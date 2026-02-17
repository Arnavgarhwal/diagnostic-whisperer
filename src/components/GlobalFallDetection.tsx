import { useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import useFallDetection from "@/hooks/useFallDetection";
import FallDetectionOverlay from "./FallDetectionOverlay";
import { useEmergencySettings, EmergencyContact } from "@/hooks/useEmergencySettings";
import { sendEmergencyAlertsNative, isNativePlatform } from "@/services/nativeSmsService";
import { Capacitor } from "@capacitor/core";

// Web fallback for sending alerts
const sendEmergencyAlertsWeb = (
  contacts: EmergencyContact[],
  location: { lat: number; lng: number } | null
) => {
  const locationText = location 
    ? `Location: https://maps.google.com/?q=${location.lat},${location.lng}`
    : "Location unavailable";
  
  const message = `🚨 EMERGENCY ALERT!\n\nFall detected! Immediate assistance may be required.\n\n${locationText}\n\nThis is an automated emergency message from the Health App.`;
  const encodedMessage = encodeURIComponent(message);

  contacts.forEach((contact, index) => {
    const phone = contact.phone.replace(/\D/g, '');
    
    setTimeout(() => {
      if (contact.preferredMethod === 'sms' || contact.preferredMethod === 'both') {
        const smsLink = document.createElement('a');
        smsLink.href = `sms:${phone}?body=${encodedMessage}`;
        smsLink.style.display = 'none';
        document.body.appendChild(smsLink);
        smsLink.click();
        document.body.removeChild(smsLink);
      }
      
      if (contact.preferredMethod === 'whatsapp' || contact.preferredMethod === 'both') {
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
    }, index * 1000);
  });

  toast.error("Emergency Alerts Sent!", {
    description: `Sending to ${contacts.length} emergency contact(s)`,
    duration: 10000,
  });
};

// Universal alert sender - uses native on mobile, web fallback otherwise
const sendEmergencyAlerts = async (
  contacts: EmergencyContact[],
  location: { lat: number; lng: number } | null
) => {
  const platform = Capacitor.getPlatform();
  
  if (isNativePlatform()) {
    // On native platform (Android/iOS), use native SMS service
    console.log(`[Emergency] Sending alerts via native ${platform} platform`);
    
    try {
      await sendEmergencyAlertsNative(contacts, location);
      toast.error("Emergency Alerts Sent!", {
        description: `Alerts sent to ${contacts.length} emergency contact(s) via ${platform}`,
        duration: 10000,
      });
    } catch (error) {
      console.error('[Emergency] Native alert failed:', error);
      // Fallback to web method
      sendEmergencyAlertsWeb(contacts, location);
    }
  } else {
    // On web, use web-based method
    console.log('[Emergency] Sending alerts via web platform');
    sendEmergencyAlertsWeb(contacts, location);
  }
};

const GlobalFallDetection = () => {
  const { settings, isLoaded } = useEmergencySettings();
  const settingsRef = useRef(settings);
  
  // Keep settings ref up to date
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const handleSOSTrigger = useCallback((location: { lat: number; lng: number } | null) => {
    // Use ref to get latest settings
    const currentSettings = settingsRef.current;
    
    if (currentSettings.autoSend && currentSettings.contacts.length > 0) {
      console.log('[Emergency] Fall detected! Triggering SOS with settings:', {
        contacts: currentSettings.contacts.length,
        autoSend: currentSettings.autoSend,
        countdownSeconds: currentSettings.countdownSeconds,
      });
      
      sendEmergencyAlerts(currentSettings.contacts, location);
    }
  }, []);

  const {
    isFallDetected,
    countdown,
    location,
    dismissFall,
    startMonitoring,
    triggerFallDetection,
  } = useFallDetection({
    onSOSTrigger: handleSOSTrigger,
    countdownSeconds: settings.countdownSeconds,
  });

  // Listen for simulated fall detection events
  useEffect(() => {
    const handleSimulate = () => {
      console.log('[Emergency] Simulated fall detection triggered');
      triggerFallDetection();
    };
    window.addEventListener('simulate-fall-detection', handleSimulate);
    return () => window.removeEventListener('simulate-fall-detection', handleSimulate);
  }, [triggerFallDetection]);

  // Start monitoring on mount
  useEffect(() => {
    if (isLoaded) {
      startMonitoring();
      
      const platform = Capacitor.getPlatform();
      const platformLabel = isNativePlatform() ? `(${platform} native)` : '(web)';
      
      toast.success("Fall Detection Active", {
        description: `Monitoring for falls ${platformLabel}. ${settings.contacts.length} contact(s) configured.`,
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
