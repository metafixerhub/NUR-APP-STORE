'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Search, 
  GraduationCap, 
  Moon, 
  BarChart2, 
  PlayCircle, 
  Wrench, 
  ShoppingBag, 
  Heart, 
  Users, 
  Gamepad2, 
  Grid,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { AppItem, AppCategory } from '@/types/app';
import AppCard from '@/components/AppCard';

const CATEGORY_ITEMS = [
  {
    name: 'Education',
    categoryKey: 'Education',
    count: '150+ Apps',
    icon: GraduationCap,
    bgColor: 'bg-blue-50/90 dark:bg-blue-950/30',
    borderColor: 'border-blue-200/80 dark:border-blue-900/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100/80 dark:bg-blue-900/40',
  },
  {
    name: 'Islamic',
    categoryKey: 'Islamic & Quran',
    count: '80+ Apps',
    icon: Moon,
    bgColor: 'bg-emerald-50/90 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200/80 dark:border-emerald-900/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100/80 dark:bg-emerald-900/40',
  },
  {
    name: 'Productivity',
    categoryKey: 'Productivity',
    count: '120+ Apps',
    icon: BarChart2,
    bgColor: 'bg-teal-50/90 dark:bg-teal-950/30',
    borderColor: 'border-teal-200/80 dark:border-teal-900/50',
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-teal-100/80 dark:bg-teal-900/40',
  },
  {
    name: 'Multimedia',
    categoryKey: 'Media & Video',
    count: '90+ Apps',
    icon: PlayCircle,
    bgColor: 'bg-pink-50/90 dark:bg-pink-950/30',
    borderColor: 'border-pink-200/80 dark:border-pink-900/50',
    iconColor: 'text-pink-600 dark:text-pink-400',
    iconBg: 'bg-pink-100/80 dark:bg-pink-900/40',
  },
  {
    name: 'Tools',
    categoryKey: 'Tools & Utilities',
    count: '100+ Apps',
    icon: Wrench,
    bgColor: 'bg-purple-50/90 dark:bg-purple-950/30',
    borderColor: 'border-purple-200/80 dark:border-purple-900/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-100/80 dark:bg-purple-900/40',
  },
  {
    name: 'Lifestyle',
    categoryKey: 'Islamic & Quran',
    count: '70+ Apps',
    icon: ShoppingBag,
    bgColor: 'bg-amber-50/90 dark:bg-amber-950/30',
    borderColor: 'border-amber-200/80 dark:border-amber-900/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-100/80 dark:bg-amber-900/40',
  },
  {
    name: 'Health',
    categoryKey: 'Tools & Utilities',
    count: '60+ Apps',
    icon: Heart,
    bgColor: 'bg-rose-50/90 dark:bg-rose-950/30',
    borderColor: 'border-rose-200/80 dark:border-rose-900/50',
    iconColor: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-100/80 dark:bg-rose-900/40',
  },
  {
    name: 'Social',
    categoryKey: 'Social & Chat',
    count: '50+ Apps',
    icon: Users,
    bgColor: 'bg-sky-50/90 dark:bg-sky-950/30',
    borderColor: 'border-sky-200/80 dark:border-sky-900/50',
    iconColor: 'text-sky-600 dark:text-sky-400',
    iconBg: 'bg-sky-100/80 dark:bg-sky-900/40',
  },
  {
    name: 'Games',
    categoryKey: 'Games',
    count: '200+ Apps',
    icon: Gamepad2,
    bgColor: 'bg-orange-50/90 dark:bg-orange-950/30',
    borderColor: 'border-orange-200/80 dark:border-orange-900/50',
    iconColor: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-100/80 dark:bg-orange-900/40',
  },
  {
    name: 'Others',
    categoryKey: 'All',
    count: '40+ Apps',
    icon: Grid,
    bgColor: 'bg-slate-50/90 dark:bg-slate-900/50',
    borderColor: 'border-slate-200/80 dark:border-slate-800',
    iconColor: 'text-slate-600 dark:text-slate-400',
    iconBg: 'bg-slate-100/80 dark:bg-slate-800/60',
  },
];

export default function CategoriesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [apps, setApps] = useState<AppItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredApps = apps.filter((app) => {
    if (!selectedCategory) return false;
    if (selectedCategory === 'All') return true;
    return app.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
      
      {/* Top Header matching Screen 3: "← Categories" with Search on right */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (selectedCategory) {
                setSelectedCategory(null);
              } else {
                router.back();
              }
            }}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {selectedCategory ? `${selectedCategory} Apps` : 'Categories'}
          </h1>
        </div>

        <NextLink
          href="/search"
          className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-900"
        >
          <Search className="w-5 h-5" />
        </NextLink>
      </div>

      {/* Main Categories 2-Column Grid (Screen 3) */}
      {!selectedCategory ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {CATEGORY_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                onClick={() => setSelectedCategory(item.name)}
                className={`relative p-4 sm:p-5 rounded-2xl border ${item.bgColor} ${item.borderColor} cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md flex flex-col justify-between min-h-[110px] group`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-xl ${item.iconBg} ${item.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>

                <div className="mt-3">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {item.count}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Selected Category Apps View */
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400">
              Showing {filteredApps.length} apps in {selectedCategory}
            </span>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              View all categories
            </button>
          </div>

          {filteredApps.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-sm font-bold text-slate-800">No apps currently in this category.</p>
              <p className="text-xs text-slate-500 mt-1">Publish an app in this category via the Admin Portal!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
