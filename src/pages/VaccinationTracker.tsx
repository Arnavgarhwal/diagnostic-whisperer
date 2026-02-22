import { useState } from "react";
import { motion } from "framer-motion";
import { Syringe, Calendar, CheckCircle, AlertTriangle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Vaccine {
  id: string;
  name: string;
  date: string;
  doseNumber: number;
  totalDoses: number;
  nextDueDate?: string;
  provider?: string;
  status: "completed" | "upcoming" | "overdue";
}

const commonVaccines = [
  { name: "COVID-19 (Pfizer)", totalDoses: 3 },
  { name: "COVID-19 (Moderna)", totalDoses: 2 },
  { name: "Influenza (Flu)", totalDoses: 1 },
  { name: "Tetanus/Diphtheria (Td)", totalDoses: 1 },
  { name: "Hepatitis B", totalDoses: 3 },
  { name: "MMR", totalDoses: 2 },
  { name: "HPV", totalDoses: 3 },
  { name: "Pneumococcal", totalDoses: 1 },
  { name: "Shingles (Shingrix)", totalDoses: 2 },
  { name: "Meningococcal", totalDoses: 1 },
];

const VaccinationTracker = () => {
  const [vaccines, setVaccines] = useState<Vaccine[]>(() => {
    const saved = localStorage.getItem("wellsync-vaccines");
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "COVID-19 (Pfizer)", date: "2024-01-15", doseNumber: 3, totalDoses: 3, status: "completed", provider: "City Hospital" },
      { id: "2", name: "Influenza (Flu)", date: "2024-10-01", doseNumber: 1, totalDoses: 1, status: "completed", provider: "Local Clinic" },
      { id: "3", name: "Tetanus/Diphtheria (Td)", date: "2025-06-15", doseNumber: 1, totalDoses: 1, nextDueDate: "2025-06-15", status: "upcoming" },
    ];
  });
  const [showAdd, setShowAdd] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState("");
  const [vaccineDate, setVaccineDate] = useState("");
  const [vaccineDose, setVaccineDose] = useState("1");

  const save = (data: Vaccine[]) => { setVaccines(data); localStorage.setItem("wellsync-vaccines", JSON.stringify(data)); };

  const addVaccine = () => {
    if (!selectedVaccine || !vaccineDate) return;
    const template = commonVaccines.find(v => v.name === selectedVaccine);
    const vaccine: Vaccine = {
      id: Date.now().toString(), name: selectedVaccine, date: vaccineDate,
      doseNumber: parseInt(vaccineDose), totalDoses: template?.totalDoses || 1,
      status: new Date(vaccineDate) > new Date() ? "upcoming" : "completed",
    };
    save([...vaccines, vaccine]);
    setSelectedVaccine(""); setVaccineDate(""); setVaccineDose("1"); setShowAdd(false);
  };

  const removeVaccine = (id: string) => save(vaccines.filter(v => v.id !== id));

  const completed = vaccines.filter(v => v.status === "completed");
  const upcoming = vaccines.filter(v => v.status === "upcoming");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><Syringe className="w-3 h-3 mr-1" />Immunization</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2"><span className="text-gradient">Vaccination</span> Tracker</h1>
            <p className="text-muted-foreground">Keep track of your immunization history and upcoming vaccines</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card><CardContent className="pt-6 text-center"><p className="text-3xl font-bold text-primary">{completed.length}</p><p className="text-xs text-muted-foreground">Completed</p></CardContent></Card>
            <Card><CardContent className="pt-6 text-center"><p className="text-3xl font-bold text-amber-500">{upcoming.length}</p><p className="text-xs text-muted-foreground">Upcoming</p></CardContent></Card>
            <Card><CardContent className="pt-6 text-center"><p className="text-3xl font-bold text-foreground">{vaccines.length}</p><p className="text-xs text-muted-foreground">Total Records</p></CardContent></Card>
          </div>

          <div className="flex justify-end mb-4">
            <Button variant="hero" onClick={() => setShowAdd(!showAdd)}><Plus className="w-4 h-4 mr-1" />Add Vaccine</Button>
          </div>

          {showAdd && (
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <Select value={selectedVaccine} onValueChange={setSelectedVaccine}>
                  <SelectTrigger><SelectValue placeholder="Select vaccine" /></SelectTrigger>
                  <SelectContent>{commonVaccines.map(v => <SelectItem key={v.name} value={v.name}>{v.name}</SelectItem>)}</SelectContent>
                </Select>
                <div className="flex gap-4">
                  <Input type="date" value={vaccineDate} onChange={e => setVaccineDate(e.target.value)} className="flex-1" />
                  <Input type="number" min="1" max="5" value={vaccineDose} onChange={e => setVaccineDose(e.target.value)} className="w-24" placeholder="Dose #" />
                </div>
                <Button onClick={addVaccine} className="w-full">Save Vaccine Record</Button>
              </CardContent>
            </Card>
          )}

          {/* Vaccine List */}
          <div className="space-y-4">
            {upcoming.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><Calendar className="w-5 h-5 text-amber-500" />Upcoming</h2>
                {upcoming.map(v => (
                  <div key={v.id} className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-2 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{v.name}</p>
                      <p className="text-sm text-muted-foreground">Dose {v.doseNumber}/{v.totalDoses} • Due: {v.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Upcoming</Badge>
                      <Button size="icon" variant="ghost" onClick={() => removeVaccine(v.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" />Completed</h2>
              {completed.length === 0 ? <p className="text-sm text-muted-foreground">No completed vaccinations recorded.</p> : completed.map(v => (
                <div key={v.id} className="bg-muted/50 border border-border rounded-xl p-4 mb-2 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{v.name}</p>
                    <p className="text-sm text-muted-foreground">Dose {v.doseNumber}/{v.totalDoses} • {v.date}{v.provider ? ` • ${v.provider}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Done</Badge>
                    <Button size="icon" variant="ghost" onClick={() => removeVaccine(v.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VaccinationTracker;
