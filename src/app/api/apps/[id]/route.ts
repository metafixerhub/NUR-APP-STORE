import { NextRequest, NextResponse } from 'next/server';
import { getAppById, updateApp, deleteApp } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const app = getAppById(id);
    if (!app) {
      return NextResponse.json({ success: false, error: 'App not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, app });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updated = updateApp(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'App not found to update' }, { status: 404 });
    }

    return NextResponse.json({ success: true, app: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const success = deleteApp(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'App not found to delete' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'App deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
