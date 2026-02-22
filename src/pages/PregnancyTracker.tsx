import { useState } from "react";
import { motion } from "framer-motion";
import { Baby, Calendar, Heart, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const weeklyInfo: Record<number, { size: string; development: string; tips: string[]; warnings: string[] }> = {
  4: { size: "Poppy seed", development: "Embryo implants in uterus. Neural tube forming.", tips: ["Start prenatal vitamins with folic acid", "Avoid alcohol and smoking"], warnings: ["Heavy bleeding", "Severe cramping"] },
  8: { size: "Raspberry", development: "Heart beating. Tiny fingers and toes forming.", tips: ["Schedule first prenatal visit", "Stay hydrated", "Eat small frequent meals"], warnings: ["Persistent vomiting", "Spotting"] },
  12: { size: "Lime", development: "All organs formed. Baby can make fists.", tips: ["First trimester screening", "Announce pregnancy if comfortable", "Moderate exercise"], warnings: ["Severe nausea preventing eating", "Fever above 100.4°F"] },
  16: { size: "Avocado", development: "Baby can hear sounds. Gender may be visible.", tips: ["Anatomy scan around week 20", "Start sleeping on your side", "Kegel exercises"], warnings: ["Severe headaches", "Vision changes"] },
  20: { size: "Banana", development: "Halfway! Baby is moving actively.", tips: ["Track baby movements", "Eat iron-rich foods", "Stay active"], warnings: ["Reduced fetal movement", "Swelling in hands/face"] },
  24: { size: "Corn ear", development: "Baby responds to light and sound. Lungs developing.", tips: ["Glucose screening test", "Prepare nursery", "Childbirth classes"], warnings: ["Regular contractions before 37 weeks", "Fluid leaking"] },
  28: { size: "Eggplant", development: "Eyes can open. Brain developing rapidly.", tips: ["Count kicks daily", "Rh antibody testing", "Plan maternity leave"], warnings: ["Decreased movement", "Persistent headache"] },
  32: { size: "Squash", development: "Baby practicing breathing. Gaining weight.", tips: ["Hospital bag ready", "Perineal massage", "Birth plan discussion"], warnings: ["Vaginal bleeding", "Severe back pain"] },
  36: { size: "Honeydew melon", development: "Baby is head-down. Fat accumulating under skin.", tips: ["Weekly check-ups", "Install car seat", "Pre-register at hospital"], warnings: ["Water breaking early", "Regular contractions"] },
  40: { size: "Watermelon", development: "Full term! Baby is ready to be born.", tips: ["Rest as much as possible", "Know labor signs", "Stay close to hospital"], warnings: ["No fetal movement", "Heavy bleeding", "Severe pain"] },
};

const PregnancyTracker = () => {
  const [currentWeek, setCurrentWeek] = useState<number>(() => {
    const saved = localStorage.getItem("wellsync-pregnancy-week");
    return saved ? parseInt(saved) : 12;
  });
  const [dueDate, setDueDate] = useState(() => localStorage.getItem("wellsync-due-date") || "");
  const [symptoms, setSymptoms] = useState<string[]>(() => {
    const saved = localStorage.getItem("wellsync-pregnancy-symptoms");
    return saved ? JSON.parse(saved) : [];
  });

  const nearestWeek = Object.keys(weeklyInfo).map(Number).reduce((prev, curr) => Math.abs(curr - currentWeek) < Math.abs(prev - currentWeek) ? curr : prev);
  const info = weeklyInfo[nearestWeek];
  const trimester = currentWeek <= 12 ? 1 : currentWeek <= 27 ? 2 : 3;

  const updateWeek = (week: number) => {
    setCurrentWeek(week);
    localStorage.setItem("wellsync-pregnancy-week", week.toString());
  };

  const updateDueDate = (date: string) => {
    setDueDate(date);
    localStorage.setItem("wellsync-due-date", date);
    if (date) {
      const due = new Date(date);
      const now = new Date();
      const diff = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7));
      updateWeek(Math.max(1, 40 - diff));
    }
  };

  const commonSymptoms = ["Morning Sickness", "Fatigue", "Back Pain", "Heartburn", "Swelling", "Insomnia", "Mood Swings", "Cramps"];
  const toggleSymptom = (s: string) => {
    const updated = symptoms.includes(s) ? symptoms.filter(x => x !== s) : [...symptoms, s];
    setSymptoms(updated);
    localStorage.setItem("wellsync-pregnancy-symptoms", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><Baby className="w-3 h-3 mr-1" />Pregnancy</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2"><span className="text-gradient">Pregnancy</span> Tracker</h1>
            <p className="text-muted-foreground">Week-by-week guidance for a healthy pregnancy</p>
          </motion.div>

          {/* Week & Due Date */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-5xl font-bold text-primary">{currentWeek}</p>
                <p className="text-muted-foreground">Weeks Pregnant</p>
                <Badge className="mt-2">Trimester {trimester}</Badge>
                <div className="flex gap-2 mt-4 justify-center">
                  <Button size="sm" variant="outline" onClick={() => updateWeek(Math.max(1, currentWeek - 1))}>-</Button>
                  <Button size="sm" variant="outline" onClick={() => updateWeek(Math.min(42, currentWeek + 1))}>+</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium text-foreground mb-2">Due Date</p>
                <Input type="date" value={dueDate} onChange={e => updateDueDate(e.target.value)} />
                {dueDate && <p className="text-xs text-muted-foreground mt-2">{Math.max(0, 40 - currentWeek)} weeks to go!</p>}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm font-medium text-foreground mb-1">Baby is the size of a</p>
                <p className="text-2xl font-bold text-primary">{info.size}</p>
                <p className="text-xs text-muted-foreground mt-2">{info.development}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" />Tips for Week {nearestWeek}</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {info.tips.map(t => <div key={t} className="flex items-start gap-2 bg-muted/50 rounded-lg p-3"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" /><p className="text-sm text-foreground">{t}</p></div>)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-destructive" />Warning Signs</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {info.warnings.map(w => <div key={w} className="flex items-start gap-2 bg-destructive/5 rounded-lg p-3"><AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" /><p className="text-sm text-foreground">{w}</p></div>)}
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader><CardTitle>Track Your Symptoms</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map(s => (
                    <Button key={s} variant={symptoms.includes(s) ? "default" : "outline"} size="sm" onClick={() => toggleSymptom(s)}>{s}</Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PregnancyTracker;
