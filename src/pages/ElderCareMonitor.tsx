import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Pill, Clock, Phone, AlertTriangle, CheckCircle, Heart, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ElderProfile {
  id: string;
  name: string;
  age: number;
  conditions: string[];
  medications: string[];
  emergencyContact: string;
  lastCheckIn: string;
  vitals: { bp: string; heartRate: number; sugar: number };
}

const ElderCareMonitor = () => {
  const [elders, setElders] = useState<ElderProfile[]>(() => {
    const saved = localStorage.getItem("wellsync-elder-profiles");
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "Margaret Johnson", age: 78, conditions: ["Hypertension", "Type 2 Diabetes"], medications: ["Metformin 500mg", "Amlodipine 5mg", "Aspirin 75mg"], emergencyContact: "+1-555-0101", lastCheckIn: new Date().toLocaleDateString(), vitals: { bp: "138/85", heartRate: 72, sugar: 145 } },
      { id: "2", name: "Robert Smith", age: 82, conditions: ["Arthritis", "Heart Disease"], medications: ["Atorvastatin 20mg", "Clopidogrel 75mg"], emergencyContact: "+1-555-0102", lastCheckIn: new Date().toLocaleDateString(), vitals: { bp: "142/88", heartRate: 68, sugar: 110 } },
    ];
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");

  const save = (data: ElderProfile[]) => { setElders(data); localStorage.setItem("wellsync-elder-profiles", JSON.stringify(data)); };

  const addElder = () => {
    if (!newName || !newAge) return;
    const profile: ElderProfile = { id: Date.now().toString(), name: newName, age: parseInt(newAge), conditions: [], medications: [], emergencyContact: "", lastCheckIn: new Date().toLocaleDateString(), vitals: { bp: "120/80", heartRate: 70, sugar: 100 } };
    save([...elders, profile]);
    setNewName(""); setNewAge(""); setShowAdd(false);
  };

  const checkIn = (id: string) => {
    save(elders.map(e => e.id === id ? { ...e, lastCheckIn: new Date().toLocaleString() } : e));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><Users className="w-3 h-3 mr-1" />Elder Care</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2"><span className="text-gradient">Elder Care</span> Monitor</h1>
            <p className="text-muted-foreground">Monitor and manage health for senior family members</p>
          </motion.div>

          <div className="flex justify-end mb-6">
            <Button variant="hero" onClick={() => setShowAdd(!showAdd)}>+ Add Elder</Button>
          </div>

          {showAdd && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex gap-4 flex-wrap">
                  <Input placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} className="flex-1 min-w-[200px]" />
                  <Input placeholder="Age" type="number" value={newAge} onChange={e => setNewAge(e.target.value)} className="w-24" />
                  <Button onClick={addElder}>Add</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {elders.map(elder => (
              <motion.div key={elder.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{elder.name}</CardTitle>
                      <Badge variant="outline">Age {elder.age}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Vitals */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <Heart className="w-4 h-4 mx-auto text-destructive mb-1" />
                        <p className="text-sm font-bold text-foreground">{elder.vitals.bp}</p>
                        <p className="text-xs text-muted-foreground">BP</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <Activity className="w-4 h-4 mx-auto text-primary mb-1" />
                        <p className="text-sm font-bold text-foreground">{elder.vitals.heartRate}</p>
                        <p className="text-xs text-muted-foreground">BPM</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <Activity className="w-4 h-4 mx-auto text-amber-500 mb-1" />
                        <p className="text-sm font-bold text-foreground">{elder.vitals.sugar}</p>
                        <p className="text-xs text-muted-foreground">Sugar</p>
                      </div>
                    </div>

                    {/* Conditions */}
                    {elder.conditions.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Conditions</p>
                        <div className="flex flex-wrap gap-1">{elder.conditions.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}</div>
                      </div>
                    )}

                    {/* Medications */}
                    {elder.medications.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Medications</p>
                        {elder.medications.map(m => <p key={m} className="text-xs text-muted-foreground">💊 {m}</p>)}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Last check-in: {elder.lastCheckIn}</span>
                      {elder.emergencyContact && <span>📞 {elder.emergencyContact}</span>}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => checkIn(elder.id)}>
                        <CheckCircle className="w-3 h-3 mr-1" />Check In
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1">
                        <Phone className="w-3 h-3 mr-1" />Emergency
                      </Button>
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

export default ElderCareMonitor;
