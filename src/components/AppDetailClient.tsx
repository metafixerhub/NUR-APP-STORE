'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import NextLink from 'next/link';
import { 
  Star, 
  ArrowLeft, 
  MoreVertical, 
  ShieldCheck, 
  Share2, 
  ChevronRight,
  CheckCircle2, 
  AlertCircle,
  Download
} from 'lucide-react';
import { AppItem } from '@/types/app';
import { INITIAL_APPS } from '@/data/initialApps';
import ScreenshotViewer from '@/components/ScreenshotViewer';
import CommentSection from '@/components/CommentSection';
import ShareAppModal from '@/components/ShareAppModal';
import confetti from 'canvas-confetti';

export default function AppDetailClient() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [app, setApp] = useState<AppItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Download / Install state
  const [installing, setInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    async function fetchAppData() {
      if (!id) return;
      setIsLoading(true);

      const fallback = INITIAL_APPS.find((a) => a.id === id);
      if (fallback) {
        setApp(fallback);
      }

      try {
        const res = await fetch(`/api/apps/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.app) {
            setApp(data.app);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAppData();
  }, [id]);

  const handleInstallClick = async () => {
    if (!app || installing) return;

    if (installed) {
      alert(`Launching ${app.name}... APK is downloaded.`);
      return;
    }

    setInstalling(true);
    setProgress(20);

    fetch(`/api/apps/${app.id}/download`, { method: 'POST' }).catch(() => {});

    setTimeout(() => setProgress(55), 300);
    setTimeout(() => setProgress(88), 650);
    setTimeout(() => {
      setProgress(100);
      setInstalling(false);
      setInstalled(true);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563EB', '#10B981', '#F59E0B'],
        });
      } catch (e) {}

      // Download actual APK
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const rawUrl = app.apkUrl || `/sample-apks/${app.id}.apk`;
      const targetUrl = rawUrl.startsWith('/') && !rawUrl.startsWith(basePath) ? `${basePath}${rawUrl}` : rawUrl;
      const link = document.createElement('a');
      link.href = targetUrl;
      link.download = app.apkFileName || `${app.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.apk`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 950);
  };

  if (isLoading && !app) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-slate-500 text-xs font-semibold">Loading app details...</p>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h1 className="text-lg font-bold text-slate-900 mb-2">App Not Found</h1>
        <NextLink href="/" className="px-5 py-2 rounded-full bg-blue-600 text-white text-xs font-bold inline-block">
          Return to Store
        </NextLink>
      </div>
    );
  }

  const tags = app.tags && app.tags.length > 0 ? app.tags : ['Education', 'Islamic', 'Offline', 'Free'];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 pb-28">
      
      {/* Top Header matching Screen 4: Back arrow on left, More dots on right */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-900"
            title="Share App"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* App Header Info matching Screen 4 */}
      <div className="flex items-start gap-4 mb-5">
        {/* App Icon */}
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-50 border border-slate-200 shadow-md">
          <Image
            src={app.iconUrl || '/logo.png'}
            alt={app.name}
            fill
            sizes="80px"
            className="object-cover"
            priority
          />
        </div>

        {/* Title, Subtitle, Star rating */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            {app.name}
          </h1>
          <p className="text-xs text-slate-600 mt-1 leading-snug line-clamp-2 font-medium">
            {app.shortDescription}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{app.rating ? app.rating.toFixed(1) : '4.7'}</span>
            </span>
            <span className="text-slate-400">
              ({(app.ratingCount || 12000).toLocaleString()} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Blue Install Button (Matching Screen 4) */}
      <div className="mb-6">
        <button
          onClick={handleInstallClick}
          disabled={installing}
          className={`relative w-full overflow-hidden py-3 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md ${
            installed
              ? 'bg-emerald-600 text-white'
              : installing
              ? 'bg-blue-600/80 text-white cursor-wait'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-98 text-white shadow-blue-500/30'
          }`}
        >
          {installing && (
            <div
              className="absolute left-0 top-0 bottom-0 bg-blue-800/60 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          )}

          <div className="relative z-10 flex items-center gap-2">
            {installed ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Installed (Open)</span>
              </>
            ) : installing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Installing APK ({progress}%)...</span>
              </>
            ) : (
              'Install'
            )}
          </div>
        </button>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified by Nur Protect</span>
          </span>
          <span className="text-slate-500">Size: {app.size}</span>
        </div>
      </div>

      {/* Screenshots Carousel matching Screen 4 */}
      <ScreenshotViewer screenshots={app.screenshots} appName={app.name} />

      {/* About this app section with chevron matching Screen 4 */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 mb-6">
        <div 
          onClick={() => setIsDescExpanded(!isDescExpanded)}
          className="flex items-center justify-between cursor-pointer mb-2"
        >
          <h2 className="text-base font-bold text-slate-900">
            About this app
          </h2>
          <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isDescExpanded ? 'rotate-90' : ''}`} />
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {isDescExpanded ? app.fullDescription : app.fullDescription.slice(0, 240) + (app.fullDescription.length > 240 ? '...' : '')}
        </p>

        {/* Tag pills matching Screen 4: [Education] [Islamic] [Offline] [Free] */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-200/80 text-slate-700 border border-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Ratings & Reviews with Community Comment Search */}
      <CommentSection
        appId={app.id}
        initialComments={app.comments || []}
        overallRating={app.rating}
        ratingCount={app.ratingCount || 12000}
        ratingBreakdown={app.ratingBreakdown}
        onCommentAdded={(newComment, updatedApp) => {
          if (updatedApp) setApp(updatedApp);
        }}
      />

      {/* Special Share Modal */}
      {app && (
        <ShareAppModal
          app={app}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

    </div>
  );
}
