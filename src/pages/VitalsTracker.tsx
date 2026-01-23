import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Activity, Heart, Droplets, Scale, Plus, TrendingUp, 
  TrendingDown, Calendar, ArrowLeft, Download, FileText, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { exportVitals } from "@/utils/exportData";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area 
} from "recharts";

interface VitalRecord {
  id: string;
  type: "blood_pressure" | "blood_sugar" | "weight" | "heart_rate" | "oxygen";
  value: number;
  value2?: number; // For BP (diastolic)
  date: string;
  time: string;
  notes?: string;
}

const defaultVitals: VitalRecord[] = [
  { id: "1", type: "blood_pressure", value: 120, value2: 80, date: "2024-01-15", time: "08:00" },
  { id: "2", type: "blood_pressure", value: 118, value2: 78, date: "2024-01-16", time: "08:15" },
  { id: "3", type: "blood_pressure", value: 122, value2: 82, date: "2024-01-17", time: "08:30" },
  { id: "4", type: "blood_sugar", value: 95, date: "2024-01-15", time: "07:00" },
  { id: "5", type: "blood_sugar", value: 102, date: "2024-01-16", time: "07:15" },
  { id: "6", type: "blood_sugar", value: 98, date: "2024-01-17", time: "07:30" },
  { id: "7", type: "weight", value: 72, date: "2024-01-15", time: "06:00" },
  { id: "8", type: "weight", value: 71.8, date: "2024-01-16", time: "06:00" },
  { id: "9", type: "weight", value: 71.5, date: "2024-01-17", time: "06:00" },
  { id: "10", type: "heart_rate", value: 72, date: "2024-01-15", time: "09:00" },
  { id: "11", type: "heart_rate", value: 75, date: "2024-01-16", time: "09:00" },
  { id: "12", type: "heart_rate", value: 70, date: "2024-01-17", time: "09:00" },
  { id: "13", type: "oxygen", value: 98, date: "2024-01-15", time: "09:00" },
  { id: "14", type: "oxygen", value: 97, date: "2024-01-16", time: "09:00" },
  { id: "15", type: "oxygen", value: 99, date: "2024-01-17", time: "09:00" },
];

const vitalTypes = [
  { 
    id: "blood_pressure", 
    name: "Blood Pressure", 
    icon: Heart, 
    unit: "mmHg",
    color: "hsl(var(--destructive))",
    gradient: "from-red-500 to-pink-500"
  },
  { 
    id: "blood_sugar", 
    name: "Blood Sugar", 
    icon: Droplets, 
    unit: "mg/dL",
    color: "hsl(var(--primary))",
    gradient: "from-blue-500 to-cyan-500"
  },
  { 
    id: "weight", 
    name: "Weight", 
    icon: Scale, 
    unit: "kg",
    color: "hsl(var(--chart-3))",
    gradient: "from-green-500 to-emerald-500"
  },
  { 
    id: "heart_rate", 
    name: "Heart Rate", 
    icon: Activity, 
    unit: "bpm",
    color: "hsl(var(--chart-4))",
    gradient: "from-orange-500 to-amber-500"
  },
  { 
    id: "oxygen", 
    name: "SpO2", 
    icon: Activity, 
    unit: "%",
    color: "hsl(var(--chart-5))",
    gradient: "from-purple-500 to-violet-500"
  },
];

const VitalsTracker = () => {
  const [vitals, setVitals] = useState<VitalRecord[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newVital, setNewVital] = useState({
    type: "blood_pressure" as VitalRecord["type"],
    value: "",
    value2: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    notes: ""
  });

  useEffect(() => {
    const stored = localStorage.getItem("healthai-vitals");
    if (stored) {
      setVitals(JSON.parse(stored));
    } else {
      setVitals(defaultVitals);
      localStorage.setItem("healthai-vitals", JSON.stringify(defaultVitals));
    }
  }, []);

  const addVital = () => {
    if (!newVital.value) {
      toast({
        title: "Missing Value",
        description: "Please enter a value.",
        variant: "destructive"
      });
      return;
    }

    const record: VitalRecord = {
      id: Date.now().toString(),
      type: newVital.type,
      value: parseFloat(newVital.value),
      value2: newVital.value2 ? parseFloat(newVital.value2) : undefined,
      date: newVital.date,
      time: newVital.time,
      notes: newVital.notes
    };

    const updated = [...vitals, record];
    setVitals(updated);
    localStorage.setItem("healthai-vitals", JSON.stringify(updated));
    setIsAddOpen(false);
    setNewVital({
      type: "blood_pressure",
      value: "",
      value2: "",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      notes: ""
    });

    toast({
      title: "Vital Added",
      description: "Your health vital has been recorded successfully."
    });
  };

  const getLatestVital = (type: string) => {
    const typeVitals = vitals.filter(v => v.type === type);
    return typeVitals.sort((a, b) => 
      new Date(b.date + " " + b.time).getTime() - new Date(a.date + " " + a.time).getTime()
    )[0];
  };

  const getChartData = (type: string) => {
    return vitals
      .filter(v => v.type === type)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7)
      .map(v => ({
        date: new Date(v.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        value: v.value,
        value2: v.value2
      }));
  };

  const getTrend = (type: string) => {
    const typeVitals = vitals.filter(v => v.type === type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (typeVitals.length < 2) return null;
    return typeVitals[0].value > typeVitals[1].value ? "up" : "down";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">Health Vitals</h1>
              <p className="text-muted-foreground">Track and monitor your daily health metrics</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  exportVitals(vitals, 'csv');
                  toast({ title: "Export Complete", description: "Vitals exported as CSV." });
                }}
              >
                <Download className="w-4 h-4 mr-2" /> CSV
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  exportVitals(vitals, 'pdf');
                  toast({ title: "Export Complete", description: "Vitals exported as PDF." });
                }}
              >
                <FileText className="w-4 h-4 mr-2" /> PDF
              </Button>
              <Link to="/health-dashboard">
                <Button variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" /> Reports
                </Button>
              </Link>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero">
                    <Plus className="w-4 h-4 mr-2" /> Add Vital
                  </Button>
                </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record New Vital</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Vital Type</Label>
                    <Select
                      value={newVital.type}
                      onValueChange={(v) => setNewVital({ ...newVital, type: v as VitalRecord["type"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {vitalTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{newVital.type === "blood_pressure" ? "Systolic" : "Value"}</Label>
                      <Input
                        type="number"
                        placeholder={newVital.type === "blood_pressure" ? "120" : "Enter value"}
                        value={newVital.value}
                        onChange={(e) => setNewVital({ ...newVital, value: e.target.value })}
                      />
                    </div>
                    {newVital.type === "blood_pressure" && (
                      <div className="space-y-2">
                        <Label>Diastolic</Label>
                        <Input
                          type="number"
                          placeholder="80"
                          value={newVital.value2}
                          onChange={(e) => setNewVital({ ...newVital, value2: e.target.value })}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={newVital.date}
                        onChange={(e) => setNewVital({ ...newVital, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={newVital.time}
                        onChange={(e) => setNewVital({ ...newVital, time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Notes (Optional)</Label>
                    <Input
                      placeholder="Any additional notes..."
                      value={newVital.notes}
                      onChange={(e) => setNewVital({ ...newVital, notes: e.target.value })}
                    />
                  </div>

                  <Button onClick={addVital} className="w-full" variant="hero">
                    Save Vital
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {vitalTypes.map((type, i) => {
              const latest = getLatestVital(type.id);
              const trend = getTrend(type.id);
              const Icon = type.icon;
              
              return (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-5`} />
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${type.gradient}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        {trend && (
                          <div className={`flex items-center text-xs ${
                            trend === "up" ? "text-destructive" : "text-green-500"
                          }`}>
                            {trend === "up" ? 
                              <TrendingUp className="w-3 h-3" /> : 
                              <TrendingDown className="w-3 h-3" />
                            }
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground">{type.name}</p>
                        <p className="text-2xl font-bold text-foreground">
                          {latest ? (
                            type.id === "blood_pressure" 
                              ? `${latest.value}/${latest.value2}` 
                              : latest.value
                          ) : "--"}
                        </p>
                        <p className="text-xs text-muted-foreground">{type.unit}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Charts */}
          <Tabs defaultValue="blood_pressure" className="space-y-6">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl">
              {vitalTypes.map(type => (
                <TabsTrigger key={type.id} value={type.id} className="text-xs">
                  {type.name.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {vitalTypes.map(type => (
              <TabsContent key={type.id} value={type.id}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <type.icon className="w-5 h-5" />
                      {type.name} History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        {type.id === "blood_pressure" ? (
                          <LineChart data={getChartData(type.id)}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                            <XAxis dataKey="date" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px"
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke={type.color}
                              strokeWidth={2}
                              name="Systolic"
                              dot={{ fill: type.color }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="value2" 
                              stroke="hsl(var(--muted-foreground))"
                              strokeWidth={2}
                              name="Diastolic"
                              dot={{ fill: "hsl(var(--muted-foreground))" }}
                            />
                          </LineChart>
                        ) : (
                          <AreaChart data={getChartData(type.id)}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                            <XAxis dataKey="date" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px"
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke={type.color}
                              fill={type.color}
                              fillOpacity={0.2}
                              strokeWidth={2}
                            />
                          </AreaChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Records */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Recent Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {vitals
                        .filter(v => v.type === type.id)
                        .sort((a, b) => new Date(b.date + " " + b.time).getTime() - new Date(a.date + " " + a.time).getTime())
                        .slice(0, 5)
                        .map(record => (
                          <div 
                            key={record.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-foreground">
                                  {type.id === "blood_pressure" 
                                    ? `${record.value}/${record.value2}` 
                                    : record.value} {type.unit}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(record.date).toLocaleDateString("en-IN", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric"
                                  })} at {record.time}
                                </p>
                              </div>
                            </div>
                            {record.notes && (
                              <p className="text-xs text-muted-foreground max-w-[200px] truncate">
                                {record.notes}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VitalsTracker;
