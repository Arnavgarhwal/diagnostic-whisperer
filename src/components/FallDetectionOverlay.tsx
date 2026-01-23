import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Phone, MapPin, MessageSquare, Users, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmergencyContact } from "@/hooks/useEmergencySettings";

interface FallDetectionOverlayProps {
  isVisible: boolean;
  countdown: number;
  location: { lat: number; lng: number } | null;
  onDismiss: () => void;
  contacts: EmergencyContact[];
  onManualAlert: () => void;
}

const FallDetectionOverlay = ({
  isVisible,
  countdown,
  location,
  onDismiss,
  contacts,
  onManualAlert,
}: FallDetectionOverlayProps) => {
  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'sms': return 'SMS';
      case 'whatsapp': return 'WhatsApp';
      case 'both': return 'SMS & WhatsApp';
      default: return method;
    }
  };

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
            className="bg-card border-2 border-destructive rounded-2xl p-6 max-w-md w-full text-center max-h-[90vh] overflow-y-auto"
          >
            {/* Warning Icon */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center"
            >
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </motion.div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Fall Detected!
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">
              Emergency alerts will be sent automatically when countdown ends.
            </p>

            {/* Countdown */}
            <motion.div
              key={countdown}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="w-28 h-28 mx-auto mb-4 rounded-full bg-destructive flex items-center justify-center"
            >
              <span className="text-4xl font-bold text-white">{countdown}</span>
            </motion.div>

            <p className="text-xs text-muted-foreground mb-4">
              seconds until emergency alerts are sent
            </p>

            {/* Emergency Contacts Preview */}
            <div className="bg-muted/50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-foreground mb-2">
                <Users className="w-4 h-4" />
                <span>Alerting {contacts.length} Contact{contacts.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="space-y-1">
                {contacts.slice(0, 3).map((contact, index) => (
                  <div key={index} className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <span className="font-medium">{contact.name}</span>
                    <span>({contact.phone})</span>
                    <span className="text-primary">via {getMethodLabel(contact.preferredMethod)}</span>
                  </div>
                ))}
                {contacts.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{contacts.length - 3} more
                  </div>
                )}
              </div>
            </div>

            {/* Location Info */}
            {location && (
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-4 bg-muted/30 rounded-lg p-2">
                <MapPin className="w-3 h-3" />
                <span>
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={onDismiss}
                variant="outline"
                size="lg"
                className="w-full h-12 text-base border-2"
              >
                <X className="w-4 h-4 mr-2" />
                I'm OK - Cancel Alert
              </Button>
              
              <Button
                onClick={onManualAlert}
                variant="default"
                size="lg"
                className="w-full h-12 text-base bg-primary"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Alerts Now
              </Button>
              
              <Button
                variant="destructive"
                size="lg"
                className="w-full h-12 text-base"
                onClick={() => {
                  window.location.href = 'tel:112';
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Emergency (112)
              </Button>

              <Link to="/emergency-settings" onClick={onDismiss}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2"
                >
                  <Settings className="w-3 h-3 mr-2" />
                  Configure Contacts
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground mt-3">
              Location will be shared with emergency contacts
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FallDetectionOverlay;
