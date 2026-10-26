'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Server, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Layers, 
  HardDrive, 
  Activity, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface ClusterStat {
  name: string;
  status: string;
  storagePercent: number;
}

export default function AdminMongoClusterManager() {
  const [clusters, setClusters] = useState<ClusterStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingAll, setSyncingAll] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<number>(1);
  const [customDbName, setCustomDbName] = useState('NurAppStoreDB');
  const [customCollection, setCustomCollection] = useState('apps');
  const [customPayload, setCustomPayload] = useState('{\n  "source": "Nur App Store Admin",\n  "status": "healthy",\n  "note": "Manual sync test"\n}');
  const [pushingCustom, setPushingCustom] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [syncLogs, setSyncLogs] = useState<Array<{ time: string; text: string; id?: string }>>([]);

  const fetchClusters = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mongo');
      const data = await res.json();
      if (data.success && Array.isArray(data.clusters)) {
        setClusters(data.clusters);
      }
    } catch (err: any) {
      console.error('Error fetching cluster stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  const handleSyncAllApps = async () => {
    setSyncingAll(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/mongo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_all_apps',
          clusterIndex: selectedCluster,
          dbName: customDbName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const id = data.result?.insertedId;
        const msg = `Synced ${data.syncedCount} apps into Cluster ${selectedCluster} (${customDbName}.apps)`;
        setStatusMessage({ type: 'success', text: msg });
        setSyncLogs(prev => [
          { time: new Date().toLocaleTimeString(), text: msg, id },
          ...prev.slice(0, 9)
        ]);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to sync apps to cluster' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Network error during sync' });
    } finally {
      setSyncingAll(false);
    }
  };

  const handlePushCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    setPushingCustom(true);
    setStatusMessage(null);

    let parsedPayload;
    try {
      parsedPayload = JSON.parse(customPayload);
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Invalid JSON payload. Please verify JSON format.' });
      setPushingCustom(false);
      return;
    }

    try {
      const res = await fetch('/api/mongo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'push',
          clusterIndex: selectedCluster,
          dbName: customDbName,
          collectionName: customCollection,
          payload: parsedPayload,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const id = data.result?.insertedId;
        const msg = `Inserted data into Cluster ${selectedCluster} [${customDbName}.${customCollection}] (ID: ${id})`;
        setStatusMessage({ type: 'success', text: msg });
        setSyncLogs(prev => [
          { time: new Date().toLocaleTimeString(), text: msg, id },
          ...prev.slice(0, 9)
        ]);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Push failed' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Push request error' });
    } finally {
      setPushingCustom(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-white/15 backdrop-blur-md shrink-0">
              <Database className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">MongoDB 10-Cluster External Integration</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/25 border border-emerald-300/30 text-[10px] font-black tracking-wide uppercase">
                  Connected
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Target Server: <code className="bg-black/20 px-1.5 py-0.5 rounded text-[11px]">one0l-server-point-234567.onrender.com</code>
              </p>
            </div>
          </div>
          <button
            onClick={fetchClusters}
            disabled={loading}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-bold text-white transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Clusters</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Cluster Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-600" />
            <span>Available Clusters (1 - 10)</span>
          </h4>
          <span className="text-xs text-slate-500 font-medium">Click a cluster to set as active target</span>
        </div>

        {loading && clusters.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 animate-pulse h-24"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {(clusters.length > 0 ? clusters : Array.from({ length: 10 }).map((_, i) => ({
              name: `Cluster ${i + 1}`,
              status: 'Online',
              storagePercent: 0
            }))).map((cl, idx) => {
              const clusterNum = idx + 1;
              const isSelected = selectedCluster === clusterNum;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedCluster(clusterNum)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-900">{cl.name}</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {cl.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Storage</span>
                      <span className="font-bold text-slate-700">{cl.storagePercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${Math.max(cl.storagePercent, 5)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Index: {clusterNum}</span>
                    {isSelected && (
                      <span className="text-blue-600 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Target
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bulk Store Sync */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Layers className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">One-Click Store Sync to MongoDB</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Synchronizes all current apps, metadata, download statistics, ratings, and APK endpoints from NUR APP STORE into 
            <strong className="text-slate-900"> Cluster {selectedCluster}</strong> inside <code className="text-emerald-700 font-mono bg-emerald-50 px-1 py-0.5 rounded text-[11px]">{customDbName}.apps</code>.
          </p>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Cluster</label>
              <select
                value={selectedCluster}
                onChange={(e) => setSelectedCluster(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Cluster {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Database Name</label>
              <input
                type="text"
                value={customDbName}
                onChange={(e) => setCustomDbName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
              />
            </div>
          </div>

          <button
            onClick={handleSyncAllApps}
            disabled={syncingAll}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            {syncingAll ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Syncing to MongoDB Cluster {selectedCluster}...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Sync All Store Apps to Cluster {selectedCluster}</span>
              </>
            )}
          </button>
        </div>

        {/* Custom Data Push Console */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Send className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">Push Custom Data into Cluster</h4>
          </div>
          <form onSubmit={handlePushCustom} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Collection</label>
                <input
                  type="text"
                  value={customCollection}
                  onChange={(e) => setCustomCollection(e.target.value)}
                  placeholder="e.g. users, logs"
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Cluster Index</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={selectedCluster}
                  onChange={(e) => setSelectedCluster(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">JSON Payload</label>
              <textarea
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800 leading-tight focus:bg-white transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={pushingCustom}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
            >
              {pushingCustom ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Pushing to MongoDB...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Push Data to Cluster {selectedCluster}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Sync Log Feed */}
      {syncLogs.length > 0 && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h5 className="text-xs font-bold text-slate-900">Recent MongoDB Sync Operations</h5>
          </div>
          <div className="space-y-1.5">
            {syncLogs.map((log, i) => (
              <div key={i} className="flex items-start justify-between text-[11px] py-1 border-b border-slate-50 last:border-none">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono text-[10px]">{log.time}</span>
                  <span className="text-slate-800 font-medium">{log.text}</span>
                </div>
                {log.id && (
                  <span className="font-mono text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                    ID: {log.id}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
