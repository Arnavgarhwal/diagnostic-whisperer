import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Plus, Trash2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

interface Goal {
  id: string;
  title: string;
  category: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
}

const categories = ["Fitness", "Nutrition", "Sleep", "Mental Health", "Weight", "Hydration"];

const HealthGoals = () => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem("health-goals");
    return saved ? JSON.parse(saved) : [
      { id: "1", title: "Walk 10,000 steps daily", category: "Fitness", target: 10000, current: 6500, unit: "steps", deadline: "2026-03-01" },
      { id: "2", title: "Drink 8 glasses of water", category: "Hydration", target: 8, current: 5, unit: "glasses", deadline: "2026-02-28" },
      { id: "3", title: "Sleep 8 hours per night", category: "Sleep", target: 8, current: 6.5, unit: "hours", deadline: "2026-03-15" },
    ];
  });

  const [newGoal, setNewGoal] = useState({ title: "", category: "Fitness", target: "", unit: "", deadline: "" });

  const saveGoals = (updated: Goal[]) => {
    setGoals(updated);
    localStorage.setItem("health-goals", JSON.stringify(updated));
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.target || !newGoal.unit) {
      toast.error("Please fill all fields");
      return;
    }
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      category: newGoal.category,
      target: Number(newGoal.target),
      current: 0,
      unit: newGoal.unit,
      deadline: newGoal.deadline || "2026-12-31",
    };
    saveGoals([...goals, goal]);
    setNewGoal({ title: "", category: "Fitness", target: "", unit: "", deadline: "" });
    toast.success("Goal added!");
  };

  const updateProgress = (id: string, increment: number) => {
    const updated = goals.map(g => g.id === id ? { ...g, current: Math.max(0, Math.min(g.target, g.current + increment)) } : g);
    saveGoals(updated);
  };

  const removeGoal = (id: string) => {
    saveGoals(goals.filter(g => g.id !== id));
    toast.success("Goal removed");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Health <span className="text-gradient">Goals</span></h1>
              <p className="text-muted-foreground">Set and track your wellness objectives</p>
            </div>
          </div>

          {/* Add Goal */}
          <Card className="mb-8">
            <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" /> New Goal</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Goal title" value={newGoal.title} onChange={e => setNewGoal({ ...newGoal, title: e.target.value })} />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Select value={newGoal.category} onValueChange={v => setNewGoal({ ...newGoal, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="number" placeholder="Target" value={newGoal.target} onChange={e => setNewGoal({ ...newGoal, target: e.target.value })} />
                <Input placeholder="Unit (steps, kg...)" value={newGoal.unit} onChange={e => setNewGoal({ ...newGoal, unit: e.target.value })} />
                <Input type="date" value={newGoal.deadline} onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })} />
              </div>
              <Button onClick={addGoal} className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Goal</Button>
            </CardContent>
          </Card>

          {/* Goals List */}
          <div className="space-y-4">
            {goals.map(goal => {
              const pct = Math.round((goal.current / goal.target) * 100);
              return (
                <motion.div key={goal.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{goal.title}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary">{goal.category}</Badge>
                            <span className="text-xs text-muted-foreground">Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeGoal(goal.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <Progress value={pct} className="flex-1" />
                        <span className="text-sm font-medium text-foreground w-12 text-right">{pct}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{goal.current} / {goal.target} {goal.unit}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => updateProgress(goal.id, -1)}>-1</Button>
                          <Button size="sm" onClick={() => updateProgress(goal.id, 1)}>+1</Button>
                          <Button size="sm" variant="secondary" onClick={() => updateProgress(goal.id, 5)}>+5</Button>
                        </div>
                      </div>
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

export default HealthGoals;
