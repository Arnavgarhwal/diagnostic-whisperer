import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const commonSymptoms = [
  { name: "Headache", emoji: "🤕" },
  { name: "Fever", emoji: "🤒" },
  { name: "Fatigue", emoji: "😴" },
  { name: "Cough", emoji: "😷" },
  { name: "Nausea", emoji: "🤢" },
  { name: "Back Pain", emoji: "💆" },
  { name: "Chest Pain", emoji: "💔" },
  { name: "Dizziness", emoji: "😵" },
  { name: "Skin Rash", emoji: "🔴" },
  { name: "Joint Pain", emoji: "🦴" },
  { name: "Anxiety", emoji: "😰" },
  { name: "Insomnia", emoji: "😫" },
];

const SymptomsSection = () => {
  return (
    <section id="symptoms" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Quick Symptom{" "}
              <span className="text-gradient">Checker</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Select your symptoms to get an instant AI analysis. Our system evaluates 
              thousands of conditions to provide you with accurate insights and recommendations.
            </p>
            
            <div className="p-6 rounded-2xl bg-card border border-border card-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <span className="text-2xl">🔬</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    How it works
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Our AI analyzes your symptoms using a database of over 10,000 medical conditions, 
                    then provides personalized recommendations based on severity and likelihood.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Symptoms Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {commonSymptoms.map((symptom, index) => (
                <motion.button
                  key={symptom.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 text-center group"
                >
                  <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">
                    {symptom.emoji}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {symptom.name}
                  </span>
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ x: 5 }}
              className="mt-6 flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              View all symptoms
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SymptomsSection;
