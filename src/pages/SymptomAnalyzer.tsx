import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, AlertTriangle, CheckCircle, Activity, RefreshCw, Mic, MicOff, AlertCircle, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { commonSymptoms } from "@/data/symptoms";
import SkullModel3D from "@/components/SkullModel3D";
import HeartModel3D from "@/components/HeartModel3D";
import AbdomenModel3D from "@/components/AbdomenModel3D";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { toast } from "@/hooks/use-toast";
import CameraPainDetector from "@/components/CameraPainDetector";
import { supabase } from "@/integrations/supabase/client";

interface Analysis {
  detectedSymptoms?: string[];
  condition: string;
  severity: string;
  advice: string;
  shouldSeeDoctor: boolean;
  followUpQuestions?: string[];
}

interface Message {
  id: number;
  type: "user" | "bot";
  content: string;
  analysis?: Analysis;
}

// Use first 12 common symptoms for quick buttons
const quickSymptoms = commonSymptoms.slice(0, 12);

const SymptomAnalyzer = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your AI Health Assistant. Please describe your symptoms in detail, and I'll help analyze them. Remember, this is for informational purposes only and not a substitute for professional medical advice."
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSkullModel, setShowSkullModel] = useState(false);
  const [showHeartModel, setShowHeartModel] = useState(false);
  const [showAbdomenModel, setShowAbdomenModel] = useState(false);
  const [showCameraDetector, setShowCameraDetector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice input hook
  const { 
    isListening, 
    transcript, 
    isSupported: voiceSupported, 
    startListening, 
    stopListening,
    resetTranscript 
  } = useVoiceInput();

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeSymptoms = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Check for matching symptoms
    for (const [symptom, response] of Object.entries(symptomResponses)) {
      if (lowerText.includes(symptom)) {
        return response;
      }
    }

    // Default response for unrecognized symptoms
    return {
      condition: "Unable to determine specific condition",
      severity: "Unknown",
      advice: "Based on your description, I couldn't identify specific symptoms. Please try describing your symptoms more specifically, such as: location of discomfort, duration, intensity (mild/moderate/severe), and any accompanying symptoms. For accurate diagnosis, please consult a healthcare professional.",
      shouldSeeDoctor: true
    };
  };

  const handleSend = (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim()) return;

    // Stop listening if voice was active
    if (isListening) {
      stopListening();
    }
    resetTranscript();

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: textToSend
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const analysis = analyzeSymptoms(textToSend);
      const botMessage: Message = {
        id: messages.length + 2,
        type: "bot",
        content: `Based on your symptoms, here's my analysis:`,
        analysis
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickSymptom = (symptom: string) => {
    const lowerSymptom = symptom.toLowerCase();
    
    // Show 3D models for specific symptoms
    if (lowerSymptom === "headache") {
      setShowSkullModel(true);
    } else if (lowerSymptom === "chest pain") {
      setShowHeartModel(true);
    } else if (lowerSymptom === "stomach pain" || lowerSymptom === "abdominal pain" || lowerSymptom === "nausea") {
      setShowAbdomenModel(true);
    } else {
      setInput(`I'm experiencing ${symptom.toLowerCase()}`);
    }
  };

  const handleSkullLocationSelect = (location: string, description: string) => {
    const message = `I'm experiencing a headache in the ${location.toLowerCase()}. ${description}`;
    handleSend(message);
  };

  const handleHeartLocationSelect = (location: string, description: string) => {
    const message = `I'm experiencing chest pain in the ${location.toLowerCase()}. ${description}`;
    handleSend(message);
  };

  const handleAbdomenLocationSelect = (location: string, description: string) => {
    const message = `I'm experiencing stomach/abdominal pain in the ${location.toLowerCase()}. ${description}`;
    handleSend(message);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleReset = () => {
    setMessages([{
      id: 1,
      type: "bot",
      content: "Hello! I'm your AI Health Assistant. Please describe your symptoms in detail, and I'll help analyze them. Remember, this is for informational purposes only and not a substitute for professional medical advice."
    }]);
    resetTranscript();
    setInput("");
  };


  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-8">
        <div className="container mx-auto px-4 h-full flex flex-col max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Activity className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              AI <span className="text-gradient">Symptom</span> Analyzer
            </h1>
            <p className="text-muted-foreground">
              Describe your symptoms for an AI-powered preliminary assessment
            </p>
            
          </motion.div>

          {/* Quick Symptoms */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {quickSymptoms.map(symptom => (
              <Button
                key={symptom}
                variant="outline"
                size="sm"
                onClick={() => handleQuickSymptom(symptom)}
                className="hover:bg-primary/10 hover:border-primary"
              >
                {symptom}
              </Button>
            ))}
          </div>

          {/* Chat Container */}
          <div className="flex-1 bg-card border border-border rounded-2xl flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.type === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-gradient-to-br from-primary to-health-teal-dark text-white"
                      }`}>
                        {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      
                      <div className={`rounded-2xl p-4 ${
                        message.type === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-accent"
                      }`}>
                        <p>{message.content}</p>
                        
                        {message.analysis && (
                          <div className="mt-4 space-y-3">
                            <div className="p-3 rounded-xl bg-background/50">
                              <p className="text-sm text-muted-foreground mb-1">Possible Condition</p>
                              <p className="font-semibold text-foreground">{message.analysis.condition}</p>
                            </div>
                            
                            <div className="p-3 rounded-xl bg-background/50">
                              <p className="text-sm text-muted-foreground mb-1">Severity Level</p>
                              <Badge variant={
                                message.analysis.severity === "High" ? "destructive" :
                                message.analysis.severity.includes("Moderate") ? "default" : "secondary"
                              }>
                                {message.analysis.severity}
                              </Badge>
                            </div>
                            
                            <div className="p-3 rounded-xl bg-background/50">
                              <p className="text-sm text-muted-foreground mb-1">Recommendation</p>
                              <p className="text-sm text-foreground">{message.analysis.advice}</p>
                            </div>
                            
                            <div className={`flex items-center gap-2 p-3 rounded-xl ${
                              message.analysis.shouldSeeDoctor 
                                ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400" 
                                : "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                            }`}>
                              {message.analysis.shouldSeeDoctor ? (
                                <>
                                  <AlertTriangle className="w-5 h-5" />
                                  <span className="text-sm font-medium">We recommend consulting a doctor</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-5 h-5" />
                                  <span className="text-sm font-medium">Self-care may be sufficient, but monitor symptoms</span>
                                </>
                              )}
                            </div>

                            <Button variant="hero" className="w-full mt-2" asChild>
                              <a href="/consultations">Book Doctor Consultation</a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-health-teal-dark flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-accent rounded-2xl p-4">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              {/* Voice indicator */}
              {isListening && (
                <div className="flex items-center justify-center gap-2 mb-3 text-sm text-primary animate-pulse">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  Listening... Speak your symptoms
                </div>
              )}
              
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleReset}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
                
                {/* Voice Input Button */}
                {voiceSupported && (
                  <Button 
                    variant={isListening ? "destructive" : "outline"} 
                    size="icon" 
                    onClick={handleVoiceToggle}
                    title={isListening ? "Stop listening" : "Start voice input"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                )}

                {/* Camera Pain Detector Button */}
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setShowCameraDetector(true)}
                  title="Use camera to detect pain area"
                >
                  <Camera className="w-4 h-4" />
                </Button>
                
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Listening..." : "Describe your symptoms..."}
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button variant="hero" onClick={() => handleSend()} disabled={!input.trim() || isTyping}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                ⚠️ This AI assistant provides general health information only and is not a substitute for professional medical advice.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* 3D Models for different symptoms */}
      <SkullModel3D 
        isOpen={showSkullModel}
        onClose={() => setShowSkullModel(false)}
        onSelectLocation={handleSkullLocationSelect}
      />
      
      <HeartModel3D
        isOpen={showHeartModel}
        onClose={() => setShowHeartModel(false)}
        onSelectLocation={handleHeartLocationSelect}
      />
      
      <AbdomenModel3D
        isOpen={showAbdomenModel}
        onClose={() => setShowAbdomenModel(false)}
        onSelectLocation={handleAbdomenLocationSelect}
      />

      <CameraPainDetector
        isOpen={showCameraDetector}
        onClose={() => setShowCameraDetector(false)}
        onResult={(result) => {
          handleSend(`I'm experiencing pain in my ${result.area}. Symptoms: ${result.symptoms.join(', ')}`);
          setShowCameraDetector(false);
        }}
      />

    </div>
  );
};

export default SymptomAnalyzer;
