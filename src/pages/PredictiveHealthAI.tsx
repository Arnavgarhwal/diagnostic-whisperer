import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Activity, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface HealthPrediction {
  condition: string;
  riskPercent: number;
  timeframe: string;
  factors: string[];
  preventionSteps: string[];
  severity: "low" | "moderate" | "high";
}

const PredictiveHealthAI = () => {
  const [age, setAge] = useState(() => localStorage.getItem("wellsync-predict-age") || "35");
  const [gender, setGender] = useState(() => localStorage.getItem("wellsync-predict-gender") || "male");
  const [smoker, setSmoker] = useState(() => localStorage.getItem("wellsync-predict-smoker") || "no");
  const [exercise, setExercise] = useState(() => localStorage.getItem("wellsync-predict-exercise") || "moderate");
  const [familyHistory, setFamilyHistory] = useState(() => localStorage.getItem("wellsync-predict-family") || "none");
  const [bmi, setBmi] = useState(() => localStorage.getItem("wellsync-predict-bmi") || "24");
  const [predictions, setPredictions] = useState<HealthPrediction[]>([]);
  const [analyzed, setAnalyzed] = useState(false);

  const generatePredictions = () => {
    const ageNum = parseInt(age);
    const bmiNum = parseFloat(bmi);
    const preds: HealthPrediction[] = [];

    // Heart disease
    let heartRisk = 10;
    if (ageNum > 50) heartRisk += 20;
    if (smoker === "yes") heartRisk += 25;
    if (exercise === "none") heartRisk += 15;
    if (familyHistory === "heart") heartRisk += 20;
    if (bmiNum > 30) heartRisk += 15;
    preds.push({ condition: "Heart Disease", riskPercent: Math.min(heartRisk, 95), timeframe: "Next 10 years", factors: [ageNum > 50 ? "Age over 50" : "", smoker === "yes" ? "Active smoker" : "", bmiNum > 30 ? "High BMI" : "", exercise === "none" ? "Sedentary lifestyle" : ""].filter(Boolean), preventionSteps: ["Regular cardio exercise (150 min/week)", "Mediterranean diet", "Regular BP monitoring", "Stress management"], severity: heartRisk > 50 ? "high" : heartRisk > 25 ? "moderate" : "low" });

    // Type 2 Diabetes
    let diabetesRisk = 8;
    if (bmiNum > 30) diabetesRisk += 30;
    if (exercise === "none") diabetesRisk += 15;
    if (familyHistory === "diabetes") diabetesRisk += 25;
    if (ageNum > 45) diabetesRisk += 10;
    preds.push({ condition: "Type 2 Diabetes", riskPercent: Math.min(diabetesRisk, 90), timeframe: "Next 5 years", factors: [bmiNum > 30 ? "Obesity" : "", exercise === "none" ? "No physical activity" : "", familyHistory === "diabetes" ? "Family history" : ""].filter(Boolean), preventionSteps: ["Maintain healthy weight", "Limit sugar and refined carbs", "30 min daily walk", "Annual glucose screening"], severity: diabetesRisk > 50 ? "high" : diabetesRisk > 25 ? "moderate" : "low" });

    // Hypertension
    let bpRisk = 12;
    if (ageNum > 40) bpRisk += 15;
    if (smoker === "yes") bpRisk += 20;
    if (bmiNum > 28) bpRisk += 15;
    preds.push({ condition: "Hypertension", riskPercent: Math.min(bpRisk, 85), timeframe: "Next 5 years", factors: [ageNum > 40 ? "Age factor" : "", smoker === "yes" ? "Smoking" : "", bmiNum > 28 ? "Elevated BMI" : ""].filter(Boolean), preventionSteps: ["Reduce sodium intake", "DASH diet", "Regular exercise", "Limit alcohol"], severity: bpRisk > 50 ? "high" : bpRisk > 25 ? "moderate" : "low" });

    // Depression
    let depressionRisk = 10;
    if (exercise === "none") depressionRisk += 20;
    preds.push({ condition: "Depression", riskPercent: Math.min(depressionRisk, 70), timeframe: "Next 2 years", factors: [exercise === "none" ? "Sedentary lifestyle" : ""].filter(Boolean), preventionSteps: ["Regular physical activity", "Social connections", "Mindfulness practice", "Adequate sleep"], severity: depressionRisk > 40 ? "high" : depressionRisk > 20 ? "moderate" : "low" });

    setPredictions(preds.sort((a, b) => b.riskPercent - a.riskPercent));
    setAnalyzed(true);

    // Save inputs
    localStorage.setItem("wellsync-predict-age", age);
    localStorage.setItem("wellsync-predict-gender", gender);
    localStorage.setItem("wellsync-predict-smoker", smoker);
    localStorage.setItem("wellsync-predict-exercise", exercise);
    localStorage.setItem("wellsync-predict-family", familyHistory);
    localStorage.setItem("wellsync-predict-bmi", bmi);
  };

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-destructive/10 text-destructive";
      case "moderate": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default: return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><Brain className="w-3 h-3 mr-1" />USP Feature</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2"><span className="text-gradient">Predictive Health</span> AI</h1>
            <p className="text-muted-foreground">AI-powered disease risk prediction based on your health profile</p>
          </motion.div>

          {/* Input Form */}
          <Card className="mb-8">
            <CardHeader><CardTitle>Your Health Profile</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div><label className="text-sm font-medium text-foreground">Age</label><Input type="number" value={age} onChange={e => setAge(e.target.value)} /></div>
                <div><label className="text-sm font-medium text-foreground">Gender</label>
                  <Select value={gender} onValueChange={setGender}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent></Select>
                </div>
                <div><label className="text-sm font-medium text-foreground">BMI</label><Input type="number" step="0.1" value={bmi} onChange={e => setBmi(e.target.value)} /></div>
                <div><label className="text-sm font-medium text-foreground">Smoker?</label>
                  <Select value={smoker} onValueChange={setSmoker}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="no">No</SelectItem><SelectItem value="yes">Yes</SelectItem></SelectContent></Select>
                </div>
                <div><label className="text-sm font-medium text-foreground">Exercise Level</label>
                  <Select value={exercise} onValueChange={setExercise}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="moderate">Moderate</SelectItem><SelectItem value="none">Sedentary</SelectItem></SelectContent></Select>
                </div>
                <div><label className="text-sm font-medium text-foreground">Family History</label>
                  <Select value={familyHistory} onValueChange={setFamilyHistory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="heart">Heart Disease</SelectItem><SelectItem value="diabetes">Diabetes</SelectItem><SelectItem value="cancer">Cancer</SelectItem></SelectContent></Select>
                </div>
              </div>
              <Button variant="hero" className="w-full mt-6" onClick={generatePredictions}>
                <Zap className="w-4 h-4 mr-2" />Generate Health Predictions
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {analyzed && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Risk Assessment Results</h2>
              {predictions.map(pred => (
                <motion.div key={pred.condition} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-foreground">{pred.condition}</h3>
                        <Badge className={getRiskColor(pred.severity)}>{pred.riskPercent}% Risk</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">Timeframe: {pred.timeframe}</p>
                      {/* Risk bar */}
                      <div className="w-full bg-muted rounded-full h-3 mb-4">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pred.riskPercent}%` }} transition={{ duration: 1 }} className={`h-3 rounded-full ${pred.severity === "high" ? "bg-destructive" : pred.severity === "moderate" ? "bg-amber-500" : "bg-primary"}`} />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {pred.factors.length > 0 && (
                          <div className="bg-muted/50 rounded-xl p-3">
                            <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-amber-500" />Risk Factors</p>
                            {pred.factors.map(f => <p key={f} className="text-sm text-muted-foreground">⚠️ {f}</p>)}
                          </div>
                        )}
                        <div className="bg-primary/5 rounded-xl p-3">
                          <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1"><CheckCircle className="w-4 h-4 text-primary" />Prevention</p>
                          {pred.preventionSteps.map(s => <p key={s} className="text-sm text-muted-foreground">✅ {s}</p>)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PredictiveHealthAI;
