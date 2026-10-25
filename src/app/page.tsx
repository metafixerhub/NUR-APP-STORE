'use client';

import React, { useState, useEffect, useMemo } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Settings, 
  ChevronRight, 
  GraduationCap, 
  BarChart2, 
  Moon, 
  Wrench, 
  PlayCircle, 
  ShoppingBag,
  ShieldCheck,
  CloudDownload,
  Grid,
  Star,
  Monitor,
  Smartphone
} from 'lucide-react';
import { AppItem } from '@/types/app';
import { INITIAL_APPS } from '@/data/initialApps';
import AppCard from '@/components/AppCard';
import SplashScreen from '@/components/SplashScreen';
import ShowcaseGallery from '@/components/ShowcaseGallery';

const FEATURE_BADGES = [
  { icon: ShieldCheck, label: 'Safe Apps', color: 'text-emerald-600 bg-white border-emerald-300' },
  { icon: CloudDownload, label: 'Easy Download', color: 'text-blue-600 bg-white border-blue-300' },
  { icon: Grid, label: 'Many Categories', color: 'text-pink-600 bg-white border-pink-300' },
  { icon: Star, label: 'User Friendly', color: 'text-amber-600 bg-white border-amber-300' },
];

const HOME_CATEGORIES = [
  {
    name: 'Education',
    categoryKey: 'Education',
    icon: GraduationCap,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
  },
  {
    name: 'Productivity',
    categoryKey: 'Productivity',
    icon: BarChart2,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-100',
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
  },
  {
    name: 'Islamic',
    categoryKey: 'Islamic & Quran',
    icon: Moon,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
  },
  {
    name: 'Tools',
    categoryKey: 'Tools & Utilities',
    icon: Wrench,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-100',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
  },
  {
    name: 'Multimedia',
    categoryKey: 'Media & Video',
    icon: PlayCircle,
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-100',
    iconColor: 'text-pink-600',
    iconBg: 'bg-pink-100',
  },
  {
    name: 'Lifestyle',
    categoryKey: 'Islamic & Quran',
    icon: ShoppingBag,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [apps, setApps] = useState<AppItem[]>(INITIAL_APPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  
  // On desktop: default to the 5-screen showcase view matching user's image!
  const [desktopView, setDesktopView] = useState<'showcase' | 'single'>('showcase');

  useEffect(() => {
    fetch('/api/apps')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.apps) {
          setApps(data.apps);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const popularApps = useMemo(() => {
    if (selectedCategoryFilter) {
      return apps.filter((a) => a.category === selectedCategoryFilter);
    }
    return apps;
  }, [apps, selectedCategoryFilter]);

  return (
    <>
      {/* ========================================================
          DESKTOP VIEW: 5-SCREEN UI SHOWCASE (DITTO MATCH)
          ======================================================== */}
      <div className="hidden lg:block">
        {desktopView === 'showcase' ? (
          <div>
            {/* View Mode Toggle at Top */}
            <div className="bg-slate-900 text-white py-2 px-6 flex items-center justify-between text-xs border-b border-slate-800">
              <span className="font-semibold text-slate-300">
                ⭐ <strong>Ditto Showcase Mode Active</strong> — Matching your mobile UI showcase design
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDesktopView('single')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Single Phone Interactive View</span>
                </button>
                <NextLink
                  href="/admin"
                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-white transition-colors"
                >
                  Admin Portal
                </NextLink>
              </div>
            </div>

            <ShowcaseGallery />
          </div>
        ) : (
          <div className="min-h-screen bg-slate-900 py-10 flex flex-col items-center justify-center">
            {/* Toggle back to showcase */}
            <div className="mb-6 flex items-center gap-4">
              <button
                onClick={() => setDesktopView('showcase')}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg transition-all"
              >
                <Monitor className="w-4 h-4" />
                <span>Switch to 5-Screen UI Showcase</span>
              </button>
              <NextLink
                href="/admin"
                className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
              >
                Admin Portal
              </NextLink>
            </div>

            {/* Centered Phone Frame */}
            <div className="phone-frame w-[380px] h-[780px] bg-white text-slate-900 shadow-2xl">
              <div className="phone-punchhole"></div>

              {/* Status Bar */}
              <div className="w-full flex items-center justify-between px-7 pt-3 text-[11px] font-mono text-slate-600 z-40 bg-white">
                <span>10:30</span>
                <div className="flex items-center gap-1 text-[10px]">
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>

              {/* Scrollable Screen Body */}
              <div className="phone-screen p-4 space-y-4 bg-white">
                {/* Header */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-black text-emerald-600">Nur</span>
                    <span className="text-xl font-black text-slate-900">App Store</span>
                  </div>
                  <NextLink href="/admin" className="p-1 text-slate-500 hover:text-slate-900">
                    <Settings className="w-5 h-5" />
                  </NextLink>
                </div>

                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for apps..."
                    className="w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Search className="w-4 h-4" />
                  </button>
                </form>

                {/* Hero Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#071B2F] via-[#09223D] to-[#0A2D4F] p-4 text-white shadow-md">
                  <div className="absolute right-0 top-0 bottom-0 w-28 opacity-30 pointer-events-none">
                    <Image src="/logo.png" alt="Mosque" fill sizes="112px" className="object-contain object-right" />
                  </div>
                  <div className="relative z-10 space-y-2 max-w-[180px]">
                    <h3 className="text-xs font-black leading-snug">
                      Useful Apps <br />
                      <span className="font-semibold text-slate-200">For Your Daily Life</span>
                    </h3>
                    <NextLink
                      href="/categories"
                      className="inline-block px-3.5 py-1.5 rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm"
                    >
                      Explore Now
                    </NextLink>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">Categories</span>
                    <NextLink href="/categories" className="text-[10px] font-bold text-blue-600 hover:underline">
                      See All
                    </NextLink>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {HOME_CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <NextLink
                          key={cat.name}
                          href="/categories"
                          className={`p-2.5 rounded-xl ${cat.bgColor} border ${cat.borderColor} flex flex-col items-center text-center`}
                        >
                          <div className={`p-1.5 rounded-lg ${cat.iconBg} ${cat.iconColor} mb-1`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-800">{cat.name}</span>
                        </NextLink>
                      );
                    })}
                  </div>
                </div>

                {/* Popular Apps */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">Popular Apps</span>
                    <NextLink href="/categories" className="text-[10px] font-bold text-blue-600 hover:underline">
                      See All
                    </NextLink>
                  </div>
                  <div className="space-y-2.5">
                    {popularApps.slice(0, 4).map((app) => (
                      <AppCard key={app.id} app={app} layout="row" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="w-full bg-white border-t border-slate-200 py-2 px-5 flex items-center justify-around text-slate-500 text-[10px] font-medium">
                <div className="flex flex-col items-center text-blue-600 font-bold">
                  <span className="w-4 h-4 mb-0.5">🏠</span>
                  <span>Home</span>
                </div>
                <NextLink href="/categories" className="flex flex-col items-center">
                  <span className="w-4 h-4 mb-0.5">⊞</span>
                  <span>Categories</span>
                </NextLink>
                <NextLink href="/updates" className="flex flex-col items-center relative">
                  <span className="w-4 h-4 mb-0.5">📥</span>
                  <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">2</span>
                  <span>Updates</span>
                </NextLink>
                <NextLink href="/admin" className="flex flex-col items-center">
                  <span className="w-4 h-4 mb-0.5">👤</span>
                  <span>Profile</span>
                </NextLink>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          MOBILE VIEW (ON SMARTPHONES & TABLETS)
          ======================================================== */}
      <div className="lg:hidden">
        <SplashScreen />

        <div className="max-w-md mx-auto px-4 py-4 pb-24">
          
          {/* Top 4 Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5 pt-1">
            {FEATURE_BADGES.map((b) => {
              const Icon = b.icon;
              return (
                <span
                  key={b.label}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border shadow-xs ${b.color}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{b.label}</span>
                </span>
              );
            })}
          </div>

          {/* Top Bar: Nur App Store + Settings */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-emerald-600">Nur</span>
              <span className="text-xl font-black text-slate-900">App Store</span>
            </div>

            <NextLink
              href="/admin"
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
              title="Admin Portal Settings"
            >
              <Settings className="w-5 h-5" />
            </NextLink>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative mb-5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for apps..."
              className="w-full pl-4 pr-11 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#071B2F] via-[#09223D] to-[#0A2D4F] p-5 mb-6 shadow-md text-white">
            <div className="absolute right-0 top-0 bottom-0 w-36 opacity-30 pointer-events-none">
              <Image src="/logo.png" alt="Mosque" fill sizes="144px" className="object-contain object-right" />
            </div>

            <div className="relative z-10 max-w-[200px] space-y-2.5">
              <h2 className="text-sm font-black leading-snug">
                Useful Apps <br />
                <span className="text-slate-200 font-semibold">For Your Daily Life</span>
              </h2>

              <NextLink
                href="/categories"
                className="inline-block px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-md shadow-blue-600/30"
              >
                Explore Now
              </NextLink>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Categories</h2>
              <NextLink href="/categories" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5">
                <span>See All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </NextLink>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {HOME_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <NextLink
                    key={cat.name}
                    href="/categories"
                    className={`p-3 rounded-2xl border ${cat.bgColor} ${cat.borderColor} flex flex-col items-center justify-center text-center`}
                  >
                    <div className={`p-2 rounded-xl ${cat.iconBg} ${cat.iconColor} mb-1`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 truncate w-full">
                      {cat.name}
                    </span>
                  </NextLink>
                );
              })}
            </div>
          </div>

          {/* Popular Apps */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Popular Apps</h2>
              <NextLink href="/categories" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5">
                <span>See All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </NextLink>
            </div>

            <div className="space-y-2.5">
              {popularApps.map((app) => (
                <AppCard key={app.id} app={app} layout="row" />
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
