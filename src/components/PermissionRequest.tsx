import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, MapPin, Activity, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PermissionRequestProps {
  onComplete: () => void;
}

const PermissionRequest = ({ onComplete }: PermissionRequestProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [permissions, setPermissions] = useState({
    motion: false,
    location: false,
  });
  const [requesting, setRequesting] = useState<string | null>(null);

  useEffect(() => {
    // Check if we've already asked for permissions
    const permissionsGranted = localStorage.getItem("health-app-permissions-granted");
    if (permissionsGranted) {
      onComplete();
      return;
    }
    
    // Show permission dialog after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  const requestMotionPermission = async () => {
    setRequesting("motion");
    
    try {
      // For iOS 13+
      if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission === "granted") {
          setPermissions(prev => ({ ...prev, motion: true }));
          toast.success("Motion detection enabled!");
        } else {
          toast.error("Motion permission denied. Fall detection won't work.");
        }
      } else {
        // For non-iOS devices, motion is usually auto-granted
        setPermissions(prev => ({ ...prev, motion: true }));
        toast.success("Motion detection enabled!");
      }
    } catch (error) {
      console.error("Motion permission error:", error);
      // Fallback - assume permission for non-supporting browsers
      setPermissions(prev => ({ ...prev, motion: true }));
    }
    
    setRequesting(null);
  };

  const requestLocationPermission = async () => {
    setRequesting("location");
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });
      
      if (position) {
        setPermissions(prev => ({ ...prev, location: true }));
        toast.success("Location access enabled!");
      }
    } catch (error: any) {
      console.error("Location permission error:", error);
      if (error.code === 1) {
        toast.error("Location permission denied. Emergency alerts won't include your location.");
      } else {
        toast.error("Could not get location. Please try again.");
      }
    }
    
    setRequesting(null);
  };

  const handleComplete = () => {
    // Save that we've asked for permissions
    localStorage.setItem("health-app-permissions-granted", "true");
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem("health-app-permissions-granted", "skipped");
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card border rounded-2xl p-6 max-w-md w-full"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Enable Safety Features
            </h2>
            <p className="text-muted-foreground text-sm">
              Allow these permissions for fall detection and emergency alerts to work properly.
            </p>
          </div>

          {/* Permission Items */}
          <div className="space-y-4 mb-6">
            {/* Motion Permission */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Motion Detection</p>
                  <p className="text-xs text-muted-foreground">Detect falls & sudden movements</p>
                </div>
              </div>
              {permissions.motion ? (
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={requestMotionPermission}
                  disabled={requesting === "motion"}
                >
                  {requesting === "motion" ? "..." : "Allow"}
                </Button>
              )}
            </div>

            {/* Location Permission */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Location Access</p>
                  <p className="text-xs text-muted-foreground">Share location in emergencies</p>
                </div>
              </div>
              {permissions.location ? (
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={requestLocationPermission}
                  disabled={requesting === "location"}
                >
                  {requesting === "location" ? "..." : "Allow"}
                </Button>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-6">
            <p className="text-xs text-foreground">
              <strong>Why is this important?</strong> In case of a medical emergency like a heart attack or fall, 
              the app can automatically alert your emergency contacts with your location — even if you can't press any buttons.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={handleComplete}
              className="w-full"
              disabled={!permissions.motion && !permissions.location}
            >
              Continue
            </Button>
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="w-full text-muted-foreground"
            >
              Skip for now
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PermissionRequest;