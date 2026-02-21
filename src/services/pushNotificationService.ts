import { toast } from "@/hooks/use-toast";

interface PushNotificationData {
  title: string;
  body: string;
  data?: Record<string, string>;
}

class PushNotificationService {
  private isNative = false;
  private scheduledNotifications: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.isNative = typeof (window as any)?.Capacitor !== 'undefined' && 
      (window as any)?.Capacitor?.getPlatform() !== 'web';
  }

  async initialize(): Promise<boolean> {
    if (this.isNative) {
      console.log('[PushNotification] Native platform detected, using Capacitor Push');
      return true;
    }

    // Web fallback - use Notification API
    if (!('Notification' in window)) {
      console.log('[PushNotification] Browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    }
    return false;
  }

  async sendLocalNotification(data: PushNotificationData): Promise<void> {
    if (this.isNative) {
      // Native: would use Capacitor LocalNotifications plugin
      console.log('[PushNotification] Native notification:', data);
      toast({ title: data.title, description: data.body });
      return;
    }

    // Web fallback
    if (Notification.permission === 'granted') {
      const notification = new Notification(data.title, {
        body: data.body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: data.data?.tag || 'default',
        requireInteraction: true,
      });
      notification.onclick = () => { window.focus(); notification.close(); };
    }

    toast({ title: data.title, description: data.body });
  }

  scheduleNotification(id: string, data: PushNotificationData, delayMs: number): void {
    this.cancelScheduled(id);
    const timeout = setTimeout(() => {
      this.sendLocalNotification(data);
      this.scheduledNotifications.delete(id);
    }, delayMs);
    this.scheduledNotifications.set(id, timeout);
    console.log(`[PushNotification] Scheduled "${id}" in ${Math.round(delayMs / 1000)}s`);
  }

  scheduleRepeating(id: string, data: PushNotificationData, intervalMs: number): void {
    this.cancelScheduled(id);
    const interval = setInterval(() => {
      this.sendLocalNotification(data);
    }, intervalMs);
    this.scheduledNotifications.set(id, interval as unknown as NodeJS.Timeout);
  }

  cancelScheduled(id: string): void {
    const existing = this.scheduledNotifications.get(id);
    if (existing) {
      clearTimeout(existing);
      clearInterval(existing as unknown as NodeJS.Timeout);
      this.scheduledNotifications.delete(id);
    }
  }

  cancelAll(): void {
    this.scheduledNotifications.forEach((_, id) => this.cancelScheduled(id));
  }

  // Emergency background notification
  sendEmergencyNotification(message: string): void {
    this.sendLocalNotification({
      title: '🚨 EMERGENCY ALERT',
      body: message,
      data: { tag: 'emergency', priority: 'high' },
    });
  }

  // Medicine reminder notification
  scheduleMedicineNotification(medicineName: string, dosage: string, timeStr: string): void {
    const now = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const scheduled = new Date();
    scheduled.setHours(hours, minutes, 0, 0);
    if (scheduled <= now) scheduled.setDate(scheduled.getDate() + 1);

    const delay = scheduled.getTime() - now.getTime();
    this.scheduleNotification(`medicine-${medicineName}`, {
      title: '💊 Medicine Reminder',
      body: `Time to take ${medicineName} (${dosage})`,
      data: { tag: 'medicine' },
    }, delay);
  }

  // Health tip notification
  scheduleHealthTip(tip: string, delayMs: number = 3600000): void {
    this.scheduleNotification('health-tip', {
      title: '💡 Health Tip',
      body: tip,
      data: { tag: 'health-tip' },
    }, delayMs);
  }
}

export const pushNotificationService = new PushNotificationService();
export default pushNotificationService;
