import { NextRequest, NextResponse } from 'next/server';
import { incrementDownload } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updated = incrementDownload(id);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'App not found' }, { status: 404 });
    }
    return NextResponse.json({ 
      success: true, 
      downloadCount: updated.downloadCount, 
      downloads: updated.downloads 
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
