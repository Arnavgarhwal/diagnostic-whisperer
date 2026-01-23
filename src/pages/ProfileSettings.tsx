import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Bell,
  Shield,
  CreditCard,
  LogOut,
  Camera,
  Check,
  Moon,
  Sun,
  Smartphone,
  MessageSquare,
  Heart,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
  avatarEmoji: string;
}

interface NotificationSettings {
  emailAppointmentReminders: boolean;
  emailTestResults: boolean;
  emailPromotions: boolean;
  smsAppointmentReminders: boolean;
  smsTestResults: boolean;
  pushNotifications: boolean;
  reminderTime: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    bloodGroup: "",
    emergencyContact: "",
    avatarEmoji: "👤",
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailAppointmentReminders: true,
    emailTestResults: true,
    emailPromotions: false,
    smsAppointmentReminders: true,
    smsTestResults: true,
    pushNotifications: true,
    reminderTime: "24",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem("wellsync-profile");
    const savedNotifications = localStorage.getItem("wellsync-notifications");
    const savedUser = localStorage.getItem("wellsync-user");

    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      setProfile(profileData);
      setOriginalProfile(profileData);
    } else if (savedUser) {
      const user = JSON.parse(savedUser);
      const newProfile = {
        ...profile,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      };
      setProfile(newProfile);
      setOriginalProfile(newProfile);
    }

    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const handleSaveProfile = () => {
    // Validation
    if (!profile.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage
    localStorage.setItem("wellsync-profile", JSON.stringify(profile));
    
    // Also update the user session
    const savedUser = localStorage.getItem("wellsync-user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      user.name = profile.name;
      user.email = profile.email;
      user.phone = profile.phone;
      localStorage.setItem("wellsync-user", JSON.stringify(user));
      
      // Update registered users as well
      const registeredUsers = JSON.parse(localStorage.getItem("wellsync-registered-users") || "[]");
      const updatedUsers = registeredUsers.map((u: any) => 
        u.phone === user.phone ? { ...u, name: profile.name, email: profile.email } : u
      );
      localStorage.setItem("wellsync-registered-users", JSON.stringify(updatedUsers));
    }

    setOriginalProfile(profile);
    setIsEditing(false);
    
    // Trigger auth change for navbar update
    window.dispatchEvent(new Event("auth-change"));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleCancelEdit = () => {
    if (originalProfile) {
      setProfile(originalProfile);
    }
    setIsEditing(false);
  };

  const handleSaveNotifications = () => {
    localStorage.setItem("wellsync-notifications", JSON.stringify(notifications));
    toast({
      title: "Preferences Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const handleChangePassword = () => {
    // Validation
    if (!passwordForm.currentPassword) {
      toast({
        title: "Current Password Required",
        description: "Please enter your current password.",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "New password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    // Verify current password
    const savedUser = localStorage.getItem("wellsync-user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      const registeredUsers = JSON.parse(localStorage.getItem("wellsync-registered-users") || "[]");
      const registeredUser = registeredUsers.find((u: any) => u.phone === user.phone);

      if (registeredUser && registeredUser.password !== passwordForm.currentPassword) {
        toast({
          title: "Incorrect Password",
          description: "The current password you entered is incorrect.",
          variant: "destructive",
        });
        return;
      }

      // Update password
      const updatedUsers = registeredUsers.map((u: any) => 
        u.phone === user.phone ? { ...u, password: passwordForm.newPassword } : u
      );
      localStorage.setItem("wellsync-registered-users", JSON.stringify(updatedUsers));

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
    }
  };

  const handleLogout = () => {
    const userData = localStorage.getItem("wellsync-user");
    if (userData) {
      const parsed = JSON.parse(userData);
      parsed.isLoggedIn = false;
      localStorage.setItem("wellsync-user", JSON.stringify(parsed));
    }
    
    window.dispatchEvent(new Event("auth-change"));
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate("/auth");
  };

  const handleDeleteAccount = () => {
    const savedUser = localStorage.getItem("wellsync-user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      
      // Remove user from registered users
      const registeredUsers = JSON.parse(localStorage.getItem("wellsync-registered-users") || "[]");
      const updatedUsers = registeredUsers.filter((u: any) => u.phone !== user.phone);
      localStorage.setItem("wellsync-registered-users", JSON.stringify(updatedUsers));
      
      // Clear all user data
      localStorage.removeItem("wellsync-user");
      localStorage.removeItem("wellsync-profile");
      localStorage.removeItem("wellsync-notifications");
      
      window.dispatchEvent(new Event("auth-change"));
      
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully.",
      });
      navigate("/");
    }
  };

  const avatarOptions = ["👤", "👨", "👩", "🧑", "👨‍⚕️", "👩‍⚕️", "🧑‍💼", "😊"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Profile <span className="text-gradient">Settings</span>
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </motion.div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full md:w-auto mb-8 grid grid-cols-4 md:flex">
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="gap-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Billing</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Avatar Section */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-health-coral/20 flex items-center justify-center text-5xl">
                        {profile.avatarEmoji}
                      </div>
                      {isEditing && (
                        <div className="mt-3 flex flex-wrap justify-center gap-2">
                          {avatarOptions.map((emoji) => (
                            <button
                              key={emoji}
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                                profile.avatarEmoji === emoji
                                  ? "bg-primary/20 ring-2 ring-primary"
                                  : "bg-accent hover:bg-accent/80"
                              }`}
                              onClick={() =>
                                setProfile({ ...profile, avatarEmoji: emoji })
                              }
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl font-bold">{profile.name || "Your Name"}</h2>
                      <p className="text-muted-foreground">{profile.email || profile.phone || "Add your details"}</p>
                      <Badge className="mt-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <Check className="w-3 h-3 mr-1" /> Verified Account
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button variant="hero" onClick={handleSaveProfile}>
                            <Save className="w-4 h-4 mr-2" /> Save
                          </Button>
                          <Button variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                          <Camera className="w-4 h-4 mr-2" /> Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={profile.name}
                          onChange={(e) =>
                            setProfile({ ...profile, name: e.target.value })
                          }
                          className="pl-9"
                          disabled={!isEditing}
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                          className="pl-9"
                          disabled={!isEditing}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                          className="pl-9"
                          disabled={!isEditing}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="date"
                          value={profile.dateOfBirth}
                          onChange={(e) =>
                            setProfile({ ...profile, dateOfBirth: e.target.value })
                          }
                          className="pl-9"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Gender
                      </label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-border bg-background disabled:opacity-50"
                        value={profile.gender}
                        onChange={(e) =>
                          setProfile({ ...profile, gender: e.target.value })
                        }
                        disabled={!isEditing}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Blood Group
                      </label>
                      <div className="relative">
                        <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <select
                          className="w-full h-10 px-3 pl-9 rounded-md border border-border bg-background disabled:opacity-50"
                          value={profile.bloodGroup}
                          onChange={(e) =>
                            setProfile({ ...profile, bloodGroup: e.target.value })
                          }
                          disabled={!isEditing}
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm text-muted-foreground mb-1 block">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={profile.address}
                        onChange={(e) =>
                          setProfile({ ...profile, address: e.target.value })
                        }
                        className="pl-9"
                        disabled={!isEditing}
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm text-muted-foreground mb-1 block">
                      Emergency Contact
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={profile.emergencyContact}
                        onChange={(e) =>
                          setProfile({ ...profile, emergencyContact: e.target.value })
                        }
                        className="pl-9"
                        placeholder="Emergency contact number"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Email Notifications */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">Email Notifications</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        key: "emailAppointmentReminders",
                        label: "Appointment Reminders",
                        desc: "Get reminded before your scheduled appointments",
                      },
                      {
                        key: "emailTestResults",
                        label: "Test Results",
                        desc: "Be notified when your lab results are ready",
                      },
                      {
                        key: "emailPromotions",
                        label: "Promotions & Updates",
                        desc: "Receive health tips and promotional offers",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between py-2"
                      >
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                        <Switch
                          checked={
                            notifications[
                              item.key as keyof NotificationSettings
                            ] as boolean
                          }
                          onCheckedChange={(checked) =>
                            setNotifications({
                              ...notifications,
                              [item.key]: checked,
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* SMS Notifications */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-secondary" />
                    </div>
                    <h3 className="text-lg font-semibold">SMS Notifications</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        key: "smsAppointmentReminders",
                        label: "Appointment Reminders",
                        desc: "Get SMS reminders for appointments",
                      },
                      {
                        key: "smsTestResults",
                        label: "Test Results",
                        desc: "Get SMS when results are available",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between py-2"
                      >
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                        <Switch
                          checked={
                            notifications[
                              item.key as keyof NotificationSettings
                            ] as boolean
                          }
                          onCheckedChange={(checked) =>
                            setNotifications({
                              ...notifications,
                              [item.key]: checked,
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reminder Timing */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="text-lg font-semibold">Reminder Timing</h3>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Send appointment reminders
                    </label>
                    <select
                      className="w-full md:w-auto h-10 px-4 rounded-md border border-border bg-background"
                      value={notifications.reminderTime}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          reminderTime: e.target.value,
                        })
                      }
                    >
                      <option value="1">1 hour before</option>
                      <option value="2">2 hours before</option>
                      <option value="6">6 hours before</option>
                      <option value="12">12 hours before</option>
                      <option value="24">24 hours before</option>
                      <option value="48">48 hours before</option>
                    </select>
                  </div>
                </div>

                <Button variant="hero" onClick={handleSaveNotifications}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Notification Preferences
                </Button>
              </motion.div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Current Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPasswords ? "text" : "password"}
                          placeholder="••••••••"
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              currentPassword: e.target.value,
                            })
                          }
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowPasswords(!showPasswords)}
                        >
                          {showPasswords ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">
                        New Password
                      </label>
                      <Input
                        type={showPasswords ? "text" : "password"}
                        placeholder="••••••••"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Confirm New Password
                      </label>
                      <Input
                        type={showPasswords ? "text" : "password"}
                        placeholder="••••••••"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button variant="hero" onClick={handleChangePassword}>
                      Update Password
                    </Button>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Current Device</p>
                          <p className="text-sm text-muted-foreground">
                            Chrome • Mumbai, India
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-2 text-destructive">
                    Danger Zone
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back.
                  </p>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    Delete Account
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Current Plan</h3>
                    <Badge className="bg-primary/10 text-primary">Free Plan</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    You're currently on the free plan. Upgrade to unlock premium features.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border border-border rounded-xl">
                      <h4 className="font-semibold mb-2">Premium Monthly</h4>
                      <p className="text-2xl font-bold text-primary mb-2">
                        ₹299<span className="text-sm font-normal text-muted-foreground">/month</span>
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                        <li>✓ Unlimited consultations</li>
                        <li>✓ Priority support</li>
                        <li>✓ Health insights</li>
                      </ul>
                      <Button variant="hero" className="w-full">
                        Upgrade
                      </Button>
                    </div>
                    <div className="p-4 border-2 border-primary rounded-xl relative">
                      <Badge className="absolute -top-2 left-4 bg-primary">
                        Best Value
                      </Badge>
                      <h4 className="font-semibold mb-2">Premium Yearly</h4>
                      <p className="text-2xl font-bold text-primary mb-2">
                        ₹2,499<span className="text-sm font-normal text-muted-foreground">/year</span>
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                        <li>✓ All monthly features</li>
                        <li>✓ 2 months free</li>
                        <li>✓ Family sharing (4 members)</li>
                      </ul>
                      <Button variant="hero" className="w-full">
                        Upgrade
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
                  <div className="p-4 bg-accent/30 rounded-xl flex items-center gap-4">
                    <CreditCard className="w-8 h-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">No payment methods added</p>
                      <p className="text-sm text-muted-foreground">
                        Add a payment method to upgrade your plan
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4">
                    Add Payment Method
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 pt-6 border-t border-border"
          >
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfileSettings;