import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  FileText,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  Stethoscope,
  TestTube,
  User,
  Settings,
  Bell,
  Phone,
  Pill,
  Calculator,
  MapPin,
  Heart,
  Lightbulb,
  X,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Appointment {
  id: number;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  type: string;
}

interface TestResult {
  id: number;
  testName: string;
  date: string;
  status: "pending" | "ready" | "reviewed";
  resultSummary?: string;
}

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  items: string[];
  total: number;
  status: "processing" | "shipped" | "delivered";
}

interface Notification {
  id: number;
  type: "reminder" | "tip";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const quickLinks = [
  { name: "Emergency SOS", icon: Phone, path: "/emergency", color: "bg-destructive/10 text-destructive", description: "Quick emergency access" },
  { name: "Medicine Reminders", icon: Pill, path: "/medicine-reminders", color: "bg-primary/10 text-primary", description: "Manage medications" },
  { name: "BMI Calculator", icon: Calculator, path: "/bmi-calculator", color: "bg-secondary/10 text-secondary", description: "Check your BMI" },
  { name: "Nearby Hospitals", icon: MapPin, path: "/nearby-hospitals", color: "bg-accent text-accent-foreground", description: "Find hospitals" },
  { name: "Health Reports", icon: BarChart3, path: "/health-dashboard", color: "bg-primary/10 text-primary", description: "View health trends" },
];

const healthTips = [
  "Stay hydrated! Aim to drink 8 glasses of water daily.",
  "Take a 5-minute break every hour to stretch and move.",
  "Include more leafy greens in your diet for better immunity.",
  "Get 7-8 hours of quality sleep for optimal health.",
  "Practice deep breathing exercises to reduce stress.",
  "Walk at least 10,000 steps daily for heart health.",
  "Limit screen time before bed for better sleep quality.",
  "Eat a balanced breakfast to kickstart your metabolism.",
];

const Dashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Load from localStorage or use mock data
    const savedAppointments = localStorage.getItem("wellsync-appointments");
    const savedResults = localStorage.getItem("wellsync-test-results");
    const savedOrders = localStorage.getItem("wellsync-orders");

    const appointmentsData = savedAppointments
      ? JSON.parse(savedAppointments)
      : [
          {
            id: 1,
            doctorName: "Dr. Sarah Johnson",
            specialty: "Cardiologist",
            date: "2024-01-25",
            time: "10:00 AM",
            status: "upcoming",
            type: "Video Consultation",
          },
          {
            id: 2,
            doctorName: "Dr. Michael Chen",
            specialty: "General Physician",
            date: "2024-01-20",
            time: "2:30 PM",
            status: "completed",
            type: "In-Person",
          },
          {
            id: 3,
            doctorName: "Dr. Emily Davis",
            specialty: "Dermatologist",
            date: "2024-01-28",
            time: "11:00 AM",
            status: "upcoming",
            type: "Video Consultation",
          },
        ];

    setAppointments(appointmentsData);

    setTestResults(
      savedResults
        ? JSON.parse(savedResults)
        : [
            {
              id: 1,
              testName: "Complete Blood Count",
              date: "2024-01-18",
              status: "ready",
              resultSummary: "All values within normal range",
            },
            {
              id: 2,
              testName: "Lipid Profile",
              date: "2024-01-15",
              status: "reviewed",
              resultSummary: "Cholesterol slightly elevated",
            },
            {
              id: 3,
              testName: "Thyroid Panel",
              date: "2024-01-22",
              status: "pending",
            },
            {
              id: 4,
              testName: "Vitamin D Test",
              date: "2024-01-19",
              status: "ready",
              resultSummary: "Vitamin D levels adequate",
            },
          ]
    );

    setOrders(
      savedOrders
        ? JSON.parse(savedOrders)
        : [
            {
              id: 1,
              orderNumber: "ORD-2024-001",
              date: "2024-01-17",
              items: ["Metformin 500mg", "Vitamin D3 1000IU"],
              total: 45.99,
              status: "delivered",
            },
            {
              id: 2,
              orderNumber: "ORD-2024-002",
              date: "2024-01-20",
              items: ["Blood Pressure Monitor", "Glucose Test Strips"],
              total: 89.99,
              status: "shipped",
            },
            {
              id: 3,
              orderNumber: "ORD-2024-003",
              date: "2024-01-22",
              items: ["Omega-3 Fish Oil", "Multivitamins"],
              total: 34.99,
              status: "processing",
            },
          ]
    );

    // Generate notifications based on appointments and health tips
    const generatedNotifications: Notification[] = [];
    
    // Add appointment reminders
    appointmentsData
      .filter((apt: Appointment) => apt.status === "upcoming")
      .forEach((apt: Appointment, index: number) => {
        generatedNotifications.push({
          id: index + 1,
          type: "reminder",
          title: "Upcoming Appointment",
          message: `Don't forget your appointment with ${apt.doctorName} on ${new Date(apt.date).toLocaleDateString()} at ${apt.time}`,
          time: "Today",
          read: false,
        });
      });

    // Add random health tips
    const randomTips = healthTips.sort(() => 0.5 - Math.random()).slice(0, 2);
    randomTips.forEach((tip, index) => {
      generatedNotifications.push({
        id: generatedNotifications.length + index + 1,
        type: "tip",
        title: "Health Tip",
        message: tip,
        time: index === 0 ? "Just now" : "1 hour ago",
        read: false,
      });
    });

    setNotifications(generatedNotifications);
  }, []);

  const dismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getStatusBadge = (status: string) => {
    const styles = {
      upcoming: "bg-primary/10 text-primary",
      completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-destructive/10 text-destructive",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      ready: "bg-primary/10 text-primary",
      reviewed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      processing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    };
    return styles[status as keyof typeof styles] || "";
  };

  const upcomingCount = appointments.filter((a) => a.status === "upcoming").length;
  const pendingResultsCount = testResults.filter((t) => t.status === "pending").length;
  const activeOrdersCount = orders.filter((o) => o.status !== "delivered").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Welcome back, <span className="text-gradient">User</span>
                </h1>
                <p className="text-muted-foreground">
                  Manage your health journey from one place
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                  
                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 top-12 w-80 md:w-96 bg-card border border-border rounded-xl shadow-lg z-50 max-h-96 overflow-hidden">
                      <div className="p-4 border-b border-border flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">Notifications</h3>
                        {unreadCount > 0 && (
                          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                            Mark all as read
                          </Button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-muted-foreground">
                            No notifications
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-border hover:bg-muted/50 transition-colors ${
                                !notification.read ? "bg-primary/5" : ""
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  notification.type === "reminder" 
                                    ? "bg-primary/10 text-primary" 
                                    : "bg-secondary/10 text-secondary"
                                }`}>
                                  {notification.type === "reminder" ? (
                                    <Calendar className="w-4 h-4" />
                                  ) : (
                                    <Lightbulb className="w-4 h-4" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {notification.time}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => dismissNotification(notification.id)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <Link to="/profile">
                  <Button variant="outline" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{upcomingCount}</p>
                  <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <TestTube className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pendingResultsCount}</p>
                  <p className="text-sm text-muted-foreground">Pending Test Results</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <Package className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{activeOrdersCount}</p>
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Access</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickLinks.map((link) => (
                <Link key={link.name} to={link.path}>
                  <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer">
                    <div className={`w-10 h-10 rounded-lg ${link.color} flex items-center justify-center mb-3`}>
                      <link.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-medium text-foreground text-sm">{link.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{link.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Health Tips Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-border rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Daily Health Tip</h3>
                  <p className="text-muted-foreground">
                    {healthTips[Math.floor(Math.random() * healthTips.length)]}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="appointments" className="w-full">
              <TabsList className="w-full md:w-auto mb-6 grid grid-cols-3 md:flex">
                <TabsTrigger value="appointments" className="gap-2">
                  <Stethoscope className="w-4 h-4" />
                  <span className="hidden sm:inline">Appointments</span>
                </TabsTrigger>
                <TabsTrigger value="results" className="gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Test Results</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Orders</span>
                </TabsTrigger>
              </TabsList>

              {/* Appointments Tab */}
              <TabsContent value="appointments">
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {appointment.doctorName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {appointment.specialty}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(appointment.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {appointment.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusBadge(appointment.status)}>
                            {appointment.status}
                          </Badge>
                          <Badge variant="outline">{appointment.type}</Badge>
                          {appointment.status === "upcoming" && (
                            <Button size="sm">Join</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Test Results Tab */}
              <TabsContent value="results">
                <div className="space-y-4">
                  {testResults.map((result) => (
                    <div
                      key={result.id}
                      className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                            <TestTube className="w-6 h-6 text-secondary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {result.testName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(result.date).toLocaleDateString()}
                            </p>
                            {result.resultSummary && (
                              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                {result.resultSummary}
                              </p>
                            )}
                            {result.status === "pending" && (
                              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-yellow-500" />
                                Results expected within 24-48 hours
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusBadge(result.status)}>
                            {result.status}
                          </Badge>
                          {result.status === "ready" && (
                            <Button size="sm">View Report</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                            <Package className="w-6 h-6 text-accent-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {order.orderNumber}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {order.items.join(", ")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-foreground">
                            ₹{(order.total * 83).toFixed(0)}
                          </span>
                          <Badge className={getStatusBadge(order.status)}>
                            {order.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            Track
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
