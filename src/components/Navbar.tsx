'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/router'; // We use next/link in next 14
import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  ShieldCheck, 
  User, 
  Compass, 
  Sparkles, 
  Menu, 
  X, 
  DownloadCloud,
  LogOut,
  Moon,
  ChevronDown
} from 'lucide-react';
import { AppCategory } from '@/types/app';

interface NavbarProps {
  onSearch?: (query: string) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: AppCategory) => void;
}

export default function Navbar({ onSearch, selectedCategory, onSelectCategory }: NavbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userNameInput, setUserNameInput] = useState('');
  const [userEmailInput, setUserEmailInput] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nur_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userNameInput.trim()) return;
    const user = {
      name: userNameInput.trim(),
      email: userEmailInput.trim() || `${userNameInput.toLowerCase().replace(/\s+/g, '')}@nurstore.user`,
    };
    setCurrentUser(user);
    try {
      localStorage.setItem('nur_user', JSON.stringify(user));
    } catch (e) {}
    setShowUserModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('nur_user');
    } catch (e) {}
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-nur-dark/85 border-b border-nur-border/70 transition-all shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo & Brand */}
            <NextLink href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-nur-gold via-nur-emerald to-nur-goldLight shadow-md shadow-nur-gold/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-[14px] overflow-hidden bg-nur-midnight flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Nur App Store"
                    width={48}
                    height={48}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-gold-gradient drop-shadow-sm font-sans">
                    Nur
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-nur-pillBg text-nur-gold border border-nur-gold/40 shadow-sm">
                    Store
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-medium tracking-wide flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  APK Market
                </span>
              </div>
            </NextLink>

            {/* Desktop Center Search Bar */}
            <form 
              onSubmit={handleSearchSubmit} 
              className="hidden md:flex flex-1 max-w-xl mx-4 relative"
            >
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (onSearch) onSearch(e.target.value);
                  }}
                  placeholder="Search apps, games, tools & APKs..."
                  className="w-full pl-11 pr-24 py-2.5 rounded-full bg-nur-navy/90 border border-nur-border text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-nur-gold focus:ring-2 focus:ring-nur-gold/30 transition-all shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-full bg-nur-surface hover:bg-nur-hover text-xs font-semibold text-nur-gold hover:text-nur-goldLight border border-nur-border hover:border-nur-gold/50 transition-all"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Right Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <NextLink
                href="/admin"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-nur-gold border border-nur-gold/40 hover:border-nur-gold bg-nur-gold/10 hover:bg-nur-gold/20 transition-all shadow-sm group"
                title="Admin Upload & Management Portal"
              >
                <ShieldCheck className="w-4 h-4 text-nur-gold group-hover:scale-110 transition-transform" />
                <span>Admin Portal</span>
              </NextLink>

              {/* User Account / Profile */}
              {currentUser ? (
                <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-nur-navy border border-nur-border">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-xs text-white">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-200 leading-tight max-w-[100px] truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-tight">Member</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Log out"
                    className="p-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors ml-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowUserModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-nur-navy hover:bg-nur-surface border border-nur-border transition-all"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="flex sm:hidden items-center gap-2">
              <NextLink
                href="/admin"
                className="p-2 rounded-xl bg-nur-gold/10 border border-nur-gold/30 text-nur-gold"
                title="Admin Portal"
              >
                <ShieldCheck className="w-5 h-5" />
              </NextLink>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl bg-nur-navy border border-nur-border text-slate-300"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

          {/* Mobile search bar dropdown */}
          <div className="md:hidden pb-3 pt-1">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (onSearch) onSearch(e.target.value);
                }}
                placeholder="Search apps & APKs..."
                className="w-full pl-10 pr-20 py-2 rounded-xl bg-nur-navy border border-nur-border text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-nur-gold transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-nur-surface text-xs font-semibold text-nur-gold border border-nur-border"
              >
                Go
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-nur-border bg-nur-dark/95 backdrop-blur-xl px-4 py-4 space-y-3">
            <NextLink
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-nur-navy/60 text-slate-200 text-sm font-medium"
            >
              <Compass className="w-4 h-4 text-nur-emerald" />
              <span>Explore Store</span>
            </NextLink>

            <NextLink
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-nur-gold/15 text-nur-gold text-sm font-semibold border border-nur-gold/30"
            >
              <ShieldCheck className="w-4 h-4 text-nur-gold" />
              <span>Admin Portal (Upload APKs)</span>
            </NextLink>

            <div className="pt-2 border-t border-nur-border">
              {currentUser ? (
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-nur-navy">
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{currentUser.name}</p>
                    <p className="text-xs text-slate-400">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-red-400 font-medium px-2 py-1 rounded bg-red-500/10"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowUserModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-nur-navy border border-nur-border text-slate-200 text-sm font-medium"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Create Account / Sign In (Optional)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* User Login/Register Modal (Optional user account) */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-nur-navy border border-nur-border shadow-2xl">
            <button
              onClick={() => setShowUserModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-nur-gold/10 text-nur-gold border border-nur-gold/30">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Join Nur Community</h3>
                <p className="text-xs text-slate-400">Account is optional, but lets you leave reviews and save favorites</p>
              </div>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name / Nickname</label>
                <input
                  type="text"
                  required
                  value={userNameInput}
                  onChange={(e) => setUserNameInput(e.target.value)}
                  placeholder="e.g. Tariq, Aisha, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-nur-dark border border-nur-border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-nur-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={userEmailInput}
                  onChange={(e) => setUserEmailInput(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-nur-dark border border-nur-border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-nur-gold"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-nur-surface hover:bg-nur-hover text-xs font-semibold text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl btn-gold text-xs font-bold transition-all shadow-md"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
