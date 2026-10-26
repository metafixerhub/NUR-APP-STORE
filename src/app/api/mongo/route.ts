import { NextRequest, NextResponse } from 'next/server';
import { 
  fetchClusterStats, 
  pushToMongoCluster, 
  DEFAULT_DB_NAME, 
  DEFAULT_CLUSTER_INDEX 
} from '@/lib/mongoIntegration';
import { getAllApps } from '@/lib/store';

export const dynamic = 'force-dynamic';

/**
 * GET /api/mongo: Fetches live stats of all 10 MongoDB clusters
 */
export async function GET() {
  try {
    const stats = await fetchClusterStats();
    return NextResponse.json({
      success: true,
      clusters: stats,
      endpoint: 'https://one0l-server-point-234567.onrender.com/api/external/stats-embed',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch cluster stats' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mongo: 
 * Actions supported:
 * 1. 'push' - Push custom data to cluster
 * 2. 'sync_all_apps' - Bulk sync all apps in NUR APP STORE to cluster
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'push';
    const clusterIndex = Number(body.clusterIndex) || DEFAULT_CLUSTER_INDEX;
    const dbName = body.dbName || DEFAULT_DB_NAME;

    if (action === 'sync_all_apps') {
      const allApps = getAllApps();
      const sanitizedApps = allApps.map(a => ({
        id: a.id,
        name: a.name,
        packageName: a.packageName,
        version: a.version,
        category: a.category,
        downloads: a.downloads,
        rating: a.rating,
        ratingCount: a.ratingCount,
        apkUrl: a.apkUrl,
        iconUrl: a.iconUrl,
        shortDescription: a.shortDescription,
        tags: a.tags,
        updatedAt: a.updatedAt,
      }));

      const result = await pushToMongoCluster({
        clusterIndex,
        dbName,
        collectionName: 'apps',
        payload: sanitizedApps,
      });

      return NextResponse.json({
        success: result.success,
        syncedCount: sanitizedApps.length,
        result,
        message: `Successfully synchronized ${sanitizedApps.length} apps to Cluster ${clusterIndex} (${dbName}.apps)`,
      });
    }

    // Default push action
    const collectionName = body.collectionName || 'general_logs';
    const payload = body.payload;

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'payload field is required' },
        { status: 400 }
      );
    }

    const result = await pushToMongoCluster({
      clusterIndex,
      dbName,
      collectionName,
      payload,
    });

    return NextResponse.json({
      success: result.success,
      result,
      message: result.success 
        ? `Successfully pushed data to Cluster ${clusterIndex} [${dbName}.${collectionName}]` 
        : result.error,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error processing MongoDB request' },
      { status: 500 }
    );
  }
}
