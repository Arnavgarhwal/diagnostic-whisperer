import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Heart,
  Droplets,
  Scale,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  FileText,
  Pill,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  ArrowLeft,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNotifications } from "@/hooks/useNotifications";
import { exportHealthReport, exportVitals } from "@/utils/exportData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

interface VitalRecord {
  id: string;
  type: "blood_pressure" | "blood_sugar" | "weight" | "heart_rate" | "oxygen";
  value: number;
  value2?: number;
  date: string;
  time: string;
  notes?: string;
}

interface Reminder {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate: string;
  notes: string;
  active: boolean;
  takenToday: string[];
}

const HealthDashboard = () => {
  const [vitals, setVitals] = useState<VitalRecord[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { requestPermission, showNotification } = useNotifications();

  useEffect(() => {
    const storedVitals = localStorage.getItem("healthai-vitals");
    const storedReminders = localStorage.getItem("wellsync-medicine-reminders");

    if (storedVitals) setVitals(JSON.parse(storedVitals));
    if (storedReminders) setReminders(JSON.parse(storedReminders));

    // Check notification permission
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const periodDays = period === "weekly" ? 7 : 30;
  const periodStart = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - periodDays);
    return date;
  }, [periodDays]);

  const filteredVitals = useMemo(() => {
    return vitals.filter((v) => new Date(v.date) >= periodStart);
  }, [vitals, periodStart]);

  // Calculate vital statistics
  const vitalStats = useMemo(() => {
    const stats: Record<string, { values: number[]; trend: "up" | "down" | "stable" }> = {};

    ["blood_pressure", "blood_sugar", "weight", "heart_rate", "oxygen"].forEach((type) => {
      const typeVitals = filteredVitals
        .filter((v) => v.type === type)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const values = typeVitals.map((v) => v.value);
      let trend: "up" | "down" | "stable" = "stable";

      if (values.length >= 2) {
        const first = values.slice(0, Math.ceil(values.length / 2));
        const second = values.slice(Math.ceil(values.length / 2));
        const firstAvg = first.reduce((a, b) => a + b, 0) / first.length;
        const secondAvg = second.reduce((a, b) => a + b, 0) / second.length;

        if (secondAvg > firstAvg * 1.05) trend = "up";
        else if (secondAvg < firstAvg * 0.95) trend = "down";
      }

      stats[type] = { values, trend };
    });

    return stats;
  }, [filteredVitals]);

  // Calculate medication adherence
  const medicationAdherence = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    let totalDoses = 0;
    let takenDoses = 0;

    reminders.forEach((r) => {
      if (r.active) {
        r.times.forEach((time) => {
          totalDoses++;
          if (r.takenToday?.includes(`${today}-${time}`)) {
            takenDoses++;
          }
        });
      }
    });

    return totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;
  }, [reminders]);

  // Weekly adherence data for chart
  const adherenceChartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      let taken = 0;
      let total = 0;

      reminders.forEach((r) => {
        if (r.active) {
          r.times.forEach((time) => {
            total++;
            if (r.takenToday?.includes(`${dateStr}-${time}`)) {
              taken++;
            }
          });
        }
      });

      data.push({
        day: date.toLocaleDateString("en-IN", { weekday: "short" }),
        adherence: total > 0 ? Math.round((taken / total) * 100) : 0,
      });
    }
    return data;
  }, [reminders]);

  // Get chart data for vitals
  const getVitalChartData = (type: string) => {
    return filteredVitals
      .filter((v) => v.type === type)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((v) => ({
        date: new Date(v.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        value: v.value,
        value2: v.value2,
      }));
  };

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      setNotificationsEnabled(true);
      showNotification("Notifications Enabled", {
        body: "You will now receive medicine reminders and health alerts.",
      });
      toast({
        title: "Notifications Enabled",
        description: "You will receive medicine reminders and appointment alerts.",
      });
    } else {
      toast({
        title: "Permission Denied",
        description: "Please enable notifications in your browser settings.",
        variant: "destructive",
      });
    }
  };

  const handleExportReport = () => {
    exportHealthReport(vitals, reminders, period);
    toast({
      title: "Report Generated",
      description: `Your ${period} health report is being downloaded.`,
    });
  };

  const handleExportVitals = (format: "csv" | "pdf") => {
    exportVitals(filteredVitals, format);
    toast({
      title: "Export Complete",
      description: `Vitals exported as ${format.toUpperCase()}.`,
    });
  };

  const getVitalIcon = (type: string) => {
    switch (type) {
      case "blood_pressure":
        return Heart;
      case "blood_sugar":
        return Droplets;
      case "weight":
        return Scale;
      case "heart_rate":
        return Activity;
      default:
        return Activity;
    }
  };

  const healthInsights = useMemo(() => {
    const insights: { type: "good" | "warning" | "info"; message: string }[] = [];

    // Blood pressure insight
    const bpValues = vitalStats.blood_pressure?.values || [];
    if (bpValues.length > 0) {
      const avgBP = bpValues.reduce((a, b) => a + b, 0) / bpValues.length;
      if (avgBP > 140) {
        insights.push({
          type: "warning",
          message: "Your average blood pressure is elevated. Consider consulting a doctor.",
        });
      } else if (avgBP < 90) {
        insights.push({
          type: "warning",
          message: "Your average blood pressure is low. Monitor for symptoms.",
        });
      } else {
        insights.push({
          type: "good",
          message: "Your blood pressure is within normal range. Keep it up!",
        });
      }
    }

    // Medication adherence insight
    if (medicationAdherence < 70) {
      insights.push({
        type: "warning",
        message: "Your medication adherence is below 70%. Try setting reminders.",
      });
    } else if (medicationAdherence >= 90) {
      insights.push({
        type: "good",
        message: "Excellent medication adherence! You're staying on track.",
      });
    }

    // Weight trend insight
    if (vitalStats.weight?.trend === "up") {
      insights.push({
        type: "info",
        message: "Your weight has been trending upward. Consider reviewing your diet.",
      });
    } else if (vitalStats.weight?.trend === "down") {
      insights.push({
        type: "info",
        message: "Your weight is trending downward. Good progress!",
      });
    }

    return insights;
  }, [vitalStats, medicationAdherence]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Health <span className="text-gradient">Reports</span>
                </h1>
                <p className="text-muted-foreground">
                  Track your health trends and insights
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {!notificationsEnabled && (
                <Button variant="outline" onClick={handleEnableNotifications}>
                  <Bell className="w-4 h-4 mr-2" />
                  Enable Notifications
                </Button>
              )}
              <Button variant="outline" onClick={() => handleExportVitals("csv")}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="hero" onClick={handleExportReport}>
                <FileText className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={period === "weekly" ? "default" : "outline"}
              onClick={() => setPeriod("weekly")}
            >
              Weekly
            </Button>
            <Button
              variant={period === "monthly" ? "default" : "outline"}
              onClick={() => setPeriod("monthly")}
            >
              Monthly
            </Button>
          </div>

          {/* Overview Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{filteredVitals.length}</p>
                      <p className="text-sm text-muted-foreground">Vitals Recorded</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <Pill className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{medicationAdherence}%</p>
                      <p className="text-sm text-muted-foreground">Med Adherence</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{periodDays}</p>
                      <p className="text-sm text-muted-foreground">Days Tracked</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {reminders.filter((r) => r.active).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Active Meds</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Charts Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Medication Adherence Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="w-5 h-5" />
                    Medication Adherence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={adherenceChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="day" className="text-xs" />
                        <YAxis domain={[0, 100]} className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => [`${value}%`, "Adherence"]}
                        />
                        <Bar
                          dataKey="adherence"
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Vitals Trends */}
              <Tabs defaultValue="blood_pressure">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="blood_pressure">BP</TabsTrigger>
                  <TabsTrigger value="blood_sugar">Sugar</TabsTrigger>
                  <TabsTrigger value="weight">Weight</TabsTrigger>
                  <TabsTrigger value="heart_rate">Heart</TabsTrigger>
                </TabsList>

                {["blood_pressure", "blood_sugar", "weight", "heart_rate"].map((type) => {
                  const Icon = getVitalIcon(type);
                  const data = getVitalChartData(type);
                  const stats = vitalStats[type];

                  return (
                    <TabsContent key={type} value={type}>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Icon className="w-5 h-5" />
                              {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())} Trend
                            </span>
                            {stats && (
                              <Badge
                                variant={
                                  stats.trend === "up"
                                    ? "destructive"
                                    : stats.trend === "down"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {stats.trend === "up" ? (
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                ) : stats.trend === "down" ? (
                                  <TrendingDown className="w-3 h-3 mr-1" />
                                ) : null}
                                {stats.trend}
                              </Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {data.length > 0 ? (
                            <div className="h-[250px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                  <XAxis dataKey="date" className="text-xs" />
                                  <YAxis className="text-xs" />
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: "hsl(var(--card))",
                                      border: "1px solid hsl(var(--border))",
                                      borderRadius: "8px",
                                    }}
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="hsl(var(--primary))"
                                    fill="hsl(var(--primary))"
                                    fillOpacity={0.2}
                                    strokeWidth={2}
                                  />
                                  {type === "blood_pressure" && (
                                    <Area
                                      type="monotone"
                                      dataKey="value2"
                                      stroke="hsl(var(--muted-foreground))"
                                      fill="hsl(var(--muted-foreground))"
                                      fillOpacity={0.1}
                                      strokeWidth={2}
                                    />
                                  )}
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          ) : (
                            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                              No data available for this period
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>

            {/* Insights & Summary */}
            <div className="space-y-6">
              {/* Health Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Health Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {healthInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg ${
                        insight.type === "good"
                          ? "bg-green-500/10 border border-green-500/20"
                          : insight.type === "warning"
                          ? "bg-orange-500/10 border border-orange-500/20"
                          : "bg-blue-500/10 border border-blue-500/20"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {insight.type === "good" ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : insight.type === "warning" ? (
                          <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        ) : (
                          <Activity className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        )}
                        <p className="text-sm">{insight.message}</p>
                      </div>
                    </motion.div>
                  ))}

                  {healthInsights.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Record more vitals to see personalized insights
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Today's Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's Medication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span className="font-medium">{medicationAdherence}%</span>
                      </div>
                      <Progress value={medicationAdherence} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      {reminders
                        .filter((r) => r.active)
                        .slice(0, 3)
                        .map((reminder) => (
                          <div
                            key={reminder.id}
                            className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <Pill className="w-4 h-4 text-primary" />
                              <span className="text-sm">{reminder.medicineName}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {reminder.dosage}
                            </Badge>
                          </div>
                        ))}
                    </div>

                    <Link to="/medicine-reminders">
                      <Button variant="outline" className="w-full" size="sm">
                        View All Reminders
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/vitals">
                    <Button variant="outline" className="w-full justify-start">
                      <Activity className="w-4 h-4 mr-2" />
                      Record Vitals
                    </Button>
                  </Link>
                  <Link to="/health-records">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Health Records
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleExportVitals("pdf")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HealthDashboard;
