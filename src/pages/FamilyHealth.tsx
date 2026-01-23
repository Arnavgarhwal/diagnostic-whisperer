import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, Plus, User, Calendar, Heart, Phone, Mail, 
  Edit2, Trash2, ArrowLeft, Activity, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  allergies: string[];
  conditions: string[];
  medications: string[];
  emergencyContact: boolean;
}

const defaultMembers: FamilyMember[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    relationship: "Self",
    dateOfBirth: "1985-06-15",
    gender: "Male",
    bloodGroup: "B+",
    phone: "+91 98765 43210",
    email: "rajesh@example.com",
    allergies: ["Penicillin"],
    conditions: ["Hypertension"],
    medications: ["Amlodipine 5mg"],
    emergencyContact: false
  },
  {
    id: "2",
    name: "Priya Kumar",
    relationship: "Spouse",
    dateOfBirth: "1988-03-22",
    gender: "Female",
    bloodGroup: "O+",
    phone: "+91 98765 43211",
    email: "priya@example.com",
    allergies: [],
    conditions: ["Thyroid"],
    medications: ["Thyroxine 50mcg"],
    emergencyContact: true
  },
  {
    id: "3",
    name: "Arjun Kumar",
    relationship: "Son",
    dateOfBirth: "2015-09-10",
    gender: "Male",
    bloodGroup: "B+",
    phone: "",
    email: "",
    allergies: ["Dust"],
    conditions: [],
    medications: [],
    emergencyContact: false
  }
];

const relationships = [
  "Self", "Spouse", "Father", "Mother", "Son", "Daughter", 
  "Brother", "Sister", "Grandfather", "Grandmother", "Other"
];

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const FamilyHealth = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editMember, setEditMember] = useState<FamilyMember | null>(null);
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    name: "",
    relationship: "Spouse",
    dateOfBirth: "",
    gender: "Male",
    bloodGroup: "O+",
    phone: "",
    email: "",
    allergies: [],
    conditions: [],
    medications: [],
    emergencyContact: false
  });
  const [newItem, setNewItem] = useState({ allergies: "", conditions: "", medications: "" });

  useEffect(() => {
    const stored = localStorage.getItem("healthai-family");
    if (stored) {
      setMembers(JSON.parse(stored));
    } else {
      setMembers(defaultMembers);
      localStorage.setItem("healthai-family", JSON.stringify(defaultMembers));
    }
  }, []);

  const saveMember = () => {
    if (!formData.name || !formData.dateOfBirth) {
      toast({
        title: "Missing Information",
        description: "Please fill in name and date of birth.",
        variant: "destructive"
      });
      return;
    }

    let updated;
    if (editMember) {
      updated = members.map(m => 
        m.id === editMember.id ? { ...formData, id: editMember.id } as FamilyMember : m
      );
      toast({ title: "Member Updated", description: "Family member profile has been updated." });
    } else {
      const newMember: FamilyMember = {
        ...formData as FamilyMember,
        id: Date.now().toString()
      };
      updated = [...members, newMember];
      toast({ title: "Member Added", description: "New family member has been added." });
    }

    setMembers(updated);
    localStorage.setItem("healthai-family", JSON.stringify(updated));
    closeDialog();
  };

  const deleteMember = () => {
    if (!deleteMemberId) return;
    const updated = members.filter(m => m.id !== deleteMemberId);
    setMembers(updated);
    localStorage.setItem("healthai-family", JSON.stringify(updated));
    setDeleteMemberId(null);
    toast({ title: "Member Removed", description: "Family member has been removed." });
  };

  const closeDialog = () => {
    setIsAddOpen(false);
    setEditMember(null);
    setFormData({
      name: "",
      relationship: "Spouse",
      dateOfBirth: "",
      gender: "Male",
      bloodGroup: "O+",
      phone: "",
      email: "",
      allergies: [],
      conditions: [],
      medications: [],
      emergencyContact: false
    });
  };

  const openEdit = (member: FamilyMember) => {
    setFormData({ ...member });
    setEditMember(member);
    setIsAddOpen(true);
  };

  const addListItem = (field: "allergies" | "conditions" | "medications") => {
    if (!newItem[field]) return;
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), newItem[field]]
    });
    setNewItem({ ...newItem, [field]: "" });
  };

  const removeListItem = (field: "allergies" | "conditions" | "medications", index: number) => {
    setFormData({
      ...formData,
      [field]: (formData[field] || []).filter((_, i) => i !== index)
    });
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Family Health</h1>
              <p className="text-muted-foreground">Manage health profiles for your family members</p>
            </div>
            <Dialog open={isAddOpen} onOpenChange={(open) => { if (!open) closeDialog(); else setIsAddOpen(true); }}>
              <DialogTrigger asChild>
                <Button variant="hero" className="ml-auto">
                  <Plus className="w-4 h-4 mr-2" /> Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editMember ? "Edit" : "Add"} Family Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Relationship</Label>
                      <Select
                        value={formData.relationship}
                        onValueChange={(v) => setFormData({ ...formData, relationship: v })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {relationships.map(r => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Date of Birth *</Label>
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(v) => setFormData({ ...formData, gender: v })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Blood Group</Label>
                      <Select
                        value={formData.bloodGroup}
                        onValueChange={(v) => setFormData({ ...formData, bloodGroup: v })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {bloodGroups.map(bg => (
                            <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Allergies */}
                  <div className="space-y-2">
                    <Label>Allergies</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add allergy"
                        value={newItem.allergies}
                        onChange={(e) => setNewItem({ ...newItem, allergies: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addListItem("allergies"))}
                      />
                      <Button type="button" variant="outline" onClick={() => addListItem("allergies")}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(formData.allergies || []).map((a, i) => (
                        <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => removeListItem("allergies", i)}>
                          {a} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Conditions */}
                  <div className="space-y-2">
                    <Label>Medical Conditions</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add condition"
                        value={newItem.conditions}
                        onChange={(e) => setNewItem({ ...newItem, conditions: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addListItem("conditions"))}
                      />
                      <Button type="button" variant="outline" onClick={() => addListItem("conditions")}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(formData.conditions || []).map((c, i) => (
                        <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => removeListItem("conditions", i)}>
                          {c} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Medications */}
                  <div className="space-y-2">
                    <Label>Current Medications</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add medication"
                        value={newItem.medications}
                        onChange={(e) => setNewItem({ ...newItem, medications: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addListItem("medications"))}
                      />
                      <Button type="button" variant="outline" onClick={() => addListItem("medications")}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(formData.medications || []).map((m, i) => (
                        <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => removeListItem("medications", i)}>
                          {m} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="emergency"
                      checked={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="emergency" className="cursor-pointer">Set as emergency contact</Label>
                  </div>

                  <Button onClick={saveMember} className="w-full" variant="hero">
                    {editMember ? "Update" : "Add"} Member
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Members Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedMember(member)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-14 h-14">
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{member.name}</h3>
                          {member.emergencyContact && (
                            <Shield className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{member.relationship}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{calculateAge(member.dateOfBirth)} yrs</span>
                          <span>{member.gender}</span>
                          <Badge variant="outline" className="text-xs">{member.bloodGroup}</Badge>
                        </div>
                      </div>
                    </div>

                    {(member.conditions.length > 0 || member.allergies.length > 0) && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex flex-wrap gap-1">
                          {member.allergies.map((a, i) => (
                            <Badge key={i} variant="destructive" className="text-xs">
                              {a}
                            </Badge>
                          ))}
                          {member.conditions.map((c, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => { e.stopPropagation(); openEdit(member); }}
                      >
                        <Edit2 className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      {member.relationship !== "Self" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); setDeleteMemberId(member.id); }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Member Detail Dialog */}
          <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
            <DialogContent className="max-w-lg">
              {selectedMember && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(selectedMember.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span>{selectedMember.name}</span>
                        <p className="text-sm font-normal text-muted-foreground">
                          {selectedMember.relationship}
                        </p>
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-2xl font-bold text-foreground">{calculateAge(selectedMember.dateOfBirth)}</p>
                        <p className="text-xs text-muted-foreground">Years Old</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-2xl font-bold text-foreground">{selectedMember.bloodGroup}</p>
                        <p className="text-xs text-muted-foreground">Blood Group</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-2xl font-bold text-foreground">{selectedMember.gender.charAt(0)}</p>
                        <p className="text-xs text-muted-foreground">Gender</p>
                      </div>
                    </div>

                    {selectedMember.phone && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{selectedMember.phone}</span>
                      </div>
                    )}

                    {selectedMember.email && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{selectedMember.email}</span>
                      </div>
                    )}

                    {selectedMember.allergies.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Allergies</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedMember.allergies.map((a, i) => (
                            <Badge key={i} variant="destructive">{a}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMember.conditions.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Medical Conditions</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedMember.conditions.map((c, i) => (
                            <Badge key={i} variant="secondary">{c}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMember.medications.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Current Medications</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedMember.medications.map((m, i) => (
                            <Badge key={i} variant="outline">{m}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation */}
          <AlertDialog open={!!deleteMemberId} onOpenChange={() => setDeleteMemberId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Family Member?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently remove the family member's health profile.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteMember} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FamilyHealth;
