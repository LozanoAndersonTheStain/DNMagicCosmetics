"use client";

import { useState, useEffect } from 'react';

interface IOSInfo {
  isIOS: boolean;
  isSafari: boolean;
  isStandalone: boolean;
  version: string | null;
}

export const useIOSDetection = (): IOSInfo => {
  const [iosInfo, setIOSInfo] = useState<IOSInfo>({
    isIOS: false,
    isSafari: false,
    isStandalone: false,
    version: null,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userAgent = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    // Detectar versión de iOS
    const iosVersionMatch = userAgent.match(/OS (\d+)_(\d+)/);
    const version = iosVersionMatch ? `${iosVersionMatch[1]}.${iosVersionMatch[2]}` : null;

    setIOSInfo({
      isIOS,
      isSafari,
      isStandalone,
      version,
    });
  }, []);

  return iosInfo;
};