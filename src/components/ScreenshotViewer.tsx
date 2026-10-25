'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ScreenshotViewerProps {
  screenshots: string[];
  appName: string;
}

export default function ScreenshotViewer({ screenshots, appName }: ScreenshotViewerProps) {
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  if (!screenshots || screenshots.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeModalIndex !== null) {
      setActiveModalIndex((activeModalIndex - 1 + screenshots.length) % screenshots.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeModalIndex !== null) {
      setActiveModalIndex((activeModalIndex + 1) % screenshots.length);
    }
  };

  return (
    <div className="my-8">
      <h2 className="text-base sm:text-lg font-bold text-white mb-3">App Screenshots</h2>
      
      {/* Horizontal Scroll list */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {screenshots.map((src, idx) => (
          <div
            key={idx}
            onClick={() => setActiveModalIndex(idx)}
            className="group relative h-64 sm:h-80 w-36 sm:w-48 shrink-0 rounded-2xl overflow-hidden bg-nur-midnight border border-nur-border hover:border-nur-gold/60 cursor-pointer shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <Image
              src={src}
              alt={`${appName} screenshot ${idx + 1}`}
              fill
              sizes="(max-width: 640px) 150px, 200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="p-2 rounded-full bg-nur-dark/80 text-nur-gold border border-nur-gold/40">
                <Maximize2 className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeModalIndex !== null && (
        <div
          onClick={() => setActiveModalIndex(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <button
            onClick={() => setActiveModalIndex(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow */}
          {screenshots.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-nur-navy/80 border border-nur-border text-white hover:bg-nur-surface transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] w-auto h-auto rounded-2xl overflow-hidden shadow-2xl border border-nur-border"
          >
            <img
              src={screenshots[activeModalIndex]}
              alt={`${appName} enlarged preview`}
              className="max-h-[85vh] max-w-full object-contain rounded-2xl"
            />
          </div>

          {/* Right Arrow */}
          {screenshots.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-nur-navy/80 border border-nur-border text-white hover:bg-nur-surface transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Counter indicator */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-nur-navy/90 border border-nur-border text-xs text-slate-300 font-semibold">
            {activeModalIndex + 1} / {screenshots.length}
          </div>
        </div>
      )}
    </div>
  );
}
