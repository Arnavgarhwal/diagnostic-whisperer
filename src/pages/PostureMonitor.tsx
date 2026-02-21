import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MonitorSmartphone, Play, Pause, Bell, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

const STORAGE_KEY = "wellsync-posture-monitor";

const PostureMonitor = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [interval, setIntervalMin] = useState(30);
  const [checkCount, setCheckCount] = useState(0);
  const [goodPostureCount, setGoodPostureCount] = useState(0);
  const [totalChecks, setTotalChecks] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setIntervalMin(data.interval || 30);
      setTotalChecks(data.totalChecks || 0);
      setGoodPostureCount(data.goodPosture || 0);
    }
  }, []);

  const save = (total: number, good: number) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ interval, totalChecks: total, goodPosture: good }));
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    toast({ title: "🧍 Posture Monitor Active", description: `You'll be reminded every ${interval} minutes` });

    timerRef.current = setInterval(() => {
      setCheckCount((c) => c + 1);
      toast({ title: "🧍 Posture Check!", description: "Are you sitting straight? Fix your posture now!" });
      
      if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
    }, interval * 60 * 1000);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    if (timerRef.current) clearInterval(timerRef.current);
    toast({ title: "Monitoring Paused", description: `${checkCount} checks completed this session` });
  };

  const reportPosture = (isGood: boolean) => {
    const newTotal = totalChecks + 1;
    const newGood = isGood ? goodPostureCount + 1 : goodPostureCount;
    setTotalChecks(newTotal);
    setGoodPostureCount(newGood);
    save(newTotal, newGood);
    toast({
      title: isGood ? "✅ Great posture!" : "⚠️ Try to sit straighter",
      description: isGood ? "Keep it up!" : "Adjust your back and shoulders",
    });
  };

  const postureScore = totalChecks > 0 ? Math.round((goodPostureCount / totalChecks) * 100) : 0;

  const tips = [
    "Keep your screen at eye level to avoid neck strain",
    "Feet should be flat on the floor, knees at 90°",
    "Keep shoulders relaxed and pulled back slightly",
    "Take micro-breaks every 20 minutes to stretch",
    "Use a lumbar support cushion for lower back",
    "Keep your wrists straight while typing",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><MonitorSmartphone className="w-3 h-3 mr-1" /> Wellness</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Posture <span className="text-gradient">Monitor</span></h1>
            <p className="text-muted-foreground">Regular reminders to maintain healthy posture</p>
          </motion.div>

          {/* Status */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6 text-center">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${isMonitoring ? "bg-primary/10 animate-pulse" : "bg-muted"}`}>
              <MonitorSmartphone className={`w-10 h-10 ${isMonitoring ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <p className="text-lg font-semibold text-foreground mb-2">
              {isMonitoring ? "Monitoring Active" : "Monitoring Paused"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">Reminder every {interval} minutes</p>
            <Button variant={isMonitoring ? "outline" : "hero"} onClick={isMonitoring ? stopMonitoring : startMonitoring}>
              {isMonitoring ? <><Pause className="w-4 h-4 mr-2" /> Stop</> : <><Play className="w-4 h-4 mr-2" /> Start Monitoring</>}
            </Button>
          </div>

          {/* Interval Setting */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Bell className="w-4 h-4 text-primary" /> Reminder Interval</h3>
            <div className="flex flex-wrap gap-2">
              {[15, 20, 30, 45, 60].map((min) => (
                <Button key={min} variant={interval === min ? "default" : "outline"} size="sm"
                  onClick={() => { setIntervalMin(min); save(totalChecks, goodPostureCount); }}>
                  {min} min
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Posture Check */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-foreground mb-4">Quick Posture Check</h3>
            <p className="text-sm text-muted-foreground mb-4">How's your posture right now?</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => reportPosture(true)}>
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Good
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => reportPosture(false)}>
                ⚠️ Needs Fix
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{postureScore}%</p>
              <p className="text-xs text-muted-foreground">Posture Score</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <CheckCircle className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{totalChecks}</p>
              <p className="text-xs text-muted-foreground">Total Checks</p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-foreground mb-3">Posture Tips</h3>
            <div className="space-y-2">
              {tips.map((tip, i) => (
                <p key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">•</span> {tip}
                </p>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostureMonitor;
