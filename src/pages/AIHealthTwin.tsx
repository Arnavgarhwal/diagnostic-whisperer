import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Fingerprint, Brain, TrendingUp, AlertTriangle, Shield, Activity, Heart, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

interface HealthProfile {
  age: number;
  weight: number;
  height: number;
  bloodPressure: string;
  heartRate: number;
  sleepHours: number;
  waterGlasses: number;
  exerciseMin: number;
  smokingStatus: string;
  stressLevel: number;
}

interface RiskPrediction {
  condition: string;
  risk: number;
  timeline: string;
  preventionTips: string[];
  icon: typeof Heart;
}

const AIHealthTwin = () => {
  const [profile, setProfile] = useState<HealthProfile>({
    age: 30, weight: 70, height: 170, bloodPressure: "120/80", heartRate: 72,
    sleepHours: 7, waterGlasses: 6, exerciseMin: 30, smokingStatus: "never", stressLevel: 5,
  });
  const [predictions, setPredictions] = useState<RiskPrediction[]>([]);
  const [twinScore, setTwinScore] = useState(0);
  const [analyzed, setAnalyzed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("wellsync-health-twin");
    if (saved) {
      const data = JSON.parse(saved);
      setProfile(data.profile || profile);
      if (data.predictions) { setPredictions(data.predictions); setAnalyzed(true); }
      if (data.twinScore) setTwinScore(data.twinScore);
    }
  }, []);

  const analyzeHealthTwin = () => {
    const risks: RiskPrediction[] = [];
    let score = 85;

    // Heart disease risk
    const bpSystolic = parseInt(profile.bloodPressure.split("/")[0]);
    let heartRisk = 15;
    if (bpSystolic > 130) { heartRisk += 20; score -= 10; }
    if (profile.heartRate > 90) { heartRisk += 10; score -= 5; }
    if (profile.exerciseMin < 20) { heartRisk += 15; score -= 8; }
    if (profile.smokingStatus === "current") { heartRisk += 25; score -= 15; }
    risks.push({ condition: "Cardiovascular Disease", risk: Math.min(heartRisk, 95), timeline: "10-15 years", icon: Heart,
      preventionTips: ["Exercise 150 min/week", "Maintain BP below 120/80", "Reduce sodium intake", "Manage stress levels"] });

    // Diabetes risk
    let diabetesRisk = 10;
    const bmi = profile.weight / ((profile.height / 100) ** 2);
    if (bmi > 25) { diabetesRisk += 15; score -= 5; }
    if (bmi > 30) { diabetesRisk += 20; score -= 10; }
    if (profile.exerciseMin < 15) { diabetesRisk += 10; score -= 5; }
    risks.push({ condition: "Type 2 Diabetes", risk: Math.min(diabetesRisk, 90), timeline: "5-10 years", icon: Activity,
      preventionTips: ["Maintain healthy BMI (18.5-24.9)", "Exercise regularly", "Limit sugar and processed carbs", "Get annual blood sugar tests"] });

    // Sleep disorder risk
    let sleepRisk = 10;
    if (profile.sleepHours < 6) { sleepRisk += 30; score -= 10; }
    if (profile.stressLevel > 7) { sleepRisk += 15; score -= 5; }
    risks.push({ condition: "Sleep Disorders", risk: Math.min(sleepRisk, 85), timeline: "1-3 years", icon: Brain,
      preventionTips: ["Aim for 7-9 hours of sleep", "Maintain consistent sleep schedule", "Reduce screen time before bed", "Create a dark, cool sleeping environment"] });

    // Dehydration risk
    let dehydrationRisk = 10;
    if (profile.waterGlasses < 6) { dehydrationRisk += 20; score -= 5; }
    if (profile.waterGlasses < 4) { dehydrationRisk += 25; score -= 8; }
    risks.push({ condition: "Chronic Dehydration", risk: Math.min(dehydrationRisk, 80), timeline: "Ongoing", icon: Droplets,
      preventionTips: ["Drink 8+ glasses of water daily", "Eat water-rich fruits & vegetables", "Reduce caffeine and alcohol", "Carry a water bottle always"] });

    score = Math.max(score, 20);
    setTwinScore(score);
    setPredictions(risks.sort((a, b) => b.risk - a.risk));
    setAnalyzed(true);
    localStorage.setItem("wellsync-health-twin", JSON.stringify({ profile, predictions: risks, twinScore: score }));
    toast({ title: "🧬 Digital Twin Updated", description: `Your health twin score is ${score}/100` });
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 50) return "text-red-500";
    if (risk >= 30) return "text-yellow-500";
    return "text-green-500";
  };

  const updateField = (field: keyof HealthProfile, value: any) => {
    setProfile((p) => ({ ...p, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><Fingerprint className="w-3 h-3 mr-1" /> USP Feature</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">AI Health <span className="text-gradient">Twin</span></h1>
            <p className="text-muted-foreground">Your digital health replica that predicts future health risks</p>
          </motion.div>

          {/* Profile Inputs */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-foreground mb-4">Your Health Profile</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {([
                { label: "Age", field: "age", type: "number" },
                { label: "Weight (kg)", field: "weight", type: "number" },
                { label: "Height (cm)", field: "height", type: "number" },
                { label: "Blood Pressure", field: "bloodPressure", type: "text" },
                { label: "Heart Rate (bpm)", field: "heartRate", type: "number" },
                { label: "Sleep (hours)", field: "sleepHours", type: "number" },
                { label: "Water (glasses)", field: "waterGlasses", type: "number" },
                { label: "Exercise (min/day)", field: "exerciseMin", type: "number" },
                { label: "Stress (1-10)", field: "stressLevel", type: "number" },
              ] as const).map((item) => (
                <div key={item.field}>
                  <label className="text-xs text-muted-foreground">{item.label}</label>
                  <input type={item.type} value={profile[item.field]}
                    onChange={(e) => updateField(item.field, item.type === "number" ? Number(e.target.value) : e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground" />
                </div>
              ))}
              <div>
                <label className="text-xs text-muted-foreground">Smoking</label>
                <select value={profile.smokingStatus} onChange={(e) => updateField("smokingStatus", e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground">
                  <option value="never">Never</option>
                  <option value="former">Former</option>
                  <option value="current">Current</option>
                </select>
              </div>
            </div>
            <Button variant="hero" className="w-full mt-4" onClick={analyzeHealthTwin}>
              <Brain className="w-4 h-4 mr-2" /> Generate Health Twin Analysis
            </Button>
          </div>

          {/* Twin Score */}
          {analyzed && (
            <>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-border rounded-2xl p-6 mb-6 text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 52}`} strokeDashoffset={`${2 * Math.PI * 52 * (1 - twinScore / 100)}`}
                      strokeLinecap="round" className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">{twinScore}</span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-foreground">Digital Twin Health Score</h3>
                <p className="text-sm text-muted-foreground">
                  {twinScore >= 80 ? "Excellent! Your health twin looks great." : twinScore >= 60 ? "Good, but there's room for improvement." : "Attention needed — review the risk predictions below."}
                </p>
              </motion.div>

              {/* Predictions */}
              <div className="space-y-4">
                {predictions.map((pred) => (
                  <motion.div key={pred.condition} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <pred.icon className={`w-5 h-5 ${getRiskColor(pred.risk)}`} />
                        <h3 className="font-semibold text-foreground">{pred.condition}</h3>
                      </div>
                      <Badge variant={pred.risk >= 50 ? "destructive" : pred.risk >= 30 ? "default" : "secondary"}>
                        {pred.risk}% risk
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">Projected timeline: {pred.timeline}</p>
                    <div className="w-full bg-muted rounded-full h-2 mb-3">
                      <div className={`h-2 rounded-full transition-all duration-700 ${pred.risk >= 50 ? "bg-red-500" : pred.risk >= 30 ? "bg-yellow-500" : "bg-green-500"}`}
                        style={{ width: `${pred.risk}%` }} />
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs font-medium text-foreground mb-1 flex items-center gap-1"><Shield className="w-3 h-3" /> Prevention Tips</p>
                      {pred.preventionTips.map((tip, i) => (
                        <p key={i} className="text-xs text-muted-foreground">• {tip}</p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIHealthTwin;
