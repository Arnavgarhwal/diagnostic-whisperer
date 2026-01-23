import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Phone, Pill, Calculator, MapPin, Heart, Users, FileText, 
  Activity, Stethoscope, BookOpen, ShoppingBag, Brain, Calendar
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
