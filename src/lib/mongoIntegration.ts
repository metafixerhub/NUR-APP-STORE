export interface ClusterStat {
  name: string;
  status: string;
  storagePercent: number;
}

export interface MongoPushResult {
  success: boolean;
  insertedId?: string;
  error?: string;
  clusterIndex?: number;
  dbName?: string;
  collectionName?: string;
  timestamp?: string;
}

export const MONGO_EXTERNAL_BASE_URL = 'https://one0l-server-point-234567.onrender.com';
export const DEFAULT_DB_NAME = 'NurAppStoreDB';
export const DEFAULT_CLUSTER_INDEX = 1;

/**
 * Reads live cluster stats from external Render server
 * Endpoint: GET /api/external/stats-embed
 */
export async function fetchClusterStats(): Promise<ClusterStat[]> {
  try {
    const res = await fetch(`${MONGO_EXTERNAL_BASE_URL}/api/external/stats-embed`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.warn('[MongoDB External API] Error fetching cluster stats:', err);
    return [];
  }
}

/**
 * Pushes arbitrary payload directly into one of the 10 MongoDB clusters
 * Endpoint: POST /api/external/push-data
 */
export async function pushToMongoCluster(params: {
  clusterIndex?: number;
  dbName?: string;
  collectionName: string;
  payload: any;
}): Promise<MongoPushResult> {
  const clusterIndex = params.clusterIndex ?? DEFAULT_CLUSTER_INDEX;
  const dbName = params.dbName || DEFAULT_DB_NAME;
  const timestamp = new Date().toISOString();

  try {
    const res = await fetch(`${MONGO_EXTERNAL_BASE_URL}/api/external/push-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clusterIndex,
        dbName,
        collectionName: params.collectionName,
        payload: Array.isArray(params.payload)
          ? params.payload.map(p => ({ ...p, syncedAt: timestamp }))
          : { ...params.payload, syncedAt: timestamp },
      }),
    });

    const json = await res.json();
    if (json.success) {
      return {
        success: true,
        insertedId: json.result?.insertedId || 'synced_ok',
        clusterIndex,
        dbName,
        collectionName: params.collectionName,
        timestamp,
      };
    }
    return {
      success: false,
      error: json.message || 'Failed to push to cluster',
      clusterIndex,
      dbName,
      collectionName: params.collectionName,
      timestamp,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error connecting to cluster API',
      clusterIndex,
      dbName,
      collectionName: params.collectionName,
      timestamp,
    };
  }
}

/**
 * Asynchronously sync an app to MongoDB cluster (non-blocking)
 */
export function syncAppToMongoCluster(app: any, action: 'create' | 'update' = 'create', clusterIndex = DEFAULT_CLUSTER_INDEX) {
  pushToMongoCluster({
    clusterIndex,
    dbName: DEFAULT_DB_NAME,
    collectionName: 'apps',
    payload: {
      action,
      appId: app.id,
      name: app.name,
      packageName: app.packageName,
      version: app.version,
      category: app.category,
      downloads: app.downloads,
      rating: app.rating,
      apkUrl: app.apkUrl,
      iconUrl: app.iconUrl,
      updatedAt: app.updatedAt,
    },
  }).catch((err) => console.warn('[MongoSync] Failed to sync app:', err));
}

/**
 * Asynchronously sync a new review / comment to MongoDB cluster
 */
export function syncCommentToMongoCluster(appId: string, comment: any, clusterIndex = DEFAULT_CLUSTER_INDEX) {
  pushToMongoCluster({
    clusterIndex,
    dbName: DEFAULT_DB_NAME,
    collectionName: 'comments',
    payload: {
      appId,
      commentId: comment.id,
      userName: comment.userName,
      rating: comment.rating,
      comment: comment.comment,
      date: comment.date,
      likes: comment.likes,
    },
  }).catch((err) => console.warn('[MongoSync] Failed to sync comment:', err));
}

/**
 * Asynchronously record a download event in MongoDB cluster
 */
export function syncDownloadEventToMongoCluster(appId: string, appName?: string, clusterIndex = DEFAULT_CLUSTER_INDEX) {
  pushToMongoCluster({
    clusterIndex,
    dbName: DEFAULT_DB_NAME,
    collectionName: 'downloads',
    payload: {
      appId,
      appName: appName || appId,
      event: 'apk_download',
      timestamp: new Date().toISOString(),
    },
  }).catch((err) => console.warn('[MongoSync] Failed to sync download event:', err));
}
