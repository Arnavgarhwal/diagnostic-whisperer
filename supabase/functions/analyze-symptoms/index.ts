// Symptom analyzer using Lovable AI Gateway (Google Gemini)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a careful, empathetic medical triage assistant. Given a free-text description of symptoms, you must:
1. Identify ALL distinct symptoms the user mentions (location, duration, intensity, accompanying signs).
2. Suggest the most likely possible condition(s) in plain language.
3. Rate severity as one of: "Low", "Mild to Moderate", "Moderate", "Moderate to High", "High".
4. Give safe, practical advice (self-care steps + clear red-flags).
5. Decide whether the user should see a doctor (true/false). When in doubt, true.

You MUST call the function "report_symptom_analysis" exactly once with structured fields. Do NOT add disclaimers in the function arguments — keep them concise. Never diagnose definitively; use language like "may indicate", "could be consistent with".`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { description, history } = await req.json();
    if (!description || typeof description !== "string" || description.trim().length < 2) {
      return new Response(JSON.stringify({ error: "description is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: SYSTEM_PROMPT },
    ];
    if (Array.isArray(history)) {
      for (const m of history.slice(-6)) {
        if (m?.role && m?.content) messages.push({ role: m.role, content: String(m.content) });
      }
    }
    messages.push({ role: "user", content: description });

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        tools: [
          {
            type: "function",
            function: {
              name: "report_symptom_analysis",
              description: "Return structured triage analysis of the user's symptoms.",
              parameters: {
                type: "object",
                properties: {
                  detectedSymptoms: {
                    type: "array",
                    items: { type: "string" },
                    description: "All distinct symptoms detected from the user input.",
                  },
                  condition: {
                    type: "string",
                    description: "Most likely possible condition or differential summary (1-2 sentences).",
                  },
                  severity: {
                    type: "string",
                    enum: ["Low", "Mild to Moderate", "Moderate", "Moderate to High", "High"],
                  },
                  advice: {
                    type: "string",
                    description: "Practical, safe advice including self-care and red flags.",
                  },
                  shouldSeeDoctor: { type: "boolean" },
                  followUpQuestions: {
                    type: "array",
                    items: { type: "string" },
                    description: "Up to 3 clarifying questions to refine the analysis.",
                  },
                },
                required: ["detectedSymptoms", "condition", "severity", "advice", "shouldSeeDoctor"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "report_symptom_analysis" } },
      }),
    });

    if (!aiResp.ok) {
      const txt = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, txt);
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Add credits in Lovable Cloud settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ error: "AI request failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResp.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      return new Response(
        JSON.stringify({ error: "AI did not return structured output" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid AI output" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-symptoms error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
