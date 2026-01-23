import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Home, Clock, CalendarDays, MapPin, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { diagnosticTests, testCategories } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const Diagnostics = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTest, setSelectedTest] = useState<typeof diagnosticTests[0] | null>(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [collectionType, setCollectionType] = useState<"home" | "lab">("home");

  const filteredTests = diagnosticTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBookTest = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Select Date & Time",
        description: "Please select a date and time for your appointment.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Booking Confirmed! 🎉",
      description: `Your ${selectedTest?.name} is scheduled for ${selectedDate} at ${selectedTime}.`
    });
    setSelectedTest(null);
    setBookingStep(0);
    setSelectedDate("");
    setSelectedTime("");
  };

  const timeSlots = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  });

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
              🔬 Diagnostics
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Book <span className="text-gradient">Lab Tests</span> & Imaging
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Wide range of diagnostic tests with home sample collection and quick results.
            </p>
          </motion.div>

          {/* Features Banner */}
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
            {[
              { icon: Home, title: "Home Collection", desc: "Sample pickup from your doorstep" },
              { icon: Clock, title: "Quick Results", desc: "Get reports within 24-48 hours" },
              { icon: Check, title: "NABL Accredited", desc: "100% accurate & reliable tests" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-accent/30 border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search tests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {testCategories.map(cat => (
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

          {/* Test Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{test.image}</div>
                  <div className="flex flex-col items-end gap-1">
                    {test.homeCollection && (
                      <Badge variant="secondary" className="text-xs">
                        <Home className="w-3 h-3 mr-1" /> Home Collection
                      </Badge>
                    )}
                    {test.fasting && (
                      <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                        <AlertCircle className="w-3 h-3 mr-1" /> Fasting Required
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Badge variant="secondary" className="mb-2">{test.category}</Badge>
                <h3 className="font-semibold text-lg mb-2">{test.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{test.description}</p>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock className="w-4 h-4" />
                  <span>Results in {test.turnaround}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">₹{(test.price * 83).toFixed(0)}</span>
                  <Button 
                    variant="hero" 
                    size="sm"
                    onClick={() => {
                      setSelectedTest(test);
                      setBookingStep(1);
                      setCollectionType(test.homeCollection ? "home" : "lab");
                    }}
                  >
                    Book Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {selectedTest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTest(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{selectedTest.image}</div>
                <div>
                  <h2 className="text-xl font-bold">{selectedTest.name}</h2>
                  <p className="text-primary font-semibold">₹{(selectedTest.price * 83).toFixed(0)}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Collection Type */}
              {selectedTest.homeCollection && (
                <div>
                  <h3 className="font-semibold mb-3">Collection Type</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={collectionType === "home" ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setCollectionType("home")}
                    >
                      <Home className="w-4 h-4 mr-2" /> Home Collection
                    </Button>
                    <Button
                      variant={collectionType === "lab" ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setCollectionType("lab")}
                    >
                      <MapPin className="w-4 h-4 mr-2" /> Visit Lab
                    </Button>
                  </div>
                </div>
              )}

              {/* Date Selection */}
              <div>
                <h3 className="font-semibold mb-3">Select Date</h3>
                <div className="grid grid-cols-4 gap-2">
                  {dates.map(date => (
                    <Button
                      key={date}
                      variant={selectedDate === date ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      onClick={() => setSelectedDate(date)}
                    >
                      {date}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <h3 className="font-semibold mb-3">Select Time</h3>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map(time => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedTest.fasting && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Fasting Required</span>
                  </div>
                  <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">
                    Please fast for 10-12 hours before the test. Water is allowed.
                  </p>
                </div>
              )}

              <Button variant="hero" className="w-full" size="lg" onClick={handleBookTest}>
                Confirm Booking
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};

export default Diagnostics;
