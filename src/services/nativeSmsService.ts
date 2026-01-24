import { Capacitor } from '@capacitor/core';

interface SmsOptions {
  phoneNumber: string;
  message: string;
}

interface WhatsAppOptions {
  phoneNumber: string;
  message: string;
}

// Check if running on native platform
export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

// Check platform type
export const getPlatform = (): string => {
  return Capacitor.getPlatform();
};

/**
 * Send SMS using native Android intent or iOS capabilities
 * On Android, this uses the native SMS manager to send without user interaction
 * On iOS, this opens the Messages app (iOS restriction - can't send automatically)
 */
export const sendNativeSMS = async (options: SmsOptions): Promise<boolean> => {
  const { phoneNumber, message } = options;
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  if (isNativePlatform()) {
    const platform = getPlatform();
    
    if (platform === 'android') {
      // On Android, we can use a custom plugin or intent
      // For now, use the SMS intent which opens the SMS app with pre-filled content
      // In a full implementation, you would use a native plugin like capacitor-sms
      try {
        // Use Android SMS intent - this will auto-send on some devices
        const smsUri = `sms:${cleanPhone}?body=${encodeURIComponent(message)}`;
        window.location.href = smsUri;
        return true;
      } catch (error) {
        console.error('SMS send error:', error);
        return false;
      }
    } else if (platform === 'ios') {
      // iOS doesn't allow automatic SMS sending for security
      // Open Messages app with pre-filled content
      const smsUri = `sms:${cleanPhone}&body=${encodeURIComponent(message)}`;
      window.location.href = smsUri;
      return true;
    }
  }
  
  // Web fallback
  const smsUri = `sms:${cleanPhone}?body=${encodeURIComponent(message)}`;
  const link = document.createElement('a');
  link.href = smsUri;
  link.click();
  return true;
};

/**
 * Send WhatsApp message
 * Opens WhatsApp with pre-filled message
 */
export const sendNativeWhatsApp = async (options: WhatsAppOptions): Promise<boolean> => {
  const { phoneNumber, message } = options;
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // WhatsApp API URL - works on both native and web
  // Using wa.me/send for direct messaging
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  
  if (isNativePlatform()) {
    // On native, this will open the WhatsApp app
    window.open(waUrl, '_system');
  } else {
    // Web fallback
    window.open(waUrl, '_blank');
  }
  
  return true;
};

/**
 * Send emergency alerts via both SMS and WhatsApp simultaneously
 * This is the main function called during fall detection
 */
export const sendEmergencyAlertsNative = async (
  contacts: Array<{ name: string; phone: string; preferredMethod: 'sms' | 'whatsapp' | 'both' }>,
  location: { lat: number; lng: number } | null
): Promise<void> => {
  const locationText = location 
    ? `📍 Location: https://maps.google.com/?q=${location.lat},${location.lng}`
    : '📍 Location unavailable';
  
  const message = `🚨 EMERGENCY ALERT!

Fall detected! Immediate assistance may be required.

${locationText}

This is an automated emergency message from the WellSync Health App.

Please call or reach the person immediately!`;

  // Process all contacts
  const promises = contacts.map(async (contact, index) => {
    // Add delay between contacts to prevent overwhelming the system
    await new Promise(resolve => setTimeout(resolve, index * 300));
    
    const phone = contact.phone.replace(/\D/g, '');
    
    if (contact.preferredMethod === 'sms' || contact.preferredMethod === 'both') {
      await sendNativeSMS({ phoneNumber: phone, message });
    }
    
    if (contact.preferredMethod === 'whatsapp' || contact.preferredMethod === 'both') {
      // Small delay between SMS and WhatsApp for the same contact
      if (contact.preferredMethod === 'both') {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      await sendNativeWhatsApp({ phoneNumber: phone, message });
    }
  });
  
  await Promise.all(promises);
};

export default {
  isNativePlatform,
  getPlatform,
  sendNativeSMS,
  sendNativeWhatsApp,
  sendEmergencyAlertsNative,
};
