import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, Activity, Heart, Scale, TrendingUp, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface HealthScore {
  overall: number;
  bmi: number;
  bpScore: number;
  sugarScore: number;
  heartScore: number;
}

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);

  useEffect(() => {
    // Load vitals data for health score calculation
    const vitalsData = localStorage.getItem("wellsync-vitals");
    if (vitalsData) {
      const vitals = JSON.parse(vitalsData);
      calculateHealthScore(vitals);
    }
  }, [bmi]);

  const calculateBMI = () => {
    const h = parseFloat(height) / 100; // cm to m
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const calculatedBMI = w / (h * h);
      setBmi(Math.round(calculatedBMI * 10) / 10);
    }
  };

  const calculateHealthScore = (vitals: any[]) => {
    let bpScore = 80;
    let sugarScore = 80;
    let heartScore = 80;
    
    // Get latest vitals
    const latestBP = vitals.filter((v: any) => v.type === "bloodPressure").pop();
    const latestSugar = vitals.filter((v: any) => v.type === "bloodSugar").pop();
    const latestHeart = vitals.filter((v: any) => v.type === "heartRate").pop();

    if (latestBP) {
      const systolic = latestBP.value.systolic;
      if (systolic >= 90 && systolic <= 120) bpScore = 100;
      else if (systolic > 120 && systolic <= 140) bpScore = 75;
      else if (systolic > 140) bpScore = 50;
      else bpScore = 60;
    }

    if (latestSugar) {
      const sugar = latestSugar.value;
      if (sugar >= 70 && sugar <= 100) sugarScore = 100;
      else if (sugar > 100 && sugar <= 126) sugarScore = 75;
      else if (sugar > 126) sugarScore = 50;
      else sugarScore = 60;
    }

    if (latestHeart) {
      const hr = latestHeart.value;
      if (hr >= 60 && hr <= 100) heartScore = 100;
      else if (hr > 100 && hr <= 110) heartScore = 75;
      else heartScore = 60;
    }

    const bmiScore = bmi ? (bmi >= 18.5 && bmi < 25 ? 100 : bmi >= 25 && bmi < 30 ? 70 : 50) : 80;
    const overall = Math.round((bpScore + sugarScore + heartScore + bmiScore) / 4);

    setHealthScore({
      overall,
      bmi: bmiScore,
      bpScore,
      sugarScore,
      heartScore
    });
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/30" };
    if (bmi < 25) return { label: "Normal", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" };
    if (bmi < 30) return { label: "Overweight", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30" };
    return { label: "Obese", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" };
  };

  const getRecommendations = () => {
    const recs = [];
    
    if (bmi) {
      if (bmi < 18.5) {
        recs.push({
          icon: Scale,
          title: "Increase Caloric Intake",
          desc: "Focus on nutrient-dense foods like nuts, avocados, and whole grains."
        });
      } else if (bmi >= 25 && bmi < 30) {
        recs.push({
          icon: Activity,
          title: "Increase Physical Activity",
          desc: "Aim for 150 minutes of moderate exercise weekly."
        });
        recs.push({
          icon: Scale,
          title: "Monitor Portion Sizes",
          desc: "Use smaller plates and practice mindful eating."
        });
      } else if (bmi >= 30) {
        recs.push({
          icon: Heart,
          title: "Consult a Healthcare Provider",
          desc: "A professional can help create a personalized weight management plan."
        });
        recs.push({
          icon: Activity,
          title: "Start with Low-Impact Exercise",
          desc: "Walking, swimming, or cycling are great starting points."
        });
      }
    }

    if (healthScore) {
      if (healthScore.bpScore < 80) {
        recs.push({
          icon: Heart,
          title: "Monitor Blood Pressure",
          desc: "Reduce sodium intake and manage stress levels."
        });
      }
      if (healthScore.sugarScore < 80) {
        recs.push({
          icon: AlertTriangle,
          title: "Watch Blood Sugar",
          desc: "Limit refined carbs and sugary drinks."
        });
      }
    }

    if (recs.length === 0) {
      recs.push({
        icon: CheckCircle,
        title: "Keep Up the Good Work!",
        desc: "Maintain your healthy lifestyle with regular exercise and balanced diet."
      });
    }

    return recs;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Calculator className="w-3 h-3 mr-1" />
              Health Calculator
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              BMI Calculator & <span className="text-gradient">Health Score</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Calculate your Body Mass Index and get personalized health recommendations
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* BMI Calculator */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                Calculate Your BMI
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Height (cm)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 170"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Weight (kg)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Age (years)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 30"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
              </div>

              <Button variant="hero" className="w-full" onClick={calculateBMI}>
                Calculate BMI
              </Button>

              {bmi && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6"
                >
                  <div className={`p-6 rounded-xl ${getBMICategory(bmi).bg} text-center`}>
                    <p className="text-sm text-muted-foreground mb-2">Your BMI</p>
                    <p className={`text-5xl font-bold ${getBMICategory(bmi).color}`}>{bmi}</p>
                    <Badge className={`mt-3 ${getBMICategory(bmi).bg} ${getBMICategory(bmi).color} border-0`}>
                      {getBMICategory(bmi).label}
                    </Badge>
                  </div>

                  {/* BMI Scale */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Underweight</span>
                      <span>Normal</span>
                      <span>Overweight</span>
                      <span>Obese</span>
                    </div>
                    <div className="h-3 rounded-full flex overflow-hidden">
                      <div className="flex-1 bg-yellow-400" />
                      <div className="flex-1 bg-green-400" />
                      <div className="flex-1 bg-orange-400" />
                      <div className="flex-1 bg-red-400" />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>18.5</span>
                      <span>25</span>
                      <span>30</span>
                      <span>40</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Health Score */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Your Health Score
              </h2>

              {healthScore ? (
                <>
                  <div className="text-center mb-6">
                    <div className="relative w-40 h-40 mx-auto">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke="currentColor"
                          className="text-muted/20"
                          strokeWidth="12"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke="currentColor"
                          className={getScoreColor(healthScore.overall)}
                          strokeWidth="12"
                          strokeDasharray={`${(healthScore.overall / 100) * 440} 440`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-bold ${getScoreColor(healthScore.overall)}`}>
                          {healthScore.overall}
                        </span>
                        <span className="text-sm text-muted-foreground">out of 100</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "BMI Score", value: healthScore.bmi, icon: Scale },
                      { label: "Blood Pressure", value: healthScore.bpScore, icon: Heart },
                      { label: "Blood Sugar", value: healthScore.sugarScore, icon: Activity },
                      { label: "Heart Rate", value: healthScore.heartScore, icon: Heart },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <span className={`font-semibold ${getScoreColor(item.value)}`}>{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Log your vitals in the Health Vitals Tracker to see your personalized health score
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = "/vitals"}>
                    Go to Vitals Tracker
                  </Button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <h2 className="text-xl font-semibold mb-4">Personalized Recommendations</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {getRecommendations().map((rec, index) => (
                <div key={index} className="bg-card border border-border rounded-xl p-4 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <rec.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{rec.title}</h3>
                    <p className="text-sm text-muted-foreground">{rec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-accent/50 border border-border rounded-xl p-6"
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">About BMI</h3>
                <p className="text-sm text-muted-foreground">
                  BMI is a screening tool and doesn't directly measure body fat. It may not be accurate for athletes, 
                  elderly, or those with high muscle mass. Always consult a healthcare provider for a complete health assessment.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BMICalculator;
