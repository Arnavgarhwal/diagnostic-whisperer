import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  "What are symptoms of diabetes?",
  "How to lower blood pressure?",
  "Tips for better sleep",
  "When should I see a doctor?",
];

const aiResponses: Record<string, string> = {
  "diabetes": "Common symptoms of diabetes include:\n\n• Increased thirst and frequent urination\n• Unexplained weight loss\n• Fatigue and weakness\n• Blurred vision\n• Slow-healing sores\n• Frequent infections\n\n⚠️ If you're experiencing these symptoms, please consult a healthcare provider for proper diagnosis and treatment.",
  
  "blood pressure": "Here are effective ways to lower blood pressure naturally:\n\n• **Exercise regularly** - Aim for 30 minutes of moderate activity daily\n• **Reduce sodium intake** - Limit to less than 2,300mg per day\n• **Eat a healthy diet** - DASH diet is recommended\n• **Maintain healthy weight** - Losing even 5-10 lbs can help\n• **Limit alcohol** - No more than 1-2 drinks per day\n• **Manage stress** - Try meditation or yoga\n• **Get quality sleep** - 7-8 hours nightly\n\n💊 Always follow your doctor's medication advice.",
  
  "sleep": "Tips for better sleep:\n\n• **Stick to a schedule** - Same bedtime and wake time daily\n• **Create a restful environment** - Cool, dark, and quiet\n• **Limit screen time** - No devices 1 hour before bed\n• **Watch your diet** - Avoid caffeine and heavy meals late\n• **Exercise regularly** - But not too close to bedtime\n• **Manage worries** - Journal or practice relaxation\n• **Limit naps** - Keep them under 30 minutes\n\n🌙 Good sleep is essential for overall health!",
  
  "doctor": "You should see a doctor if you experience:\n\n🚨 **Emergency Signs:**\n• Chest pain or difficulty breathing\n• Sudden severe headache\n• Signs of stroke (face drooping, arm weakness, speech difficulty)\n• High fever (above 103°F)\n• Severe abdominal pain\n\n⚠️ **Schedule an Appointment For:**\n• Symptoms lasting more than a week\n• Unexplained weight changes\n• Persistent fatigue\n• New or changing moles\n• Blood in urine or stool\n\n✅ Regular check-ups are also important for preventive care!",
  
  "headache": "Common causes and remedies for headaches:\n\n**Types:**\n• Tension headaches - Most common\n• Migraines - Often with nausea, light sensitivity\n• Cluster headaches - Severe, around one eye\n\n**Home Remedies:**\n• Rest in a dark, quiet room\n• Apply cold or warm compress\n• Stay hydrated\n• Practice relaxation techniques\n• Over-the-counter pain relievers\n\n⚠️ See a doctor if headaches are severe, frequent, or accompanied by fever, vision changes, or confusion.",
  
  "cold": "Managing common cold symptoms:\n\n**Self-Care:**\n• Rest and get plenty of sleep\n• Stay hydrated - water, warm liquids, soup\n• Gargle with salt water for sore throat\n• Use saline nasal drops for congestion\n• Honey for cough (not for children under 1)\n\n**OTC Options:**\n• Pain relievers for fever/aches\n• Decongestants for stuffiness\n• Cough suppressants\n\n⏱️ Most colds resolve in 7-10 days. See a doctor if symptoms worsen or last longer.",
  
  "anxiety": "Managing anxiety effectively:\n\n**Immediate Relief:**\n• Deep breathing exercises (4-7-8 technique)\n• Grounding techniques (5-4-3-2-1 senses)\n• Progressive muscle relaxation\n\n**Long-term Strategies:**\n• Regular exercise\n• Adequate sleep\n• Limit caffeine and alcohol\n• Practice mindfulness/meditation\n• Connect with supportive people\n• Consider therapy (CBT is very effective)\n\n💚 Anxiety is treatable. Don't hesitate to seek professional help if it's affecting your daily life.",
  
  "weight": "Healthy weight management tips:\n\n**Nutrition:**\n• Eat more whole foods, vegetables, lean proteins\n• Control portion sizes\n• Limit processed foods and added sugars\n• Stay hydrated\n\n**Exercise:**\n• Aim for 150 minutes of moderate activity weekly\n• Include strength training 2x per week\n• Find activities you enjoy\n\n**Lifestyle:**\n• Get 7-9 hours of sleep\n• Manage stress\n• Track your progress\n• Set realistic goals\n\n📊 Use the BMI Calculator to check your current status!",
};

const getAIResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  for (const [keyword, response] of Object.entries(aiResponses)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }
  
  return `Thank you for your question! 

I understand you're asking about "${message}". While I can provide general health information, here are some suggestions:

1. **Browse our Disease Library** - Search for specific conditions
2. **Use the Symptom Analyzer** - Get AI-powered symptom analysis
3. **Book a Consultation** - Connect with qualified doctors
4. **Check Nearby Hospitals** - Find healthcare facilities near you

💡 For personalized medical advice, please consult with a healthcare professional.

Is there anything specific about your health I can help with?`;
};

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! 👋 I'm WellSync AI Assistant. I can help you with:\n\n• Health information & tips\n• Symptom guidance\n• Finding nearby hospitals\n• Understanding medications\n\nHow can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getAIResponse(userMessage.content),
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiResponse]);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-health-teal-dark hover:shadow-xl"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? "auto" : "600px"
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] bg-background rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-health-teal-dark text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">WellSync AI</h3>
                  <p className="text-xs opacity-80">Health Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-white/20"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.role === "assistant" 
                            ? "bg-gradient-to-r from-primary to-health-teal-dark text-white" 
                            : "bg-muted"
                        }`}>
                          {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div className={`max-w-[80%] rounded-2xl p-3 ${
                          msg.role === "user" 
                            ? "bg-primary text-primary-foreground rounded-tr-sm" 
                            : "bg-muted rounded-tl-sm"
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${
                            msg.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-health-teal-dark text-white flex items-center justify-center">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-muted rounded-2xl rounded-tl-sm p-3">
                          <div className="flex items-center gap-1">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Quick Questions */}
                {messages.length <= 2 && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickQuestion(q)}
                          className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Ask me anything about health..."
                      className="flex-1"
                    />
                    <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center mt-2">
                    AI assistant provides general info only. Consult a doctor for medical advice.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatAssistant;
