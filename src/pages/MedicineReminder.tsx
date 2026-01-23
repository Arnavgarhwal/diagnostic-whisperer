import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Pill,
  Plus,
  Clock,
  Calendar,
  Bell,
  Trash2,
  Check,
  X,
  Edit2,
  Save,
  AlertCircle,
  Sun,
  Sunrise,
  Moon,
  Coffee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

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

const defaultReminders: Reminder[] = [
  {
    id: "1",
    medicineName: "Vitamin D3",
    dosage: "60000 IU",
    frequency: "weekly",
    times: ["09:00"],
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    notes: "Take with breakfast",
    active: true,
    takenToday: [],
  },
  {
    id: "2",
    medicineName: "Metformin",
    dosage: "500mg",
    frequency: "daily",
    times: ["08:00", "20:00"],
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    notes: "Take after meals",
    active: true,
    takenToday: [],
  },
];

const MedicineReminder = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newReminder, setNewReminder] = useState({
    medicineName: "",
    dosage: "",
    frequency: "daily",
    times: ["08:00"],
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    notes: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("wellsync-medicine-reminders");
    if (saved) {
      setReminders(JSON.parse(saved));
    } else {
      setReminders(defaultReminders);
      localStorage.setItem("wellsync-medicine-reminders", JSON.stringify(defaultReminders));
    }
  }, []);

  const saveReminders = (updated: Reminder[]) => {
    setReminders(updated);
    localStorage.setItem("wellsync-medicine-reminders", JSON.stringify(updated));
  };

  const handleAddReminder = () => {
    if (!newReminder.medicineName || !newReminder.dosage) {
      toast({
        title: "Missing Information",
        description: "Please enter medicine name and dosage.",
        variant: "destructive",
      });
      return;
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      ...newReminder,
      active: true,
      takenToday: [],
    };

    saveReminders([...reminders, reminder]);
    setNewReminder({
      medicineName: "",
      dosage: "",
      frequency: "daily",
      times: ["08:00"],
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      notes: "",
    });
    setShowAddForm(false);
    toast({
      title: "Reminder Added",
      description: `${reminder.medicineName} reminder has been set.`,
    });
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    saveReminders(updated);
    toast({
      title: "Reminder Deleted",
      description: "Medicine reminder has been removed.",
    });
  };

  const handleToggleActive = (id: string) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, active: !r.active } : r
    );
    saveReminders(updated);
  };

  const handleMarkTaken = (id: string, time: string) => {
    const today = new Date().toISOString().split("T")[0];
    const updated = reminders.map((r) => {
      if (r.id === id) {
        const takenKey = `${today}-${time}`;
        if (r.takenToday.includes(takenKey)) {
          return { ...r, takenToday: r.takenToday.filter((t) => t !== takenKey) };
        } else {
          return { ...r, takenToday: [...r.takenToday, takenKey] };
        }
      }
      return r;
    });
    saveReminders(updated);
    toast({
      title: "Marked as Taken",
      description: "Great job staying on track with your medication!",
    });
  };

  const isTaken = (reminder: Reminder, time: string) => {
    const today = new Date().toISOString().split("T")[0];
    return reminder.takenToday.includes(`${today}-${time}`);
  };

  const addTimeSlot = () => {
    setNewReminder({
      ...newReminder,
      times: [...newReminder.times, "12:00"],
    });
  };

  const removeTimeSlot = (index: number) => {
    const times = newReminder.times.filter((_, i) => i !== index);
    setNewReminder({ ...newReminder, times });
  };

  const updateTimeSlot = (index: number, value: string) => {
    const times = [...newReminder.times];
    times[index] = value;
    setNewReminder({ ...newReminder, times });
  };

  const getTimeIcon = (time: string) => {
    const hour = parseInt(time.split(":")[0]);
    if (hour >= 5 && hour < 12) return <Sunrise className="w-4 h-4" />;
    if (hour >= 12 && hour < 17) return <Sun className="w-4 h-4" />;
    if (hour >= 17 && hour < 21) return <Coffee className="w-4 h-4" />;
    return <Moon className="w-4 h-4" />;
  };

  const getTimeLabel = (time: string) => {
    const hour = parseInt(time.split(":")[0]);
    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    if (hour >= 17 && hour < 21) return "Evening";
    return "Night";
  };

  const todayProgress = () => {
    let total = 0;
    let taken = 0;
    const today = new Date().toISOString().split("T")[0];

    reminders.forEach((r) => {
      if (r.active) {
        total += r.times.length;
        r.times.forEach((time) => {
          if (r.takenToday.includes(`${today}-${time}`)) taken++;
        });
      }
    });

    return { total, taken, percentage: total > 0 ? Math.round((taken / total) * 100) : 0 };
  };

  const progress = todayProgress();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Medicine <span className="text-gradient">Reminders</span>
            </h1>
            <p className="text-muted-foreground">
              Never miss a dose with customizable medication schedules
            </p>
          </motion.div>

          {/* Today's Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-primary/10 via-background to-health-coral/10 border border-border rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Today's Progress</h2>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{progress.percentage}%</p>
                <p className="text-sm text-muted-foreground">
                  {progress.taken}/{progress.total} doses
                </p>
              </div>
            </div>
            <div className="w-full bg-accent rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-primary to-health-coral rounded-full"
              />
            </div>
          </motion.div>

          {/* Add Reminder Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Button
              variant="hero"
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full md:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Medicine Reminder
            </Button>
          </motion.div>

          {/* Add Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-card border border-border rounded-xl p-6 mb-8"
            >
              <h3 className="text-lg font-semibold mb-4">Add New Reminder</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Medicine Name *
                  </label>
                  <Input
                    placeholder="e.g., Paracetamol"
                    value={newReminder.medicineName}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, medicineName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Dosage *
                  </label>
                  <Input
                    placeholder="e.g., 500mg"
                    value={newReminder.dosage}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, dosage: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Frequency
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-border bg-background"
                    value={newReminder.frequency}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, frequency: e.target.value })
                    }
                  >
                    <option value="daily">Daily</option>
                    <option value="twice-daily">Twice Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="alternate">Alternate Days</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={newReminder.startDate}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    End Date (Optional)
                  </label>
                  <Input
                    type="date"
                    value={newReminder.endDate}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, endDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Notes
                  </label>
                  <Input
                    placeholder="e.g., Take after meals"
                    value={newReminder.notes}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, notes: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block">
                  Reminder Times
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newReminder.times.map((time, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-accent/50 rounded-lg p-2"
                    >
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => updateTimeSlot(index, e.target.value)}
                        className="w-32"
                      />
                      {newReminder.times.length > 1 && (
                        <button
                          onClick={() => removeTimeSlot(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={addTimeSlot}>
                  <Plus className="w-4 h-4 mr-1" /> Add Time
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="hero" onClick={handleAddReminder}>
                  <Save className="w-4 h-4 mr-2" /> Save Reminder
                </Button>
                <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Reminders List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {reminders.length === 0 ? (
              <div className="text-center py-12 bg-card border border-border rounded-xl">
                <Pill className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No medicine reminders set</p>
                <p className="text-sm text-muted-foreground">
                  Click "Add Medicine Reminder" to get started
                </p>
              </div>
            ) : (
              reminders.map((reminder) => (
                <motion.div
                  key={reminder.id}
                  layout
                  className={`bg-card border rounded-xl p-5 ${
                    reminder.active ? "border-border" : "border-border/50 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          reminder.active
                            ? "bg-primary/10"
                            : "bg-muted"
                        }`}
                      >
                        <Pill
                          className={`w-6 h-6 ${
                            reminder.active ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {reminder.medicineName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {reminder.dosage} • {reminder.frequency}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={reminder.active}
                        onCheckedChange={() => handleToggleActive(reminder.id)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteReminder(reminder.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {reminder.notes && (
                    <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {reminder.notes}
                    </p>
                  )}

                  {/* Time Slots */}
                  <div className="flex flex-wrap gap-2">
                    {reminder.times.map((time, index) => {
                      const taken = isTaken(reminder, time);
                      return (
                        <button
                          key={index}
                          onClick={() =>
                            reminder.active && handleMarkTaken(reminder.id, time)
                          }
                          disabled={!reminder.active}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                            taken
                              ? "bg-green-100 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400"
                              : reminder.active
                              ? "bg-accent hover:bg-accent/80 border-border"
                              : "bg-muted border-border"
                          }`}
                        >
                          {taken ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            getTimeIcon(time)
                          )}
                          <span className="font-medium">{time}</span>
                          <span className="text-xs opacity-70">
                            {getTimeLabel(time)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Started: {new Date(reminder.startDate).toLocaleDateString("en-IN")}
                    </span>
                    {reminder.endDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Ends: {new Date(reminder.endDate).toLocaleDateString("en-IN")}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6"
          >
            <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Medication Tips
            </h3>
            <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-400">
              <li>• Set reminders at consistent times each day for better adherence</li>
              <li>• Take medications with meals if instructed to avoid stomach upset</li>
              <li>• Keep a week's supply in a pill organizer for easy tracking</li>
              <li>• Never skip doses without consulting your doctor</li>
            </ul>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MedicineReminder;