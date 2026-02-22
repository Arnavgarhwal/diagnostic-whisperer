import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Phone, Pill, Calculator, MapPin, Heart, Users, FileText, 
  Activity, Stethoscope, BookOpen, ShoppingBag, Brain, Calendar,
  Target, Apple, Moon, Smile, HelpCircle, ShieldAlert, Clock, Award, Trophy,
  Droplets, Wind, NotebookPen, MonitorSmartphone, Cross, Dna, Scan,
  HeartHandshake, Baby, UserRoundCog, Syringe, TrendingUp, Hand, CalendarClock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const quickLinks = [
  {
    title: "Emergency SOS",
    description: "One-tap emergency help",
    icon: Phone,
    href: "/emergency",
    color: "from-red-500 to-rose-600",
    bgColor: "bg-red-50 dark:bg-red-950/30"
  },
  {
    title: "Medicine Reminders",
    description: "Never miss a dose",
    icon: Pill,
    href: "/medicine-reminders",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30"
  },
  {
    title: "BMI Calculator",
    description: "Check your health score",
    icon: Calculator,
    href: "/bmi-calculator",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50 dark:bg-green-950/30"
  },
  {
    title: "Nearby Hospitals",
    description: "Find healthcare near you",
    icon: MapPin,
    href: "/nearby-hospitals",
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30"
  },
  {
    title: "Health Vitals",
    description: "Track BP, heart rate & more",
    icon: Activity,
    href: "/vitals",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/30"
  },
  {
    title: "Family Health",
    description: "Manage family records",
    icon: Users,
    href: "/family",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30"
  },
  {
    title: "Health Records",
    description: "Store medical documents",
    icon: FileText,
    href: "/health-records",
    color: "from-cyan-500 to-teal-600",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30"
  },
  {
    title: "Symptom Analyzer",
    description: "AI-powered analysis",
    icon: Brain,
    href: "/symptom-analyzer",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50 dark:bg-violet-950/30"
  },
  {
    title: "Disease Library",
    description: "5000+ conditions",
    icon: BookOpen,
    href: "/diseases",
    color: "from-teal-500 to-cyan-600",
    bgColor: "bg-teal-50 dark:bg-teal-950/30"
  },
  {
    title: "Consultations",
    description: "Book doctor appointments",
    icon: Stethoscope,
    href: "/consultations",
    color: "from-indigo-500 to-blue-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30"
  },
  {
    title: "Medicines",
    description: "Browse & buy medicines",
    icon: ShoppingBag,
    href: "/medicines",
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30"
  },
  {
    title: "Diagnostics",
    description: "Book lab tests",
    icon: Heart,
    href: "/diagnostics",
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-50 dark:bg-rose-950/30"
  },
  {
    title: "Health Goals",
    description: "Track wellness objectives",
    icon: Target,
    href: "/health-goals",
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30"
  },
  {
    title: "Diet Tracker",
    description: "Log meals & macros",
    icon: Apple,
    href: "/diet-tracker",
    color: "from-lime-500 to-green-600",
    bgColor: "bg-lime-50 dark:bg-lime-950/30"
  },
  {
    title: "Sleep Tracker",
    description: "Monitor sleep patterns",
    icon: Moon,
    href: "/sleep-tracker",
    color: "from-indigo-500 to-purple-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30"
  },
  {
    title: "Mood Tracker",
    description: "Track your feelings",
    icon: Smile,
    href: "/mood-tracker",
    color: "from-yellow-500 to-amber-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30"
  },
  {
    title: "Health Quiz",
    description: "Test your knowledge",
    icon: HelpCircle,
    href: "/health-quiz",
    color: "from-sky-500 to-blue-600",
    bgColor: "bg-sky-50 dark:bg-sky-950/30"
  },
  {
    title: "Drug Interactions",
    description: "Check medicine safety",
    icon: ShieldAlert,
    href: "/drug-interactions",
    color: "from-red-500 to-rose-600",
    bgColor: "bg-red-50 dark:bg-red-950/30"
  },
  {
    title: "Patient Timeline",
    description: "Your health history",
    icon: Clock,
    href: "/patient-timeline",
    color: "from-slate-500 to-gray-600",
    bgColor: "bg-slate-50 dark:bg-slate-950/30"
  },
  {
    title: "Health Score",
    description: "Wellness assessment",
    icon: Award,
    href: "/health-score",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30"
  },
  {
    title: "Health Challenges",
    description: "Join & compete",
    icon: Trophy,
    href: "/health-challenges",
    color: "from-amber-500 to-yellow-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30"
  },
  {
    title: "Water Reminder",
    description: "Stay hydrated daily",
    icon: Droplets,
    href: "/water-reminder",
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30"
  },
  {
    title: "Breathing Exercises",
    description: "Guided relaxation",
    icon: Wind,
    href: "/breathing-exercises",
    color: "from-sky-500 to-indigo-500",
    bgColor: "bg-sky-50 dark:bg-sky-950/30"
  },
  {
    title: "Symptom Journal",
    description: "Log daily symptoms",
    icon: NotebookPen,
    href: "/symptom-journal",
    color: "from-violet-500 to-fuchsia-500",
    bgColor: "bg-violet-50 dark:bg-violet-950/30"
  },
  {
    title: "Posture Monitor",
    description: "Fix your posture",
    icon: MonitorSmartphone,
    href: "/posture-monitor",
    color: "from-slate-500 to-zinc-600",
    bgColor: "bg-slate-50 dark:bg-slate-950/30"
  },
  {
    title: "First Aid Guide",
    description: "Emergency instructions",
    icon: Cross,
    href: "/first-aid",
    color: "from-red-500 to-rose-600",
    bgColor: "bg-red-50 dark:bg-red-950/30"
  },
  {
    title: "AI Health Twin",
    description: "Your digital health replica",
    icon: Dna,
    href: "/ai-health-twin",
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30"
  },
  {
    title: "Skin Analyzer",
    description: "AI dermatology scan",
    icon: Scan,
    href: "/skin-analyzer",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/30"
  },
  {
    title: "Mental Health",
    description: "Wellness & journaling",
    icon: HeartHandshake,
    href: "/mental-health",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30"
  },
  {
    title: "Pregnancy Tracker",
    description: "Week-by-week guidance",
    icon: Baby,
    href: "/pregnancy-tracker",
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/30"
  },
  {
    title: "Elder Care",
    description: "Senior health monitor",
    icon: UserRoundCog,
    href: "/elder-care",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30"
  },
  {
    title: "Vaccinations",
    description: "Track immunizations",
    icon: Syringe,
    href: "/vaccination-tracker",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30"
  },
  {
    title: "Predictive Health AI",
    description: "Disease risk prediction",
    icon: TrendingUp,
    href: "/predictive-health",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50 dark:bg-violet-950/30"
  },
  {
    title: "Gesture SOS",
    description: "Hands-free emergency",
    icon: Hand,
    href: "/gesture-control",
    color: "from-red-600 to-rose-700",
    bgColor: "bg-red-50 dark:bg-red-950/30"
  },
  {
    title: "Med Schedule",
    description: "Visual med timeline",
    icon: CalendarClock,
    href: "/medication-schedule",
    color: "from-indigo-500 to-blue-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30"
  },
];

const QuickAccessSection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Quick <span className="text-gradient">Access</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Access all health features with just one click. Everything you need, right at your fingertips.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={link.href}>
                <Card className={`h-full ${link.bgColor} border-transparent hover:border-primary/30 hover:shadow-lg transition-all group cursor-pointer`}>
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${link.color} text-white flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <link.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {link.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickAccessSection;
