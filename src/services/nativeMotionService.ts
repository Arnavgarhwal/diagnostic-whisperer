import { Capacitor } from '@capacitor/core';
import { Motion, MotionEventResult } from '@capacitor/motion';
import { Geolocation } from '@capacitor/geolocation';

interface AccelerationData {
  x: number;
  y: number;
  z: number;
}

interface MotionListenerCallback {
  (data: { acceleration: AccelerationData }): void;
}

let motionListener: any = null;

/**
 * Request motion sensor permissions on native platforms
 */
export const requestMotionPermission = async (): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) {
    // Web fallback - use DeviceMotionEvent permission
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Motion permission error:', error);
        return false;
      }
    }
    return true; // Non-iOS browsers don't require explicit permission
  }
  
  // Native platform - permission is handled in native layer
  return true;
};

/**
 * Request location permissions
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) {
    // Web fallback
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        { enableHighAccuracy: true }
      );
    });
  }
  
  try {
    const permission = await Geolocation.requestPermissions();
    return permission.location === 'granted';
  } catch (error) {
    console.error('Location permission error:', error);
    return false;
  }
};

/**
 * Get current location using native Geolocation
 */
export const getCurrentLocation = async (): Promise<{ lat: number; lng: number } | null> => {
  if (!Capacitor.isNativePlatform()) {
    // Web fallback
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }
  
  try {
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });
    
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  } catch (error) {
    console.error('Location error:', error);
    return null;
  }
};

/**
 * Start listening to motion events
 */
export const startMotionListening = async (callback: MotionListenerCallback): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    // Web fallback
    const handleMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (acceleration?.x != null && acceleration?.y != null && acceleration?.z != null) {
        callback({
          acceleration: {
            x: acceleration.x,
            y: acceleration.y,
            z: acceleration.z,
          },
        });
      }
    };
    
    window.addEventListener('devicemotion', handleMotion);
    motionListener = handleMotion;
    return;
  }
  
  // Native platform - use Capacitor Motion plugin
  try {
    motionListener = await Motion.addListener('accel', (event: MotionEventResult) => {
      callback({
        acceleration: {
          x: event.acceleration?.x || 0,
          y: event.acceleration?.y || 0,
          z: event.acceleration?.z || 0,
        },
      });
    });
  } catch (error) {
    console.error('Motion listener error:', error);
  }
};

/**
 * Stop listening to motion events
 */
export const stopMotionListening = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    if (motionListener) {
      window.removeEventListener('devicemotion', motionListener);
      motionListener = null;
    }
    return;
  }
  
  if (motionListener) {
    await motionListener.remove();
    motionListener = null;
  }
};

export default {
  requestMotionPermission,
  requestLocationPermission,
  getCurrentLocation,
  startMotionListening,
  stopMotionListening,
};
