import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import MobileBottomNav from '@/components/MobileBottomNav';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nur App Store - The Twilight Mosque APK Market',
  description: 'Download verified clean Android APKs directly. Fast, secure, and beautiful app store experience for mobile and desktop.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="bg-nur-dark text-slate-100 min-h-screen flex flex-col antialiased selection:bg-nur-gold selection:text-nur-dark">
        {/* Top Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 pb-20 sm:pb-12">
          {children}
        </main>

        {/* Desktop / Tablet Footer */}
        <footer className="border-t border-nur-border/70 bg-nur-midnight/90 backdrop-blur-md pt-12 pb-16 text-slate-400 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              
              {/* Col 1: Brand & Logo */}
              <div className="space-y-3 md:col-span-1">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-nur-border">
                    <Image src="/logo.png" alt="Nur Logo" fill sizes="40px" className="object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-gold-gradient leading-tight">Nur</span>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">App Store</span>
                  </div>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  The purest, trusted Android APK repository. Direct APK distribution with zero intrusive bloatware.
                </p>
              </div>

              {/* Col 2: Quick Links */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Explore Store</h4>
                <ul className="space-y-2">
                  <li><Link href="/" className="hover:text-nur-gold transition-colors">Home & Featured</Link></li>
                  <li><Link href="/#categories" className="hover:text-nur-gold transition-colors">Islamic & Quran Apps</Link></li>
                  <li><Link href="/#categories" className="hover:text-nur-gold transition-colors">Tools & Utilities</Link></li>
                  <li><Link href="/search" className="hover:text-nur-gold transition-colors">Search APKs</Link></li>
                </ul>
              </div>

              {/* Col 3: Publisher & Admin */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Publishers & Admin</h4>
                <ul className="space-y-2">
                  <li><Link href="/admin" className="hover:text-nur-gold transition-colors">Admin Portal Login</Link></li>
                  <li><Link href="/admin" className="hover:text-nur-gold transition-colors">Upload APK File</Link></li>
                  <li><Link href="/admin" className="hover:text-nur-gold transition-colors">Manage & Update Apps</Link></li>
                </ul>
              </div>

              {/* Col 4: Security Guarantee */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Nur Protection</h4>
                <div className="p-3 rounded-xl bg-nur-navy border border-nur-border space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>100% Verified Safe</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Every APK uploaded to Nur Store is checked for security integrity and cryptographically signed.
                  </p>
                </div>
              </div>

            </div>

            <div className="pt-8 border-t border-nur-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
              <p>© {new Date().getFullYear()} Nur App Store. All rights reserved.</p>
              <div className="flex items-center gap-1 text-slate-400">
                <span>Designed with</span>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>for the global community</span>
              </div>
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </body>
    </html>
  );
}
