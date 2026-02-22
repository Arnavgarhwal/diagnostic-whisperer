import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, Loader2, AlertTriangle, CheckCircle, Pill, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface SkinResult {
  condition: string;
  confidence: number;
  severity: "mild" | "moderate" | "severe";
  description: string;
  remedies: string[];
  shouldSeeDoctor: boolean;
}

const skinConditions: Record<string, SkinResult> = {
  acne: { condition: "Acne Vulgaris", confidence: 89, severity: "mild", description: "Common skin condition caused by clogged pores. Usually affects face, chest, and back.", remedies: ["Benzoyl peroxide 2.5%", "Salicylic acid cleanser", "Retinoid cream (prescription)", "Tea tree oil (topical)"], shouldSeeDoctor: false },
  eczema: { condition: "Atopic Dermatitis (Eczema)", confidence: 85, severity: "moderate", description: "Chronic inflammatory skin condition causing dry, itchy patches. Often linked to allergies.", remedies: ["Hydrocortisone 1% cream", "Moisturizer (ceramide-based)", "Antihistamine (oral)", "Colloidal oatmeal bath"], shouldSeeDoctor: true },
  psoriasis: { condition: "Psoriasis", confidence: 82, severity: "moderate", description: "Autoimmune condition causing thick, scaly patches. Can appear anywhere on the body.", remedies: ["Topical corticosteroids", "Vitamin D analogues", "Coal tar shampoo", "UV light therapy"], shouldSeeDoctor: true },
  rash: { condition: "Contact Dermatitis", confidence: 78, severity: "mild", description: "Skin reaction from contact with an irritant or allergen. Usually resolves on its own.", remedies: ["Calamine lotion", "Hydrocortisone cream", "Cool compress", "Oral antihistamine"], shouldSeeDoctor: false },
  sunburn: { condition: "Solar Erythema (Sunburn)", confidence: 94, severity: "mild", description: "Skin damage from UV radiation. Redness, pain, and peeling are common symptoms.", remedies: ["Aloe vera gel", "Cool compress", "Ibuprofen for pain", "Stay hydrated"], shouldSeeDoctor: false },
  mole: { condition: "Melanocytic Nevus (Mole)", confidence: 75, severity: "moderate", description: "Pigmented growth on the skin. Most are harmless but some can be pre-cancerous. Monitor for ABCDE signs.", remedies: ["Monitor for changes", "Use sunscreen SPF 50+", "Photograph for comparison", "Annual dermatologist check"], shouldSeeDoctor: true },
};

const SkinAnalyzer = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<SkinResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      analyzeImage();
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = () => {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const conditions = Object.values(skinConditions);
      const randomResult = conditions[Math.floor(Math.random() * conditions.length)];
      setResult(randomResult);
      setAnalyzing(false);
    }, 2500);
  };

  const handleQuickAnalyze = (type: string) => {
    setImagePreview(null);
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setResult(skinConditions[type] || skinConditions.acne);
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><ShieldCheck className="w-3 h-3 mr-1" />AI Dermatology</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">AI <span className="text-gradient">Skin</span> Analyzer</h1>
            <p className="text-muted-foreground">Upload a photo or describe your skin concern for AI analysis</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Camera className="w-5 h-5 text-primary" />Scan Your Skin</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Uploaded" className="w-full h-48 object-cover rounded-lg" />
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">Click to upload a photo of the affected area</p>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Or select a condition:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(skinConditions).map(k => (
                      <Button key={k} variant="outline" size="sm" onClick={() => handleQuickAnalyze(k)} className="capitalize">{k}</Button>
                    ))}
                  </div>
                </div>

                {analyzing && (
                  <div className="flex items-center justify-center gap-2 py-4"><Loader2 className="w-5 h-5 animate-spin text-primary" /><span className="text-sm text-muted-foreground">Analyzing skin condition...</span></div>
                )}
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader><CardTitle>Analysis Results</CardTitle></CardHeader>
              <CardContent>
                {result ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-foreground">{result.condition}</h3>
                      <Badge className={result.severity === "severe" ? "bg-destructive/10 text-destructive" : result.severity === "moderate" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}>
                        {result.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">AI Confidence: {result.confidence}%</p>
                    <p className="text-sm text-muted-foreground">{result.description}</p>

                    <div className="bg-muted/50 rounded-xl p-3">
                      <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1"><Pill className="w-4 h-4 text-primary" />Suggested Remedies</p>
                      {result.remedies.map(r => <p key={r} className="text-sm text-muted-foreground">💊 {r}</p>)}
                    </div>

                    <div className={`flex items-center gap-2 p-3 rounded-xl ${result.shouldSeeDoctor ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400" : "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"}`}>
                      {result.shouldSeeDoctor ? (<><AlertTriangle className="w-5 h-5" /><span className="text-sm font-medium">Consult a dermatologist</span></>) : (<><CheckCircle className="w-5 h-5" /><span className="text-sm font-medium">Can be managed at home</span></>)}
                    </div>

                    <Button variant="hero" className="w-full" asChild><a href="/consultations">Book Dermatologist</a></Button>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                    <Camera className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <p className="text-sm text-muted-foreground">Upload or select a skin condition to see AI analysis results here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">⚠️ AI skin analysis is for informational purposes only. Always consult a dermatologist for accurate diagnosis.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SkinAnalyzer;
