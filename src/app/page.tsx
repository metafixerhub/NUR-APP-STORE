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
  ArrowRight
} from 'lucide-react';
import { AppItem } from '@/types/app';
import { INITIAL_APPS } from '@/data/initialApps';
import AppCard from '@/components/AppCard';

const FEATURE_BADGES = [
  { icon: ShieldCheck, label: 'Safe Apps', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { icon: CloudDownload, label: 'Easy Download', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { icon: Grid, label: 'Many Categories', color: 'text-pink-700 bg-pink-50 border-pink-200' },
  { icon: Star, label: 'User Friendly', color: 'text-amber-700 bg-amber-50 border-amber-200' },
];

const HOME_CATEGORIES = [
  {
    name: 'Education',
    categoryKey: 'Education',
    count: '150+ Apps',
    icon: GraduationCap,
    bgColor: 'bg-blue-50',
    hoverBg: 'hover:bg-blue-100/60',
    borderColor: 'border-blue-100',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
  },
  {
    name: 'Productivity',
    categoryKey: 'Productivity',
    count: '120+ Apps',
    icon: BarChart2,
    bgColor: 'bg-green-50',
    hoverBg: 'hover:bg-green-100/60',
    borderColor: 'border-green-100',
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
  },
  {
    name: 'Islamic',
    categoryKey: 'Islamic & Quran',
    count: '80+ Apps',
    icon: Moon,
    bgColor: 'bg-emerald-50',
    hoverBg: 'hover:bg-emerald-100/60',
    borderColor: 'border-emerald-100',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
  },
  {
    name: 'Tools',
    categoryKey: 'Tools & Utilities',
    count: '100+ Apps',
    icon: Wrench,
    bgColor: 'bg-purple-50',
    hoverBg: 'hover:bg-purple-100/60',
    borderColor: 'border-purple-100',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
  },
  {
    name: 'Multimedia',
    categoryKey: 'Media & Video',
    count: '90+ Apps',
    icon: PlayCircle,
    bgColor: 'bg-pink-50',
    hoverBg: 'hover:bg-pink-100/60',
    borderColor: 'border-pink-100',
    iconColor: 'text-pink-600',
    iconBg: 'bg-pink-100',
  },
  {
    name: 'Lifestyle',
    categoryKey: 'Lifestyle',
    count: '70+ Apps',
    icon: ShoppingBag,
    bgColor: 'bg-amber-50',
    hoverBg: 'hover:bg-amber-100/60',
    borderColor: 'border-amber-100',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [apps, setApps] = useState<AppItem[]>(INITIAL_APPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  useEffect(() => {
    fetch('/api/apps')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.apps)) {
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

  const categoriesList = ['All', 'Islamic & Quran', 'Education', 'Productivity', 'Tools & Utilities', 'Media & Video'];

  const filteredApps = useMemo(() => {
    if (selectedCategoryFilter === 'All') return apps;
    return apps.filter((a) => a.category === selectedCategoryFilter);
  }, [apps, selectedCategoryFilter]);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col pb-24 sm:pb-16">
      
      {/* ========================================================
          TOP NAVIGATION BAR (DESKTOP & MOBILE RESPONSIVE)
          ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Store Branding */}
          <NextLink href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden border border-emerald-500/30 shadow-xs">
              <Image src="/logo.png" alt="Nur Logo" fill sizes="44px" className="object-contain" priority />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">Nur</span>
                <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">App Store</span>
              </div>
              <p className="hidden md:block text-[10px] text-slate-500 font-medium -mt-0.5">
                Discover Useful Apps for Your Daily Life
              </p>
            </div>
          </NextLink>

          {/* Search Bar in Desktop Header */}
          <div className="hidden sm:block flex-1 max-w-lg mx-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for verified apps, tools, books..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-inner"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </form>
          </div>

          {/* Desktop Nav Links & Admin Portal Link */}
          <div className="flex items-center gap-2 sm:gap-4">
            <NextLink
              href="/categories"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Grid className="w-4 h-4 text-slate-500" />
              <span>Categories</span>
            </NextLink>

            <NextLink
              href="/updates"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors relative"
            >
              <CloudDownload className="w-4 h-4 text-slate-500" />
              <span>Updates</span>
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                2
              </span>
            </NextLink>

            <NextLink
              href="/admin"
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Portal</span>
            </NextLink>
          </div>

        </div>
      </header>

      {/* ========================================================
          MAIN APP STORE CONTENT CONTAINER
          ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 w-full space-y-6">

        {/* Feature Badges Header Bar */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          {FEATURE_BADGES.map((b) => {
            const Icon = b.icon;
            return (
              <span
                key={b.label}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold border shadow-xs ${b.color}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{b.label}</span>
              </span>
            );
          })}
        </div>

        {/* Mobile Search Bar (Visible on mobile screens) */}
        <div className="sm:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for apps..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </form>
        </div>

        {/* ========================================================
            HERO BANNER (MATCHES SCREEN 2 DESIGN)
            ======================================================== */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#071B2F] via-[#09223D] to-[#0A2D4F] p-6 sm:p-8 text-white shadow-lg">
          {/* Mosque background graphic from logo */}
          <div className="absolute right-0 top-0 bottom-0 w-44 sm:w-80 opacity-25 pointer-events-none">
            <Image src="/logo.png" alt="Mosque" fill sizes="(max-width: 640px) 176px, 320px" className="object-contain object-right" />
          </div>

          <div className="relative z-10 max-w-sm sm:max-w-md space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Official Curated Store</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black leading-tight tracking-tight">
              Useful Apps <br />
              <span className="font-semibold text-slate-200 text-lg sm:text-2xl">For Your Daily Life</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xs leading-relaxed">
              Explore safe, verified Android APKs built for productivity, knowledge, and daily lifestyle.
            </p>

            <div className="pt-1">
              <NextLink
                href="/categories"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-98 text-xs font-bold text-white shadow-md shadow-blue-600/30 transition-all"
              >
                <span>Explore Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NextLink>
            </div>
          </div>
        </div>

        {/* ========================================================
            CATEGORIES SECTION (MATCHES SCREEN 2 & 3)
            ======================================================== */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Categories</h2>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                • 6 Main Categories
              </span>
            </div>
            <NextLink
              href="/categories"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 group"
            >
              <span>See All</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </NextLink>
          </div>

          {/* 6 Category Rounded Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3.5">
            {HOME_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <NextLink
                  key={cat.name}
                  href="/categories"
                  className={`p-3 sm:p-4 rounded-2xl border ${cat.bgColor} ${cat.hoverBg} ${cat.borderColor} flex flex-col items-center justify-center text-center transition-all duration-200 hover:shadow-xs group`}
                >
                  <div className={`p-2 sm:p-2.5 rounded-xl ${cat.iconBg} ${cat.iconColor} mb-2 shadow-xs group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 truncate w-full">
                    {cat.name}
                  </span>
                  <span className="hidden sm:block text-[10px] font-semibold text-slate-500 mt-0.5">
                    {cat.count}
                  </span>
                </NextLink>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            POPULAR APPS SECTION (MATCHES SCREEN 2)
            ======================================================== */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Popular Apps</h2>
              <span className="text-xs text-slate-400 font-medium">
                ({filteredApps.length} Available)
              </span>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategoryFilter === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                  }`}
                >
                  {cat === 'All' ? 'All Apps' : cat.split(' & ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Apps Layout: Single Column List on Mobile, 2-Column Responsive Grid on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {filteredApps.map((app) => (
              <AppCard key={app.id} app={app} layout="row" />
            ))}
          </div>

          {filteredApps.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-xs font-bold text-slate-600">No apps found in this category</p>
              <button
                onClick={() => setSelectedCategoryFilter('All')}
                className="mt-2 text-xs font-bold text-blue-600 hover:underline"
              >
                Reset filter
              </button>
            </div>
          )}
        </div>

      </main>

    </div>
  );
}
