import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, CheckCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const quizzes = [
  {
    title: "General Health Knowledge",
    questions: [
      { q: "What is the normal resting heart rate for adults?", options: ["40-60 bpm", "60-100 bpm", "100-120 bpm", "120-150 bpm"], correct: 1 },
      { q: "Which vitamin is produced when skin is exposed to sunlight?", options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"], correct: 3 },
      { q: "How many hours of sleep do adults need per night?", options: ["4-5 hours", "5-6 hours", "7-9 hours", "10-12 hours"], correct: 2 },
      { q: "What is considered normal blood pressure?", options: ["90/60 mmHg", "120/80 mmHg", "140/90 mmHg", "160/100 mmHg"], correct: 1 },
      { q: "Which organ filters blood in the body?", options: ["Heart", "Lungs", "Kidneys", "Liver"], correct: 2 },
    ],
  },
  {
    title: "Nutrition Basics",
    questions: [
      { q: "Which nutrient provides the most energy per gram?", options: ["Protein", "Carbohydrates", "Fat", "Fiber"], correct: 2 },
      { q: "How much water should you drink daily?", options: ["1-2 liters", "2-3 liters", "4-5 liters", "6+ liters"], correct: 1 },
      { q: "Which food is rich in Omega-3?", options: ["Chicken", "Salmon", "Rice", "Bread"], correct: 1 },
      { q: "What mineral strengthens bones?", options: ["Iron", "Zinc", "Calcium", "Potassium"], correct: 2 },
      { q: "Which vitamin helps blood clotting?", options: ["Vitamin A", "Vitamin C", "Vitamin E", "Vitamin K"], correct: 3 },
    ],
  },
  {
    title: "First Aid Essentials",
    questions: [
      { q: "What should you do first for a burn?", options: ["Apply butter", "Cool with water", "Apply ice directly", "Wrap tightly"], correct: 1 },
      { q: "CPR compression rate per minute?", options: ["60-80", "80-100", "100-120", "120-140"], correct: 2 },
      { q: "How to stop a nosebleed?", options: ["Tilt head back", "Pinch nose, lean forward", "Lay flat", "Apply heat"], correct: 1 },
      { q: "Signs of a stroke include:", options: ["Hiccups", "Facial drooping", "Sneezing", "Coughing"], correct: 1 },
      { q: "Heimlich maneuver is used for:", options: ["Heart attack", "Choking", "Drowning", "Bleeding"], correct: 1 },
    ],
  },
];

const HealthQuiz = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const quiz = selectedQuiz !== null ? quizzes[selectedQuiz] : null;

  const answer = (idx: number) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    if (quiz && currentQ < quiz.questions.length - 1) {
      setTimeout(() => setCurrentQ(c => c + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 300);
    }
  };

  const score = quiz ? answers.filter((a, i) => a === quiz.questions[i].correct).length : 0;

  const reset = () => { setSelectedQuiz(null); setCurrentQ(0); setAnswers([]); setShowResult(false); };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><HelpCircle className="w-6 h-6 text-primary" /></div>
            <div>
              <h1 className="text-3xl font-bold">Health <span className="text-gradient">Quiz</span></h1>
              <p className="text-muted-foreground">Test your health knowledge</p>
            </div>
          </div>

          {!quiz ? (
            <div className="grid gap-4">
              {quizzes.map((q, i) => (
                <Card key={i} className="cursor-pointer hover:shadow-md transition-all" onClick={() => setSelectedQuiz(i)}>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{q.title}</h3>
                      <p className="text-sm text-muted-foreground">{q.questions.length} questions</p>
                    </div>
                    <Badge variant="secondary">Start</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : showResult ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Complete!</h2>
                <p className="text-4xl font-bold text-primary mb-2">{score}/{quiz.questions.length}</p>
                <p className="text-muted-foreground mb-6">{score === quiz.questions.length ? "Perfect score! 🎉" : score >= quiz.questions.length / 2 ? "Great job! 👍" : "Keep learning! 📚"}</p>
                <div className="space-y-3 text-left mb-6">
                  {quiz.questions.map((q, i) => (
                    <div key={i} className={`p-3 rounded-lg ${answers[i] === q.correct ? "bg-green-500/10" : "bg-destructive/10"}`}>
                      <p className="text-sm font-medium text-foreground">{q.q}</p>
                      <p className="text-xs text-muted-foreground">Your answer: {q.options[answers[i]]} {answers[i] !== q.correct && `| Correct: ${q.options[q.correct]}`}</p>
                    </div>
                  ))}
                </div>
                <Button onClick={reset}><RotateCcw className="w-4 h-4 mr-2" /> Try Another Quiz</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle>{quiz.title}</CardTitle>
                  <span className="text-sm text-muted-foreground">{currentQ + 1}/{quiz.questions.length}</span>
                </div>
                <Progress value={((currentQ + 1) / quiz.questions.length) * 100} />
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium text-foreground mb-6">{quiz.questions[currentQ].q}</p>
                <div className="grid gap-3">
                  {quiz.questions[currentQ].options.map((opt, i) => (
                    <Button key={i} variant="outline" className="justify-start text-left h-auto py-3 px-4" onClick={() => answer(i)}>{opt}</Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default HealthQuiz;
