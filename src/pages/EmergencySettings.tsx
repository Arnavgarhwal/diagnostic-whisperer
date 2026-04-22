import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, User, Phone, MessageSquare, Save, RotateCcw, Shield, Clock, Smartphone, Globe, ArrowUp, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEmergencySettings, EmergencyContact } from "@/hooks/useEmergencySettings";
import { isNativePlatform, getPlatform } from "@/services/nativeSmsService";

const EmergencySettings = () => {
  const { settings, saveSettings, addContact, updateContact, removeContact, moveContact, resetToDefaults } = useEmergencySettings();
  const [newContact, setNewContact] = useState<EmergencyContact>({
    name: "",
    phone: "",
    preferredMethod: "both",
  });
  const [platform, setPlatform] = useState<string>('web');
  const [isNative, setIsNative] = useState<boolean>(false);

  useEffect(() => {
    setPlatform(getPlatform());
    setIsNative(isNativePlatform());
  }, []);

  const handleAddContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      toast.error("Please fill in both name and phone number");
      return;
    }
    
    // Basic phone validation
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    if (!phoneRegex.test(newContact.phone.replace(/\s/g, ''))) {
      toast.error("Please enter a valid phone number");
      return;
    }

    addContact(newContact);
    setNewContact({ name: "", phone: "", preferredMethod: "both" });
    toast.success("Emergency contact added!");
  };

  const handleUpdateContact = (index: number, field: keyof EmergencyContact, value: string) => {
    const contact = { ...settings.contacts[index], [field]: value };
    updateContact(index, contact);
  };

  const handleRemoveContact = (index: number) => {
    if (settings.contacts.length === 1) {
      toast.error("You must have at least one emergency contact");
      return;
    }
    removeContact(index);
    toast.success("Contact removed");
  };

  const handleReset = () => {
    resetToDefaults();
    toast.success("Settings reset to defaults");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/emergency">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Emergency Settings</h1>
              <p className="text-muted-foreground">Configure fall detection and emergency contacts</p>
            </div>
          </div>

          {/* Fall Detection Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Fall Detection Settings
              </CardTitle>
              <CardDescription>
                Configure how fall detection behaves
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-send Emergency Alert</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically send SMS/WhatsApp when countdown ends
                  </p>
                </div>
                <Switch
                  checked={settings.autoSend}
                  onCheckedChange={(checked) => saveSettings({ autoSend: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Countdown Duration (seconds)
                </Label>
                <Select
                  value={settings.countdownSeconds.toString()}
                  onValueChange={(value) => {
                    saveSettings({ countdownSeconds: parseInt(value) });
                    toast.success(`Countdown duration set to ${value} seconds`);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="20">20 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">60 seconds</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Time before emergency alerts are automatically sent after a fall is detected.
                </p>
              </div>

              {/* Platform Status */}
              <div className={`rounded-lg p-3 ${isNative ? 'bg-green-500/10 border border-green-500/30' : 'bg-amber-500/10 border border-amber-500/30'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {isNative ? (
                    <Smartphone className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  )}
                  <span className={`text-sm font-medium ${isNative ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'}`}>
                    {isNative ? `Native App (${platform})` : 'Web Browser Mode'}
                  </span>
                </div>
                <p className={`text-xs ${isNative ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'}`}>
                  {isNative ? (
                    <>
                      <strong>✓ Full automatic alerts enabled!</strong> Emergency SMS and WhatsApp messages will be sent automatically without any user interaction when a fall is detected.
                    </>
                  ) : (
                    <>
                      <strong>Note:</strong> Running in web browser mode. For fully automatic emergency alerts without any taps, export this app as a native mobile app using Capacitor. Messages will open in apps with pre-filled content in web mode.
                    </>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Emergency Contacts
              </CardTitle>
              <CardDescription>
                These contacts will receive emergency alerts when a fall is detected
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground -mb-2">
                Higher contacts are alerted first. Use the arrows to reorder priority.
              </p>
              {settings.contacts.map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 border rounded-lg bg-muted/30 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium text-foreground">
                        {index === 0 ? "Primary Contact" : `Contact ${index + 1}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={index === 0}
                        onClick={() => moveContact(index, "up")}
                        title="Move up (higher priority)"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={index === settings.contacts.length - 1}
                        onClick={() => moveContact(index, "down")}
                        title="Move down (lower priority)"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveContact(index)}
                        className="text-destructive hover:text-destructive h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={contact.name}
                        onChange={(e) => handleUpdateContact(index, 'name', e.target.value)}
                        placeholder="Contact name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        value={contact.phone}
                        onChange={(e) => handleUpdateContact(index, 'phone', e.target.value)}
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Alert Method</Label>
                    <Select
                      value={contact.preferredMethod}
                      onValueChange={(value) => handleUpdateContact(index, 'preferredMethod', value as 'sms' | 'whatsapp' | 'both')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sms">SMS Only</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp Only</SelectItem>
                        <SelectItem value="both">Both SMS & WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              ))}

              {/* Add New Contact */}
              <div className="p-4 border-2 border-dashed rounded-lg space-y-4">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add New Contact
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      placeholder="Contact name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Alert Method</Label>
                  <Select
                    value={newContact.preferredMethod}
                    onValueChange={(value) => setNewContact({ ...newContact, preferredMethod: value as 'sms' | 'whatsapp' | 'both' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS Only</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp Only</SelectItem>
                      <SelectItem value="both">Both SMS & WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddContact} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Test Fall Detection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-destructive" />
                Test Fall Detection
              </CardTitle>
              <CardDescription>
                Simulate a fall detection event to test your emergency alert setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This will trigger the fall detection overlay with countdown. When the countdown reaches zero, emergency alerts will be sent to your configured contacts.
              </p>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  // Dispatch custom event that GlobalFallDetection listens for
                  window.dispatchEvent(new CustomEvent('simulate-fall-detection'));
                  toast.success("Fall detection simulated!", { description: "The fall detection overlay should appear now." });
                }}
              >
                <Shield className="w-4 h-4 mr-2" />
                Simulate Fall Detection
              </Button>
            </CardContent>
          </Card>

          {/* Reset Button */}
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default EmergencySettings;
