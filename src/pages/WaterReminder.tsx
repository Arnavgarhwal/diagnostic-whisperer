import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplets, Plus, Minus, Target, TrendingUp, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

const STORAGE_KEY = "wellsync-water-tracker";

interface WaterLog {
  date: string;
  glasses: number;
  goal: number;
}

const WaterReminder = () => {
  const [glasses, setGlasses] = useState(0);
  const [goal, setGoal] = useState(8);
  const [history, setHistory] = useState<WaterLog[]>([]);
  const [reminderInterval, setReminderInterval] = useState(60);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      const today = new Date().toISOString().split("T")[0];
      const todayLog = data.history?.find((h: WaterLog) => h.date === today);
      if (todayLog) setGlasses(todayLog.glasses);
      setGoal(data.goal || 8);
      setHistory(data.history || []);
      setReminderInterval(data.reminderInterval || 60);
    }
  }, []);

  const save = (g: number, goalVal: number, hist: WaterLog[]) => {
    const today = new Date().toISOString().split("T")[0];
    const updatedHistory = hist.filter((h) => h.date !== today);
    updatedHistory.push({ date: today, glasses: g, goal: goalVal });
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ goal: goalVal, history: updatedHistory, reminderInterval }));
  };

  const addGlass = () => {
    const newVal = glasses + 1;
    setGlasses(newVal);
    save(newVal, goal, history);
    if (newVal >= goal) {
      toast({ title: "🎉 Goal Reached!", description: `You've hit your ${goal} glasses goal!` });
    } else {
      toast({ title: "💧 Water Logged", description: `${newVal}/${goal} glasses today` });
    }
  };

  const removeGlass = () => {
    if (glasses <= 0) return;
    const newVal = glasses - 1;
    setGlasses(newVal);
    save(newVal, goal, history);
  };

  const percentage = Math.min((glasses / goal) * 100, 100);
  const weekHistory = history.slice(-7);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Droplets className="w-3 h-3 mr-1" /> Hydration
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Water <span className="text-gradient">Reminder</span>
            </h1>
            <p className="text-muted-foreground">Stay hydrated throughout the day</p>
          </motion.div>

          {/* Progress Circle */}
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex justify-center mb-8">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - percentage / 100)}`}
                  strokeLinecap="round" className="transition-all duration-700" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Droplets className="w-6 h-6 text-primary mb-1" />
                <span className="text-3xl font-bold text-foreground">{glasses}</span>
                <span className="text-sm text-muted-foreground">/ {goal} glasses</span>
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <Button variant="outline" size="lg" onClick={removeGlass} disabled={glasses <= 0}>
              <Minus className="w-5 h-5" />
            </Button>
            <Button variant="hero" size="lg" onClick={addGlass} className="px-8">
              <Plus className="w-5 h-5 mr-2" /> Add Glass
            </Button>
          </div>

          {/* Goal Setting */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> Daily Goal
            </h3>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => { const g = Math.max(1, goal - 1); setGoal(g); save(glasses, g, history); }}>
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-xl font-bold text-foreground">{goal} glasses</span>
              <Button variant="outline" size="sm" onClick={() => { const g = goal + 1; setGoal(g); save(glasses, g, history); }}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Reminder Setting */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" /> Reminder Interval
            </h3>
            <div className="flex flex-wrap gap-2">
              {[30, 45, 60, 90, 120].map((min) => (
                <Button key={min} variant={reminderInterval === min ? "default" : "outline"} size="sm"
                  onClick={() => {
                    setReminderInterval(min);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify({ goal, history, reminderInterval: min }));
                    toast({ title: "⏰ Reminder Set", description: `You'll be reminded every ${min} minutes` });
                  }}>
                  {min} min
                </Button>
              ))}
            </div>
          </div>

          {/* Week History */}
          {weekHistory.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> This Week
              </h3>
              <div className="flex items-end gap-2 justify-center h-32">
                {weekHistory.map((log) => (
                  <div key={log.date} className="flex flex-col items-center gap-1">
                    <div className="w-8 rounded-t-lg bg-primary/80 transition-all"
                      style={{ height: `${Math.max(8, (log.glasses / log.goal) * 100)}px` }} />
                    <span className="text-xs text-muted-foreground">{new Date(log.date).toLocaleDateString(undefined, { weekday: "short" })}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WaterReminder;
