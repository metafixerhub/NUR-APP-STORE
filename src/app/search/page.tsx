'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, Star, Sparkles, ArrowLeft } from 'lucide-react';
import NextLink from 'next/link';
import AppCard from '@/components/AppCard';
import { AppItem, AppCategory } from '@/types/app';
import { INITIAL_APPS } from '@/data/initialApps';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [apps, setApps] = useState<AppItem[]>(INITIAL_APPS);
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | 'All'>('All');
  const [minRating, setMinRating] = useState<number>(0);

  useEffect(() => {
    async function loadApps() {
      try {
        const res = await fetch('/api/apps');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.apps)) {
            setApps(data.apps);
          }
        }
      } catch (err) {}
    }
    loadApps();
  }, []);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const q = query.toLowerCase();
      const matchesText =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.shortDescription.toLowerCase().includes(q) ||
        app.developer.toLowerCase().includes(q) ||
        app.tags?.some((t) => t.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'All' || app.category === selectedCategory;
      const matchesRating = minRating === 0 || app.rating >= minRating;

      return matchesText && matchesCat && matchesRating;
    });
  }, [apps, query, selectedCategory, minRating]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="flex items-center gap-3 mb-6">
        <NextLink href="/" className="p-2 rounded-xl bg-nur-navy border border-nur-border text-slate-300 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
        </NextLink>
        <h1 className="text-2xl font-bold text-white">Search Nur App Store</h1>
      </div>

      {/* Main Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-nur-gold" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by app name, description, tags, or developer..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-nur-navy border border-nur-border text-base text-slate-100 placeholder-slate-400 focus:outline-none focus:border-nur-gold shadow-lg"
          autoFocus
        />
      </div>

      {/* Filter Row */}
      <div className="p-4 rounded-2xl bg-nur-surface/40 border border-nur-border mb-8 flex flex-wrap items-center justify-between gap-4 text-xs">
        
        {/* Category selector */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-nur-dark border border-nur-border text-slate-200 focus:outline-none focus:border-nur-gold"
          >
            <option value="All">All Categories</option>
            <option value="Islamic & Quran">Islamic & Quran</option>
            <option value="Tools & Utilities">Tools & Utilities</option>
            <option value="Social & Chat">Social & Chat</option>
            <option value="Productivity">Productivity</option>
            <option value="Education">Education</option>
            <option value="Games">Games</option>
            <option value="Media & Video">Media & Video</option>
          </select>
        </div>

        {/* Rating filter */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Min Rating:</span>
          <div className="flex items-center gap-1">
            {[0, 4.0, 4.5, 4.8].map((val) => (
              <button
                key={val}
                onClick={() => setMinRating(val)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  minRating === val
                    ? 'bg-nur-gold text-nur-dark'
                    : 'bg-nur-dark text-slate-300 hover:text-white border border-nur-border'
                }`}
              >
                {val === 0 ? 'Any' : `${val}★+`}
              </button>
            ))}
          </div>
        </div>

        <div className="text-slate-400">
          Found <strong className="text-white">{filteredApps.length}</strong> matching apps
        </div>

      </div>

      {/* Results Grid */}
      {filteredApps.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-nur-navy/40 border border-nur-border my-8">
          <Search className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No matching apps found</h3>
          <p className="text-xs text-slate-400 mt-1">Try different keywords or reset your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-3 border-nur-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
