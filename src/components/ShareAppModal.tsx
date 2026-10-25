'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  QrCode, 
  ExternalLink, 
  MessageCircle, 
  Send, 
  Smartphone,
  Download
} from 'lucide-react';
import { AppItem } from '@/types/app';
import confetti from 'canvas-confetti';

interface ShareAppModalProps {
  app: AppItem;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export default function ShareAppModal({
  app,
  isOpen,
  onClose,
  title = 'Special Share Link',
  subtitle = 'Anyone with this link can view this app and download the APK directly',
}: ShareAppModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'link' | 'qr'>('link');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      setShareUrl(`${origin}/app/${app.id}`);
    }
  }, [app.id]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (typeof window !== 'undefined' && shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#FDE047'],
        });
      } catch (e) {}

      setTimeout(() => setCopied(false), 3000);
    }
  };

  const shareText = `Check out "${app.name}" on Nur App Store! Direct APK download:`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${app.name} - Nur App Store`,
          text: `Download ${app.name} APK on Nur App Store:`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or unsupported
      }
    } else {
      handleCopy();
    }
  };

  // QR Code generation URL using standard QR code service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareUrl)}&color=050D18&bgcolor=FFFFFF`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-nur-navy/95 border border-nur-border shadow-2xl p-6 sm:p-8 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-nur-surface hover:bg-nur-hover text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-nur-gold/40 shadow-lg bg-nur-midnight">
            <Image
              src={app.iconUrl || '/logo.png'}
              alt={app.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-nur-gold/15 text-nur-gold text-[10px] font-bold uppercase tracking-wider border border-nur-gold/30 mb-1">
              <Share2 className="w-3 h-3" />
              <span>Shareable APK Link</span>
            </div>
            <h3 className="text-lg font-bold text-white leading-tight">{app.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* Tab switch (Link vs QR Code) */}
        <div className="flex rounded-xl bg-nur-dark/80 p-1 border border-nur-border mb-5">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'link'
                ? 'bg-nur-surface text-nur-gold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Special Share Link</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'qr'
                ? 'bg-nur-surface text-nur-gold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR Code</span>
          </button>
        </div>

        {/* TAB 1: SPECIAL LINK & SOCIAL SHARING */}
        {activeTab === 'link' && (
          <div className="space-y-4">
            
            {/* The Special Link Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Special Direct Link for this App:
              </label>
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-nur-dark border border-nur-border focus-within:border-nur-gold transition-colors">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-transparent px-2 text-xs text-slate-200 select-all focus:outline-none truncate font-mono"
                />
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'btn-gold text-nur-dark shadow-md'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Social Share Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Or share directly via:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                
                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>

                {/* Telegram */}
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-400 text-xs font-bold transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Telegram</span>
                </a>

                {/* Native / Mobile Share */}
                <button
                  onClick={handleNativeShare}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-bold transition-colors"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Share App</span>
                </button>

              </div>
            </div>

            {/* Live Preview Button */}
            <div className="pt-2">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-nur-surface hover:bg-nur-hover border border-nur-border text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-nur-gold" />
                <span>Open & Test Special Link</span>
              </a>
            </div>

          </div>
        )}

        {/* TAB 2: QR CODE */}
        {activeTab === 'qr' && (
          <div className="flex flex-col items-center text-center space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-white shadow-xl border-4 border-nur-gold/40">
              <img
                src={qrCodeUrl}
                alt={`QR code for ${app.name}`}
                className="w-44 h-44 object-contain"
              />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-200">
                Scan with any phone camera
              </p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                Directly opens {app.name} on Nur App Store so users can download the APK file immediately.
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="btn-gold px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
