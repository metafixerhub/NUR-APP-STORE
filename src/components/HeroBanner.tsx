'use client';

import React from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  ShieldCheck, 
  Download, 
  Star, 
  Flame, 
  CheckCircle2, 
  ArrowRight,
  UploadCloud
} from 'lucide-react';
import { AppItem } from '@/types/app';

interface HeroBannerProps {
  featuredApp?: AppItem;
}

export default function HeroBanner({ featuredApp }: HeroBannerProps) {
  const app = featuredApp;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-nur-border/70 bg-gradient-to-br from-nur-navy via-nur-midnight to-nur-dark shadow-2xl mb-10">
      {/* Twilight & Mosque Ambient Glow Background Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-nur-gold/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-nur-emerald/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
      
      {/* Decorative stars / crescent shimmer */}
      <div className="absolute top-6 right-10 flex items-center gap-1.5 opacity-60">
        <Sparkles className="w-5 h-5 text-nur-goldLight animate-pulse" />
      </div>

      <div className="relative p-6 sm:p-8 md:p-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-nur-pillBg border border-nur-gold/40 text-xs font-semibold text-nur-gold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Direct APK Publishing & Distribution</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Discover & Download <br />
              <span className="text-gold-gradient font-sans">
                Authentic Android Apps
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Welcome to <span className="text-white font-semibold">Nur App Store</span>. Direct APK installation without barriers, verified for security and performance. Anyone can browse, download, and publishers can easily upload.
            </p>

            {/* Badges / Guarantees */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-nur-surface border border-nur-border">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified Clean APKs
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-nur-surface border border-nur-border">
                <CheckCircle2 className="w-4 h-4 text-nur-gold" />
                Zero Forced Ads
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-nur-surface border border-nur-border">
                <Flame className="w-4 h-4 text-amber-400" />
                Fast Direct Download
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="#apps-section"
                className="btn-gold px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-nur-gold/40 transition-all"
              >
                <span>Browse Store</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <NextLink
                href="/admin"
                className="px-5 py-3 rounded-2xl text-sm font-bold text-slate-200 hover:text-white bg-nur-surface hover:bg-nur-hover border border-nur-border hover:border-nur-gold/50 flex items-center gap-2 transition-all"
              >
                <UploadCloud className="w-4 h-4 text-nur-gold" />
                <span>Upload APK (Admin)</span>
              </NextLink>
            </div>
          </div>

          {/* Right Spotlight App Card */}
          {app && (
            <div className="lg:col-span-5">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-nur-gold via-nur-emerald to-nur-goldLight opacity-30 blur-xl group-hover:opacity-50 transition duration-500"></div>
                <div className="relative rounded-2xl bg-nur-navy/90 border border-nur-border/90 p-5 sm:p-6 backdrop-blur-md shadow-2xl">
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      Editor's Choice
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {app.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-18 h-18 rounded-2xl overflow-hidden shadow-lg border border-nur-border shrink-0 bg-nur-dark">
                      <Image
                        src={app.iconUrl || '/logo.png'}
                        alt={app.name}
                        width={72}
                        height={72}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-snug line-clamp-1 group-hover:text-nur-gold transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-xs text-slate-400 mb-2">{app.developer}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 font-semibold text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {app.rating.toFixed(1)}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-300 font-medium">{app.downloads} downloads</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-300 font-medium">{app.size}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 mb-5 leading-relaxed">
                    {app.shortDescription}
                  </p>

                  <div className="flex items-center gap-2">
                    <NextLink
                      href={`/app/${app.id}`}
                      className="flex-1 py-2.5 rounded-xl btn-emerald text-xs font-bold text-center flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download APK</span>
                    </NextLink>
                    <NextLink
                      href={`/app/${app.id}`}
                      className="px-4 py-2.5 rounded-xl bg-nur-surface hover:bg-nur-hover border border-nur-border text-xs font-semibold text-slate-200 transition-colors"
                    >
                      Details
                    </NextLink>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
