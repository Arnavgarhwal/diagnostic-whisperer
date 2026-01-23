import { useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }, []);

  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }
    return null;
  }, []);

  const scheduleMedicineReminder = useCallback((medicineName: string, dosage: string, time: string) => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      showNotification(`💊 Medicine Reminder`, {
        body: `Time to take ${medicineName} (${dosage})`,
        tag: `medicine-${medicineName}-${time}`,
        requireInteraction: true,
      });
      
      toast({
        title: "💊 Medicine Reminder",
        description: `Time to take ${medicineName} (${dosage})`,
      });
    }, delay);

    return delay;
  }, [showNotification]);

  const scheduleAppointmentReminder = useCallback((doctorName: string, specialty: string, appointmentTime: Date) => {
    const now = new Date();
    const reminderTime = new Date(appointmentTime.getTime() - 60 * 60 * 1000); // 1 hour before

    if (reminderTime <= now) return null;

    const delay = reminderTime.getTime() - now.getTime();

    setTimeout(() => {
      showNotification(`📅 Appointment Reminder`, {
        body: `You have an appointment with ${doctorName} (${specialty}) in 1 hour`,
        tag: `appointment-${doctorName}`,
        requireInteraction: true,
      });
      
      toast({
        title: "📅 Appointment Reminder",
        description: `You have an appointment with ${doctorName} (${specialty}) in 1 hour`,
      });
    }, delay);

    return delay;
  }, [showNotification]);

  return {
    requestPermission,
    showNotification,
    scheduleMedicineReminder,
    scheduleAppointmentReminder,
  };
};

export default useNotifications;
