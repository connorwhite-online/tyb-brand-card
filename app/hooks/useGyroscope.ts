'use client';

import { useState, useEffect, useCallback } from 'react';
import { GyroscopeData } from '../types';

export const useGyroscope = (isEnabled: boolean = true) => {
  const [gyroscopeData, setGyroscopeData] = useState<GyroscopeData>({
    alpha: null,
    beta: null,
    gamma: null,
  });

  const [isSupported, setIsSupported] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined') return false;

    // Check if DeviceOrientationEvent is supported
    if (!window.DeviceOrientationEvent) {
      setIsSupported(false);
      return false;
    }

    setIsSupported(true);

    // For iOS 13+ we need to request permission
    if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
        const granted = permission === 'granted';
        setHasPermission(granted);
        return granted;
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
        setHasPermission(false);
        return false;
      }
    } else {
      // For other browsers, assume permission is granted
      setHasPermission(true);
      return true;
    }
  }, []);

  // Initialize on mount and auto-request permission
  useEffect(() => {
    if (isEnabled) {
      requestPermission();
    }
  }, [isEnabled, requestPermission]);

  useEffect(() => {
    if (!isEnabled || !isSupported || !hasPermission) return;

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      setGyroscopeData({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      });
    };

    window.addEventListener('deviceorientation', handleDeviceOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, [isEnabled, isSupported, hasPermission]);

  return {
    gyroscopeData,
    isSupported,
    hasPermission,
    requestPermission,
  };
};
