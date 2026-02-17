import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, CheckCircle, Clock, Users, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  totalDays: number;
  currentDay: number;
  joined: boolean;
  participants: number;
}

const initialChallenges: Challenge[] = [
  { id: "1", title: "30-Day Water Challenge", description: "Drink 8 glasses of water every day for 30 days", duration: "30 days", category: "Hydration", totalDays: 30, currentDay: 0, joined: false, participants: 1245 },
  { id: "2", title: "10K Steps Daily", description: "Walk at least 10,000 steps every day for 21 days", duration: "21 days", category: "Fitness", totalDays: 21, currentDay: 0, joined: false, participants: 3421 },
  { id: "3", title: "Meditation Streak", description: "Meditate for at least 10 minutes daily for 14 days", duration: "14 days", category: "Mental Health", totalDays: 14, currentDay: 0, joined: false, participants: 2156 },
  { id: "4", title: "Sugar-Free Week", description: "Avoid added sugars for 7 days straight", duration: "7 days", category: "Nutrition", totalDays: 7, currentDay: 0, joined: false, participants: 892 },
  { id: "5", title: "Early Bird Challenge", description: "Wake up before 6 AM for 14 days", duration: "14 days", category: "Sleep", totalDays: 14, currentDay: 0, joined: false, participants: 1567 },
  { id: "6", title: "Stretching Routine", description: "Complete a 15-min stretch routine daily for 21 days", duration: "21 days", category: "Fitness", totalDays: 21, currentDay: 0, joined: false, participants: 2089 },
];

const HealthChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem("health-challenges");
    return saved ? JSON.parse(saved) : initialChallenges;
  });

  const save = (updated: Challenge[]) => { setChallenges(updated); localStorage.setItem("health-challenges", JSON.stringify(updated)); };

  const joinChallenge = (id: string) => {
    save(challenges.map(c => c.id === id ? { ...c, joined: true, currentDay: 1, participants: c.participants + 1 } : c));
    toast.success("Challenge joined! 🎉 Day 1 starts now!");
  };

  const logDay = (id: string) => {
    save(challenges.map(c => {
      if (c.id !== id) return c;
      const newDay = Math.min(c.currentDay + 1, c.totalDays);
      if (newDay === c.totalDays) toast.success("🏆 Challenge completed! Congratulations!");
      else toast.success(`Day ${newDay} completed! Keep going! 💪`);
      return { ...c, currentDay: newDay };
    }));
  };

  const active = challenges.filter(c => c.joined && c.currentDay < c.totalDays);
  const completed = challenges.filter(c => c.joined && c.currentDay >= c.totalDays);
  const available = challenges.filter(c => !c.joined);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Trophy className="w-6 h-6 text-primary" /></div>
            <div>
              <h1 className="text-3xl font-bold">Health <span className="text-gradient">Challenges</span></h1>
              <p className="text-muted-foreground">Join challenges and build healthy habits</p>
            </div>
          </div>

          {/* Active Challenges */}
          {active.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2"><Flame className="w-5 h-5 text-primary" /> Active Challenges</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {active.map(c => (
                  <Card key={c.id} className="border-primary/30">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{c.title}</h3>
                        <Badge>{c.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground font-medium">Day {c.currentDay}/{c.totalDays}</span>
                        <span className="text-sm text-muted-foreground">{Math.round((c.currentDay / c.totalDays) * 100)}%</span>
                      </div>
                      <Progress value={(c.currentDay / c.totalDays) * 100} className="mb-3" />
                      <Button onClick={() => logDay(c.id)} className="w-full" size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" /> Log Today's Progress
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-primary" /> Completed ({completed.length})</h2>
              <div className="grid md:grid-cols-3 gap-3">
                {completed.map(c => (
                  <Card key={c.id} className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4 text-center">
                      <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="font-semibold text-foreground text-sm">{c.title}</p>
                      <Badge variant="secondary" className="mt-1">Completed ✓</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Available */}
          <h2 className="text-xl font-semibold text-foreground mb-4">Available Challenges</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {available.map(c => (
              <Card key={c.id}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{c.title}</h3>
                    <Badge variant="secondary">{c.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.duration}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.participants.toLocaleString()}</span>
                    </div>
                    <Button size="sm" onClick={() => joinChallenge(c.id)}>Join</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default HealthChallenges;
