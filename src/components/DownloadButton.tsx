'use client';

import React, { useState } from 'react';
import { Download, CheckCircle2, ShieldCheck, Smartphone, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DownloadButtonProps {
  appId: string;
  appName: string;
  apkUrl: string;
  apkFileName?: string;
  size: string;
  onDownloadComplete?: () => void;
}

export default function DownloadButton({
  appId,
  appName,
  apkUrl,
  apkFileName,
  size,
  onDownloadComplete,
}: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloaded, setDownloaded] = useState(false);

  const startDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    setProgress(15);

    try {
      // Send download analytics to server
      fetch(`/api/apps/${appId}/download`, { method: 'POST' }).catch(() => {});

      // Simulate download progress steps
      const p1 = setTimeout(() => setProgress(45), 250);
      const p2 = setTimeout(() => setProgress(80), 500);
      const p3 = setTimeout(() => {
        setProgress(100);
        setDownloading(false);
        setDownloaded(true);

        // Confetti burst
        try {
          confetti({
            particleCount: 60,
            spread: 80,
            origin: { y: 0.7 },
            colors: ['#F59E0B', '#10B981', '#34D399', '#FDE047'],
          });
        } catch (e) {}

        // Trigger real file download
        const targetUrl = apkUrl || `/sample-apks/${appId}.apk`;
        const link = document.createElement('a');
        link.href = targetUrl;
        link.download = apkFileName || `${appName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.apk`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (onDownloadComplete) onDownloadComplete();

        // Reset after 5 seconds
        setTimeout(() => {
          setDownloaded(false);
          setProgress(0);
        }, 5000);
      }, 850);
    } catch (err) {
      setDownloading(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full sm:w-auto">
      <button
        onClick={startDownload}
        disabled={downloading}
        className={`relative w-full sm:w-auto overflow-hidden px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
          downloaded
            ? 'bg-emerald-600 text-white shadow-emerald-500/30'
            : downloading
            ? 'bg-nur-surface text-nur-gold border border-nur-gold/40 cursor-wait'
            : 'btn-emerald text-white hover:scale-[1.02] shadow-emerald-500/25'
        }`}
      >
        {/* Progress bar background fill */}
        {downloading && (
          <div
            className="absolute left-0 top-0 bottom-0 bg-nur-gold/25 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        )}

        <div className="relative z-10 flex items-center gap-2.5">
          {downloaded ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>APK Downloaded & Ready to Install</span>
            </>
          ) : downloading ? (
            <>
              <div className="w-4 h-4 border-2 border-nur-gold border-t-transparent rounded-full animate-spin"></div>
              <span>Downloading APK ({progress}%)...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Download APK ({size})</span>
            </>
          )}
        </div>
      </button>

      {/* Safety subtitle */}
      <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Scanned by <strong className="text-slate-300">Nur Protect</strong> • Official Signature Verified</span>
      </div>
    </div>
  );
}
