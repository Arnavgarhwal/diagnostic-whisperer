import { motion } from "framer-motion";
import {
  Brain,
  Calendar,
  FileText,
  Pill,
  BookOpen,
  TestTube2,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Symptom Analyzer",
    description:
      "Describe your symptoms and get instant AI-powered analysis with potential conditions and recommended actions.",
    color: "from-primary to-health-teal-dark",
    bgColor: "bg-health-mint",
  },
  {
    icon: Calendar,
    title: "Book Consultation",
    description:
      "Schedule appointments with verified doctors across specialties. Video, phone, or in-person options available.",
    color: "from-health-coral to-secondary",
    bgColor: "bg-health-coral-light",
  },
  {
    icon: FileText,
    title: "Medical Records",
    description:
      "Securely store, access, and share your complete medical history. All your health data in one place.",
    color: "from-primary to-health-teal-dark",
    bgColor: "bg-health-lavender",
  },
  {
    icon: Pill,
    title: "Order Medicines",
    description:
      "Get prescriptions filled and delivered to your door. Compare prices and find the best deals.",
    color: "from-health-coral to-secondary",
    bgColor: "bg-health-mint",
  },
  {
    icon: BookOpen,
    title: "Disease Information",
    description:
      "Access a comprehensive library of conditions, treatments, and prevention tips from medical experts.",
    color: "from-primary to-health-teal-dark",
    bgColor: "bg-health-coral-light",
  },
  {
    icon: TestTube2,
    title: "Diagnostics & Tests",
    description:
      "Book blood tests, imaging, and other diagnostics. Get results fast with clear explanations.",
    color: "from-health-coral to-secondary",
    bgColor: "bg-health-lavender",
  },
];

const FeaturesGrid = () => {
  return (
    <section id="services" className="py-24 relative">
      <div className="absolute inset-0 bg-muted/30" />
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need for{" "}
            <span className="text-gradient">Better Health</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive healthcare services powered by AI and backed by medical professionals.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <div className="h-full p-8 rounded-2xl bg-card border border-border/50 card-shadow hover:card-shadow-hover transition-all duration-300">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-7 h-7 bg-gradient-to-br ${feature.color} bg-clip-text`} style={{ color: 'hsl(var(--primary))' }} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
