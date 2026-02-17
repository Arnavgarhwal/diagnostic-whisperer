import { useState } from "react";
import { motion } from "framer-motion";
import { Apple, Plus, Droplets, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

const quickMeals = [
  { name: "Oatmeal Bowl", calories: 300, protein: 10, carbs: 50, fat: 8 },
  { name: "Grilled Chicken Salad", calories: 400, protein: 35, carbs: 15, fat: 18 },
  { name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0 },
  { name: "Brown Rice & Vegetables", calories: 350, protein: 8, carbs: 65, fat: 5 },
  { name: "Protein Shake", calories: 200, protein: 25, carbs: 10, fat: 5 },
  { name: "Greek Yogurt", calories: 150, protein: 15, carbs: 12, fat: 5 },
];

const DietTracker = () => {
  const [meals, setMeals] = useState<Meal[]>(() => {
    const saved = localStorage.getItem("diet-meals-today");
    return saved ? JSON.parse(saved) : [];
  });
  const [waterGlasses, setWaterGlasses] = useState(() => {
    const saved = localStorage.getItem("water-today");
    return saved ? Number(saved) : 0;
  });
  const [customMeal, setCustomMeal] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "" });

  const dailyGoal = { calories: 2000, protein: 60, carbs: 250, fat: 65, water: 8 };

  const saveMeals = (updated: Meal[]) => {
    setMeals(updated);
    localStorage.setItem("diet-meals-today", JSON.stringify(updated));
  };

  const addMeal = (meal: Omit<Meal, "id" | "time">) => {
    const newMeal: Meal = { ...meal, id: Date.now().toString(), time: new Date().toLocaleTimeString() };
    saveMeals([...meals, newMeal]);
    toast.success(`${meal.name} logged!`);
  };

  const addCustomMeal = () => {
    if (!customMeal.name || !customMeal.calories) { toast.error("Fill name and calories"); return; }
    addMeal({ name: customMeal.name, calories: Number(customMeal.calories), protein: Number(customMeal.protein) || 0, carbs: Number(customMeal.carbs) || 0, fat: Number(customMeal.fat) || 0 });
    setCustomMeal({ name: "", calories: "", protein: "", carbs: "", fat: "" });
  };

  const addWater = () => {
    const newVal = waterGlasses + 1;
    setWaterGlasses(newVal);
    localStorage.setItem("water-today", String(newVal));
    toast.success("Glass of water logged! 💧");
  };

  const totals = meals.reduce((acc, m) => ({ calories: acc.calories + m.calories, protein: acc.protein + m.protein, carbs: acc.carbs + m.carbs, fat: acc.fat + m.fat }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const aiTip = totals.calories > 1500 && totals.protein < 40
    ? "💡 Your protein intake is low relative to calories. Consider adding lean protein sources like chicken breast or lentils."
    : totals.calories < 800
    ? "💡 You haven't logged many calories today. Make sure you're eating enough to maintain energy levels!"
    : "💡 Great job tracking your meals! Keep maintaining a balanced diet with proper macro ratios.";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Apple className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Diet <span className="text-gradient">Tracker</span></h1>
              <p className="text-muted-foreground">Log meals, track macros, stay healthy</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {[
              { label: "Calories", val: totals.calories, goal: dailyGoal.calories, unit: "kcal", color: "text-primary" },
              { label: "Protein", val: totals.protein, goal: dailyGoal.protein, unit: "g", color: "text-primary" },
              { label: "Carbs", val: totals.carbs, goal: dailyGoal.carbs, unit: "g", color: "text-primary" },
              { label: "Fat", val: totals.fat, goal: dailyGoal.fat, unit: "g", color: "text-primary" },
              { label: "Water", val: waterGlasses, goal: dailyGoal.water, unit: "glasses", color: "text-primary" },
            ].map(item => (
              <Card key={item.label}>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className={`text-xl font-bold ${item.color}`}>{item.val}</p>
                  <Progress value={Math.min(100, (item.val / item.goal) * 100)} className="mt-2 h-1.5" />
                  <p className="text-xs text-muted-foreground mt-1">/ {item.goal} {item.unit}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Water + AI Tip */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Droplets className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Water Intake</p>
                    <p className="text-sm text-muted-foreground">{waterGlasses} / {dailyGoal.water} glasses</p>
                  </div>
                </div>
                <Button onClick={addWater}><Plus className="w-4 h-4 mr-1" /> Add</Button>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <p className="text-sm text-foreground">{aiTip}</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Add */}
          <Card className="mb-6">
            <CardHeader><CardTitle>Quick Add Meals</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {quickMeals.map(m => (
                  <Button key={m.name} variant="outline" size="sm" onClick={() => addMeal(m)}>
                    {m.name} ({m.calories} cal)
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <Input placeholder="Meal name" value={customMeal.name} onChange={e => setCustomMeal({ ...customMeal, name: e.target.value })} />
                <Input type="number" placeholder="Calories" value={customMeal.calories} onChange={e => setCustomMeal({ ...customMeal, calories: e.target.value })} />
                <Input type="number" placeholder="Protein (g)" value={customMeal.protein} onChange={e => setCustomMeal({ ...customMeal, protein: e.target.value })} />
                <Input type="number" placeholder="Carbs (g)" value={customMeal.carbs} onChange={e => setCustomMeal({ ...customMeal, carbs: e.target.value })} />
                <Input type="number" placeholder="Fat (g)" value={customMeal.fat} onChange={e => setCustomMeal({ ...customMeal, fat: e.target.value })} />
              </div>
              <Button onClick={addCustomMeal} className="w-full mt-3"><Plus className="w-4 h-4 mr-2" /> Log Meal</Button>
            </CardContent>
          </Card>

          {/* Meal Log */}
          <Card>
            <CardHeader><CardTitle>Today's Meals ({meals.length})</CardTitle></CardHeader>
            <CardContent>
              {meals.length === 0 ? (
                <p className="text-muted-foreground text-center py-6">No meals logged yet today</p>
              ) : (
                <div className="space-y-3">
                  {meals.map(meal => (
                    <div key={meal.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-foreground">{meal.name}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary">{meal.calories} cal</Badge>
                          <span className="text-xs text-muted-foreground">P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{meal.time}</span>
                        <Button variant="ghost" size="icon" onClick={() => saveMeals(meals.filter(m => m.id !== meal.id))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default DietTracker;
