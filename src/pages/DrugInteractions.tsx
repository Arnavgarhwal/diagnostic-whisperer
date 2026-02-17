import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Plus, X, Search, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const interactionDB: Record<string, Record<string, { severity: string; description: string }>> = {
  aspirin: {
    ibuprofen: { severity: "High", description: "Both are NSAIDs. Taking together increases risk of stomach bleeding and ulcers. Aspirin's cardioprotective effect may be reduced." },
    warfarin: { severity: "High", description: "Significantly increases bleeding risk. Requires close medical monitoring if used together." },
    metformin: { severity: "Low", description: "Generally safe but aspirin may slightly enhance metformin's blood sugar lowering effect." },
  },
  ibuprofen: {
    aspirin: { severity: "High", description: "Both are NSAIDs. Taking together increases risk of stomach bleeding and ulcers." },
    lisinopril: { severity: "Moderate", description: "Ibuprofen may reduce the blood pressure lowering effect of lisinopril and increase kidney risks." },
    warfarin: { severity: "High", description: "Increases bleeding risk. Avoid combination if possible." },
  },
  warfarin: {
    aspirin: { severity: "High", description: "Significantly increases bleeding risk." },
    ibuprofen: { severity: "High", description: "Increases bleeding risk significantly." },
    "vitamin k": { severity: "Moderate", description: "Vitamin K can reduce warfarin's effectiveness. Keep vitamin K intake consistent." },
  },
  metformin: {
    aspirin: { severity: "Low", description: "Minor interaction. Monitor blood sugar levels." },
    alcohol: { severity: "High", description: "Risk of lactic acidosis increases. Avoid excessive alcohol." },
  },
  lisinopril: {
    ibuprofen: { severity: "Moderate", description: "NSAIDs may reduce blood pressure lowering effect." },
    potassium: { severity: "High", description: "Risk of hyperkalemia. Avoid potassium supplements without medical advice." },
  },
};

const allMedicines = ["Aspirin", "Ibuprofen", "Warfarin", "Metformin", "Lisinopril", "Vitamin K", "Potassium", "Alcohol", "Paracetamol", "Omeprazole", "Amoxicillin", "Atorvastatin"];

const DrugInteractions = () => {
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const filtered = allMedicines.filter(m => m.toLowerCase().includes(search.toLowerCase()) && !selectedDrugs.includes(m));

  const addDrug = (drug: string) => {
    setSelectedDrugs([...selectedDrugs, drug]);
    setSearch("");
    toast.success(`${drug} added`);
  };

  const removeDrug = (drug: string) => setSelectedDrugs(selectedDrugs.filter(d => d !== drug));

  const getInteractions = () => {
    const results: { drug1: string; drug2: string; severity: string; description: string }[] = [];
    for (let i = 0; i < selectedDrugs.length; i++) {
      for (let j = i + 1; j < selectedDrugs.length; j++) {
        const d1 = selectedDrugs[i].toLowerCase();
        const d2 = selectedDrugs[j].toLowerCase();
        const interaction = interactionDB[d1]?.[d2] || interactionDB[d2]?.[d1];
        if (interaction) results.push({ drug1: selectedDrugs[i], drug2: selectedDrugs[j], ...interaction });
      }
    }
    return results;
  };

  const interactions = getInteractions();
  const sevColor = (s: string) => s === "High" ? "bg-destructive/10 text-destructive border-destructive/30" : s === "Moderate" ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30" : "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center"><ShieldAlert className="w-6 h-6 text-destructive" /></div>
            <div>
              <h1 className="text-3xl font-bold">Drug <span className="text-gradient">Interactions</span></h1>
              <p className="text-muted-foreground">Check for potential medication interactions</p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader><CardTitle><Search className="w-5 h-5 inline mr-2" />Add Medicines</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedDrugs.map(d => (
                  <Badge key={d} variant="secondary" className="px-3 py-1.5 text-sm">
                    {d} <button onClick={() => removeDrug(d)} className="ml-2"><X className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
              <Input placeholder="Search medicines..." value={search} onChange={e => setSearch(e.target.value)} />
              {search && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {filtered.slice(0, 8).map(m => (
                    <Button key={m} variant="outline" size="sm" onClick={() => addDrug(m)}><Plus className="w-3 h-3 mr-1" />{m}</Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedDrugs.length >= 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Interaction Results ({interactions.length} found)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {interactions.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-green-600 dark:text-green-400 font-medium">✅ No known interactions found</p>
                    <p className="text-sm text-muted-foreground mt-1">Always consult your doctor before combining medications</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {interactions.map((int, i) => (
                      <div key={i} className={`p-4 rounded-lg border ${sevColor(int.severity)}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="font-semibold">{int.drug1} + {int.drug2}</span>
                          <Badge variant={int.severity === "High" ? "destructive" : "secondary"}>{int.severity} Risk</Badge>
                        </div>
                        <p className="text-sm">{int.description}</p>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground text-center mt-4">⚠️ This is for informational purposes only. Always consult a healthcare professional.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default DrugInteractions;
