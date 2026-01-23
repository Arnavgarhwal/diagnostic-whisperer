import { useState, useEffect, useCallback, useRef } from 'react';

interface FallDetectionState {
  isFallDetected: boolean;
  countdown: number;
  isActive: boolean;
  location: { lat: number; lng: number } | null;
}

export const useFallDetection = (onSOSTrigger: (location: { lat: number; lng: number } | null) => void) => {
  const [state, setState] = useState<FallDetectionState>({
    isFallDetected: false,
    countdown: 20,
    isActive: false,
    location: null,
  });
  
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const motionThreshold = 30; // Threshold for detecting sudden motion changes
  const lastAcceleration = useRef({ x: 0, y: 0, z: 0 });

  const getLocation = useCallback((): Promise<{ lat: number; lng: number } | null> => {
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
        () => {
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  }, []);

  const triggerFallDetection = useCallback(async () => {
    const location = await getLocation();
    
    setState({
      isFallDetected: true,
      countdown: 20,
      isActive: true,
      location,
    });
  }, [getLocation]);

  const dismissFall = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    
    setState({
      isFallDetected: false,
      countdown: 20,
      isActive: false,
      location: null,
    });
  }, []);

  const startMonitoring = useCallback(() => {
    setState(prev => ({ ...prev, isActive: true }));
  }, []);

  const stopMonitoring = useCallback(() => {
    setState(prev => ({ ...prev, isActive: false }));
    dismissFall();
  }, [dismissFall]);

  // Handle countdown
  useEffect(() => {
    if (state.isFallDetected && state.countdown > 0) {
      countdownRef.current = setInterval(() => {
        setState(prev => {
          if (prev.countdown <= 1) {
            // Trigger SOS
            onSOSTrigger(prev.location);
            return {
              ...prev,
              isFallDetected: false,
              countdown: 20,
            };
          }
          return { ...prev, countdown: prev.countdown - 1 };
        });
      }, 1000);
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [state.isFallDetected, onSOSTrigger]);

  // Device motion detection
  useEffect(() => {
    if (!state.isActive || typeof window === 'undefined') return;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      
      if (!acceleration?.x || !acceleration?.y || !acceleration?.z) return;

      const deltaX = Math.abs(acceleration.x - lastAcceleration.current.x);
      const deltaY = Math.abs(acceleration.y - lastAcceleration.current.y);
      const deltaZ = Math.abs(acceleration.z - lastAcceleration.current.z);

      const totalDelta = deltaX + deltaY + deltaZ;

      // Update last acceleration
      lastAcceleration.current = {
        x: acceleration.x,
        y: acceleration.y,
        z: acceleration.z,
      };

      // Check if motion exceeds threshold (potential fall)
      if (totalDelta > motionThreshold && !state.isFallDetected) {
        triggerFallDetection();
      }
    };

    // Request permission for iOS 13+
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      (DeviceMotionEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [state.isActive, state.isFallDetected, triggerFallDetection]);

  return {
    ...state,
    dismissFall,
    triggerFallDetection,
    startMonitoring,
    stopMonitoring,
  };
};

export default useFallDetection;
