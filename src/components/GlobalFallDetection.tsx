import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import useFallDetection from "@/hooks/useFallDetection";
import FallDetectionOverlay from "./FallDetectionOverlay";

const EMERGENCY_CONTACT = "9004682830";
const EMERGENCY_NAME = "Family Member";

const GlobalFallDetection = () => {
  const sendEmergencySMS = useCallback((location: { lat: number; lng: number } | null) => {
    const locationText = location 
      ? `Location: https://maps.google.com/?q=${location.lat},${location.lng}`
      : "Location unavailable";
    
    const message = encodeURIComponent(
      `🚨 EMERGENCY ALERT!\n\nFall detected! Immediate assistance may be required.\n\n${locationText}\n\nThis is an automated emergency message from the Health App.`
    );
    
    // Open native SMS app with pre-filled message
    const smsUri = `sms:${EMERGENCY_CONTACT}?body=${message}`;
    
    // Create a hidden link and click it to trigger SMS
    const link = document.createElement('a');
    link.href = smsUri;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Also try to call emergency services
    setTimeout(() => {
      window.location.href = 'tel:112';
    }, 1000);
    
    toast.error("Emergency SOS Triggered!", {
      description: `Opening SMS to ${EMERGENCY_NAME} (${EMERGENCY_CONTACT})`,
      duration: 10000,
    });
  }, []);

  const {
    isFallDetected,
    countdown,
    location,
    dismissFall,
    startMonitoring,
  } = useFallDetection(sendEmergencySMS);

  // Start monitoring on mount
  useEffect(() => {
    startMonitoring();
    
    toast.success("Fall Detection Active", {
      description: "Monitoring for falls. Emergency contact will be notified if a fall is detected.",
      duration: 3000,
    });
  }, [startMonitoring]);

  return (
    <FallDetectionOverlay
      isVisible={isFallDetected}
      countdown={countdown}
      location={location}
      onDismiss={dismissFall}
      emergencyContact={EMERGENCY_CONTACT}
      emergencyName={EMERGENCY_NAME}
    />
  );
};

export default GlobalFallDetection;
