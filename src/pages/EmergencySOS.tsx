import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  MapPin,
  Plus,
  Trash2,
  AlertTriangle,
  Hospital,
  Ambulance,
  Heart,
  Shield,
  Navigation,
  User,
  Edit2,
  Save,
  X,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { sendEmergencyAlertsNative, isNativePlatform } from "@/services/nativeSmsService";
import { getCurrentLocation } from "@/services/nativeMotionService";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

interface Hospital {
  id: string;
  name: string;
  distance: string;
  address: string;
  phone: string;
  type: string;
}

const defaultContacts: EmergencyContact[] = [
  { id: "1", name: "Emergency Services", phone: "112", relation: "Emergency" },
  { id: "2", name: "Ambulance", phone: "102", relation: "Medical" },
  { id: "3", name: "Police", phone: "100", relation: "Emergency" },
];

const nearbyHospitals: Hospital[] = [
  {
    id: "1",
    name: "Apollo Hospital",
    distance: "2.3 km",
    address: "Jubilee Hills, Hyderabad",
    phone: "+91 40 2360 7777",
    type: "Multi-Specialty",
  },
  {
    id: "2",
    name: "KIMS Hospital",
    distance: "3.8 km",
    address: "Secunderabad, Hyderabad",
    phone: "+91 40 4488 5000",
    type: "Super-Specialty",
  },
  {
    id: "3",
    name: "Care Hospitals",
    distance: "4.1 km",
    address: "Banjara Hills, Hyderabad",
    phone: "+91 40 3041 8888",
    type: "Multi-Specialty",
  },
  {
    id: "4",
    name: "Yashoda Hospitals",
    distance: "5.2 km",
    address: "Somajiguda, Hyderabad",
    phone: "+91 40 4567 4567",
    type: "Super-Specialty",
  },
];

const EmergencySOS = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relation: "",
  });
  const [sosActive, setSosActive] = useState(false);
  


  useEffect(() => {
    const saved = localStorage.getItem("wellsync-emergency-contacts");
    if (saved) {
      setContacts(JSON.parse(saved));
    } else {
      setContacts(defaultContacts);
      localStorage.setItem("wellsync-emergency-contacts", JSON.stringify(defaultContacts));
    }

  }, []);

  const saveContacts = (updated: EmergencyContact[]) => {
    setContacts(updated);
    localStorage.setItem("wellsync-emergency-contacts", JSON.stringify(updated));
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Missing Information",
        description: "Please enter name and phone number.",
        variant: "destructive",
      });
      return;
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      ...newContact,
    };

    saveContacts([...contacts, contact]);
    setNewContact({ name: "", phone: "", relation: "" });
    setShowAddContact(false);
    toast({
      title: "Contact Added",
      description: `${contact.name} has been added to emergency contacts.`,
    });
  };

  const handleDeleteContact = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    saveContacts(updated);
    toast({
      title: "Contact Removed",
      description: "Emergency contact has been removed.",
    });
  };

  const handleCall = (phone: string, name: string) => {
    window.location.href = `tel:${phone}`;
    toast({
      title: `Calling ${name}`,
      description: `Dialing ${phone}...`,
    });
  };

  const handleSOS = async () => {
    if (sosActive) return;
    setSosActive(true);

    toast({
      title: "🚨 SOS Activated!",
      description: "Sending emergency alerts to your contacts now…",
      variant: "destructive",
    });

    // Best-effort location (don't block alert sending)
    let location: { lat: number; lng: number } | null = null;
    try {
      location = await Promise.race([
        getCurrentLocation(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 4000)),
      ]);
    } catch {
      location = null;
    }

    const userContacts = contacts
      .filter((c) => !["1", "2", "3"].includes(c.id))
      .map((c) => ({ name: c.name, phone: c.phone, preferredMethod: "both" as const }));

    if (userContacts.length > 0) {
      try {
        if (isNativePlatform()) {
          await sendEmergencyAlertsNative(userContacts, location);
        } else {
          // Web: open SMS + WhatsApp directly without confirmation prompts
          const locText = location
            ? `📍 https://maps.google.com/?q=${location.lat},${location.lng}`
            : "📍 Location unavailable";
          const message = `🚨 EMERGENCY! I need help. ${locText}`;
          const encoded = encodeURIComponent(message);
          userContacts.forEach((c, i) => {
            const phone = c.phone.replace(/\D/g, "");
            setTimeout(() => {
              window.open(`sms:${phone}?body=${encoded}`, "_self");
              setTimeout(() => {
                window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
              }, 400);
            }, i * 800);
          });
        }
        toast({
          title: "Alerts Sent",
          description: `Emergency message sent to ${userContacts.length} contact(s).`,
        });
      } catch (e) {
        console.error("SOS send failed:", e);
      }
    } else {
      toast({
        title: "No personal emergency contacts",
        description: "Add contacts in Emergency Settings for instant alerts. Calling 112…",
        variant: "destructive",
      });
    }

    // Auto-call official emergency services
    setTimeout(() => {
      handleCall("112", "Emergency Services");
      setSosActive(false);
    }, 1500);
  };

  const handleGetDirections = (hospital: Hospital) => {
    // Open in maps
    const query = encodeURIComponent(hospital.name + " " + hospital.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
    toast({
      title: "Opening Maps",
      description: `Getting directions to ${hospital.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive mb-4">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Emergency Services</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Emergency <span className="text-gradient">SOS</span>
            </h1>
            <p className="text-muted-foreground">
              Quick access to emergency services and nearby hospitals
            </p>
          </motion.div>

          {/* Fall Detection Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-8 bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Fall Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically detect falls and trigger SOS
                  </p>
                </div>
              </div>
              <Link to="/emergency-settings">
                <Button variant="outline" size="sm">
                  Settings
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Fall detection is always active site-wide
            </p>
          </motion.div>

          {/* SOS Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 flex justify-center"
          >
            <button
              onClick={handleSOS}
              disabled={sosActive}
              className={`relative w-40 h-40 rounded-full ${
                sosActive
                  ? "bg-destructive animate-pulse"
                  : "bg-gradient-to-br from-destructive to-red-600 hover:scale-105"
              } transition-transform shadow-2xl shadow-destructive/30`}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <Ambulance className="w-12 h-12 mb-2" />
                <span className="text-2xl font-bold">
                  {sosActive ? "SENDING..." : "SOS"}
                </span>
              </div>
              {!sosActive && (
                <div className="absolute inset-0 rounded-full border-4 border-destructive/30 animate-ping" />
              )}
            </button>
          </motion.div>

          <p className="text-center text-sm text-muted-foreground mb-8">
            Tap the SOS button to alert emergency services and share your location
          </p>

          {/* Quick Dial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Quick Dial</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Ambulance, label: "Ambulance", phone: "102", color: "bg-red-500" },
                { icon: Shield, label: "Police", phone: "100", color: "bg-blue-500" },
                { icon: AlertTriangle, label: "Fire", phone: "101", color: "bg-orange-500" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleCall(item.phone, item.label)}
                  className={`${item.color} text-white p-4 rounded-xl flex flex-col items-center gap-2 hover:opacity-90 transition-opacity`}
                >
                  <item.icon className="w-8 h-8" />
                  <span className="font-medium text-sm">{item.label}</span>
                  <span className="text-xs opacity-80">{item.phone}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Emergency Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Emergency Contacts</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddContact(true)}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Contact
              </Button>
            </div>

            {/* Add Contact Form */}
            {showAddContact && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-card border border-border rounded-xl p-4 mb-4"
              >
                <div className="grid md:grid-cols-3 gap-3 mb-3">
                  <Input
                    placeholder="Name"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Phone Number"
                    value={newContact.phone}
                    onChange={(e) =>
                      setNewContact({ ...newContact, phone: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Relation (e.g., Father, Friend)"
                    value={newContact.relation}
                    onChange={(e) =>
                      setNewContact({ ...newContact, relation: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddContact}>
                    <Save className="w-4 h-4 mr-1" /> Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowAddContact(false)}
                  >
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                </div>
              </motion.div>
            )}

            <div className="space-y-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-card border border-border rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {contact.phone} • {contact.relation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={() => handleCall(contact.phone, contact.name)}
                    >
                      <Phone className="w-4 h-4 mr-1" /> Call
                    </Button>
                    {!["1", "2", "3"].includes(contact.id) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteContact(contact.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Nearby Hospitals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Hospital className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Nearby Hospitals</h2>
            </div>

            <div className="space-y-3">
              {nearbyHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Hospital className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{hospital.name}</h3>
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            {hospital.distance}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {hospital.address}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {hospital.type} • {hospital.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-16 md:ml-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCall(hospital.phone, hospital.name)}
                      >
                        <Phone className="w-4 h-4 mr-1" /> Call
                      </Button>
                      <Button
                        variant="hero"
                        size="sm"
                        onClick={() => handleGetDirections(hospital)}
                      >
                        <Navigation className="w-4 h-4 mr-1" /> Directions
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Medical Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-gradient-to-br from-primary/10 to-health-coral/10 border border-primary/20 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Your Medical Info</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Keep your medical information updated so emergency responders can access critical details.
            </p>
            <Button variant="outline" onClick={() => window.location.href = "/profile"}>
              Update Medical Info
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmergencySOS;