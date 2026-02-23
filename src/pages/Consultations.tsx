import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Clock, Video, MessageSquare, Calendar, Check, Globe, Mail, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { doctors, specialties, timeSlots } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface BookedAppointment {
  id: string;
  doctorName: string;
  doctorImage: string;
  specialty: string;
  date: string;
  time: string;
  type: "video" | "chat";
  fee: number;
  userEmail: string;
  userPhone: string;
  bookedAt: string;
}

const APPOINTMENTS_KEY = "wellsync-appointments";

const Consultations = () => {
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [consultationType, setConsultationType] = useState<"video" | "chat">("video");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [appointments, setAppointments] = useState<BookedAppointment[]>([]);
  const [showAppointments, setShowAppointments] = useState(false);

  // Load user profile & appointments
  useEffect(() => {
    const savedProfile = localStorage.getItem("wellsync-profile");
    const savedUser = localStorage.getItem("wellsync-user");
    if (savedProfile) {
      const p = JSON.parse(savedProfile);
      setUserEmail(p.email || "");
      setUserPhone(p.phone || "");
    } else if (savedUser) {
      const u = JSON.parse(savedUser);
      setUserEmail(u.email || "");
      setUserPhone(u.phone || "");
    }
    const saved = localStorage.getItem(APPOINTMENTS_KEY);
    if (saved) setAppointments(JSON.parse(saved));
  }, []);

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All" || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      full: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate()
    };
  });

  const sendConfirmationEmail = (appt: BookedAppointment) => {
    if (!appt.userEmail) return;
    const subject = encodeURIComponent(`Appointment Confirmed - ${appt.doctorName}`);
    const body = encodeURIComponent(
      `Dear Patient,\n\nYour ${appt.type} consultation has been confirmed!\n\nDoctor: ${appt.doctorName}\nSpecialty: ${appt.specialty}\nDate: ${appt.date}\nTime: ${appt.time}\nFee: ₹${appt.fee}\n\nPlease be available 5 minutes before your scheduled time.\n\nThank you,\nWellSync Health`
    );
    window.open(`mailto:${appt.userEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  const sendConfirmationSMS = (appt: BookedAppointment) => {
    if (!appt.userPhone) return;
    const cleanPhone = appt.userPhone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `WellSync: Appointment confirmed with ${appt.doctorName} (${appt.specialty}) on ${appt.date} at ${appt.time}. Fee: ₹${appt.fee}. Be available 5 min early.`
    );
    window.open(`sms:${cleanPhone}?body=${message}`, '_blank');
  };

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      toast({ title: "Select Date & Time", description: "Please select a date and time slot.", variant: "destructive" });
      return;
    }
    if (!userEmail && !userPhone) {
      toast({ title: "Contact Info Required", description: "Please enter your email or phone for confirmation.", variant: "destructive" });
      return;
    }

    const newAppt: BookedAppointment = {
      id: Date.now().toString(),
      doctorName: selectedDoctor!.name,
      doctorImage: selectedDoctor!.image,
      specialty: selectedDoctor!.specialty,
      date: selectedDate,
      time: selectedTime,
      type: consultationType,
      fee: selectedDoctor!.consultationFee * 83,
      userEmail,
      userPhone,
      bookedAt: new Date().toISOString(),
    };

    const updated = [...appointments, newAppt];
    setAppointments(updated);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));

    // Send confirmations
    if (userEmail) sendConfirmationEmail(newAppt);
    if (userPhone) {
      setTimeout(() => sendConfirmationSMS(newAppt), 500);
    }

    toast({
      title: "Appointment Booked! 🎉",
      description: `Your ${consultationType} consultation with ${selectedDoctor?.name} is scheduled for ${selectedDate} at ${selectedTime}. Confirmation sent!`
    });

    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedTime("");
  };

  const cancelAppointment = (id: string) => {
    const updated = appointments.filter(a => a.id !== id);
    setAppointments(updated);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
    toast({ title: "Appointment Cancelled", description: "Your appointment has been cancelled." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">👨‍⚕️ Doctor Consultations</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Consult Top <span className="text-gradient">Doctors</span> Online
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Connect with verified specialists via video or chat. Get expert medical advice from the comfort of your home.
            </p>
          </motion.div>

          {/* My Appointments Toggle */}
          <div className="max-w-4xl mx-auto mb-6 flex justify-center">
            <Button variant={showAppointments ? "default" : "outline"} onClick={() => setShowAppointments(!showAppointments)}>
              <Calendar className="w-4 h-4 mr-2" />
              My Appointments ({appointments.length})
            </Button>
          </div>

          {/* Booked Appointments Section */}
          <AnimatePresence>
            {showAppointments && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="max-w-4xl mx-auto mb-8 overflow-hidden">
                {appointments.length === 0 ? (
                  <div className="text-center py-8 bg-card border border-border rounded-2xl">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No appointments booked yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointments.map(appt => (
                      <motion.div key={appt.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="text-4xl">{appt.doctorImage}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{appt.doctorName}</h4>
                          <p className="text-sm text-muted-foreground">{appt.specialty}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge variant="secondary">{appt.date}</Badge>
                            <Badge variant="outline">{appt.time}</Badge>
                            <Badge className={appt.type === "video" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"}>
                              {appt.type === "video" ? <Video className="w-3 h-3 mr-1" /> : <MessageSquare className="w-3 h-3 mr-1" />}
                              {appt.type}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary">₹{appt.fee}</span>
                          <Button variant="destructive" size="sm" onClick={() => cancelAppointment(appt.id)}>Cancel</Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search doctors by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-12" />
            </div>
            <div className="flex flex-wrap gap-2">
              {specialties.map(spec => (
                <Button key={spec} variant={selectedSpecialty === spec ? "default" : "outline"} size="sm" onClick={() => setSelectedSpecialty(spec)} className={selectedSpecialty === spec ? "bg-primary" : ""}>
                  {spec}
                </Button>
              ))}
            </div>
          </div>

          {/* Doctor Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, index) => (
              <motion.div key={doctor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-5xl">{doctor.image}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                    <Badge variant="secondary" className="mt-1">{doctor.specialty}</Badge>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{doctor.rating}</span>
                    <span className="text-muted-foreground">({doctor.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" /><span>{doctor.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="w-4 h-4" /><span>{doctor.languages.join(", ")}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{doctor.about}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Consultation Fee</p>
                    <p className="text-xl font-bold text-primary">₹{doctor.consultationFee * 83}</p>
                  </div>
                  <Button variant="hero" onClick={() => setSelectedDoctor(doctor)}>Book Now</Button>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                    <Check className="w-3 h-3 mr-1" /> {doctor.nextAvailable}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {selectedDoctor && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedDoctor(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-background rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{selectedDoctor.image}</div>
                <div>
                  <h2 className="text-xl font-bold">{selectedDoctor.name}</h2>
                  <Badge variant="secondary">{selectedDoctor.specialty}</Badge>
                  <p className="text-primary font-semibold mt-1">₹{selectedDoctor.consultationFee * 83}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* User Contact Details */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2"><Send className="w-4 h-4" /> Your Contact Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="your@email.com" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="pl-9" />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="+91 98765 43210" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Confirmation will be sent via email & SMS</p>
              </div>

              {/* Consultation Type */}
              <div>
                <h3 className="font-semibold mb-3">Consultation Type</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant={consultationType === "video" ? "default" : "outline"} className="justify-start" onClick={() => setConsultationType("video")}>
                    <Video className="w-4 h-4 mr-2" /> Video Call
                  </Button>
                  <Button variant={consultationType === "chat" ? "default" : "outline"} className="justify-start" onClick={() => setConsultationType("chat")}>
                    <MessageSquare className="w-4 h-4 mr-2" /> Chat
                  </Button>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <h3 className="font-semibold mb-3">Select Date</h3>
                <div className="grid grid-cols-7 gap-2">
                  {dates.map(date => (
                    <Button key={date.full} variant={selectedDate === date.full ? "default" : "outline"} className="flex flex-col h-auto py-2" onClick={() => setSelectedDate(date.full)}>
                      <span className="text-xs">{date.day}</span>
                      <span className="text-lg font-bold">{date.date}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <h3 className="font-semibold mb-3">Available Slots</h3>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(time => (
                    <Button key={time} variant={selectedTime === time ? "default" : "outline"} size="sm" onClick={() => setSelectedTime(time)}>
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-accent/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Consultation Fee</span>
                  <span className="font-semibold">₹{selectedDoctor.consultationFee * 83}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="font-semibold">₹0</span>
                </div>
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-border">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary">₹{selectedDoctor.consultationFee * 83}</span>
                </div>
              </div>

              <Button variant="hero" className="w-full" size="lg" onClick={handleBookAppointment}>
                <Calendar className="w-4 h-4 mr-2" /> Confirm Appointment
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};

export default Consultations;
