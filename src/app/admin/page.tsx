'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  UploadCloud, 
  Layers, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  PlusCircle, 
  BarChart3, 
  Star, 
  Download, 
  MessageSquare,
  Search,
  Sparkles,
  Share2
} from 'lucide-react';
import { AppItem } from '@/types/app';
import { INITIAL_APPS } from '@/data/initialApps';
import AdminAppForm from '@/components/AdminAppForm';
import ShareAppModal from '@/components/ShareAppModal';

export default function AdminPortalPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Login form inputs
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard state
  const [activeTab, setActiveTab] = useState<'publish' | 'manage' | 'comments'>('publish');
  const [apps, setApps] = useState<AppItem[]>(INITIAL_APPS);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);
  const [searchManageQuery, setSearchManageQuery] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [shareModalApp, setShareModalApp] = useState<AppItem | null>(null);

  // Check login on load
  useEffect(() => {
    try {
      const auth = sessionStorage.getItem('nur_admin_session');
      if (auth === 'authenticated') {
        setIsAdminLoggedIn(true);
      }
    } catch (e) {}
    setAuthChecking(false);
  }, []);

  // Fetch apps
  const fetchApps = async () => {
    try {
      const res = await fetch('/api/apps');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.apps)) {
          setApps(data.apps);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchApps();
    }
  }, [isAdminLoggedIn]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Requirements: "admin account and password is admin only"
    if (usernameInput.trim() === 'admin' && passwordInput.trim() === 'admin') {
      setIsAdminLoggedIn(true);
      try {
        sessionStorage.setItem('nur_admin_session', 'authenticated');
      } catch (e) {}
    } else {
      setLoginError('Invalid credentials. Admin username is "admin" and password is "admin".');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    try {
      sessionStorage.removeItem('nur_admin_session');
    } catch (e) {}
  };

  // Delete App
  const handleDeleteApp = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the store?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/apps/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setApps((prev) => prev.filter((a) => a.id !== id));
        showToast(`App "${name}" removed from store.`);
      } else {
        alert(data.error || 'Failed to delete app');
      }
    } catch (err) {
      alert('Error deleting app');
    }
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  // Manage apps filter
  const filteredApps = apps.filter((a) =>
    a.name.toLowerCase().includes(searchManageQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchManageQuery.toLowerCase()) ||
    a.developer.toLowerCase().includes(searchManageQuery.toLowerCase())
  );

  // Aggregated analytics
  const totalDownloads = apps.reduce((sum, a) => sum + (a.downloadCount || 0), 0);
  const totalComments = apps.reduce((sum, a) => sum + (a.comments?.length || 0), 0);

  if (authChecking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-nur-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="relative w-full max-w-md">
          
          {/* Ambient Glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-nur-gold via-emerald-500 to-amber-600 opacity-20 blur-xl"></div>
          
          <div className="relative rounded-3xl bg-nur-navy/95 border border-nur-border/90 p-8 shadow-2xl backdrop-blur-xl">
            
            {/* Header with logo */}
            <div className="text-center mb-8">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-3 border border-nur-gold/40 shadow-lg">
                <Image src="/logo.png" alt="Nur Logo" fill sizes="64px" className="object-contain" />
              </div>
              <h1 className="text-2xl font-black text-white">Nur Admin Portal</h1>
              <p className="text-xs text-slate-400 mt-1">
                Authorized publishing & application management system
              </p>
            </div>

            {loginError && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Admin Username
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-nur-gold" />
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter admin username"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nur-dark border border-nur-border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-nur-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nur-dark border border-nur-border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-nur-gold"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-nur-dark/60 border border-nur-border/60 text-[11px] text-slate-400 leading-normal">
                <strong className="text-nur-gold">Default Credentials:</strong> Username: <code className="text-white bg-nur-surface px-1.5 py-0.5 rounded">admin</code> | Password: <code className="text-white bg-nur-surface px-1.5 py-0.5 rounded">admin</code>
              </div>

              <button
                type="submit"
                className="w-full btn-gold py-3 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
              >
                <Lock className="w-4 h-4" />
                <span>Enter Admin Portal</span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <NextLink href="/" className="text-xs text-slate-400 hover:text-nur-gold transition-colors">
                ← Return to Public Store
              </NextLink>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-24 right-4 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-3 animate-fade-in border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-nur-navy/90 border border-nur-border mb-8 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-nur-gold/40 shrink-0">
            <Image src="/logo.png" alt="Nur Logo" fill sizes="56px" className="object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">Nur Admin Portal</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                Active Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Publish APKs, update existing apps, and manage community feedback
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NextLink
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-nur-surface hover:bg-nur-hover text-xs font-semibold text-slate-200 border border-nur-border transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-nur-gold" />
            <span>Open Store</span>
          </NextLink>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-400 border border-red-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-nur-navy/70 border border-nur-border">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
            <Layers className="w-4 h-4 text-nur-gold" />
            Published Apps
          </span>
          <p className="text-2xl font-black text-white">{apps.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-nur-navy/70 border border-nur-border">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
            <Download className="w-4 h-4 text-emerald-400" />
            Total Downloads
          </span>
          <p className="text-2xl font-black text-white">{totalDownloads.toLocaleString()}</p>
        </div>

        <div className="p-5 rounded-2xl bg-nur-navy/70 border border-nur-border">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            Community Reviews
          </span>
          <p className="text-2xl font-black text-white">{totalComments}</p>
        </div>

        <div className="p-5 rounded-2xl bg-nur-navy/70 border border-nur-border">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            Store Status
          </span>
          <p className="text-2xl font-black text-emerald-400 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Online
          </p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-nur-border mb-8 overflow-x-auto no-scrollbar gap-2">
        <button
          onClick={() => {
            setActiveTab('publish');
            setEditingApp(null);
          }}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'publish' && !editingApp
              ? 'border-nur-gold text-nur-gold bg-nur-gold/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload & Publish New App</span>
        </button>

        <button
          onClick={() => setActiveTab('manage')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'manage' || editingApp
              ? 'border-nur-gold text-nur-gold bg-nur-gold/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Manage & Update Existing Apps ({apps.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('comments');
            setEditingApp(null);
          }}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'comments'
              ? 'border-nur-gold text-nur-gold bg-nur-gold/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>All Community Comments ({totalComments})</span>
        </button>
      </div>

      {/* TAB 1: PUBLISH / EDIT FORM */}
      {(activeTab === 'publish' || editingApp) && (
        <div className="p-6 sm:p-8 rounded-3xl bg-nur-navy/80 border border-nur-border shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-nur-border">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{editingApp ? `Edit App: ${editingApp.name}` : 'Publish New App to Nur App Store'}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {editingApp
                  ? 'Update APK package, icon, descriptions, ratings or screenshots.'
                  : 'Follow the steps below to upload and publish your application.'}
              </p>
            </div>

            {editingApp && (
              <button
                onClick={() => setEditingApp(null)}
                className="px-4 py-2 rounded-xl bg-nur-surface hover:bg-nur-hover text-xs font-semibold text-slate-300"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <AdminAppForm
            key={editingApp ? editingApp.id : 'new-app'}
            initialData={editingApp}
            onSuccess={(saved) => {
              showToast(editingApp ? `App "${saved.name}" updated successfully!` : `App "${saved.name}" published!`);
              setEditingApp(null);
              setShareModalApp(saved);
              setActiveTab('manage');
              fetchApps();
            }}
            onCancel={editingApp ? () => setEditingApp(null) : undefined}
          />
        </div>
      )}

      {/* TAB 2: MANAGE & UPDATE APPS */}
      {activeTab === 'manage' && !editingApp && (
        <div className="space-y-6">
          
          {/* Search bar inside manage tab */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchManageQuery}
                onChange={(e) => setSearchManageQuery(e.target.value)}
                placeholder="Search apps to update or manage..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nur-navy border border-nur-border text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-nur-gold"
              />
            </div>

            <button
              onClick={() => {
                setEditingApp(null);
                setActiveTab('publish');
              }}
              className="w-full sm:w-auto btn-gold px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Upload Another App</span>
            </button>
          </div>

          {/* Apps Table / List */}
          <div className="overflow-x-auto rounded-2xl border border-nur-border bg-nur-navy/60 shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-nur-border bg-nur-surface/60 text-slate-300 font-bold uppercase tracking-wider">
                  <th className="p-4">App</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Version</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Downloads</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nur-border/50 text-slate-300">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                      No apps found matching "{searchManageQuery}".
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-nur-surface/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-nur-border bg-nur-midnight">
                            <Image src={app.iconUrl || '/logo.png'} alt={app.name} fill sizes="48px" className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate max-w-xs">{app.name}</p>
                            <p className="text-[11px] text-slate-400 truncate">{app.developer}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                          {app.category}
                        </span>
                      </td>

                      <td className="p-4 font-mono font-medium text-slate-300">
                        v{app.version}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1 font-bold text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{app.rating ? app.rating.toFixed(1) : '5.0'}</span>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-slate-200">
                        {app.downloads || '0+'}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* Share Link button */}
                          <button
                            onClick={() => setShareModalApp(app)}
                            className="px-3 py-1.5 rounded-lg bg-nur-gold/15 hover:bg-nur-gold text-nur-gold hover:text-nur-dark font-bold border border-nur-gold/40 transition-all flex items-center gap-1 shadow-sm"
                            title="Get special share link & QR code"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share Link</span>
                          </button>

                          {/* Update / Edit button */}
                          <button
                            onClick={() => {
                              setEditingApp(app);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-3 py-1.5 rounded-lg bg-nur-surface hover:bg-nur-gold hover:text-nur-dark text-slate-200 font-semibold border border-nur-border transition-colors flex items-center gap-1"
                            title="Update this app"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Update</span>
                          </button>

                          {/* View public page */}
                          <NextLink
                            href={`/app/${app.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-nur-surface hover:bg-nur-hover text-slate-300 border border-nur-border"
                            title="View in Store"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </NextLink>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteApp(app.id, app.name)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                            title="Delete app"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 3: COMMUNITY COMMENTS MODERATION */}
      {activeTab === 'comments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-white">Community Reviews Moderation</h2>
            <span className="text-xs text-slate-400">Total {totalComments} reviews across all apps</span>
          </div>

          <div className="space-y-3">
            {apps.flatMap((app) =>
              (app.comments || []).map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 rounded-2xl bg-nur-navy/70 border border-nur-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{comment.userName}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{comment.date}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-nur-gold font-semibold">on {app.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${s <= comment.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-300">{comment.comment}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <span className="text-[11px] text-slate-400">
                      👍 {comment.likes || 0} helpful
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Special Share Link Modal */}
      {shareModalApp && (
        <ShareAppModal
          app={shareModalApp}
          isOpen={Boolean(shareModalApp)}
          onClose={() => setShareModalApp(null)}
          title="App Special Share Link"
          subtitle="Share this direct link with anyone to let them view details and download the APK"
        />
      )}

    </div>
  );
}
