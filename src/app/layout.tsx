import type { Metadata } from 'next';
import './globals.css';
import MobileBottomNav from '@/components/MobileBottomNav';

export const metadata: Metadata = {
  title: 'Nur App Store - Discover Useful Apps for a Better Life',
  description: 'Download verified clean Android APKs directly. Fast, secure, and beautiful app store experience matching the mobile showcase.',
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
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="bg-[#F8FAFC] text-slate-900 min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        
        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar (Hidden on Desktop, Visible on Mobile) */}
        <MobileBottomNav />

      </body>
    </html>
  );
}
