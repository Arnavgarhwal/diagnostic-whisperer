import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Hand, Shield, Phone, Volume2, AlertTriangle, CheckCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

const gestures = [
  { name: "Triple Tap", description: "Tap the screen 3 times rapidly to trigger SOS", icon: "👆👆👆", enabled: true },
  { name: "Shake Phone", description: "Shake your phone vigorously 5 times to send alert", icon: "📱", enabled: true },
  { name: "Volume Button SOS", description: "Press volume up 5 times rapidly for silent alert", icon: "🔊", enabled: false },
  { name: "Voice Command", description: "Say 'Help me' or 'Emergency' to trigger SOS", icon: "🗣️", enabled: false },
];

const EmergencyGestureControl = () => {
  const [gestureSettings, setGestureSettings] = useState(() => {
    const saved = localStorage.getItem("wellsync-gesture-settings");
    return saved ? JSON.parse(saved) : gestures;
  });
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [testMode, setTestMode] = useState(true);
  const [shakeLogs, setShakeLogs] = useState<string[]>([]);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleGesture = (index: number) => {
    const updated = gestureSettings.map((g: any, i: number) => i === index ? { ...g, enabled: !g.enabled } : g);
    setGestureSettings(updated);
    localStorage.setItem("wellsync-gesture-settings", JSON.stringify(updated));
  };

  // Triple tap detection
  const handleScreenTap = () => {
    const tripleTap = gestureSettings[0];
    if (!tripleTap.enabled) return;

    const now = Date.now();
    if (now - lastTapTime < 500) {
      const newCount = tapCount + 1;
      setTapCount(newCount);
      if (newCount >= 3) {
        triggerSOS("Triple Tap");
        setTapCount(0);
      }
    } else {
      setTapCount(1);
    }
    setLastTapTime(now);

    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => setTapCount(0), 600);
  };

  // Shake detection
  useEffect(() => {
    const shakeGesture = gestureSettings[1];
    if (!shakeGesture.enabled) return;

    let shakeCount = 0;
    let lastShake = 0;

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const force = Math.sqrt((acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2);
      if (force > 25) {
        const now = Date.now();
        if (now - lastShake > 300) {
          shakeCount++;
          lastShake = now;
          setShakeLogs(prev => [...prev.slice(-4), `Shake ${shakeCount} detected`]);
          if (shakeCount >= 5) {
            triggerSOS("Shake Phone");
            shakeCount = 0;
          }
        }
      }
    };

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [gestureSettings]);

  const triggerSOS = (method: string) => {
    setAlertTriggered(true);
    setShakeLogs(prev => [...prev, `🚨 SOS triggered via ${method}!`]);

    if (testMode) {
      toast({ title: "🧪 Test SOS Triggered!", description: `Emergency gesture detected: ${method}. In real mode, this would send alerts to your emergency contacts.` });
    } else {
      window.dispatchEvent(new CustomEvent("simulate-fall-detection"));
      toast({ title: "🚨 SOS ACTIVATED!", description: `Emergency alert sent via ${method}!`, variant: "destructive" });
    }

    setTimeout(() => setAlertTriggered(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" onClick={handleScreenTap}>
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><Hand className="w-3 h-3 mr-1" />USP Feature</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2"><span className="text-gradient">Emergency Gesture</span> Control</h1>
            <p className="text-muted-foreground">Hands-free emergency SOS triggers using gestures</p>
          </motion.div>

          {/* Alert Animation */}
          {alertTriggered && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-destructive/10 border border-destructive rounded-2xl p-6 mb-6 text-center">
              <AlertTriangle className="w-12 h-12 mx-auto text-destructive mb-2 animate-pulse" />
              <p className="font-bold text-lg text-destructive">SOS Alert {testMode ? "(Test Mode)" : "ACTIVATED"}</p>
            </motion.div>
          )}

          {/* Test Mode Toggle */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Test Mode</p>
                  <p className="text-sm text-muted-foreground">When enabled, gestures won't send real emergency alerts</p>
                </div>
                <Switch checked={testMode} onCheckedChange={setTestMode} />
              </div>
            </CardContent>
          </Card>

          {/* Gesture Settings */}
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-semibold text-foreground">Gesture Triggers</h2>
            {gestureSettings.map((gesture: any, index: number) => (
              <Card key={gesture.name}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{gesture.icon}</span>
                      <div>
                        <p className="font-medium text-foreground">{gesture.name}</p>
                        <p className="text-sm text-muted-foreground">{gesture.description}</p>
                      </div>
                    </div>
                    <Switch checked={gesture.enabled} onCheckedChange={() => toggleGesture(index)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Test Area */}
          <Card>
            <CardHeader><CardTitle>Test Area</CardTitle></CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-xl p-6 text-center mb-4">
                <p className="text-sm text-muted-foreground mb-2">Tap this area 3 times rapidly to test triple-tap SOS</p>
                <div className={`w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center transition-colors ${tapCount > 0 ? "border-primary bg-primary/10" : "border-border"}`}>
                  <span className="text-2xl font-bold text-primary">{tapCount}/3</span>
                </div>
              </div>
              {shakeLogs.length > 0 && (
                <div className="bg-muted/30 rounded-xl p-3 max-h-32 overflow-y-auto">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Activity Log</p>
                  {shakeLogs.map((log, i) => <p key={i} className="text-xs text-muted-foreground">{log}</p>)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmergencyGestureControl;
