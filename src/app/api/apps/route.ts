import { NextRequest, NextResponse } from 'next/server';
import { getAllApps, addApp } from '@/lib/store';
import { AppItem } from '@/types/app';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = searchParams.get('q')?.toLowerCase();
    const featured = searchParams.get('featured');

    let apps = getAllApps();

    if (category && category !== 'All') {
      apps = apps.filter((app) => app.category === category);
    }

    if (featured === 'true') {
      apps = apps.filter((app) => app.featured);
    }

    if (query) {
      apps = apps.filter(
        (app) =>
          app.name.toLowerCase().includes(query) ||
          app.shortDescription.toLowerCase().includes(query) ||
          app.developer.toLowerCase().includes(query) ||
          app.tags?.some((t) => t.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({ success: true, apps });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ success: false, error: 'App name is required' }, { status: 400 });
    }

    const id = body.id || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

    const initialRating = Number(body.rating) || 5.0;

    const newApp: AppItem = {
      id,
      name: body.name.trim(),
      packageName: body.packageName || `com.nur.${id.replace(/-/g, '')}`,
      developer: body.developer || 'Nur Store Developer',
      developerEmail: body.developerEmail || 'support@nurappstore.com',
      category: body.category || 'Tools & Utilities',
      rating: initialRating,
      ratingCount: 1,
      ratingBreakdown: {
        5: initialRating >= 4.5 ? 1 : 0,
        4: initialRating >= 3.5 && initialRating < 4.5 ? 1 : 0,
        3: initialRating >= 2.5 && initialRating < 3.5 ? 1 : 0,
        2: initialRating >= 1.5 && initialRating < 2.5 ? 1 : 0,
        1: initialRating < 1.5 ? 1 : 0,
      },
      downloads: '0+',
      downloadCount: 0,
      size: body.size || '15 MB',
      version: body.version || '1.0.0',
      updatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      requiresAndroid: body.requiresAndroid || 'Android 7.0 and up',
      iconUrl: body.iconUrl || '/logo.png',
      apkUrl: body.apkUrl || '#',
      apkFileName: body.apkFileName || `${id}.apk`,
      shortDescription: body.shortDescription || '',
      fullDescription: body.fullDescription || body.shortDescription || '',
      screenshots: Array.isArray(body.screenshots) && body.screenshots.length > 0 ? body.screenshots : [
        'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&auto=format&fit=crop&q=80'
      ],
      featured: Boolean(body.featured),
      editorsChoice: Boolean(body.editorsChoice),
      tags: body.tags || [body.category || 'App'],
      whatsNew: body.whatsNew || 'Initial release on Nur App Store.',
      comments: [],
      createdAt: new Date().toISOString(),
    };

    const saved = addApp(newApp);
    return NextResponse.json({ success: true, app: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
