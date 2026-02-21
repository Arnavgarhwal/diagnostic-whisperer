import { useState } from "react";
import { motion } from "framer-motion";
import { Cross, Search, ChevronDown, ChevronUp, AlertTriangle, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface FirstAidItem {
  id: string;
  title: string;
  emoji: string;
  severity: "low" | "medium" | "high";
  steps: string[];
  warning: string;
  callEmergency: boolean;
}

const guides: FirstAidItem[] = [
  { id: "burns", title: "Burns", emoji: "🔥", severity: "medium", steps: ["Cool the burn under cool running water for at least 10 minutes", "Remove jewelry or tight clothing near the burn", "Cover with a sterile non-stick bandage", "Take over-the-counter pain relief if needed", "Do NOT apply ice, butter, or toothpaste"], warning: "Seek emergency help for burns larger than your palm, or on face/hands/joints.", callEmergency: false },
  { id: "choking", title: "Choking", emoji: "😵", severity: "high", steps: ["Ask 'Are you choking?' — if they can't speak, act immediately", "Stand behind the person, wrap arms around waist", "Make a fist above the navel, below ribcage", "Give 5 quick upward abdominal thrusts (Heimlich)", "Repeat until object is expelled or person becomes unconscious", "If unconscious, call emergency and start CPR"], warning: "Call emergency services immediately if person loses consciousness.", callEmergency: true },
  { id: "cpr", title: "CPR", emoji: "❤️", severity: "high", steps: ["Check responsiveness — tap and shout", "Call emergency services immediately", "Place heel of hand on center of chest", "Interlock fingers, keep arms straight", "Push hard and fast: 30 compressions at 100-120/min", "Give 2 rescue breaths (tilt head, lift chin)", "Continue 30:2 cycle until help arrives"], warning: "Only perform CPR on unconscious persons not breathing normally.", callEmergency: true },
  { id: "bleeding", title: "Severe Bleeding", emoji: "🩸", severity: "high", steps: ["Apply direct pressure with a clean cloth or bandage", "Keep pressing firmly — do NOT remove the cloth", "If possible, elevate the injured limb above heart level", "Apply a tourniquet only as last resort for life-threatening limb bleeding", "Keep the person calm and lying down"], warning: "Call emergency services for uncontrollable bleeding.", callEmergency: true },
  { id: "fracture", title: "Fractures", emoji: "🦴", severity: "medium", steps: ["Immobilize the injured area — do NOT try to realign", "Apply ice wrapped in cloth to reduce swelling", "Use a splint or sling to support the area", "Give pain relief if available", "Transport to hospital carefully"], warning: "Do not move someone with suspected spinal injury.", callEmergency: false },
  { id: "heatstroke", title: "Heat Stroke", emoji: "☀️", severity: "high", steps: ["Move person to a cool, shaded area immediately", "Remove excess clothing", "Cool rapidly: apply ice packs to neck, armpits, groin", "Fan the person while misting with cool water", "Give cool water if conscious and able to drink", "Monitor body temperature"], warning: "Heat stroke is life-threatening. Call emergency services.", callEmergency: true },
  { id: "seizure", title: "Seizures", emoji: "⚡", severity: "medium", steps: ["Clear the area of hard or sharp objects", "Do NOT restrain the person or put anything in their mouth", "Place something soft under their head", "Time the seizure — if over 5 minutes, call emergency", "After seizure stops, place in recovery position", "Stay with them until fully recovered"], warning: "Call emergency if seizure lasts >5 min or person doesn't regain consciousness.", callEmergency: false },
  { id: "allergic", title: "Allergic Reaction", emoji: "🤧", severity: "high", steps: ["If person has an EpiPen, help them use it immediately", "Call emergency services", "Have person sit upright if breathing is difficult", "Loosen tight clothing", "Monitor breathing and consciousness", "Be ready to perform CPR if needed"], warning: "Anaphylaxis can be fatal within minutes. Use epinephrine immediately.", callEmergency: true },
  { id: "snakebite", title: "Snake Bite", emoji: "🐍", severity: "high", steps: ["Keep the person calm and still", "Remove jewelry near the bite", "Keep bitten limb below heart level", "Clean the wound gently — do NOT suck venom", "Immobilize the limb with a splint", "Get to hospital ASAP — note the snake's appearance"], warning: "Do NOT apply tourniquet, ice, or cut the wound.", callEmergency: true },
  { id: "nosebleed", title: "Nosebleed", emoji: "👃", severity: "low", steps: ["Sit upright and lean slightly forward", "Pinch the soft part of the nose firmly", "Hold for 10-15 minutes without releasing", "Breathe through your mouth", "Apply a cold compress to the nose bridge", "Avoid blowing nose for several hours after"], warning: "Seek help if bleeding persists beyond 20 minutes.", callEmergency: false },
];

const FirstAidGuide = () => {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = guides.filter((g) => g.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Badge className="mb-4 bg-destructive/10 text-destructive border-destructive/20"><Cross className="w-3 h-3 mr-1" /> Emergency</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">First Aid <span className="text-gradient">Guide</span></h1>
            <p className="text-muted-foreground">Step-by-step emergency first aid instructions</p>
          </motion.div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search conditions..." className="pl-10" />
          </div>

          <div className="space-y-3">
            {filtered.map((guide) => (
              <motion.div key={guide.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-card border border-border rounded-xl overflow-hidden">
                <button onClick={() => setExpanded(expanded === guide.id ? null : guide.id)}
                  className="w-full p-4 flex items-center justify-between text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{guide.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-foreground">{guide.title}</h3>
                      <Badge variant={guide.severity === "high" ? "destructive" : guide.severity === "medium" ? "default" : "secondary"} className="text-xs mt-1">
                        {guide.severity} priority
                      </Badge>
                    </div>
                  </div>
                  {expanded === guide.id ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                </button>

                {expanded === guide.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="px-4 pb-4">
                    <ol className="space-y-2 mb-4">
                      {guide.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-3">
                      <p className="text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {guide.warning}
                      </p>
                    </div>
                    {guide.callEmergency && (
                      <Button variant="destructive" className="w-full" asChild>
                        <a href="tel:911"><Phone className="w-4 h-4 mr-2" /> Call Emergency Services</a>
                      </Button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FirstAidGuide;
