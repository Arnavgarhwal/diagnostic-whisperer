import { useState, useEffect, useCallback, useRef } from 'react';
import { getCurrentLocation, startMotionListening, stopMotionListening } from '@/services/nativeMotionService';
import { Capacitor } from '@capacitor/core';

interface FallDetectionState {
  isFallDetected: boolean;
  countdown: number;
  isActive: boolean;
  location: { lat: number; lng: number } | null;
}

interface UseFallDetectionOptions {
  onSOSTrigger: (location: { lat: number; lng: number } | null) => void;
  countdownSeconds?: number;
}

export const useFallDetection = (options: UseFallDetectionOptions) => {
  const { onSOSTrigger, countdownSeconds = 20 } = options;
  const [state, setState] = useState<FallDetectionState>({
    isFallDetected: false,
    countdown: countdownSeconds,
    isActive: false,
    location: null,
  });
  
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const motionThreshold = Capacitor.isNativePlatform() ? 25 : 30; // Lower threshold on native for better detection
  const lastAcceleration = useRef({ x: 0, y: 0, z: 0 });

  const getLocation = useCallback(async (): Promise<{ lat: number; lng: number } | null> => {
    // Use native geolocation service
    return getCurrentLocation();
  }, []);

  const triggerFallDetection = useCallback(async () => {
    console.log('[FallDetection] Fall detected! Getting location...');
    const location = await getLocation();
    console.log('[FallDetection] Location:', location);
    
    setState({
      isFallDetected: true,
      countdown: countdownSeconds,
      isActive: true,
      location,
    });
  }, [getLocation, countdownSeconds]);

  const dismissFall = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    
    setState({
      isFallDetected: false,
      countdown: countdownSeconds,
      isActive: false,
      location: null,
    });
  }, [countdownSeconds]);

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
      console.log(`[FallDetection] Countdown: ${state.countdown}s remaining`);
      
      countdownRef.current = setInterval(() => {
        setState(prev => {
          if (prev.countdown <= 1) {
            console.log('[FallDetection] Countdown complete! Triggering SOS...');
            // Trigger SOS
            onSOSTrigger(prev.location);
            return {
              ...prev,
              isFallDetected: false,
              countdown: countdownSeconds,
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
  }, [state.isFallDetected, onSOSTrigger, countdownSeconds]);

  // Device motion detection using native service
  useEffect(() => {
    if (!state.isActive || typeof window === 'undefined') return;

    console.log('[FallDetection] Starting motion monitoring...');
    
    const handleMotion = (data: { acceleration: { x: number; y: number; z: number } }) => {
      const { acceleration } = data;

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
        console.log(`[FallDetection] Motion threshold exceeded: ${totalDelta.toFixed(2)} > ${motionThreshold}`);
        triggerFallDetection();
      }
    };

    // Start listening using native motion service
    startMotionListening(handleMotion);

    return () => {
      console.log('[FallDetection] Stopping motion monitoring...');
      stopMotionListening();
    };
  }, [state.isActive, state.isFallDetected, triggerFallDetection, motionThreshold]);

  return {
    ...state,
    dismissFall,
    triggerFallDetection,
    startMonitoring,
    stopMonitoring,
  };
};

export default useFallDetection;
