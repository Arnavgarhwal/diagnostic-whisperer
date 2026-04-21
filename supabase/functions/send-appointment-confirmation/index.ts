// Send appointment confirmation via Email + SMS with retry, logging each attempt
// to public.appointment_delivery_log (one row per channel, updated on each retry).
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MAX_ATTEMPTS = 3;

interface ReqBody {
  appointmentId: string;
}

interface Appointment {
  id: string;
  user_id: string;
  doctor_name: string;
  doctor_specialty: string | null;
  appointment_date: string;
  appointment_time: string;
  fee_inr: number;
  consultation_type: string;
  payment_method: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  patient_name: string | null;
}

const buildMessage = (a: Appointment) =>
  `WellSync: Appointment confirmed with ${a.doctor_name} (${a.doctor_specialty ?? "Specialist"}) on ${a.appointment_date} at ${a.appointment_time}. Fee: Rs.${a.fee_inr} paid. Be available 5 min early. Support: 1800-123-4567`;

const buildEmailHtml = (a: Appointment) => `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#ffffff;color:#111">
    <h2 style="color:#0d9488">✅ Appointment Confirmed</h2>
    <p>Hi ${a.patient_name ?? "there"},</p>
    <p>Your ${a.consultation_type} consultation has been booked successfully.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <tr><td style="padding:6px 0;color:#666">Doctor</td><td style="padding:6px 0;font-weight:600">${a.doctor_name}</td></tr>
      <tr><td style="padding:6px 0;color:#666">Specialty</td><td style="padding:6px 0">${a.doctor_specialty ?? "-"}</td></tr>
      <tr><td style="padding:6px 0;color:#666">Date</td><td style="padding:6px 0">${a.appointment_date}</td></tr>
      <tr><td style="padding:6px 0;color:#666">Time</td><td style="padding:6px 0">${a.appointment_time}</td></tr>
      <tr><td style="padding:6px 0;color:#666">Fee</td><td style="padding:6px 0">₹${a.fee_inr} (Paid via ${a.payment_method ?? "online"})</td></tr>
    </table>
    <p style="color:#666;font-size:13px">Need to reschedule? Cancel at least 2 hours before.</p>
    <p style="color:#999;font-size:12px;margin-top:24px">— WellSync Health Team</p>
  </div>
`;

// --- Provider calls (with graceful fallback when not configured) ---

async function sendEmailViaResend(
  to: string,
  subject: string,
  html: string,
): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  const RESEND_KEY = Deno.env.get("RESEND_API_KEY");
  const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!RESEND_KEY || !LOVABLE_KEY) {
    return {
      ok: false,
      error: "Email provider not configured (Resend connector missing).",
    };
  }
  try {
    const resp = await fetch(
      "https://connector-gateway.lovable.dev/resend/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_KEY}`,
          "X-Connection-Api-Key": RESEND_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "WellSync <onboarding@resend.dev>",
          to: [to],
          subject,
          html,
        }),
      },
    );
    const data = await resp.json();
    if (!resp.ok) {
      return { ok: false, error: `Resend ${resp.status}: ${JSON.stringify(data)}` };
    }
    return { ok: true, messageId: data.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown email error" };
  }
}

async function sendSmsViaTwilio(
  to: string,
  body: string,
): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  const TWILIO_KEY = Deno.env.get("TWILIO_API_KEY");
  const TWILIO_FROM = Deno.env.get("TWILIO_FROM_NUMBER");
  const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!TWILIO_KEY || !LOVABLE_KEY) {
    return {
      ok: false,
      error: "SMS provider not configured (Twilio connector missing).",
    };
  }
  if (!TWILIO_FROM) {
    return { ok: false, error: "TWILIO_FROM_NUMBER secret not set." };
  }
  try {
    const resp = await fetch(
      "https://connector-gateway.lovable.dev/twilio/Messages.json",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_KEY}`,
          "X-Connection-Api-Key": TWILIO_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: to,
          From: TWILIO_FROM,
          Body: body,
        }),
      },
    );
    const data = await resp.json();
    if (!resp.ok) {
      return { ok: false, error: `Twilio ${resp.status}: ${JSON.stringify(data)}` };
    }
    return { ok: true, messageId: data.sid };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown sms error" };
  }
}

// --- Generic retry wrapper with exponential backoff ---
async function withRetry<T extends { ok: boolean; error?: string; messageId?: string }>(
  fn: () => Promise<T>,
  onAttempt: (attemptNumber: number, result: T) => Promise<void>,
): Promise<T> {
  let last: T = { ok: false, error: "no attempt" } as T;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    last = await fn();
    await onAttempt(attempt, last);
    if (last.ok) return last;
    if (attempt < MAX_ATTEMPTS) {
      // 1s, 2s, 4s exponential backoff
      await new Promise((r) => setTimeout(r, Math.pow(2, attempt - 1) * 1000));
    }
  }
  return last;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify user via JWT
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const { appointmentId }: ReqBody = await req.json();
    if (!appointmentId) {
      return new Response(JSON.stringify({ error: "appointmentId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service-role client to read appointment + write logs (bypasses RLS but we filter by user_id)
    const admin = createClient(supabaseUrl, serviceKey);
    const { data: appt, error: apptErr } = await admin
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .eq("user_id", userId)
      .maybeSingle();

    if (apptErr || !appt) {
      return new Response(JSON.stringify({ error: "Appointment not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const appointment = appt as Appointment;
    const results: Record<string, { status: string; attempts: number; error?: string }> = {};

    // ---- EMAIL ----
    if (appointment.contact_email) {
      const { data: emailLog } = await admin
        .from("appointment_delivery_log")
        .insert({
          appointment_id: appointment.id,
          user_id: userId,
          channel: "email",
          recipient: appointment.contact_email,
          status: "pending",
          attempts: 0,
        })
        .select()
        .single();

      const final = await withRetry(
        () =>
          sendEmailViaResend(
            appointment.contact_email!,
            `✅ Appointment Confirmed - ${appointment.doctor_name} | WellSync`,
            buildEmailHtml(appointment),
          ),
        async (attempt, r) => {
          await admin
            .from("appointment_delivery_log")
            .update({
              attempts: attempt,
              status: r.ok ? "sent" : attempt === MAX_ATTEMPTS ? "failed" : "pending",
              last_error: r.ok ? null : r.error ?? null,
              provider_message_id: r.messageId ?? null,
            })
            .eq("id", emailLog!.id);
        },
      );
      results.email = {
        status: final.ok ? "sent" : "failed",
        attempts: MAX_ATTEMPTS,
        error: final.ok ? undefined : final.error,
      };
    }

    // ---- SMS ----
    if (appointment.contact_phone) {
      const { data: smsLog } = await admin
        .from("appointment_delivery_log")
        .insert({
          appointment_id: appointment.id,
          user_id: userId,
          channel: "sms",
          recipient: appointment.contact_phone,
          status: "pending",
          attempts: 0,
        })
        .select()
        .single();

      const final = await withRetry(
        () => sendSmsViaTwilio(appointment.contact_phone!, buildMessage(appointment)),
        async (attempt, r) => {
          await admin
            .from("appointment_delivery_log")
            .update({
              attempts: attempt,
              status: r.ok ? "sent" : attempt === MAX_ATTEMPTS ? "failed" : "pending",
              last_error: r.ok ? null : r.error ?? null,
              provider_message_id: r.messageId ?? null,
            })
            .eq("id", smsLog!.id);
        },
      );
      results.sms = {
        status: final.ok ? "sent" : "failed",
        attempts: MAX_ATTEMPTS,
        error: final.ok ? undefined : final.error,
      };
    }

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-appointment-confirmation error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
