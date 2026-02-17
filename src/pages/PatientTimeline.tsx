import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Stethoscope, Pill, TestTube, Activity, FileText, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

interface TimelineEvent {
  id: string;
  type: "consultation" | "prescription" | "test" | "vitals" | "document";
  title: string;
  description: string;
  date: string;
  doctor?: string;
}

const typeConfig = {
  consultation: { icon: Stethoscope, color: "bg-primary/10 text-primary", label: "Consultation" },
  prescription: { icon: Pill, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", label: "Prescription" },
  test: { icon: TestTube, color: "bg-green-500/10 text-green-600 dark:text-green-400", label: "Test Result" },
  vitals: { icon: Activity, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400", label: "Vitals" },
  document: { icon: FileText, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", label: "Document" },
};

const PatientTimeline = () => {
  const [events, setEvents] = useState<TimelineEvent[]>(() => {
    const saved = localStorage.getItem("patient-timeline");
    return saved ? JSON.parse(saved) : [
      { id: "1", type: "consultation", title: "General Checkup", description: "Annual physical exam. All vitals normal.", date: "2026-02-15", doctor: "Dr. Sarah Johnson" },
      { id: "2", type: "test", title: "Blood Panel", description: "CBC, Lipid Profile, Thyroid - all within normal range", date: "2026-02-10" },
      { id: "3", type: "prescription", title: "Vitamin D Supplement", description: "Vitamin D3 1000IU daily for 3 months", date: "2026-02-10", doctor: "Dr. Sarah Johnson" },
      { id: "4", type: "vitals", title: "BP Reading", description: "Blood Pressure: 120/80 mmHg, Heart Rate: 72 bpm", date: "2026-02-05" },
      { id: "5", type: "consultation", title: "Dermatology Visit", description: "Skin rash evaluation. Prescribed topical cream.", date: "2026-01-20", doctor: "Dr. Emily Davis" },
      { id: "6", type: "document", title: "Insurance Document", description: "Health insurance renewal confirmation", date: "2026-01-15" },
    ];
  });
  const [form, setForm] = useState({ type: "consultation" as TimelineEvent["type"], title: "", description: "", date: "", doctor: "" });
  const [filter, setFilter] = useState("all");

  const save = (updated: TimelineEvent[]) => { setEvents(updated); localStorage.setItem("patient-timeline", JSON.stringify(updated)); };

  const addEvent = () => {
    if (!form.title || !form.date) { toast.error("Fill title and date"); return; }
    save([{ id: Date.now().toString(), ...form }, ...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setForm({ type: "consultation", title: "", description: "", date: "", doctor: "" });
    toast.success("Event added to timeline");
  };

  const filtered = filter === "all" ? events : events.filter(e => e.type === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Clock className="w-6 h-6 text-primary" /></div>
            <div>
              <h1 className="text-3xl font-bold">Patient <span className="text-gradient">Timeline</span></h1>
              <p className="text-muted-foreground">Your complete health history in one place</p>
            </div>
          </div>

          {/* Add Event */}
          <Card className="mb-6">
            <CardHeader><CardTitle><Plus className="w-5 h-5 inline mr-2" />Add Event</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Select value={form.type} onValueChange={(v: TimelineEvent["type"]) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <Input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Doctor (optional)" value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} />
              <Button onClick={addEvent} className="w-full"><Plus className="w-4 h-4 mr-2" /> Add to Timeline</Button>
            </CardContent>
          </Card>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["all", ...Object.keys(typeConfig)].map(f => (
              <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
                {f === "all" ? "All" : typeConfig[f as keyof typeof typeConfig].label}
              </Button>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {filtered.map(event => {
                const config = typeConfig[event.type];
                const Icon = config.icon;
                return (
                  <motion.div key={event.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative pl-16">
                    <div className={`absolute left-2 w-9 h-9 rounded-full ${config.color} flex items-center justify-center z-10`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">{event.title}</h3>
                              <Badge variant="secondary" className="text-xs">{config.label}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                            <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                              <span>{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                              {event.doctor && <span>• {event.doctor}</span>}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => save(events.filter(e => e.id !== event.id))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default PatientTimeline;
