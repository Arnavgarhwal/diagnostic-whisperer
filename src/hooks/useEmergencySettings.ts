import { useState, useEffect, useCallback } from 'react';

export interface EmergencyContact {
  name: string;
  phone: string;
  preferredMethod: 'sms' | 'whatsapp' | 'both';
}

interface EmergencySettings {
  contacts: EmergencyContact[];
  autoSend: boolean;
  countdownSeconds: number;
}

const DEFAULT_SETTINGS: EmergencySettings = {
  contacts: [
    {
      name: "Family Member",
      phone: "9004682830",
      preferredMethod: "both",
    }
  ],
  autoSend: true,
  countdownSeconds: 20,
};

const STORAGE_KEY = 'emergency_settings';

export const useEmergencySettings = () => {
  const [settings, setSettings] = useState<EmergencySettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load emergency settings:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: Partial<EmergencySettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save emergency settings:', error);
      }
      return updated;
    });
  }, []);

  const addContact = useCallback((contact: EmergencyContact) => {
    setSettings(prev => {
      const updated = { ...prev, contacts: [...prev.contacts, contact] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateContact = useCallback((index: number, contact: EmergencyContact) => {
    setSettings(prev => {
      const contacts = [...prev.contacts];
      contacts[index] = contact;
      const updated = { ...prev, contacts };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeContact = useCallback((index: number) => {
    setSettings(prev => {
      const contacts = prev.contacts.filter((_, i) => i !== index);
      const updated = { ...prev, contacts };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
  }, []);

  return {
    settings,
    isLoaded,
    saveSettings,
    addContact,
    updateContact,
    removeContact,
    resetToDefaults,
  };
};

export default useEmergencySettings;
