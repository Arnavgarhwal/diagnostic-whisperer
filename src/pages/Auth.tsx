import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, Check, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  useEffect(() => {
    if (!loading && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, loading, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!isLogin) {
        // SIGN UP
        if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
          toast({ title: "Missing fields", description: "Name, email, and password are required.", variant: "destructive" });
          return;
        }
        if (formData.password.length < 6) {
          toast({ title: "Weak password", description: "Password must be at least 6 characters.", variant: "destructive" });
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          toast({ title: "Passwords do not match", variant: "destructive" });
          return;
        }

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              display_name: formData.name,
              phone: formData.phone,
            },
          },
        });
        if (error) throw error;

        toast({ title: "Account created!", description: "Welcome to WellSync." });
        // useAuth will redirect on session
      } else {
        // SIGN IN
        if (!formData.email.trim() || !formData.password) {
          toast({ title: "Missing fields", description: "Email and password are required.", variant: "destructive" });
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        toast({ title: "Welcome back!" });
      }
    } catch (err: any) {
      toast({
        title: "Authentication error",
        description: err?.message ?? "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const features = [
    "AI-powered symptom analysis",
    "Book doctor consultations",
    "Order medicines online",
    "Track health records",
    "Get personalized insights",
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-background to-health-coral/10 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--health-coral)/0.1),transparent_50%)]" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-health-teal-dark flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              Well<span className="text-primary">Sync</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Your Health Journey Starts Here</h1>
            <p className="text-lg text-muted-foreground">Join thousands who trust WellSync for their healthcare needs.</p>
          </div>
          <div className="space-y-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-sm text-muted-foreground">
          <p>Trusted by 50,000+ users across India</p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="absolute top-4 left-4 gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-health-teal-dark flex items-center justify-center shadow-md">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Well<span className="text-primary">Sync</span>
              </span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">{isLogin ? "Welcome back" : "Create an account"}</h2>
            <p className="text-muted-foreground">
              {isLogin ? "Sign in with your email" : "Get started with your health journey"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your name" className="pl-10 h-12" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" className="pl-10 h-12" />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (for appointment SMS)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" className="pl-10 h-12" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" className="pl-10 pr-10 h-12" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="confirmPassword" type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="••••••••" className="pl-10 h-12" />
                </div>
              </div>
            )}

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
                }}
                className="text-primary font-semibold hover:underline"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
