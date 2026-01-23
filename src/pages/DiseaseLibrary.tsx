import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronRight, X, AlertCircle, Pill, Shield, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allDiseases, diseaseCategories } from "@/data/diseases";

const DiseaseLibrary = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDisease, setSelectedDisease] = useState<typeof allDiseases[0] | null>(null);

  const filteredDiseases = allDiseases.filter(disease => {
    const matchesSearch = disease.name.toLowerCase().includes(search.toLowerCase()) ||
      disease.symptoms.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || disease.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).slice(0, 100); // Show first 100 results for performance

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <BookOpen className="w-3 h-3 mr-1" />
              Disease Library
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Health <span className="text-gradient">Information</span> Library
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Search our comprehensive database of conditions, symptoms, treatments, and prevention tips.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search diseases or symptoms..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {diseaseCategories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat ? "bg-primary" : ""}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Disease Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDiseases.map((disease, index) => (
              <motion.div
                key={disease.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group"
                onClick={() => setSelectedDisease(disease)}
              >
                <div className="text-4xl mb-4">{disease.image}</div>
                <Badge variant="secondary" className="mb-2">{disease.category}</Badge>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {disease.name}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {disease.description}
                </p>
                <div className="flex items-center text-primary text-sm font-medium">
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>

          {filteredDiseases.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No diseases found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      {/* Disease Detail Modal */}
      {selectedDisease && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedDisease(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{selectedDisease.image}</div>
                <div>
                  <Badge variant="secondary" className="mb-2">{selectedDisease.category}</Badge>
                  <h2 className="text-2xl font-bold">{selectedDisease.name}</h2>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedDisease(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <p className="text-muted-foreground">{selectedDisease.description}</p>
                <Badge className="mt-2" variant={selectedDisease.severity === "Chronic" ? "destructive" : "secondary"}>
                  {selectedDisease.severity}
                </Badge>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-health-coral" />
                  <h3 className="font-semibold">Common Symptoms</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedDisease.symptoms.map(symptom => (
                    <Badge key={symptom} variant="outline">{symptom}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Pill className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Treatments</h3>
                </div>
                <ul className="space-y-2">
                  {selectedDisease.treatments.map(treatment => (
                    <li key={treatment} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {treatment}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold">Prevention Tips</h3>
                </div>
                <ul className="space-y-2">
                  {selectedDisease.prevention.map(tip => (
                    <li key={tip} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="hero" className="flex-1">
                  Book Consultation
                </Button>
                <Button variant="outline" className="flex-1">
                  Find Specialists
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};

export default DiseaseLibrary;
