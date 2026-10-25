'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { Star, Download, CheckCircle2 } from 'lucide-react';
import { AppItem } from '@/types/app';
import confetti from 'canvas-confetti';

interface AppCardProps {
  app: AppItem;
  onDownloadStarted?: () => void;
  layout?: 'grid' | 'row';
}

export default function AppCard({ app, onDownloadStarted, layout = 'row' }: AppCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleQuickDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (downloading) return;
    setDownloading(true);

    try {
      fetch(`/api/apps/${app.id}/download`, { method: 'POST' }).catch(() => {});

      setTimeout(() => {
        setDownloading(false);
        setDownloaded(true);

        try {
          confetti({
            particleCount: 35,
            spread: 50,
            origin: { y: 0.7 },
            colors: ['#2563EB', '#10B981', '#F59E0B'],
          });
        } catch (err) {}

        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        const rawUrl = app.apkUrl || `/sample-apks/${app.id}.apk`;
        const downloadUrl = rawUrl.startsWith('/') && !rawUrl.startsWith(basePath) ? `${basePath}${rawUrl}` : rawUrl;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = app.apkFileName || `${app.name.toLowerCase().replace(/\s+/g, '-')}.apk`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (onDownloadStarted) onDownloadStarted();

        setTimeout(() => setDownloaded(false), 4000);
      }, 700);
    } catch (err) {
      setDownloading(false);
    }
  };

  // ROW LAYOUT (Matches Screen 2 "Popular Apps" in UI Showcase)
  if (layout === 'row') {
    return (
      <NextLink
        href={`/app/${app.id}`}
        className="group flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 transition-all duration-200 shadow-xs"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          {/* App Icon */}
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-slate-50 border border-slate-200 shadow-xs">
            <Image
              src={app.iconUrl || '/logo.png'}
              alt={app.name}
              fill
              sizes="56px"
              className="object-cover group-hover:scale-105 transition-transform"
            />
          </div>

          {/* Title & Subtitle */}
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-900 leading-tight truncate group-hover:text-blue-600 transition-colors">
              {app.name}
            </h3>
            <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
              {app.shortDescription}
            </p>
            <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-slate-600">
              <span className="flex items-center gap-0.5 text-amber-500">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                {app.rating ? app.rating.toFixed(1) : '4.8'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 text-[10px]">{app.size}</span>
            </div>
          </div>
        </div>

        {/* Install Button matching blue pill in screenshot */}
        <div className="shrink-0 ml-3">
          <button
            onClick={handleQuickDownload}
            disabled={downloading}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              downloaded
                ? 'bg-emerald-600 text-white'
                : downloading
                ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 cursor-wait'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-blue-500/25'
            }`}
          >
            {downloaded ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved</span>
              </span>
            ) : downloading ? (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                <span>APK...</span>
              </span>
            ) : (
              'Install'
            )}
          </button>
        </div>
      </NextLink>
    );
  }

  // GRID LAYOUT
  return (
    <div className="group relative rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 p-4 transition-all duration-200 shadow-xs flex flex-col justify-between">
      <NextLink href={`/app/${app.id}`} className="block flex-1">
        <div className="flex items-start gap-3.5 mb-3">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-slate-50 border border-slate-200 shadow-xs">
            <Image src={app.iconUrl || '/logo.png'} alt={app.name} fill sizes="56px" className="object-cover" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate leading-snug">
              {app.name}
            </h3>
            <p className="text-xs text-slate-500 truncate mb-1">{app.developer}</p>
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <span className="flex items-center gap-1 font-semibold text-amber-500">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {app.rating ? app.rating.toFixed(1) : '4.8'}
              </span>
              <span>•</span>
              <span>{app.size}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {app.shortDescription}
        </p>
      </NextLink>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold text-blue-700 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
          {app.category}
        </span>

        <button
          onClick={handleQuickDownload}
          disabled={downloading}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
            downloaded
              ? 'bg-emerald-600 text-white'
              : downloading
              ? 'bg-blue-100 text-blue-600'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {downloaded ? 'Saved' : downloading ? 'APK...' : 'Install'}
        </button>
      </div>
    </div>
  );
}
