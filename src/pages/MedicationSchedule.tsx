import { useState } from "react";
import { motion } from "framer-motion";
import { Pill, Clock, Plus, Trash2, Bell, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  takenToday: boolean[];
}

const MedicationSchedule = () => {
  const [meds, setMeds] = useState<Medication[]>(() => {
    const saved = localStorage.getItem("wellsync-med-schedule");
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "Metformin", dosage: "500mg", frequency: "twice", times: ["08:00", "20:00"], startDate: "2024-01-01", takenToday: [true, false] },
      { id: "2", name: "Amlodipine", dosage: "5mg", frequency: "once", times: ["09:00"], startDate: "2024-01-01", takenToday: [false] },
      { id: "3", name: "Vitamin D3", dosage: "1000IU", frequency: "once", times: ["08:00"], startDate: "2024-06-01", takenToday: [true] },
    ];
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDosage, setNewDosage] = useState("");
  const [newFreq, setNewFreq] = useState("once");
  const [newTime, setNewTime] = useState("08:00");

  const save = (data: Medication[]) => { setMeds(data); localStorage.setItem("wellsync-med-schedule", JSON.stringify(data)); };

  const addMed = () => {
    if (!newName || !newDosage) return;
    const times = newFreq === "twice" ? [newTime, "20:00"] : newFreq === "thrice" ? ["08:00", "14:00", "20:00"] : [newTime];
    const med: Medication = { id: Date.now().toString(), name: newName, dosage: newDosage, frequency: newFreq, times, startDate: new Date().toISOString().split("T")[0], takenToday: times.map(() => false) };
    save([...meds, med]);
    setNewName(""); setNewDosage(""); setShowAdd(false);
    toast({ title: "Medication Added", description: `${newName} has been added to your schedule.` });
  };

  const markTaken = (medId: string, timeIndex: number) => {
    save(meds.map(m => m.id === medId ? { ...m, takenToday: m.takenToday.map((t, i) => i === timeIndex ? !t : t) } : m));
    toast({ title: "✅ Marked as taken!" });
  };

  const removeMed = (id: string) => save(meds.filter(m => m.id !== id));

  const totalDoses = meds.reduce((acc, m) => acc + m.times.length, 0);
  const takenDoses = meds.reduce((acc, m) => acc + m.takenToday.filter(Boolean).length, 0);
  const adherence = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><Pill className="w-3 h-3 mr-1" />Smart Schedule</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2"><span className="text-gradient">Medication</span> Schedule</h1>
            <p className="text-muted-foreground">Visual daily medication timeline with adherence tracking</p>
          </motion.div>

          {/* Adherence Score */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Adherence</p>
                  <p className="text-3xl font-bold text-primary">{adherence}%</p>
                  <p className="text-xs text-muted-foreground">{takenDoses}/{totalDoses} doses taken</p>
                </div>
                <div className="w-24 h-24 relative">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" className="stroke-muted" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" className="stroke-primary" strokeWidth="3" strokeDasharray={`${adherence}, 100`} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">{adherence}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end mb-4">
            <Button variant="hero" onClick={() => setShowAdd(!showAdd)}><Plus className="w-4 h-4 mr-1" />Add Medication</Button>
          </div>

          {showAdd && (
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Medicine name" value={newName} onChange={e => setNewName(e.target.value)} />
                  <Input placeholder="Dosage (e.g. 500mg)" value={newDosage} onChange={e => setNewDosage(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select value={newFreq} onValueChange={setNewFreq}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="once">Once daily</SelectItem><SelectItem value="twice">Twice daily</SelectItem><SelectItem value="thrice">Three times daily</SelectItem></SelectContent></Select>
                  <Input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} />
                </div>
                <Button onClick={addMed} className="w-full">Add to Schedule</Button>
              </CardContent>
            </Card>
          )}

          {/* Medication List */}
          <div className="space-y-4">
            {meds.map(med => (
              <motion.div key={med.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{med.name}</h3>
                        <p className="text-sm text-muted-foreground">{med.dosage} • {med.frequency === "once" ? "Once" : med.frequency === "twice" ? "Twice" : "3x"} daily</p>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => removeMed(med.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {med.times.map((time, i) => (
                        <Button key={i} variant={med.takenToday[i] ? "default" : "outline"} size="sm" onClick={() => markTaken(med.id, i)} className="gap-1">
                          {med.takenToday[i] ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {time} {med.takenToday[i] ? "✓" : ""}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MedicationSchedule;
