import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Heart, MessageCircle, Wind, Smile, Frown, Meh, Sun, CloudRain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const exercises = [
  { name: "Deep Breathing", duration: "5 min", icon: Wind, description: "4-7-8 breathing pattern to calm anxiety" },
  { name: "Body Scan", duration: "10 min", icon: Heart, description: "Progressive relaxation from head to toe" },
  { name: "Gratitude Journal", duration: "5 min", icon: Sun, description: "Write 3 things you're grateful for" },
  { name: "Mindful Walking", duration: "15 min", icon: Smile, description: "Focus on each step and your surroundings" },
];

const affirmations = [
  "I am worthy of love and happiness.",
  "I am stronger than my challenges.",
  "I choose to focus on what I can control.",
  "Every day is a fresh start.",
  "I am enough, just as I am.",
  "My feelings are valid and temporary.",
  "I deserve peace and calm.",
  "I am making progress, even when I can't see it.",
];

const MentalHealthSupport = () => {
  const [journalEntry, setJournalEntry] = useState("");
  const [journalEntries, setJournalEntries] = useState<Array<{ text: string; mood: string; date: string }>>(() => {
    const saved = localStorage.getItem("wellsync-mental-journal");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [affirmation] = useState(affirmations[Math.floor(Math.random() * affirmations.length)]);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");

  const moods = [
    { label: "Great", icon: Sun, value: "great" },
    { label: "Good", icon: Smile, value: "good" },
    { label: "Okay", icon: Meh, value: "okay" },
    { label: "Low", icon: CloudRain, value: "low" },
    { label: "Sad", icon: Frown, value: "sad" },
  ];

  const saveJournal = () => {
    if (!journalEntry.trim() || !currentMood) return;
    const entry = { text: journalEntry, mood: currentMood, date: new Date().toLocaleDateString() };
    const updated = [entry, ...journalEntries];
    setJournalEntries(updated);
    localStorage.setItem("wellsync-mental-journal", JSON.stringify(updated));
    setJournalEntry("");
    setCurrentMood(null);
  };

  const startBreathing = () => {
    setBreathingActive(true);
    setBreathPhase("inhale");
    let cycle = 0;
    const run = () => {
      setTimeout(() => { setBreathPhase("hold"); }, 4000);
      setTimeout(() => { setBreathPhase("exhale"); }, 11000);
      setTimeout(() => {
        cycle++;
        if (cycle < 4) { setBreathPhase("inhale"); run(); }
        else setBreathingActive(false);
      }, 19000);
    };
    run();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><Brain className="w-3 h-3 mr-1" />Mental Wellness</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2"><span className="text-gradient">Mental Health</span> Support</h1>
            <p className="text-muted-foreground">Tools and exercises for your emotional wellbeing</p>
          </motion.div>

          {/* Affirmation Banner */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-gradient-to-r from-primary/10 to-accent/10 border border-border rounded-2xl p-6 mb-8 text-center">
            <p className="text-lg font-medium text-foreground italic">"{affirmation}"</p>
            <p className="text-xs text-muted-foreground mt-2">Daily Affirmation</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Breathing Exercise */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Wind className="w-5 h-5 text-primary" />Guided Breathing</CardTitle></CardHeader>
              <CardContent className="text-center">
                {breathingActive ? (
                  <div className="space-y-6 py-4">
                    <motion.div
                      animate={{ scale: breathPhase === "inhale" ? 1.5 : breathPhase === "hold" ? 1.5 : 1 }}
                      transition={{ duration: breathPhase === "inhale" ? 4 : breathPhase === "hold" ? 7 : 8 }}
                      className="w-32 h-32 mx-auto rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center"
                    >
                      <span className="text-lg font-semibold text-primary capitalize">{breathPhase}</span>
                    </motion.div>
                    <p className="text-sm text-muted-foreground">
                      {breathPhase === "inhale" ? "Breathe in slowly for 4 seconds..." : breathPhase === "hold" ? "Hold your breath for 7 seconds..." : "Exhale slowly for 8 seconds..."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground">4-7-8 breathing technique to reduce anxiety and promote calm.</p>
                    <Button variant="hero" onClick={startBreathing}>Start Breathing Exercise</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mood Journal */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5 text-primary" />Mood Journal</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">How are you feeling?</p>
                  <div className="flex gap-2 justify-center">
                    {moods.map(m => (
                      <Button key={m.value} variant={currentMood === m.value ? "default" : "outline"} size="sm" onClick={() => setCurrentMood(m.value)} className="flex flex-col gap-1 h-auto py-2 px-3">
                        <m.icon className="w-5 h-5" />
                        <span className="text-xs">{m.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                <Textarea placeholder="Write about your feelings..." value={journalEntry} onChange={e => setJournalEntry(e.target.value)} rows={3} />
                <Button onClick={saveJournal} disabled={!journalEntry.trim() || !currentMood} className="w-full">Save Entry</Button>
              </CardContent>
            </Card>

            {/* Exercises */}
            <Card className="md:col-span-2">
              <CardHeader><CardTitle>Wellness Exercises</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {exercises.map(ex => (
                    <div key={ex.name} className="bg-muted/50 rounded-xl p-4 text-center hover:bg-primary/5 transition-colors cursor-pointer">
                      <ex.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="font-medium text-sm text-foreground">{ex.name}</p>
                      <p className="text-xs text-muted-foreground">{ex.duration}</p>
                      <p className="text-xs text-muted-foreground mt-1">{ex.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Journal History */}
            {journalEntries.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader><CardTitle>Journal History</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {journalEntries.slice(0, 10).map((entry, i) => (
                      <div key={i} className="bg-muted/50 rounded-xl p-3 flex items-start gap-3">
                        <Badge variant="outline" className="capitalize shrink-0">{entry.mood}</Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">{entry.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">{entry.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentalHealthSupport;
