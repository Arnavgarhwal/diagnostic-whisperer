import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Play, Pause, RotateCcw, Clock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdAfter: number;
  rounds: number;
  benefit: string;
}

const patterns: BreathingPattern[] = [
  { id: "box", name: "Box Breathing", description: "Navy SEAL technique for calm focus", inhale: 4, hold: 4, exhale: 4, holdAfter: 4, rounds: 4, benefit: "Reduces stress & anxiety" },
  { id: "478", name: "4-7-8 Technique", description: "Dr. Weil's relaxation breath", inhale: 4, hold: 7, exhale: 8, holdAfter: 0, rounds: 4, benefit: "Helps fall asleep faster" },
  { id: "calm", name: "Calming Breath", description: "Extended exhale for relaxation", inhale: 4, hold: 2, exhale: 6, holdAfter: 0, rounds: 6, benefit: "Activates parasympathetic system" },
  { id: "energy", name: "Energizing Breath", description: "Quick breaths for energy boost", inhale: 2, hold: 0, exhale: 2, holdAfter: 0, rounds: 10, benefit: "Increases alertness & focus" },
  { id: "deep", name: "Deep Relaxation", description: "Slow deep breathing for peace", inhale: 5, hold: 5, exhale: 5, holdAfter: 5, rounds: 5, benefit: "Lowers blood pressure" },
];

const BreathingExercises = () => {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(patterns[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "holdAfter" | "done">("inhale");
  const [timer, setTimer] = useState(0);
  const [round, setRound] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("wellsync-breathing-sessions");
    if (saved) setTotalSessions(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const phaseTime = phase === "inhale" ? selectedPattern.inhale
      : phase === "hold" ? selectedPattern.hold
      : phase === "exhale" ? selectedPattern.exhale
      : selectedPattern.holdAfter;

    if (phaseTime === 0) {
      nextPhase();
      return;
    }

    setTimer(phaseTime);
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          nextPhase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isActive, phase, round]);

  const nextPhase = () => {
    if (phase === "inhale") setPhase("hold");
    else if (phase === "hold") setPhase("exhale");
    else if (phase === "exhale") {
      if (selectedPattern.holdAfter > 0) setPhase("holdAfter");
      else finishRound();
    } else if (phase === "holdAfter") finishRound();
  };

  const finishRound = () => {
    if (round >= selectedPattern.rounds) {
      setIsActive(false);
      setPhase("done");
      const newTotal = totalSessions + 1;
      setTotalSessions(newTotal);
      localStorage.setItem("wellsync-breathing-sessions", String(newTotal));
      toast({ title: "🧘 Session Complete!", description: `Great job! You've completed ${newTotal} sessions total.` });
    } else {
      setRound((r) => r + 1);
      setPhase("inhale");
    }
  };

  const start = () => { setIsActive(true); setPhase("inhale"); setRound(1); };
  const pause = () => { setIsActive(false); if (intervalRef.current) clearInterval(intervalRef.current); };
  const reset = () => { setIsActive(false); setPhase("inhale"); setRound(1); setTimer(0); if (intervalRef.current) clearInterval(intervalRef.current); };

  const phaseLabel = phase === "inhale" ? "Breathe In" : phase === "hold" ? "Hold" : phase === "exhale" ? "Breathe Out" : phase === "holdAfter" ? "Hold" : "Complete!";
  const circleScale = phase === "inhale" ? 1.4 : phase === "exhale" ? 0.8 : 1.1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><Wind className="w-3 h-3 mr-1" /> Wellness</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Breathing <span className="text-gradient">Exercises</span></h1>
            <p className="text-muted-foreground">Guided breathing for stress relief & better health</p>
          </motion.div>

          {/* Pattern Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {patterns.map((p) => (
              <button key={p.id} onClick={() => { if (!isActive) { setSelectedPattern(p); reset(); } }}
                className={`p-4 rounded-xl border text-left transition-all ${selectedPattern.id === p.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"}`}>
                <h3 className="font-semibold text-foreground text-sm">{p.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                <p className="text-xs text-primary mt-2">{p.benefit}</p>
              </button>
            ))}
          </div>

          {/* Breathing Circle */}
          <div className="flex flex-col items-center mb-8">
            <motion.div animate={{ scale: isActive ? circleScale : 1 }} transition={{ duration: phase === "inhale" ? selectedPattern.inhale : phase === "exhale" ? selectedPattern.exhale : 0.5, ease: "easeInOut" }}
              className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex flex-col items-center justify-center mb-6">
              <p className="text-xl font-bold text-primary">{phaseLabel}</p>
              {isActive && <p className="text-4xl font-bold text-foreground mt-1">{timer}</p>}
              {!isActive && phase !== "done" && <Wind className="w-8 h-8 text-primary/50 mt-2" />}
            </motion.div>

            {isActive && (
              <p className="text-sm text-muted-foreground mb-4">Round {round} of {selectedPattern.rounds}</p>
            )}

            <div className="flex gap-3">
              {!isActive && phase !== "done" ? (
                <Button variant="hero" size="lg" onClick={start}><Play className="w-4 h-4 mr-2" /> Start</Button>
              ) : isActive ? (
                <Button variant="outline" size="lg" onClick={pause}><Pause className="w-4 h-4 mr-2" /> Pause</Button>
              ) : null}
              <Button variant="outline" size="lg" onClick={reset}><RotateCcw className="w-4 h-4 mr-2" /> Reset</Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{totalSessions}</p>
              <p className="text-xs text-muted-foreground">Total Sessions</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <Heart className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{totalSessions * 3} min</p>
              <p className="text-xs text-muted-foreground">Time Invested</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BreathingExercises;
