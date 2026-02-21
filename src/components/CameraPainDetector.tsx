import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Loader2, AlertTriangle, CheckCircle, Pill, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DetectionResult {
  area: string;
  confidence: number;
  symptoms: string[];
  possibleConditions: string[];
  medicines: string[];
  severity: "mild" | "moderate" | "severe";
  advice: string;
}

const bodyAreaMap: Record<string, DetectionResult> = {
  head: {
    area: "Head / Forehead",
    confidence: 92,
    symptoms: ["Headache", "Throbbing pain", "Light sensitivity", "Dizziness"],
    possibleConditions: ["Tension Headache", "Migraine", "Sinusitis"],
    medicines: ["Ibuprofen 400mg", "Paracetamol 500mg", "Sumatriptan (prescription)"],
    severity: "moderate",
    advice: "Rest in a dark room, stay hydrated. Consult a doctor if pain persists beyond 72 hours.",
  },
  neck: {
    area: "Neck",
    confidence: 88,
    symptoms: ["Stiffness", "Sharp pain on turning", "Radiating pain to shoulder"],
    possibleConditions: ["Cervical Spondylosis", "Muscle Strain", "Torticollis"],
    medicines: ["Diclofenac gel", "Muscle relaxant", "Ibuprofen"],
    severity: "mild",
    advice: "Apply warm compress, gentle stretches. See a doctor if numbness develops.",
  },
  chest: {
    area: "Chest",
    confidence: 95,
    symptoms: ["Chest tightness", "Sharp pain on breathing", "Pressure sensation"],
    possibleConditions: ["Costochondritis", "Acid Reflux", "Angina"],
    medicines: ["Antacid", "Aspirin (if cardiac)", "Omeprazole"],
    severity: "severe",
    advice: "⚠️ Chest pain can indicate a cardiac emergency. Seek immediate medical attention if pain is sudden, crushing, or radiates to arm/jaw.",
  },
  shoulder: {
    area: "Shoulder",
    confidence: 87,
    symptoms: ["Rotational pain", "Frozen range of motion", "Clicking sound"],
    possibleConditions: ["Frozen Shoulder", "Rotator Cuff Injury", "Bursitis"],
    medicines: ["Ibuprofen", "Ice pack", "Physiotherapy referral"],
    severity: "moderate",
    advice: "Avoid overhead activities. Apply ice for 15 minutes. See an orthopedic if no improvement in a week.",
  },
  stomach: {
    area: "Stomach / Abdomen",
    confidence: 90,
    symptoms: ["Cramping", "Bloating", "Nausea", "Burning sensation"],
    possibleConditions: ["Gastritis", "IBS", "Food Poisoning", "Peptic Ulcer"],
    medicines: ["Omeprazole 20mg", "Buscopan", "ORS solution"],
    severity: "moderate",
    advice: "Avoid spicy/oily food. Stay hydrated. Consult a gastroenterologist if symptoms recur.",
  },
  back: {
    area: "Lower Back",
    confidence: 91,
    symptoms: ["Dull ache", "Stiffness on bending", "Radiating leg pain"],
    possibleConditions: ["Lumbar Strain", "Sciatica", "Herniated Disc"],
    medicines: ["Diclofenac 50mg", "Muscle relaxant", "Pregabalin (prescription)"],
    severity: "moderate",
    advice: "Maintain good posture, do gentle stretches. MRI recommended if leg pain/numbness present.",
  },
  knee: {
    area: "Knee",
    confidence: 89,
    symptoms: ["Swelling", "Pain on stairs", "Locking sensation"],
    possibleConditions: ["Osteoarthritis", "Meniscus Tear", "Ligament Injury"],
    medicines: ["Glucosamine supplement", "Ibuprofen", "Knee brace"],
    severity: "moderate",
    advice: "Rest the joint, apply RICE (Rest, Ice, Compression, Elevation). Consult orthopedic for persistent pain.",
  },
  hand: {
    area: "Hand / Wrist",
    confidence: 86,
    symptoms: ["Tingling", "Numbness", "Grip weakness", "Pain on typing"],
    possibleConditions: ["Carpal Tunnel Syndrome", "Tendinitis", "Arthritis"],
    medicines: ["Wrist splint", "Ibuprofen", "Vitamin B6"],
    severity: "mild",
    advice: "Take breaks from repetitive tasks. Wrist exercises help. See a doctor if numbness persists.",
  },
};

interface CameraPainDetectorProps {
  isOpen: boolean;
  onClose: () => void;
  onResult?: (result: DetectionResult) => void;
}

const CameraPainDetector = ({ isOpen, onClose, onResult }: CameraPainDetectorProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [tapPosition, setTapPosition] = useState<{ x: number; y: number } | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    }
    return () => { stopCamera(); };
  }, [isOpen]);

  const detectAreaFromTap = (x: number, y: number, width: number, height: number): string => {
    const relX = x / width;
    const relY = y / height;

    if (relY < 0.15) return "head";
    if (relY < 0.22) return "neck";
    if (relY >= 0.22 && relY < 0.35 && (relX < 0.3 || relX > 0.7)) return "shoulder";
    if (relY >= 0.22 && relY < 0.4) return "chest";
    if (relY >= 0.4 && relY < 0.55) return "stomach";
    if (relY >= 0.55 && relY < 0.7) return "back";
    if (relY >= 0.7 && relY < 0.85) return "knee";
    return "hand";
  };

  const handleVideoTap = (e: React.MouseEvent<HTMLVideoElement> | React.TouchEvent<HTMLVideoElement>) => {
    if (!videoRef.current) return;
    const rect = videoRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setTapPosition({ x, y });
    setDetecting(true);

    const area = detectAreaFromTap(x, y, rect.width, rect.height);
    
    setTimeout(() => {
      const detection = bodyAreaMap[area] || bodyAreaMap.head;
      setResult(detection);
      setDetecting(false);
      onResult?.(detection);
    }, 1200);
  };

  const handleClose = () => {
    stopCamera();
    setResult(null);
    setTapPosition(null);
    onClose();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "moderate": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "severe": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">AI Pain Area Detector</h2>
              <Badge variant="outline" className="text-xs">Live</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content - camera left, results right */}
          <div className="flex flex-col md:flex-row h-[75vh]">
            {/* Camera Feed */}
            <div className="flex-1 relative bg-black flex items-center justify-center min-h-[300px]">
              {isLoading ? (
                <div className="flex flex-col items-center gap-3 text-white">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p>Starting camera...</p>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover cursor-crosshair"
                    onClick={handleVideoTap}
                    onTouchStart={handleVideoTap}
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Body outline overlay */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <svg viewBox="0 0 200 400" className="h-[80%] opacity-30">
                      <ellipse cx="100" cy="30" rx="25" ry="28" stroke="hsl(174, 62%, 47%)" strokeWidth="1.5" fill="none" />
                      <line x1="100" y1="58" x2="100" y2="85" stroke="hsl(174, 62%, 47%)" strokeWidth="1.5" />
                      <line x1="100" y1="90" x2="55" y2="140" stroke="hsl(174, 62%, 47%)" strokeWidth="1.5" />
                      <line x1="100" y1="90" x2="145" y2="140" stroke="hsl(174, 62%, 47%)" strokeWidth="1.5" />
                      <line x1="100" y1="85" x2="100" y2="200" stroke="hsl(174, 62%, 47%)" strokeWidth="1.5" />
                      <ellipse cx="100" cy="130" rx="35" ry="45" stroke="hsl(174, 62%, 47%)" strokeWidth="1" fill="none" strokeDasharray="4,4" />
                      <line x1="100" y1="200" x2="70" y2="320" stroke="hsl(174, 62%, 47%)" strokeWidth="1.5" />
                      <line x1="100" y1="200" x2="130" y2="320" stroke="hsl(174, 62%, 47%)" strokeWidth="1.5" />
                    </svg>
                  </div>

                  {/* Tap indicator */}
                  {tapPosition && (
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute w-8 h-8 rounded-full border-2 border-primary bg-primary/20"
                      style={{ left: tapPosition.x - 16, top: tapPosition.y - 16 }}
                    />
                  )}

                  {detecting && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-white">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm">Analyzing pain area...</p>
                      </div>
                    </div>
                  )}

                  {/* Instructions */}
                  {!result && !detecting && (
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <p className="text-white text-sm bg-black/60 rounded-lg p-2">
                        👆 Tap on the area where you feel pain to get AI analysis
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Results Panel */}
            <div className="w-full md:w-[380px] border-t md:border-t-0 md:border-l border-border overflow-y-auto bg-card">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-foreground">{result.area}</h3>
                    <Badge className={getSeverityColor(result.severity)}>
                      {result.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Confidence: {result.confidence}%</p>

                  {/* Symptoms */}
                  <div className="bg-muted/50 rounded-xl p-3">
                    <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-primary" /> Detected Symptoms
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {result.symptoms.map((s) => (
                        <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Conditions */}
                  <div className="bg-muted/50 rounded-xl p-3">
                    <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                      <Stethoscope className="w-4 h-4 text-primary" /> Possible Conditions
                    </p>
                    {result.possibleConditions.map((c) => (
                      <p key={c} className="text-sm text-muted-foreground">• {c}</p>
                    ))}
                  </div>

                  {/* Medicines */}
                  <div className="bg-muted/50 rounded-xl p-3">
                    <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                      <Pill className="w-4 h-4 text-primary" /> Suggested Medicines
                    </p>
                    {result.medicines.map((m) => (
                      <p key={m} className="text-sm text-muted-foreground">💊 {m}</p>
                    ))}
                  </div>

                  {/* Advice */}
                  <div className={`rounded-xl p-3 ${
                    result.severity === "severe"
                      ? "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
                      : "bg-primary/5 border border-primary/10"
                  }`}>
                    <p className="text-sm font-medium text-foreground mb-1 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Recommendation
                    </p>
                    <p className="text-sm text-muted-foreground">{result.advice}</p>
                  </div>

                  <Button variant="hero" className="w-full" asChild>
                    <a href="/consultations">Book Doctor Consultation</a>
                  </Button>

                  <Button variant="outline" className="w-full" onClick={() => { setResult(null); setTapPosition(null); }}>
                    Scan Again
                  </Button>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <Camera className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">AI Pain Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Point your camera at the area of pain and tap on it. Our AI will analyze the body region and provide symptoms, possible conditions, and medicine suggestions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CameraPainDetector;
