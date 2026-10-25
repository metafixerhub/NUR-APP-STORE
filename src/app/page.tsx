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
  Sparkles,
  Smartphone,
  Monitor
} from 'lucide-react';
import { AppItem } from '@/types/app';
import { INITIAL_APPS } from '@/data/initialApps';
import AppCard from '@/components/AppCard';
import SplashScreen from '@/components/SplashScreen';

const FEATURE_BADGES = [
  { icon: ShieldCheck, label: 'Safe Apps', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { icon: CloudDownload, label: 'Easy Download', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  { icon: Grid, label: 'Many Categories', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  { icon: Star, label: 'User Friendly', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
];

const HOME_CATEGORIES = [
  {
    name: 'Education',
    categoryKey: 'Education',
    icon: GraduationCap,
    bgColor: 'bg-blue-50/90 dark:bg-blue-950/30',
    borderColor: 'border-blue-200/80 dark:border-blue-900/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100/80 dark:bg-blue-900/40',
  },
  {
    name: 'Productivity',
    categoryKey: 'Productivity',
    icon: BarChart2,
    bgColor: 'bg-emerald-50/90 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200/80 dark:border-emerald-900/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100/80 dark:bg-emerald-900/40',
  },
  {
    name: 'Islamic',
    categoryKey: 'Islamic & Quran',
    icon: Moon,
    bgColor: 'bg-teal-50/90 dark:bg-teal-950/30',
    borderColor: 'border-teal-200/80 dark:border-teal-900/50',
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-teal-100/80 dark:bg-teal-900/40',
  },
  {
    name: 'Tools',
    categoryKey: 'Tools & Utilities',
    icon: Wrench,
    bgColor: 'bg-purple-50/90 dark:bg-purple-950/30',
    borderColor: 'border-purple-200/80 dark:border-purple-900/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-100/80 dark:bg-purple-900/40',
  },
  {
    name: 'Multimedia',
    categoryKey: 'Media & Video',
    icon: PlayCircle,
    bgColor: 'bg-pink-50/90 dark:bg-pink-950/30',
    borderColor: 'border-pink-200/80 dark:border-pink-900/50',
    iconColor: 'text-pink-600 dark:text-pink-400',
    iconBg: 'bg-pink-100/80 dark:bg-pink-900/40',
  },
  {
    name: 'Lifestyle',
    categoryKey: 'Islamic & Quran',
    icon: ShoppingBag,
    bgColor: 'bg-amber-50/90 dark:bg-amber-950/30',
    borderColor: 'border-amber-200/80 dark:border-amber-900/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-100/80 dark:bg-amber-900/40',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [apps, setApps] = useState<AppItem[]>(INITIAL_APPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

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
      {/* 1. Splash Screen transition matching Screen 1 */}
      <SplashScreen />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 pb-24">
        
        {/* Top Showcase Showcase Badges (Matching top banner in screenshot) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 pt-2">
          {FEATURE_BADGES.map((b) => {
            const Icon = b.icon;
            return (
              <span
                key={b.label}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-xs ${b.color}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{b.label}</span>
              </span>
            );
          })}
        </div>

        {/* Top Header Bar matching Screen 2: Logo on left, Settings on right */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-emerald-500 dark:text-emerald-400">
              Nur
            </span>
            <span className="text-xl font-bold text-slate-800 dark:text-white">
              App Store
            </span>
          </div>

          <NextLink
            href="/admin"
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-nur-surface text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Admin Portal Settings"
          >
            <Settings className="w-5 h-5" />
          </NextLink>
        </div>

        {/* Search Bar matching Screen 2 */}
        <form onSubmit={handleSearchSubmit} className="relative mb-5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for apps..."
            className="w-full pl-4 pr-11 py-3 rounded-2xl bg-slate-100 dark:bg-nur-navy/90 border border-slate-200 dark:border-nur-border text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-xs"
          />
          <button
            type="submit"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        {/* Hero Banner matching Screen 2: "Useful Apps For Your Daily Life" */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#071B2F] via-[#09223D] to-[#0A2D4F] p-5 sm:p-6 mb-6 shadow-xl border border-slate-700/40 text-white">
          {/* Mosque twilight silhouette ambient backdrop */}
          <div className="absolute right-0 top-0 bottom-0 w-48 opacity-30 pointer-events-none">
            <Image
              src="/logo.png"
              alt="Mosque glow"
              fill
              sizes="200px"
              className="object-contain object-right"
            />
          </div>

          <div className="relative z-10 max-w-[240px] sm:max-w-xs space-y-3">
            <h2 className="text-lg sm:text-xl font-black leading-snug tracking-tight">
              Useful Apps <br />
              <span className="text-slate-200 font-bold">For Your Daily Life</span>
            </h2>

            <NextLink
              href="/categories"
              className="inline-block px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-xs font-bold text-white shadow-md shadow-blue-600/30 transition-all"
            >
              Explore Now
            </NextLink>
          </div>
        </div>

        {/* Categories Section with "See All" link matching Screen 2 */}
        <div className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Categories
            </h2>
            <NextLink
              href="/categories"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </NextLink>
          </div>

          {/* 6 Category Rounded Cards (Screen 2) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {HOME_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategoryFilter === cat.categoryKey;
              return (
                <button
                  key={cat.name}
                  onClick={() => {
                    setSelectedCategoryFilter(isSelected ? null : cat.categoryKey);
                  }}
                  className={`p-3.5 rounded-2xl border ${cat.bgColor} ${cat.borderColor} flex flex-col items-center justify-center text-center transition-all duration-200 active:scale-95 hover:shadow-xs ${
                    isSelected ? 'ring-2 ring-blue-500 scale-102' : ''
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${cat.iconBg} ${cat.iconColor} mb-1.5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate w-full">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Popular Apps Section with "See All" link matching Screen 2 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedCategoryFilter ? `${selectedCategoryFilter} Apps` : 'Popular Apps'}
              </h2>
              {selectedCategoryFilter && (
                <button
                  onClick={() => setSelectedCategoryFilter(null)}
                  className="text-[11px] text-blue-500 hover:underline"
                >
                  (Reset)
                </button>
              )}
            </div>

            <NextLink
              href="/search"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </NextLink>
          </div>

          {/* List of Apps in Row Layout matching Screen 2 */}
          <div className="space-y-3">
            {popularApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                layout="row"
              />
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
