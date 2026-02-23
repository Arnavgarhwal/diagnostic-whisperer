import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Clock, Video, MessageSquare, Calendar, Check, Globe, Mail, Phone, Send, CreditCard, IndianRupee, CheckCircle } from "lucide-react";
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
  status: string;
  paymentMethod: string;
  paymentStatus: string;
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
  const [bookingStep, setBookingStep] = useState<"details" | "payment" | "confirmed">("details");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  // Auto-save user contact info to profile
  const autoSaveContact = (email: string, phone: string) => {
    const savedProfile = localStorage.getItem("wellsync-profile");
    if (savedProfile) {
      const p = JSON.parse(savedProfile);
      p.email = email || p.email;
      p.phone = phone || p.phone;
      localStorage.setItem("wellsync-profile", JSON.stringify(p));
    } else {
      localStorage.setItem("wellsync-profile", JSON.stringify({ email, phone, name: "", dateOfBirth: "", gender: "", address: "", bloodGroup: "", emergencyContact: "", avatarEmoji: "👤" }));
    }
  };

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
    const subject = encodeURIComponent(`✅ Appointment Confirmed - ${appt.doctorName} | WellSync`);
    const body = encodeURIComponent(
      `Dear Patient,\n\nYour ${appt.type === "video" ? "Video" : "Chat"} consultation has been confirmed!\n\n📋 Appointment Details:\n━━━━━━━━━━━━━━━━━━━━\nDoctor: ${appt.doctorName}\nSpecialty: ${appt.specialty}\nDate: ${appt.date}\nTime: ${appt.time}\nFee: ₹${appt.fee} (Paid via ${appt.paymentMethod})\n━━━━━━━━━━━━━━━━━━━━\n\n⏰ Please be available 5 minutes before your scheduled time.\n\nIf you need to reschedule or cancel, please do so at least 2 hours before the appointment.\n\nThank you for choosing WellSync Health!\n\nBest regards,\nWellSync Health Team\n📞 Support: 1800-123-4567`
    );
    window.open(`mailto:${appt.userEmail}?subject=${subject}&body=${body}`, '_self');
  };

  const sendConfirmationSMS = (appt: BookedAppointment) => {
    if (!appt.userPhone) return;
    const cleanPhone = appt.userPhone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `✅ WellSync Appointment Confirmed!\n\nDoctor: ${appt.doctorName}\nSpecialty: ${appt.specialty}\nDate: ${appt.date}\nTime: ${appt.time}\nType: ${appt.type === "video" ? "Video Call" : "Chat"}\nFee: ₹${appt.fee} (Paid)\n\nBe available 5 min early.\nSupport: 1800-123-4567`
    );
    window.open(`sms:${cleanPhone}?body=${message}`, '_self');
  };

  const handleProceedToPayment = () => {
    if (!selectedDate || !selectedTime) {
      toast({ title: "Select Date & Time", description: "Please select a date and time slot.", variant: "destructive" });
      return;
    }
    if (!userEmail && !userPhone) {
      toast({ title: "Contact Info Required", description: "Please enter your email or phone for confirmation.", variant: "destructive" });
      return;
    }
    // Auto-save contact details
    autoSaveContact(userEmail, userPhone);
    setBookingStep("payment");
  };

  const handleProcessPayment = async () => {
    // Validate payment details
    if (paymentMethod === "upi" && !upiId.includes("@")) {
      toast({ title: "Invalid UPI ID", description: "Please enter a valid UPI ID (e.g., name@upi)", variant: "destructive" });
      return;
    }
    if (paymentMethod === "card") {
      if (cardNumber.replace(/\s/g, "").length < 16) {
        toast({ title: "Invalid Card", description: "Please enter a valid 16-digit card number.", variant: "destructive" });
        return;
      }
      if (!cardExpiry || !cardCvv) {
        toast({ title: "Missing Details", description: "Please fill in card expiry and CVV.", variant: "destructive" });
        return;
      }
    }

    setIsProcessingPayment(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newAppt: BookedAppointment = {
      id: Date.now().toString(),
      doctorName: selectedDoctor!.name,
      doctorImage: selectedDoctor!.image,
      specialty: selectedDoctor!.specialty,
      date: selectedDate,
      time: selectedTime,
      type: consultationType,
      fee: selectedDoctor!.consultationFee,
      userEmail,
      userPhone,
      bookedAt: new Date().toISOString(),
      status: "upcoming",
      paymentMethod: paymentMethod === "upi" ? "UPI" : paymentMethod === "card" ? "Card" : "Net Banking",
      paymentStatus: "paid",
    };

    const updated = [...appointments, newAppt];
    setAppointments(updated);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));

    setIsProcessingPayment(false);
    setBookingStep("confirmed");

    toast({
      title: "Payment Successful! 💳",
      description: `₹${selectedDoctor!.consultationFee} paid via ${newAppt.paymentMethod}`,
    });
  };

  const handleSendConfirmations = () => {
    const lastAppt = appointments[appointments.length - 1];
    if (!lastAppt) return;
    
    // Send email confirmation
    if (lastAppt.userEmail) {
      sendConfirmationEmail(lastAppt);
      toast({ title: "📧 Email Confirmation", description: `Opening email client to send confirmation to ${lastAppt.userEmail}` });
    }
    
    // Send SMS with slight delay
    setTimeout(() => {
      if (lastAppt.userPhone) {
        sendConfirmationSMS(lastAppt);
        toast({ title: "📱 SMS Confirmation", description: `Opening SMS to send confirmation to ${lastAppt.userPhone}` });
      }
    }, 1000);
  };

  const handleCloseModal = () => {
    setSelectedDoctor(null);
    setBookingStep("details");
    setSelectedDate("");
    setSelectedTime("");
    setUpiId("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
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
              Consult Top <span className="text-gradient">Indian Doctors</span> Online
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Connect with verified Indian specialists via video or chat. Get expert medical advice in Hindi or English.
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
                            <Badge className={appt.type === "video" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}>
                              {appt.type === "video" ? <Video className="w-3 h-3 mr-1" /> : <MessageSquare className="w-3 h-3 mr-1" />}
                              {appt.type}
                            </Badge>
                            {appt.paymentStatus === "paid" && (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                <CheckCircle className="w-3 h-3 mr-1" /> Paid
                              </Badge>
                            )}
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
                    <p className="text-xl font-bold text-primary">₹{doctor.consultationFee}</p>
                  </div>
                  <Button variant="hero" onClick={() => { setSelectedDoctor(doctor); setBookingStep("details"); }}>Book Now</Button>
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleCloseModal}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-background rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{selectedDoctor.image}</div>
                <div>
                  <h2 className="text-xl font-bold">{selectedDoctor.name}</h2>
                  <Badge variant="secondary">{selectedDoctor.specialty}</Badge>
                  <p className="text-primary font-semibold mt-1">₹{selectedDoctor.consultationFee}</p>
                </div>
              </div>
              {/* Step indicator */}
              <div className="flex items-center gap-2 mt-4">
                {["details", "payment", "confirmed"].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      bookingStep === step ? "bg-primary text-primary-foreground" :
                      (["details", "payment", "confirmed"].indexOf(bookingStep) > i ? "bg-green-500 text-white" : "bg-muted text-muted-foreground")
                    }`}>
                      {["details", "payment", "confirmed"].indexOf(bookingStep) > i ? "✓" : i + 1}
                    </div>
                    {i < 2 && <div className="w-8 h-0.5 bg-muted" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {bookingStep === "details" && (
                <>
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
                      <span className="font-semibold">₹{selectedDoctor.consultationFee}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Platform Fee</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-border">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-primary text-lg">₹{selectedDoctor.consultationFee}</span>
                    </div>
                  </div>

                  <Button variant="hero" className="w-full" size="lg" onClick={handleProceedToPayment}>
                    <CreditCard className="w-4 h-4 mr-2" /> Proceed to Payment
                  </Button>
                </>
              )}

              {bookingStep === "payment" && (
                <>
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Select Payment Method</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <Button variant={paymentMethod === "upi" ? "default" : "outline"} className="flex flex-col h-auto py-3" onClick={() => setPaymentMethod("upi")}>
                        <IndianRupee className="w-5 h-5 mb-1" />
                        <span className="text-xs">UPI</span>
                      </Button>
                      <Button variant={paymentMethod === "card" ? "default" : "outline"} className="flex flex-col h-auto py-3" onClick={() => setPaymentMethod("card")}>
                        <CreditCard className="w-5 h-5 mb-1" />
                        <span className="text-xs">Card</span>
                      </Button>
                      <Button variant={paymentMethod === "netbanking" ? "default" : "outline"} className="flex flex-col h-auto py-3" onClick={() => setPaymentMethod("netbanking")}>
                        <Globe className="w-5 h-5 mb-1" />
                        <span className="text-xs">Net Banking</span>
                      </Button>
                    </div>
                  </div>

                  {paymentMethod === "upi" && (
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">UPI ID</label>
                      <Input placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                    </div>
                  )}

                  {paymentMethod === "card" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Card Number</label>
                        <Input placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} maxLength={19} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">Expiry</label>
                          <Input placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} maxLength={5} />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">CVV</label>
                          <Input type="password" placeholder="***" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} maxLength={3} />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "netbanking" && (
                    <div className="p-4 rounded-xl bg-accent/50 border border-border text-center">
                      <p className="text-sm text-muted-foreground">You'll be redirected to your bank's payment page</p>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-accent/50 border border-border">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Amount to Pay</span>
                      <span className="font-bold text-primary text-xl">₹{selectedDoctor.consultationFee}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setBookingStep("details")}>Back</Button>
                    <Button variant="hero" className="flex-1" size="lg" onClick={handleProcessPayment} disabled={isProcessingPayment}>
                      {isProcessingPayment ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <>
                          <IndianRupee className="w-4 h-4 mr-1" /> Pay ₹{selectedDoctor.consultationFee}
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}

              {bookingStep === "confirmed" && (
                <div className="text-center space-y-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Booking Confirmed! 🎉</h3>
                    <p className="text-muted-foreground">Your appointment has been booked and payment received.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/50 border border-border text-left space-y-2">
                    <div className="flex justify-between"><span className="text-muted-foreground">Doctor</span><span className="font-medium">{selectedDoctor.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{selectedDate}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{selectedTime}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{consultationType === "video" ? "Video Call" : "Chat"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Amount Paid</span><span className="font-bold text-primary">₹{selectedDoctor.consultationFee}</span></div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium">Send Confirmation via:</p>
                    <div className="flex gap-3">
                      {userEmail && (
                        <Button variant="outline" className="flex-1" onClick={() => {
                          const lastAppt = appointments[appointments.length - 1];
                          if (lastAppt) sendConfirmationEmail(lastAppt);
                          toast({ title: "📧 Email Opened", description: `Confirmation email ready for ${userEmail}` });
                        }}>
                          <Mail className="w-4 h-4 mr-2" /> Email
                        </Button>
                      )}
                      {userPhone && (
                        <Button variant="outline" className="flex-1" onClick={() => {
                          const lastAppt = appointments[appointments.length - 1];
                          if (lastAppt) sendConfirmationSMS(lastAppt);
                          toast({ title: "📱 SMS Opened", description: `SMS confirmation ready for ${userPhone}` });
                        }}>
                          <Phone className="w-4 h-4 mr-2" /> SMS
                        </Button>
                      )}
                    </div>
                    {(userEmail || userPhone) && (
                      <Button variant="hero" className="w-full" onClick={handleSendConfirmations}>
                        <Send className="w-4 h-4 mr-2" /> Send All Confirmations
                      </Button>
                    )}
                  </div>

                  <Button variant="outline" className="w-full" onClick={handleCloseModal}>
                    Close
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};

export default Consultations;