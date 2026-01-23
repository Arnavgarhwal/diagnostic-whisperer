import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FallDetectionOverlayProps {
  isVisible: boolean;
  countdown: number;
  location: { lat: number; lng: number } | null;
  onDismiss: () => void;
}

const FallDetectionOverlay = ({
  isVisible,
  countdown,
  location,
  onDismiss,
}: FallDetectionOverlayProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-card border-2 border-destructive rounded-2xl p-8 max-w-md w-full text-center"
          >
            {/* Warning Icon */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center"
            >
              <AlertTriangle className="w-12 h-12 text-destructive" />
            </motion.div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Fall Detected!
            </h2>
            <p className="text-muted-foreground mb-6">
              We detected a sudden fall. Emergency services will be contacted automatically.
            </p>

            {/* Countdown */}
            <motion.div
              key={countdown}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="w-32 h-32 mx-auto mb-6 rounded-full bg-destructive flex items-center justify-center"
            >
              <span className="text-5xl font-bold text-white">{countdown}</span>
            </motion.div>

            <p className="text-sm text-muted-foreground mb-6">
              seconds until emergency call
            </p>

            {/* Location Info */}
            {location && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6 bg-muted/50 rounded-lg p-3">
                <MapPin className="w-4 h-4" />
                <span>
                  Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={onDismiss}
                variant="outline"
                size="lg"
                className="w-full h-14 text-lg border-2"
              >
                <X className="w-5 h-5 mr-2" />
                Fall by Mistake - I'm OK
              </Button>
              
              <Button
                variant="destructive"
                size="lg"
                className="w-full h-14 text-lg"
                onClick={() => {
                  window.location.href = 'tel:112';
                }}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Emergency Now
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Your location will be shared with emergency services
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FallDetectionOverlay;
