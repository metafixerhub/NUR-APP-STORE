'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { 
  ArrowLeft, 
  MoreVertical, 
  Pause, 
  Play, 
  CheckCircle2, 
  ExternalLink, 
  DownloadCloud, 
  RefreshCw,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DownloadingApp {
  id: string;
  name: string;
  downloadedMB: number;
  totalMB: number;
  percent: number;
  isPaused: boolean;
  iconUrl: string;
}

export default function MyAppsPage() {
  const [activeTab, setActiveTab] = useState<'downloads' | 'installed' | 'updates'>('downloads');

  const [downloadingApps, setDownloadingApps] = useState<DownloadingApp[]>([
    {
      id: 'namaz-guide',
      name: 'Namaz Guide',
      downloadedMB: 12,
      totalMB: 25,
      percent: 48,
      isPaused: false,
      iconUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=256&h=256&fit=crop&q=80',
    },
    {
      id: 'quran-reader',
      name: 'Quran Reader',
      downloadedMB: 5,
      totalMB: 18,
      percent: 28,
      isPaused: false,
      iconUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=256&h=256&fit=crop&q=80',
    },
  ]);

  const [completedApps, setCompletedApps] = useState([
    {
      id: 'islamic-calendar',
      name: 'Islamic Calendar',
      size: '15 MB',
      status: 'Installed',
      iconUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=256&h=256&fit=crop&q=80',
    },
    {
      id: 'dua-collection',
      name: 'Dua Collection',
      size: '12 MB',
      status: 'Installed',
      iconUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=256&h=256&fit=crop&q=80',
    },
    {
      id: 'qibla-finder',
      name: 'Qibla Finder',
      size: '10 MB',
      status: 'Installed',
      iconUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=256&h=256&fit=crop&q=80',
    },
  ]);

  const togglePause = (id: string) => {
    setDownloadingApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, isPaused: !app.isPaused } : app))
    );
  };

  const handleOpenApp = (appName: string, apkUrl: string) => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#10B981', '#F59E0B'],
      });
    } catch (e) {}
    alert(`Opening ${appName}... APK ready on your device.`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24">
      
      {/* Header matching Screen 5: "My Apps" with three dots */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Apps</h1>
        <button className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Pill Tabs: [Installed] [Updates] [Downloads] */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab('installed')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
            activeTab === 'installed'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
          }`}
        >
          Installed
        </button>

        <button
          onClick={() => setActiveTab('updates')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
            activeTab === 'updates'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
          }`}
        >
          Updates
        </button>

        <button
          onClick={() => setActiveTab('downloads')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
            activeTab === 'downloads'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
          }`}
        >
          Downloads ({downloadingApps.length})
        </button>
      </div>

      {/* TAB 1: DOWNLOADS */}
      {activeTab === 'downloads' && (
        <div className="space-y-6">
          
          {/* Section: Downloading (2) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">
                Downloading ({downloadingApps.length})
              </h2>
              <span className="text-xs text-slate-400">›</span>
            </div>

            <div className="space-y-3">
              {downloadingApps.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-slate-200 bg-slate-50">
                        <Image src={item.iconUrl} alt={item.name} fill sizes="48px" className="object-cover" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">{item.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          {item.downloadedMB} MB / {item.totalMB} MB
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => togglePause(item.id)}
                      className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-blue-600 border border-slate-200 transition-colors"
                      title={item.isPaused ? 'Resume' : 'Pause'}
                    >
                      {item.isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Completed (3) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">
                Completed ({completedApps.length})
              </h2>
              <span className="text-xs text-slate-400">›</span>
            </div>

            <div className="space-y-3">
              {completedApps.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-slate-200 bg-slate-50">
                      <Image src={item.iconUrl} alt={item.name} fill sizes="48px" className="object-cover" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">{item.name}</h3>
                      <p className="text-xs text-emerald-600 mt-0.5 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{item.status} ({item.size})</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenApp(item.name, `/sample-apks/${item.id}.apk`)}
                    className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: INSTALLED */}
      {activeTab === 'installed' && (
        <div className="space-y-3">
          {completedApps.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-slate-200 bg-slate-50">
                  <Image src={item.iconUrl} alt={item.name} fill sizes="48px" className="object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">{item.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Version 1.0 • {item.size}</p>
                </div>
              </div>

              <NextLink
                href={`/app/${item.id}`}
                className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold"
              >
                Details
              </NextLink>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: UPDATES */}
      {activeTab === 'updates' && (
        <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 shadow-xs">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">All Apps are Up to Date</h3>
          <p className="text-xs text-slate-500">
            You are running the latest versions of all downloaded applications.
          </p>
        </div>
      )}

    </div>
  );
}
