'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  UploadCloud, 
  FileCheck, 
  Image as ImageIcon, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  X,
  Plus,
  Loader2,
  Trash2
} from 'lucide-react';
import { AppItem, AppCategory } from '@/types/app';

interface AdminAppFormProps {
  initialData?: AppItem | null;
  onSuccess: (savedApp: AppItem) => void;
  onCancel?: () => void;
}

export default function AdminAppForm({ initialData, onSuccess, onCancel }: AdminAppFormProps) {
  const isEditing = Boolean(initialData);

  // Form states in the exact order requested by user:
  // 1. APK file & 2. App Icon next to each other
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [apkUrl, setApkUrl] = useState(initialData?.apkUrl || '');
  const [apkFileName, setApkFileName] = useState(initialData?.apkFileName || '');
  const [apkSize, setApkSize] = useState(initialData?.size || '24.5 MB');

  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconUrl, setIconUrl] = useState(initialData?.iconUrl || '');

  // 3. App Name
  const [name, setName] = useState(initialData?.name || '');

  // 4. App Description (short description)
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || '');

  // 5. App More Description (detailed description)
  const [fullDescription, setFullDescription] = useState(initialData?.fullDescription || '');

  // 6. How many stars
  const [rating, setRating] = useState<number>(initialData?.rating || 4.9);

  // Additional App Store metadata
  const [category, setCategory] = useState<AppCategory>(initialData?.category || 'Islamic & Quran');
  const [version, setVersion] = useState(initialData?.version || '1.0.0');
  const [developer, setDeveloper] = useState(initialData?.developer || 'Nur Official Developer');
  const [developerEmail, setDeveloperEmail] = useState(initialData?.developerEmail || 'support@nurappstore.com');
  const [requiresAndroid, setRequiresAndroid] = useState(initialData?.requiresAndroid || 'Android 8.0 and up');
  const [featured, setFeatured] = useState<boolean>(initialData?.featured || false);
  const [screenshots, setScreenshots] = useState<string[]>(
    initialData?.screenshots || [
      'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&auto=format&fit=crop&q=80',
    ]
  );
  const [newScreenshotUrl, setNewScreenshotUrl] = useState('');

  // Status indicators
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // File input refs
  const apkInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  // Handle APK file selection
  const handleApkSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setApkFile(file);
      setApkFileName(file.name);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      setApkSize(sizeMB);
    }
  };

  // Handle Icon file selection
  const handleIconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      const previewUrl = URL.createObjectURL(file);
      setIconUrl(previewUrl);
    }
  };

  // Handle Screenshot file upload
  const handleScreenshotFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'screenshot');
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success && data.url) {
          setScreenshots((prev) => [...prev, data.url]);
        }
      } catch (err) {}
    }
  };

  const handleAddScreenshotUrl = () => {
    if (newScreenshotUrl.trim()) {
      setScreenshots((prev) => [...prev, newScreenshotUrl.trim()]);
      setNewScreenshotUrl('');
    }
  };

  const handleRemoveScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('App Name is required');
      return;
    }

    setIsUploading(true);
    setUploadStatusMsg('Preparing uploads...');

    try {
      let finalApkUrl = apkUrl;
      let finalIconUrl = iconUrl;

      // 1. Upload APK if local file was selected
      if (apkFile) {
        setUploadStatusMsg('Uploading APK file...');
        const apkData = new FormData();
        apkData.append('file', apkFile);
        apkData.append('type', 'apk');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: apkData,
        });
        const uploadResult = await uploadRes.json();
        if (uploadResult.success) {
          finalApkUrl = uploadResult.url;
        } else {
          throw new Error('APK upload failed: ' + (uploadResult.error || 'Unknown error'));
        }
      }

      // 2. Upload Icon if local file was selected
      if (iconFile) {
        setUploadStatusMsg('Uploading app icon...');
        const iconData = new FormData();
        iconData.append('file', iconFile);
        iconData.append('type', 'icon');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: iconData,
        });
        const uploadResult = await uploadRes.json();
        if (uploadResult.success) {
          finalIconUrl = uploadResult.url;
        }
      }

      setUploadStatusMsg(isEditing ? 'Saving app updates...' : 'Publishing app to Nur Store...');

      const payload = {
        name: name.trim(),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim(),
        rating: Number(rating) || 5.0,
        category,
        version: version.trim() || '1.0.0',
        size: apkSize,
        developer: developer.trim(),
        developerEmail: developerEmail.trim(),
        requiresAndroid: requiresAndroid.trim(),
        featured,
        apkUrl: finalApkUrl || '/sample-apks/nur-quran-pro-v3.4.2.apk',
        apkFileName: apkFileName || `${name.toLowerCase().replace(/\s+/g, '-')}.apk`,
        iconUrl: finalIconUrl || '/logo.png',
        screenshots,
      };

      const endpoint = isEditing && initialData ? `/api/apps/${initialData.id}` : '/api/apps';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to save app');
      }

      setUploadStatusMsg('Success!');
      onSuccess(result.app);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while saving app');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Error or Alert banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* TOP ROW: Upload APK File (left) and Upload App Icon (next to that) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* 1. Upload APK File */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-colors flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-600" />
                <span>1. Upload APK File</span>
              </label>
              <span className="text-[11px] text-slate-500">Android Package (.apk)</span>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Upload the Android APK installer file for direct download by users.
            </p>

            <input
              type="file"
              ref={apkInputRef}
              accept=".apk,application/vnd.android.package-archive"
              onChange={handleApkSelect}
              className="hidden"
            />

            <div
              onClick={() => apkInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-5 text-center cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-2"
            >
              {apkFileName ? (
                <div className="flex items-center gap-2 text-emerald-600">
                  <FileCheck className="w-6 h-6" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 max-w-[200px] truncate">{apkFileName}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">Selected ({apkSize})</p>
                  </div>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-blue-600 animate-bounce" />
                  <p className="text-xs font-semibold text-slate-800">
                    Click to select .apk file from your computer
                  </p>
                  <p className="text-[10px] text-slate-500">Supports direct APK file uploads</p>
                </>
              )}
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Or specify external APK URL (optional):
            </label>
            <input
              type="url"
              value={apkUrl}
              onChange={(e) => setApkUrl(e.target.value)}
              placeholder="https://example.com/downloads/my-app.apk"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* 2. Upload App Icon (Next to APK upload) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-colors flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>2. Upload App Icon</span>
              </label>
              <span className="text-[11px] text-slate-400">PNG, JPG or WebP</span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              App icon displayed in the store (recommended 512x512).
            </p>

            <input
              type="file"
              ref={iconInputRef}
              accept="image/*"
              onChange={handleIconSelect}
              className="hidden"
            />

            <div className="flex items-center gap-4">
              {/* Preview icon */}
              <div 
                onClick={() => iconInputRef.current?.click()}
                className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-300 hover:border-emerald-500 flex items-center justify-center shrink-0 cursor-pointer shadow-xs group"
              >
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt="App Icon Preview"
                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-emerald-500" />
                )}
              </div>

              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => iconInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Choose Icon Image...
                </button>
                <p className="text-[10px] text-slate-500 mt-1.5">
                  Click icon preview or button to upload
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Or image icon web URL:
            </label>
            <input
              type="url"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or /logo.png"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

      </div>

      {/* 3. Down App Name */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-1.5">
          3. App Name *
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Nur Quran Pro, Noor Messenger, Halal Radar..."
          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* 4. Down App Description (Short description) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-bold text-slate-900">
            4. App Description (Short Summary)
          </label>
          <span className="text-xs text-slate-500">Seen on store browse cards</span>
        </div>
        <input
          type="text"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="One-line compelling overview of your app..."
          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* 5. Down App More Description (Full / Detailed description) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-bold text-slate-900">
            5. App More Description (Full Detailed Overview & Features)
          </label>
          <span className="text-xs text-slate-500">Supports markdown and bullet points</span>
        </div>
        <textarea
          rows={5}
          value={fullDescription}
          onChange={(e) => setFullDescription(e.target.value)}
          placeholder="Detailed description, key features, instructions, and updates..."
          className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-y leading-relaxed"
        />
      </div>

      {/* 6. Down How Many Stars */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <label className="block text-sm font-bold text-slate-900 mb-2">
          6. How Many Stars (Initial Rating)
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setRating(s)}
                className="p-1 hover:scale-125 transition-transform"
              >
                <Star
                  className={`w-6 h-6 ${
                    s <= Math.round(rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Or type exact value:</span>
            <input
              type="number"
              step="0.1"
              min="1.0"
              max="5.0"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value) || 5.0)}
              className="w-20 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-amber-500 focus:outline-none focus:border-amber-400 text-center"
            />
            <span className="text-xs text-slate-400">/ 5.0 Stars</span>
          </div>
        </div>
      </div>

      {/* Additional App Store Options: Category, Version, Developer, Android Version */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as AppCategory)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          >
            <option value="Islamic & Quran">Islamic & Quran</option>
            <option value="Tools & Utilities">Tools & Utilities</option>
            <option value="Social & Chat">Social & Chat</option>
            <option value="Productivity">Productivity</option>
            <option value="Education">Education</option>
            <option value="Games">Games</option>
            <option value="Media & Video">Media & Video</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Version</label>
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="1.0.0"
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Developer Name</label>
          <input
            type="text"
            value={developer}
            onChange={(e) => setDeveloper(e.target.value)}
            placeholder="Developer or Studio"
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Min Android</label>
          <input
            type="text"
            value={requiresAndroid}
            onChange={(e) => setRequiresAndroid(e.target.value)}
            placeholder="Android 8.0 and up"
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Screenshots upload & management */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-900">
            App Screenshots (Visual Showcase)
          </label>
          <span className="text-[11px] text-slate-500">{screenshots.length} screenshots added</span>
        </div>

        <input
          type="file"
          ref={screenshotInputRef}
          accept="image/*"
          onChange={handleScreenshotFileSelect}
          className="hidden"
        />

        <div className="flex flex-wrap gap-3 mb-3">
          {screenshots.map((url, i) => (
            <div key={i} className="relative w-20 h-32 rounded-xl overflow-hidden border border-slate-200 group">
              <img src={url} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveScreenshot(i)}
                className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Add screenshot button */}
          <button
            type="button"
            onClick={() => screenshotInputRef.current?.click()}
            className="w-20 h-32 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50/40 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Upload</span>
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="url"
            value={newScreenshotUrl}
            onChange={(e) => setNewScreenshotUrl(e.target.value)}
            placeholder="Or paste screenshot image URL..."
            className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleAddScreenshotUrl}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Add URL
          </button>
        </div>
      </div>

      {/* Featured checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featuredCheckbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="featuredCheckbox" className="text-xs font-semibold text-slate-700 cursor-pointer">
          Feature this app in Hero Spotlight banner
        </label>
      </div>

      {/* Submit Buttons */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isUploading}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{uploadStatusMsg}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Update App' : 'Publish App to Store'}</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
}
