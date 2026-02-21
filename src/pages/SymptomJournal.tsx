import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Plus, Calendar, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

const STORAGE_KEY = "wellsync-symptom-journal";

interface JournalEntry {
  id: string;
  date: string;
  symptoms: string;
  severity: number;
  notes: string;
  mood: string;
}

const moods = ["😊", "😐", "😣", "😩", "😴"];

const SymptomJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [symptoms, setSymptoms] = useState("");
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState("");
  const [mood, setMood] = useState("😐");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const addEntry = () => {
    if (!symptoms.trim()) { toast({ title: "Please describe your symptoms", variant: "destructive" }); return; }
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      symptoms: symptoms.trim(),
      severity,
      notes: notes.trim(),
      mood,
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSymptoms(""); setNotes(""); setSeverity(5); setMood("😐");
    toast({ title: "📝 Entry Added", description: "Symptom logged successfully" });
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const filtered = entries.filter((e) => e.symptoms.toLowerCase().includes(search.toLowerCase()) || e.notes.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><BookOpen className="w-3 h-3 mr-1" /> Journal</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Symptom <span className="text-gradient">Journal</span></h1>
            <p className="text-muted-foreground">Track daily symptoms and patterns over time</p>
          </motion.div>

          {/* Add Entry */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-foreground mb-4">Log Today's Symptoms</h3>
            <Input value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="What symptoms are you experiencing?" className="mb-3" />
            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-2">Severity: {severity}/10</p>
              <input type="range" min="1" max="10" value={severity} onChange={(e) => setSeverity(Number(e.target.value))} className="w-full accent-primary" />
            </div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-2">How do you feel?</p>
              <div className="flex gap-2">
                {moods.map((m) => (
                  <button key={m} onClick={() => setMood(m)} className={`text-2xl p-2 rounded-lg transition-all ${mood === m ? "bg-primary/10 scale-110" : "hover:bg-muted"}`}>{m}</button>
                ))}
              </div>
            </div>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes (optional)" className="mb-4" />
            <Button variant="hero" onClick={addEntry} className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Entry</Button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search entries..." className="pl-10" />
          </div>

          {/* Entries */}
          <div className="space-y-3">
            {filtered.map((entry) => (
              <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{entry.mood}</span>
                      <span className="text-sm font-medium text-foreground">{entry.symptoms}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(entry.date).toLocaleDateString()}</span>
                      <Badge variant={entry.severity >= 7 ? "destructive" : entry.severity >= 4 ? "default" : "secondary"} className="text-xs">
                        Severity: {entry.severity}/10
                      </Badge>
                    </div>
                    {entry.notes && <p className="text-sm text-muted-foreground mt-2">{entry.notes}</p>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteEntry(entry.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No entries yet. Start logging your symptoms!</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SymptomJournal;
