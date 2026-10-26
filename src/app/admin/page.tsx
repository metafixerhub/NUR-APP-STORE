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
  Share2,
  Database
} from 'lucide-react';
import { AppItem } from '@/types/app';
import { INITIAL_APPS } from '@/data/initialApps';
import AdminAppForm from '@/components/AdminAppForm';
import ShareAppModal from '@/components/ShareAppModal';
import AdminMongoClusterManager from '@/components/AdminMongoClusterManager';

export default function AdminPortalPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Login form inputs
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard state
  const [activeTab, setActiveTab] = useState<'publish' | 'manage' | 'comments' | 'database'>('publish');
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
      setLoginError('Invalid administrator credentials. Access restricted.');
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
          
          <div className="relative rounded-3xl bg-white border border-slate-200 p-8 shadow-xl">
            
            {/* Header with logo */}
            <div className="text-center mb-8">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-3 border border-emerald-500/30 shadow-md">
                <Image src="/logo.png" alt="Nur Logo" fill sizes="64px" className="object-contain" />
              </div>
              <h1 className="text-2xl font-black text-slate-900">Nur Admin Portal</h1>
              <p className="text-xs text-slate-500 mt-1">
                Authorized publishing & application management system
              </p>
            </div>

            {loginError && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Admin Username
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter admin username"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 mt-2"
              >
                <Lock className="w-4 h-4" />
                <span>Enter Admin Portal</span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <NextLink href="/" className="text-xs text-slate-500 hover:text-blue-600 font-semibold transition-colors">
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 mb-8 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-emerald-500/30 shrink-0 shadow-xs">
            <Image src="/logo.png" alt="Nur Logo" fill sizes="56px" className="object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">Nur Admin Portal</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase">
                Active Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Publish APKs, update existing apps, and manage community feedback
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NextLink
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
            <span>Open Store</span>
          </NextLink>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-600 border border-red-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
            <Layers className="w-4 h-4 text-blue-600" />
            Published Apps
          </span>
          <p className="text-2xl font-black text-slate-900">{apps.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
            <Download className="w-4 h-4 text-emerald-600" />
            Total Downloads
          </span>
          <p className="text-2xl font-black text-slate-900">{totalDownloads.toLocaleString()}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            Community Reviews
          </span>
          <p className="text-2xl font-black text-slate-900">{totalComments}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            Store Status
          </span>
          <p className="text-2xl font-black text-emerald-600 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar gap-2">
        <button
          onClick={() => {
            setActiveTab('publish');
            setEditingApp(null);
          }}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'publish' && !editingApp
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload & Publish New App</span>
        </button>

        <button
          onClick={() => setActiveTab('manage')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'manage' || editingApp
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
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
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>All Community Comments ({totalComments})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('database');
            setEditingApp(null);
          }}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'database'
              ? 'border-emerald-600 text-emerald-600 bg-emerald-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>MongoDB Clusters (10 Clusters)</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black">
            LIVE
          </span>
        </button>
      </div>

      {/* TAB 1: PUBLISH / EDIT FORM */}
      {(activeTab === 'publish' || editingApp) && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>{editingApp ? `Edit App: ${editingApp.name}` : 'Publish New App to Nur App Store'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {editingApp
                  ? 'Update APK package, icon, descriptions, ratings or screenshots.'
                  : 'Follow the steps below to upload and publish your application.'}
              </p>
            </div>

            {editingApp && (
              <button
                onClick={() => setEditingApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200"
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            <button
              onClick={() => {
                setEditingApp(null);
                setActiveTab('publish');
              }}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Upload Another App</span>
            </button>
          </div>

          {/* Apps Table / List */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                  <th className="p-4">App</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Version</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Downloads</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                      No apps found matching "{searchManageQuery}".
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-50">
                            <Image src={app.iconUrl || '/logo.png'} alt={app.name} fill sizes="48px" className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate max-w-xs">{app.name}</p>
                            <p className="text-[11px] text-slate-500 truncate">{app.developer}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                          {app.category}
                        </span>
                      </td>

                      <td className="p-4 font-mono font-medium text-slate-600">
                        v{app.version}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1 font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{app.rating ? app.rating.toFixed(1) : '5.0'}</span>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-slate-800">
                        {app.downloads || '0+'}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* Share Link button */}
                          <button
                            onClick={() => setShareModalApp(app)}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 transition-all flex items-center gap-1 shadow-xs"
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
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 transition-colors flex items-center gap-1"
                            title="Update this app"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Update</span>
                          </button>

                          {/* View public page */}
                          <NextLink
                            href={`/app/${app.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
                            title="View in Store"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </NextLink>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteApp(app.id, app.name)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
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
            <h2 className="text-lg font-bold text-slate-900">Community Reviews Moderation</h2>
            <span className="text-xs text-slate-500">Total {totalComments} reviews across all apps</span>
          </div>

          <div className="space-y-3">
            {apps.flatMap((app) =>
              (app.comments || []).map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{comment.userName}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{comment.date}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-blue-600 font-semibold">on {app.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${s <= comment.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700">{comment.comment}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <span className="text-[11px] text-slate-500">
                      👍 {comment.likes || 0} helpful
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: MONGODB CLUSTERS INTEGRATION */}
      {activeTab === 'database' && (
        <AdminMongoClusterManager />
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
