import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Heart, Activity, Moon, Apple, Target, Pill, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ScoreCategory { name: string; score: number; max: number; icon: React.ElementType; color: string; tip: string; }

const HealthScore = () => {
  const [categories, setCategories] = useState<ScoreCategory[]>([]);

  useEffect(() => {
    // Aggregate data from other trackers in localStorage
    const goals = JSON.parse(localStorage.getItem("health-goals") || "[]");
    const goalsScore = goals.length > 0
      ? Math.round(goals.reduce((s: number, g: any) => s + Math.min(100, (g.current / g.target) * 100), 0) / goals.length)
      : 50;

    const sleepEntries = JSON.parse(localStorage.getItem("sleep-entries") || "[]");
    const avgSleep = sleepEntries.length
      ? sleepEntries.reduce((s: number, e: any) => s + e.duration, 0) / sleepEntries.length
      : 7;
    const sleepScore = Math.min(100, Math.round((avgSleep / 8) * 100));

    const meals = JSON.parse(localStorage.getItem("diet-meals-today") || "[]");
    const totalCal = meals.reduce((s: number, m: any) => s + m.calories, 0);
    const nutritionScore = totalCal > 0 ? Math.min(100, Math.round(Math.min(totalCal / 2000, 1) * 100)) : 40;

    const moods = JSON.parse(localStorage.getItem("mood-entries") || "[]");
    const avgMood = moods.length
      ? moods.slice(0, 7).reduce((s: number, e: any) => {
          const val = e.mood === "Excellent" ? 100 : e.mood === "Good" ? 80 : e.mood === "Okay" ? 60 : e.mood === "Low" ? 40 : 20;
          return s + val;
        }, 0) / Math.min(moods.length, 7)
      : 60;

    const waterToday = Number(localStorage.getItem("water-today") || "0");
    const hydrationScore = Math.min(100, Math.round((waterToday / 8) * 100));

    const bmiData = localStorage.getItem("bmi-result");
    const bmiScore = bmiData ? 70 : 50;

    const computed: ScoreCategory[] = [
      { name: "Fitness Goals", score: goalsScore, max: 100, icon: Target, color: "text-primary", tip: goalsScore < 50 ? "Set and track more health goals" : "Great progress on your goals!" },
      { name: "Sleep Quality", score: sleepScore, max: 100, icon: Moon, color: "text-primary", tip: sleepScore < 70 ? "Aim for 7-9 hours of sleep" : "Your sleep pattern is healthy!" },
      { name: "Nutrition", score: nutritionScore, max: 100, icon: Apple, color: "text-primary", tip: nutritionScore < 50 ? "Log more meals to track nutrition" : "Good nutritional intake!" },
      { name: "Mental Health", score: Math.round(avgMood), max: 100, icon: Heart, color: "text-primary", tip: avgMood < 60 ? "Consider stress-relief activities" : "Your mood is positive!" },
      { name: "Hydration", score: hydrationScore, max: 100, icon: Activity, color: "text-primary", tip: hydrationScore < 60 ? "Drink more water throughout the day" : "Well hydrated!" },
      { name: "BMI & Body", score: bmiScore, max: 100, icon: Pill, color: "text-primary", tip: "Use the BMI Calculator for accurate score" },
    ];

    setCategories(computed);
  }, []);

  const overallScore = categories.length ? Math.round(categories.reduce((s, c) => s + c.score, 0) / categories.length) : 0;
  const scoreColor = overallScore >= 80 ? "text-green-600 dark:text-green-400" : overallScore >= 60 ? "text-primary" : overallScore >= 40 ? "text-yellow-600 dark:text-yellow-400" : "text-destructive";
  const scoreLabel = overallScore >= 80 ? "Excellent" : overallScore >= 60 ? "Good" : overallScore >= 40 ? "Fair" : "Needs Improvement";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Award className="w-6 h-6 text-primary" /></div>
            <div>
              <h1 className="text-3xl font-bold">Health <span className="text-gradient">Score</span></h1>
              <p className="text-muted-foreground">Your comprehensive wellness assessment</p>
            </div>
          </div>

          {/* Overall Score */}
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <div className="relative w-40 h-40 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/30" />
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="none" className={scoreColor}
                    strokeDasharray={`${overallScore * 2.83} 283`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${scoreColor}`}>{overallScore}</span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-1">{scoreLabel}</Badge>
              <p className="text-sm text-muted-foreground mt-3">Based on your tracked health data across all categories</p>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <div className="grid md:grid-cols-2 gap-4">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <motion.div key={cat.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className={`w-5 h-5 ${cat.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-foreground">{cat.name}</h3>
                            <span className="font-bold text-foreground">{cat.score}%</span>
                          </div>
                          <Progress value={cat.score} className="mt-1 h-2" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{cat.tip}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default HealthScore;
