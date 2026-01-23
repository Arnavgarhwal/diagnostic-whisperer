import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import useFallDetection from "@/hooks/useFallDetection";
import FallDetectionOverlay from "./FallDetectionOverlay";
import { useEmergencySettings, EmergencyContact } from "@/hooks/useEmergencySettings";

const sendEmergencyAlerts = (
  contacts: EmergencyContact[],
  location: { lat: number; lng: number } | null
) => {
  const locationText = location 
    ? `Location: https://maps.google.com/?q=${location.lat},${location.lng}`
    : "Location unavailable";
  
  const message = `🚨 EMERGENCY ALERT!\n\nFall detected! Immediate assistance may be required.\n\n${locationText}\n\nThis is an automated emergency message from the Health App.`;
  const encodedMessage = encodeURIComponent(message);

  contacts.forEach((contact, index) => {
    const phone = contact.phone.replace(/\D/g, ''); // Remove non-digits
    
    // Small delay between opening multiple links
    setTimeout(() => {
      if (contact.preferredMethod === 'sms' || contact.preferredMethod === 'both') {
        // Open SMS
        const smsLink = document.createElement('a');
        smsLink.href = `sms:${phone}?body=${encodedMessage}`;
        smsLink.style.display = 'none';
        document.body.appendChild(smsLink);
        smsLink.click();
        document.body.removeChild(smsLink);
      }
      
      if (contact.preferredMethod === 'whatsapp' || contact.preferredMethod === 'both') {
        // Open WhatsApp - add small delay if SMS was also sent
        setTimeout(() => {
          const waLink = document.createElement('a');
          waLink.href = `https://wa.me/${phone}?text=${encodedMessage}`;
          waLink.target = '_blank';
          waLink.style.display = 'none';
          document.body.appendChild(waLink);
          waLink.click();
          document.body.removeChild(waLink);
        }, contact.preferredMethod === 'both' ? 500 : 0);
      }
    }, index * 1000); // Stagger alerts to different contacts
  });

  toast.error("Emergency Alerts Sent!", {
    description: `Sending to ${contacts.length} emergency contact(s)`,
    duration: 10000,
  });
};

const GlobalFallDetection = () => {
  const { settings, isLoaded } = useEmergencySettings();

  const handleSOSTrigger = useCallback((location: { lat: number; lng: number } | null) => {
    if (settings.autoSend && settings.contacts.length > 0) {
      sendEmergencyAlerts(settings.contacts, location);
    }
  }, [settings]);

  const {
    isFallDetected,
    countdown,
    location,
    dismissFall,
    startMonitoring,
  } = useFallDetection(handleSOSTrigger);

  // Start monitoring on mount
  useEffect(() => {
    if (isLoaded) {
      startMonitoring();
      
      toast.success("Fall Detection Active", {
        description: `Monitoring for falls. ${settings.contacts.length} emergency contact(s) configured.`,
        duration: 3000,
      });
    }
  }, [isLoaded, startMonitoring, settings.contacts.length]);

  if (!isLoaded) return null;

  return (
    <FallDetectionOverlay
      isVisible={isFallDetected}
      countdown={countdown}
      location={location}
      onDismiss={dismissFall}
      contacts={settings.contacts}
      onManualAlert={() => sendEmergencyAlerts(settings.contacts, location)}
    />
  );
};

export default GlobalFallDetection;
