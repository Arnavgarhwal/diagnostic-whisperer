import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Plus, Trash2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality: string;
  notes: string;
}

const SleepTracker = () => {
  const [entries, setEntries] = useState<SleepEntry[]>(() => {
    const saved = localStorage.getItem("sleep-entries");
    return saved ? JSON.parse(saved) : [
      { id: "1", date: "2026-02-16", bedtime: "22:30", wakeTime: "06:30", duration: 8, quality: "Good", notes: "Felt rested" },
      { id: "2", date: "2026-02-15", bedtime: "23:00", wakeTime: "07:00", duration: 8, quality: "Excellent", notes: "Deep sleep" },
      { id: "3", date: "2026-02-14", bedtime: "00:30", wakeTime: "06:00", duration: 5.5, quality: "Poor", notes: "Couldn't fall asleep" },
    ];
  });
  const [form, setForm] = useState({ date: "", bedtime: "", wakeTime: "", quality: "Good", notes: "" });

  const save = (updated: SleepEntry[]) => { setEntries(updated); localStorage.setItem("sleep-entries", JSON.stringify(updated)); };

  const calcDuration = (bed: string, wake: string) => {
    const [bh, bm] = bed.split(":").map(Number);
    const [wh, wm] = wake.split(":").map(Number);
    let diff = (wh * 60 + wm) - (bh * 60 + bm);
    if (diff < 0) diff += 24 * 60;
    return Math.round(diff / 60 * 10) / 10;
  };

  const addEntry = () => {
    if (!form.date || !form.bedtime || !form.wakeTime) { toast.error("Fill date and times"); return; }
    const duration = calcDuration(form.bedtime, form.wakeTime);
    const entry: SleepEntry = { id: Date.now().toString(), ...form, duration };
    save([entry, ...entries]);
    setForm({ date: "", bedtime: "", wakeTime: "", quality: "Good", notes: "" });
    toast.success(`Sleep logged: ${duration} hours`);
  };

  const avgDuration = entries.length ? (entries.reduce((s, e) => s + e.duration, 0) / entries.length).toFixed(1) : "0";
  const qualityColor = (q: string) => q === "Excellent" ? "bg-green-500/10 text-green-700 dark:text-green-400" : q === "Good" ? "bg-primary/10 text-primary" : q === "Fair" ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400" : "bg-destructive/10 text-destructive";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Moon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Sleep <span className="text-gradient">Tracker</span></h1>
              <p className="text-muted-foreground">Monitor your sleep patterns and quality</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Avg Duration</p><p className="text-2xl font-bold text-primary">{avgDuration}h</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Total Entries</p><p className="text-2xl font-bold text-foreground">{entries.length}</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Goal</p><p className="text-2xl font-bold text-foreground">8h</p></CardContent></Card>
          </div>

          {/* Log Sleep */}
          <Card className="mb-6">
            <CardHeader><CardTitle><Moon className="w-5 h-5 inline mr-2" />Log Sleep</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                <Input type="time" value={form.bedtime} onChange={e => setForm({ ...form, bedtime: e.target.value })} placeholder="Bedtime" />
                <Input type="time" value={form.wakeTime} onChange={e => setForm({ ...form, wakeTime: e.target.value })} placeholder="Wake time" />
                <Select value={form.quality} onValueChange={v => setForm({ ...form, quality: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              <Button onClick={addEntry} className="w-full"><Plus className="w-4 h-4 mr-2" /> Log Sleep</Button>
            </CardContent>
          </Card>

          {/* History */}
          <Card>
            <CardHeader><CardTitle>Sleep History</CardTitle></CardHeader>
            <CardContent>
              {entries.length === 0 ? <p className="text-muted-foreground text-center py-6">No entries yet</p> : (
                <div className="space-y-3">
                  {entries.map(e => (
                    <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-foreground">{new Date(e.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
                        <div className="flex gap-2 mt-1 items-center">
                          <span className="text-sm text-muted-foreground">{e.bedtime} → {e.wakeTime}</span>
                          <Badge className={qualityColor(e.quality)}>{e.quality}</Badge>
                        </div>
                        {e.notes && <p className="text-xs text-muted-foreground mt-1">{e.notes}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-foreground">{e.duration}h</span>
                        <Button variant="ghost" size="icon" onClick={() => save(entries.filter(x => x.id !== e.id))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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

export default SleepTracker;
