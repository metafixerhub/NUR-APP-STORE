'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onFinish?: () => void;
  autoDismissMs?: number;
}

export default function SplashScreen({ onFinish, autoDismissMs = 2200 }: SplashScreenProps) {
  const [progress, setProgress] = useState(15);
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Check if splash was already shown in this session
    try {
      const shown = sessionStorage.getItem('nur_splash_shown');
      if (shown) {
        setIsVisible(false);
        if (onFinish) onFinish();
        return;
      }
    } catch (e) {}

    const t1 = setTimeout(() => setProgress(45), 400);
    const t2 = setTimeout(() => setProgress(85), 1100);
    const t3 = setTimeout(() => {
      setProgress(100);
      setIsFading(true);
      setTimeout(() => {
        setIsVisible(false);
        try {
          sessionStorage.setItem('nur_splash_shown', 'true');
        } catch (e) {}
        if (onFinish) onFinish();
      }, 500);
    }, autoDismissMs);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [autoDismissMs, onFinish]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-gradient-to-b from-[#071626] via-[#05111F] to-[#030913] text-white transition-opacity duration-500 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Decorative ambient mosque glow */}
      <div className="absolute top-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top placeholder / status */}
      <div className="w-full flex items-center justify-between text-xs text-slate-400 font-mono opacity-60">
        <span>10:30</span>
        <div className="flex items-center gap-1.5">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Center 3D Logo */}
      <div className="flex flex-col items-center justify-center my-auto text-center">
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 mb-6 drop-shadow-2xl animate-pulse">
          <Image
            src="/logo.png"
            alt="Nur App Store Logo"
            fill
            sizes="256px"
            className="object-contain"
            priority
          />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black text-gold-gradient tracking-tight drop-shadow-lg">
          Nur App Store
        </h1>
        <p className="text-xs sm:text-sm text-emerald-400 font-medium mt-1 tracking-wide">
          Discover Useful Apps for a Better Life
        </p>
      </div>

      {/* Bottom Loading Progress Bar */}
      <div className="w-full max-w-xs flex flex-col items-center gap-3 mb-6">
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 rounded-full transition-all duration-500 shadow-sm shadow-amber-400"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-slate-400 font-medium tracking-wider">
          Loading...
        </span>
      </div>
    </div>
  );
}
