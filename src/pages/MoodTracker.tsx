import { useState } from "react";
import { motion } from "framer-motion";
import { Smile, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

interface MoodEntry { id: string; mood: string; emoji: string; note: string; date: string; time: string; }

const moods = [
  { emoji: "😄", label: "Excellent", value: 5 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😐", label: "Okay", value: 3 },
  { emoji: "😔", label: "Low", value: 2 },
  { emoji: "😢", label: "Bad", value: 1 },
];

const MoodTracker = () => {
  const [entries, setEntries] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem("mood-entries");
    return saved ? JSON.parse(saved) : [];
  });
  const [note, setNote] = useState("");

  const save = (updated: MoodEntry[]) => { setEntries(updated); localStorage.setItem("mood-entries", JSON.stringify(updated)); };

  const logMood = (mood: typeof moods[0]) => {
    const entry: MoodEntry = {
      id: Date.now().toString(), mood: mood.label, emoji: mood.emoji, note,
      date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString(),
    };
    save([entry, ...entries]);
    setNote("");
    toast.success(`Mood logged: ${mood.emoji} ${mood.label}`);
  };

  const avgMood = entries.length
    ? (entries.reduce((s, e) => s + (moods.find(m => m.label === e.mood)?.value || 3), 0) / entries.length).toFixed(1)
    : "—";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Smile className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Mood <span className="text-gradient">Tracker</span></h1>
              <p className="text-muted-foreground">Track how you feel throughout the day</p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader><CardTitle>How are you feeling?</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-center gap-4 mb-4">
                {moods.map(m => (
                  <button key={m.label} onClick={() => logMood(m)} className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-muted transition-colors">
                    <span className="text-4xl">{m.emoji}</span>
                    <span className="text-xs text-muted-foreground">{m.label}</span>
                  </button>
                ))}
              </div>
              <Input placeholder="Add a note (optional)" value={note} onChange={e => setNote(e.target.value)} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Total Entries</p><p className="text-2xl font-bold text-foreground">{entries.length}</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Avg Score</p><p className="text-2xl font-bold text-primary">{avgMood}/5</p></CardContent></Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Mood History</CardTitle></CardHeader>
            <CardContent>
              {entries.length === 0 ? <p className="text-muted-foreground text-center py-6">No entries yet. Log your first mood!</p> : (
                <div className="space-y-3">
                  {entries.slice(0, 20).map(e => (
                    <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{e.emoji}</span>
                        <div>
                          <p className="font-medium text-foreground">{e.mood}</p>
                          {e.note && <p className="text-xs text-muted-foreground">{e.note}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{e.date} {e.time}</span>
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

export default MoodTracker;
