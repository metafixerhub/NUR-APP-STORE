import { NextRequest, NextResponse } from 'next/server';
import { getAppById, addCommentToApp } from '@/lib/store';
import { syncCommentToMongoCluster } from '@/lib/mongoIntegration';
import { CommentItem } from '@/types/app';

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
    return NextResponse.json({ success: true, comments: app.comments || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!body.comment || !body.comment.trim()) {
      return NextResponse.json({ success: false, error: 'Comment text is required' }, { status: 400 });
    }

    const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
    const userName = (body.userName && body.userName.trim()) || 'Nur Community Member';

    const newComment: CommentItem = {
      id: 'comment-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6),
      userName,
      userAvatar: body.userAvatar || undefined,
      rating,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      comment: body.comment.trim(),
      likes: 0,
      verified: Boolean(body.verified),
    };

    const updatedApp = addCommentToApp(id, newComment);
    if (!updatedApp) {
      return NextResponse.json({ success: false, error: 'App not found' }, { status: 404 });
    }

    syncCommentToMongoCluster(id, newComment);

    return NextResponse.json({ 
      success: true, 
      comment: newComment, 
      app: updatedApp 
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
