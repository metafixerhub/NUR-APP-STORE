'use client';

import React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, DownloadCloud, User } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
      badge: null,
    },
    {
      label: 'Categories',
      href: '/categories',
      icon: Grid,
      isActive: pathname === '/categories',
      badge: null,
    },
    {
      label: 'Updates',
      href: '/updates',
      icon: DownloadCloud,
      isActive: pathname === '/updates',
      badge: '2',
    },
    {
      label: 'Profile',
      href: '/admin',
      icon: User,
      isActive: pathname.startsWith('/admin'),
      badge: null,
    },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-nur-midnight/95 backdrop-blur-xl border-t border-slate-200 dark:border-nur-border/80 px-2 py-2 safe-bottom shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <NextLink
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all ${
                active
                  ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative p-1">
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </NextLink>
          );
        })}
      </div>
    </nav>
  );
}
