'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { 
  ShieldCheck, 
  CloudDownload, 
  Grid, 
  Star, 
  Search, 
  Settings, 
  ChevronRight, 
  ArrowLeft, 
  MoreVertical, 
  Pause, 
  Play, 
  GraduationCap, 
  Moon, 
  BarChart2, 
  PlayCircle, 
  Wrench, 
  ShoppingBag, 
  Heart, 
  Users, 
  Gamepad2, 
  CheckCircle2, 
  Home, 
  DownloadCloud, 
  User,
  Sliders,
  Smartphone,
  Layers,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ShowcaseGallery() {
  // Interactive state inside Phone 2 & 4
  const [phone4Installed, setPhone4Installed] = useState(false);
  const [phone4Installing, setPhone4Installing] = useState(false);
  const [phone4Progress, setPhone4Progress] = useState(0);

  // Phone 5 Downloading apps
  const [namazPaused, setNamazPaused] = useState(false);
  const [quranPaused, setQuranPaused] = useState(false);

  const handleInstallNamaz = () => {
    if (phone4Installing) return;
    if (phone4Installed) {
      alert('Namaz Guide is installed on your device!');
      return;
    }

    setPhone4Installing(true);
    setPhone4Progress(20);

    setTimeout(() => setPhone4Progress(55), 300);
    setTimeout(() => setPhone4Progress(88), 650);
    setTimeout(() => {
      setPhone4Progress(100);
      setPhone4Installing(false);
      setPhone4Installed(true);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563EB', '#10B981', '#F59E0B'],
        });
      } catch (e) {}

      // Trigger download
      const link = document.createElement('a');
      link.href = '/sample-apks/namaz-guide-v2.4.0.apk';
      link.download = 'namaz-guide-v2.4.0.apk';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 950);
  };

  const handleQuickDownload = (appName: string, apkFile: string) => {
    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2563EB', '#10B981', '#F59E0B'],
      });
    } catch (e) {}

    const link = document.createElement('a');
    link.href = `/sample-apks/${apkFile}`;
    link.download = apkFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      
      {/* ========================================================
          TOP HEADER - DITTO MATCH WITH SHOWCASE IMAGE
          ======================================================== */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-2xl shrink-0 border-2 border-emerald-500/30">
              <Image
                src="/logo.png"
                alt="Nur App Store Logo"
                fill
                sizes="112px"
                className="object-contain"
                priority
              />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-5xl font-black text-emerald-800 dark:text-emerald-400 tracking-tight">
                  Nur
                </span>
                <span className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                  App Store
                </span>
              </div>
              <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 font-semibold mt-1">
                Discover Useful Apps for a Better Life
              </p>
            </div>
          </div>

          {/* 4 Pill Badges matching showcase top row */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 shadow-sm text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4 fill-emerald-500 text-white" />
              <span>Safe Apps</span>
            </div>

            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 shadow-sm text-xs font-bold text-blue-600 dark:text-blue-400">
              <CloudDownload className="w-4 h-4 text-blue-500 fill-blue-500/20" />
              <span>Easy Download</span>
            </div>

            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-pink-300 dark:border-pink-700 shadow-sm text-xs font-bold text-pink-600 dark:text-pink-400">
              <Grid className="w-4 h-4 text-pink-500" />
              <span>Many Categories</span>
            </div>

            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 shadow-sm text-xs font-bold text-amber-600 dark:text-amber-400">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>User Friendly</span>
            </div>

            <NextLink
              href="/admin"
              className="ml-auto lg:ml-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Portal</span>
            </NextLink>
          </div>

        </div>
      </div>

      {/* ========================================================
          5 MOBILE PHONES DISPLAYED SIDE BY SIDE (DITTO MATCH)
          ======================================================== */}
      <div className="max-w-[1700px] mx-auto overflow-x-auto pb-8 pt-2 no-scrollbar">
        <div className="flex items-start justify-center gap-6 min-w-max px-2">

          {/* ----------------------------------------------------
              PHONE 1: 1. SPLASH SCREEN
              ---------------------------------------------------- */}
          <div className="flex flex-col items-center gap-4">
            <div className="phone-frame w-[310px] h-[640px] bg-gradient-to-b from-[#071626] via-[#05111F] to-[#030913] text-white">
              
              {/* Punch Hole */}
              <div className="phone-punchhole"></div>

              {/* Status Bar */}
              <div className="w-full flex items-center justify-between px-6 pt-3 text-[11px] font-mono text-slate-300 z-40">
                <span>10:30</span>
                <div className="flex items-center gap-1 text-[10px]">
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>

              {/* Screen Content: Twilight Mosque Atmosphere & 3D Logo */}
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative">
                
                {/* Twilight Mosque Glow Illustration in background */}
                <div className="absolute inset-0 opacity-40 pointer-events-none flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Mosque Glow"
                    width={280}
                    height={280}
                    className="object-contain"
                  />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative w-36 h-36 mb-4 drop-shadow-2xl">
                    <Image
                      src="/logo.png"
                      alt="Nur Logo"
                      fill
                      sizes="144px"
                      className="object-contain"
                      priority
                    />
                  </div>

                  <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                    Nur
                  </h2>
                  <div className="mt-1 px-3 py-0.5 rounded-full bg-[#043229] border border-amber-400 text-amber-300 text-xs font-black shadow-md">
                    App Store
                  </div>
                </div>

              </div>

              {/* Bottom Loading Bar */}
              <div className="w-full px-8 pb-8 flex flex-col items-center gap-2 z-10">
                <span className="text-xs text-slate-300 font-medium tracking-wide">
                  Loading...
                </span>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                  <div className="h-full w-1/2 bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 rounded-full shadow-sm animate-pulse"></div>
                </div>
              </div>

            </div>

            {/* Bottom Caption Pill */}
            <div className="px-5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md">
              1. Splash Screen
            </div>
          </div>


          {/* ----------------------------------------------------
              PHONE 2: 2. HOME PAGE
              ---------------------------------------------------- */}
          <div className="flex flex-col items-center gap-4">
            <div className="phone-frame w-[310px] h-[640px] bg-white text-slate-900">
              
              <div className="phone-punchhole"></div>

              {/* Status Bar */}
              <div className="w-full flex items-center justify-between px-6 pt-3 text-[11px] font-mono text-slate-600 z-40 bg-white">
                <span>10:30</span>
                <div className="flex items-center gap-1 text-[10px]">
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>

              {/* Screen Body */}
              <div className="phone-screen p-4 space-y-3.5 bg-white">
                
                {/* Header: Nur App Store + Settings */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-black text-emerald-600">Nur</span>
                    <span className="text-lg font-black text-slate-900">App Store</span>
                  </div>
                  <NextLink href="/admin" className="p-1 text-slate-500 hover:text-slate-900">
                    <Settings className="w-4 h-4" />
                  </NextLink>
                </div>

                {/* Search Bar */}
                <NextLink href="/search" className="block relative">
                  <div className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-400 flex items-center justify-between shadow-xs">
                    <span>Search for apps...</span>
                    <Search className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </NextLink>

                {/* Hero Banner: Useful Apps For Your Daily Life */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#071B2F] via-[#09223D] to-[#0A2D4F] p-3.5 text-white shadow-md">
                  <div className="absolute right-0 top-0 bottom-0 w-24 opacity-30 pointer-events-none">
                    <Image src="/logo.png" alt="Mosque" fill sizes="96px" className="object-contain object-right" />
                  </div>
                  <div className="relative z-10 space-y-1.5 max-w-[160px]">
                    <h3 className="text-xs font-black leading-snug">
                      Useful Apps <br />
                      <span className="font-semibold text-slate-200">For Your Daily Life</span>
                    </h3>
                    <NextLink
                      href="/categories"
                      className="inline-block px-3 py-1 rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm"
                    >
                      Explore Now
                    </NextLink>
                  </div>
                </div>

                {/* Categories Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">Categories</span>
                    <NextLink href="/categories" className="text-[10px] font-bold text-blue-600 hover:underline">
                      See All
                    </NextLink>
                  </div>

                  {/* 6 Category Rounded Cards */}
                  <div className="grid grid-cols-3 gap-2">
                    <NextLink href="/categories" className="p-2 rounded-xl bg-blue-50 border border-blue-100 flex flex-col items-center text-center">
                      <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600 mb-1">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-800">Education</span>
                    </NextLink>

                    <NextLink href="/categories" className="p-2 rounded-xl bg-green-50 border border-green-100 flex flex-col items-center text-center">
                      <div className="p-1.5 rounded-lg bg-green-100 text-green-600 mb-1">
                        <BarChart2 className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-800">Productivity</span>
                    </NextLink>

                    <NextLink href="/categories" className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col items-center text-center">
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 mb-1">
                        <Moon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-800">Islamic</span>
                    </NextLink>

                    <NextLink href="/categories" className="p-2 rounded-xl bg-purple-50 border border-purple-100 flex flex-col items-center text-center">
                      <div className="p-1.5 rounded-lg bg-purple-100 text-purple-600 mb-1">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-800">Tools</span>
                    </NextLink>

                    <NextLink href="/categories" className="p-2 rounded-xl bg-pink-50 border border-pink-100 flex flex-col items-center text-center">
                      <div className="p-1.5 rounded-lg bg-pink-100 text-pink-600 mb-1">
                        <PlayCircle className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-800">Multimedia</span>
                    </NextLink>

                    <NextLink href="/categories" className="p-2 rounded-xl bg-amber-50 border border-amber-100 flex flex-col items-center text-center">
                      <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600 mb-1">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-800">Lifestyle</span>
                    </NextLink>
                  </div>
                </div>

                {/* Popular Apps Header & List */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">Popular Apps</span>
                    <NextLink href="/categories" className="text-[10px] font-bold text-blue-600 hover:underline">
                      See All
                    </NextLink>
                  </div>

                  <div className="space-y-2">
                    {/* Quran Reader */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                          <Moon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 leading-tight truncate">Quran Reader</p>
                          <p className="text-[10px] text-slate-500 truncate">Read with Translation</p>
                          <p className="text-[10px] font-bold text-amber-500">⭐ 4.8</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleQuickDownload('Quran Reader', 'quran-reader-v3.1.2.apk')}
                        className="px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold shrink-0 shadow-xs"
                      >
                        Install
                      </button>
                    </div>

                    {/* Namaz Guide */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                          <Moon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 leading-tight truncate">Namaz Guide</p>
                          <p className="text-[10px] text-slate-500 truncate">Step by Step</p>
                          <p className="text-[10px] font-bold text-amber-500">⭐ 4.7</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleQuickDownload('Namaz Guide', 'namaz-guide-v2.4.0.apk')}
                        className="px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold shrink-0 shadow-xs"
                      >
                        Install
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Nav Bar matching Screen 2 */}
              <div className="w-full bg-white border-t border-slate-200 py-1.5 px-4 flex items-center justify-around text-slate-500 text-[9px] font-medium">
                <div className="flex flex-col items-center text-blue-600 font-bold">
                  <Home className="w-4 h-4 stroke-[2.5px]" />
                  <span>Home</span>
                </div>
                <NextLink href="/categories" className="flex flex-col items-center hover:text-slate-800">
                  <Grid className="w-4 h-4" />
                  <span>Categories</span>
                </NextLink>
                <NextLink href="/updates" className="flex flex-col items-center hover:text-slate-800 relative">
                  <DownloadCloud className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">2</span>
                  <span>Updates</span>
                </NextLink>
                <NextLink href="/admin" className="flex flex-col items-center hover:text-slate-800">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </NextLink>
              </div>

            </div>

            {/* Bottom Caption Pill */}
            <div className="px-5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md">
              2. Home Page
            </div>
          </div>


          {/* ----------------------------------------------------
              PHONE 3: 3. CATEGORIES
              ---------------------------------------------------- */}
          <div className="flex flex-col items-center gap-4">
            <div className="phone-frame w-[310px] h-[640px] bg-white text-slate-900">
              
              <div className="phone-punchhole"></div>

              {/* Status Bar */}
              <div className="w-full flex items-center justify-between px-6 pt-3 text-[11px] font-mono text-slate-600 z-40 bg-white">
                <span>10:30</span>
                <div className="flex items-center gap-1 text-[10px]">
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>

              {/* Screen Body */}
              <div className="phone-screen p-4 space-y-3 bg-white">
                
                {/* Header: "← Categories" with search icon */}
                <div className="flex items-center justify-between pt-1 mb-1">
                  <div className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4 text-slate-800" />
                    <h2 className="text-base font-bold text-slate-900">Categories</h2>
                  </div>
                  <Search className="w-4 h-4 text-slate-600" />
                </div>

                {/* 10 Category Cards in 2 Columns matching Screen 3 */}
                <div className="grid grid-cols-2 gap-2 text-left">
                  
                  {/* Education */}
                  <div className="p-2.5 rounded-xl bg-blue-50/90 border border-blue-100 flex flex-col justify-between h-20">
                    <div className="flex items-start justify-between">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Education</p>
                      <p className="text-[10px] font-semibold text-blue-500">150+ Apps</p>
                    </div>
                  </div>

                  {/* Islamic */}
                  <div className="p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-100 flex flex-col justify-between h-20">
                    <div className="flex items-start justify-between">
                      <Moon className="w-5 h-5 text-emerald-600" />
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Islamic</p>
                      <p className="text-[10px] font-semibold text-emerald-500">80+ Apps</p>
                    </div>
                  </div>

                  {/* Productivity */}
                  <div className="p-2.5 rounded-xl bg-teal-50/90 border border-teal-100 flex flex-col justify-between h-20">
                    <div className="flex items-start justify-between">
                      <BarChart2 className="w-5 h-5 text-teal-600" />
                      <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Productivity</p>
                      <p className="text-[10px] font-semibold text-teal-500">120+ Apps</p>
                    </div>
                  </div>

                  {/* Multimedia */}
                  <div className="p-2.5 rounded-xl bg-pink-50/90 border border-pink-100 flex flex-col justify-between h-20">
                    <div className="flex items-start justify-between">
                      <PlayCircle className="w-5 h-5 text-pink-600" />
                      <ChevronRight className="w-3.5 h-3.5 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Multimedia</p>
                      <p className="text-[10px] font-semibold text-pink-500">90+ Apps</p>
                    </div>
                  </div>

                  {/* Tools */}
                  <div className="p-2.5 rounded-xl bg-purple-50/90 border border-purple-100 flex flex-col justify-between h-20">
                    <div className="flex items-start justify-between">
                      <Wrench className="w-5 h-5 text-purple-600" />
                      <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Tools</p>
                      <p className="text-[10px] font-semibold text-purple-500">100+ Apps</p>
                    </div>
                  </div>

                  {/* Lifestyle */}
                  <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-100 flex flex-col justify-between h-20">
                    <div className="flex items-start justify-between">
                      <ShoppingBag className="w-5 h-5 text-amber-600" />
                      <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Lifestyle</p>
                      <p className="text-[10px] font-semibold text-amber-500">70+ Apps</p>
                    </div>
                  </div>

                  {/* Health */}
                  <div className="p-2.5 rounded-xl bg-rose-50/90 border border-rose-100 flex flex-col justify-between h-20">
                    <div className="flex items-start justify-between">
                      <Heart className="w-5 h-5 text-rose-600" />
                      <ChevronRight className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Health</p>
                      <p className="text-[10px] font-semibold text-rose-500">60+ Apps</p>
                    </div>
                  </div>

                  {/* Social */}
                  <div className="p-2.5 rounded-xl bg-sky-50/90 border border-sky-100 flex flex-col justify-between h-20">
                    <div className="flex items-start justify-between">
                      <Users className="w-5 h-5 text-sky-600" />
                      <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Social</p>
                      <p className="text-[10px] font-semibold text-sky-500">50+ Apps</p>
                    </div>
                  </div>

                  {/* Games */}
                  <div className="p-2.5 rounded-xl bg-orange-50/90 border border-orange-100 flex flex-col justify-between h-20">
                    <div className="flex items-start justify-between">
                      <Gamepad2 className="w-5 h-5 text-orange-600" />
                      <ChevronRight className="w-3.5 h-3.5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Games</p>
                      <p className="text-[10px] font-semibold text-orange-500">200+ Apps</p>
                    </div>
                  </div>

                  {/* Others */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between h-20">
                    <div className="flex items-start justify-between">
                      <Grid className="w-5 h-5 text-slate-600" />
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Others</p>
                      <p className="text-[10px] font-semibold text-slate-500">40+ Apps</p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Nav Bar */}
              <div className="w-full bg-white border-t border-slate-200 py-1.5 px-4 flex items-center justify-around text-slate-500 text-[9px] font-medium">
                <NextLink href="/" className="flex flex-col items-center hover:text-slate-800">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </NextLink>
                <div className="flex flex-col items-center text-blue-600 font-bold">
                  <Grid className="w-4 h-4 stroke-[2.5px]" />
                  <span>Categories</span>
                </div>
                <NextLink href="/updates" className="flex flex-col items-center hover:text-slate-800 relative">
                  <DownloadCloud className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">2</span>
                  <span>Updates</span>
                </NextLink>
                <NextLink href="/admin" className="flex flex-col items-center hover:text-slate-800">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </NextLink>
              </div>

            </div>

            {/* Bottom Caption Pill */}
            <div className="px-5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md">
              3. Categories
            </div>
          </div>


          {/* ----------------------------------------------------
              PHONE 4: 4. APP DETAILS (NAMAZ GUIDE)
              ---------------------------------------------------- */}
          <div className="flex flex-col items-center gap-4">
            <div className="phone-frame w-[310px] h-[640px] bg-white text-slate-900">
              
              <div className="phone-punchhole"></div>

              {/* Status Bar */}
              <div className="w-full flex items-center justify-between px-6 pt-3 text-[11px] font-mono text-slate-600 z-40 bg-white">
                <span>10:30</span>
                <div className="flex items-center gap-1 text-[10px]">
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>

              {/* Screen Body */}
              <div className="phone-screen p-4 space-y-3 bg-white">
                
                {/* Header: "←" and "⋮" */}
                <div className="flex items-center justify-between pt-1">
                  <ArrowLeft className="w-4 h-4 text-slate-800 cursor-pointer" />
                  <MoreVertical className="w-4 h-4 text-slate-600 cursor-pointer" />
                </div>

                {/* Main App Info matching Screen 4 */}
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Moon className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900 leading-tight">Namaz Guide</h2>
                    <p className="text-[10px] text-slate-600 leading-snug mt-0.5">
                      Step by Step Namaz Guide with Audio and Images
                    </p>
                    <p className="text-[11px] font-bold text-amber-500 mt-1">
                      ⭐ 4.7 <span className="text-slate-400 font-normal">(12K reviews)</span>
                    </p>
                  </div>
                </div>

                {/* Big Blue Install Button */}
                <button
                  onClick={handleInstallNamaz}
                  disabled={phone4Installing}
                  className={`w-full py-2.5 rounded-full text-xs font-bold text-white transition-all shadow-md ${
                    phone4Installed
                      ? 'bg-emerald-600'
                      : phone4Installing
                      ? 'bg-blue-700'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-98 shadow-blue-500/25'
                  }`}
                >
                  {phone4Installed ? (
                    'Installed (Open)'
                  ) : phone4Installing ? (
                    `Installing (${phone4Progress}%)...`
                  ) : (
                    'Install'
                  )}
                </button>

                {/* Horizontal Screenshots Carousel */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                  {/* Screenshot 1 */}
                  <div className="w-20 h-32 rounded-xl bg-gradient-to-b from-teal-800 to-emerald-950 p-2 text-white shrink-0 shadow-xs flex flex-col justify-between">
                    <span className="text-[8px] font-bold leading-tight">Learn Namaz Step by Step</span>
                    <div className="w-6 h-6 rounded-full bg-white/20 self-center flex items-center justify-center">
                      <Moon className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>

                  {/* Screenshot 2 */}
                  <div className="w-20 h-32 rounded-xl bg-slate-100 border border-slate-200 p-2 text-slate-800 shrink-0 shadow-xs flex flex-col justify-between text-[7px] font-mono">
                    <div className="font-bold text-center border-b border-slate-300 pb-1">Fajr</div>
                    <div className="space-y-0.5">
                      <p>1 Niyat ›</p>
                      <p>2 Qiyam ›</p>
                      <p>3 Ruku ›</p>
                      <p>4 Sujood ›</p>
                    </div>
                  </div>

                  {/* Screenshot 3 */}
                  <div className="w-20 h-32 rounded-xl bg-emerald-50 border border-emerald-100 p-2 text-emerald-900 shrink-0 shadow-xs flex flex-col justify-between">
                    <span className="text-[8px] font-bold">Clear Instructions</span>
                    <div className="w-full h-1 bg-emerald-400 rounded-full"></div>
                  </div>
                </div>

                {/* About this app */}
                <div className="pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                    <span>About this app</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <p className="text-[10px] text-slate-600 leading-relaxed">
                    Complete Namaz guide with step by step instructions, audio, images and timings. Easy to learn for everyone.
                  </p>
                </div>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Education', 'Islamic', 'Offline', 'Free'].map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>

              </div>

            </div>

            {/* Bottom Caption Pill */}
            <div className="px-5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md">
              4. App Details
            </div>
          </div>


          {/* ----------------------------------------------------
              PHONE 5: 5. DOWNLOADS & UPDATES ("MY APPS")
              ---------------------------------------------------- */}
          <div className="flex flex-col items-center gap-4">
            <div className="phone-frame w-[310px] h-[640px] bg-white text-slate-900">
              
              <div className="phone-punchhole"></div>

              {/* Status Bar */}
              <div className="w-full flex items-center justify-between px-6 pt-3 text-[11px] font-mono text-slate-600 z-40 bg-white">
                <span>10:30</span>
                <div className="flex items-center gap-1 text-[10px]">
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>

              {/* Screen Body */}
              <div className="phone-screen p-4 space-y-3 bg-white">
                
                {/* Header: "My Apps" with "⋮" */}
                <div className="flex items-center justify-between pt-1">
                  <h2 className="text-base font-black text-slate-900">My Apps</h2>
                  <MoreVertical className="w-4 h-4 text-slate-600" />
                </div>

                {/* Pill Tabs matching Screen 5: [Installed] [Updates] [Downloads (active)] */}
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white border border-slate-200 text-slate-600">
                    Installed
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white border border-slate-200 text-slate-600">
                    Updates
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                    Downloads
                  </span>
                </div>

                {/* Section 1: Downloading (2) */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1.5">
                    <span>Downloading (2)</span>
                    <span className="text-slate-400">›</span>
                  </div>

                  <div className="space-y-2">
                    {/* Item 1: Namaz Guide (48%) */}
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                            <Moon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-900 leading-tight">Namaz Guide</p>
                            <p className="text-[9px] text-slate-500 font-medium">12 MB / 25 MB</p>
                          </div>
                        </div>

                        <button onClick={() => setNamazPaused(!namazPaused)} className="text-blue-600 p-1">
                          {namazPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                        </button>
                      </div>

                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '48%' }}></div>
                      </div>
                    </div>

                    {/* Item 2: Quran Reader (28%) */}
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                            <Moon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-900 leading-tight">Quran Reader</p>
                            <p className="text-[9px] text-slate-500 font-medium">5 MB / 18 MB</p>
                          </div>
                        </div>

                        <button onClick={() => setQuranPaused(!quranPaused)} className="text-blue-600 p-1">
                          {quranPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                        </button>
                      </div>

                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Completed (3) */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1.5">
                    <span>Completed (3)</span>
                    <span className="text-slate-400">›</span>
                  </div>

                  <div className="space-y-1.5">
                    {/* Islamic Calendar */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white">
                          <Moon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-900 leading-tight">Islamic Calendar</p>
                          <p className="text-[9px] text-slate-500">Installed</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleQuickDownload('Islamic Calendar', 'islamic-calendar-v1.9.0.apk')}
                        className="px-3 py-0.5 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 text-[10px] font-bold"
                      >
                        Open
                      </button>
                    </div>

                    {/* Dua Collection */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                          <Moon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-900 leading-tight">Dua Collection</p>
                          <p className="text-[9px] text-slate-500">Installed</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleQuickDownload('Dua Collection', 'dua-collection-v2.1.0.apk')}
                        className="px-3 py-0.5 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 text-[10px] font-bold"
                      >
                        Open
                      </button>
                    </div>

                    {/* Qibla Finder */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                          <Moon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-900 leading-tight">Qibla Finder</p>
                          <p className="text-[9px] text-slate-500">Installed</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleQuickDownload('Qibla Finder', 'qibla-finder-v3.0.0.apk')}
                        className="px-3 py-0.5 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 text-[10px] font-bold"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Nav Bar */}
              <div className="w-full bg-white border-t border-slate-200 py-1.5 px-4 flex items-center justify-around text-slate-500 text-[9px] font-medium">
                <NextLink href="/" className="flex flex-col items-center hover:text-slate-800">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </NextLink>
                <NextLink href="/categories" className="flex flex-col items-center hover:text-slate-800">
                  <Grid className="w-4 h-4" />
                  <span>Categories</span>
                </NextLink>
                <div className="flex flex-col items-center text-blue-600 font-bold relative">
                  <DownloadCloud className="w-4 h-4 stroke-[2.5px]" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">2</span>
                  <span>Updates</span>
                </div>
                <NextLink href="/admin" className="flex flex-col items-center hover:text-slate-800">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </NextLink>
              </div>

            </div>

            {/* Bottom Caption Pill */}
            <div className="px-5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md">
              5. Downloads & Updates
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
