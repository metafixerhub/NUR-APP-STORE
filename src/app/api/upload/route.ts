import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string || 'file'; // 'apk', 'icon', 'screenshot'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const originalName = file.name || 'file';
    const ext = path.extname(originalName) || (type === 'apk' ? '.apk' : '.png');
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFileName = `${type}_${Date.now()}_${baseName}${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // File size in readable format
    const sizeInMB = (buffer.length / (1024 * 1024)).toFixed(1) + ' MB';

    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, uniqueFileName);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${uniqueFileName}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        fileName: originalName,
        savedFileName: uniqueFileName,
        size: sizeInMB,
        type: file.type,
      });
    } catch (diskErr) {
      console.warn('Disk write failed (e.g. serverless read-only), creating data URL fallback:', diskErr);
      
      // Fallback for serverless if disk is read-only
      const mimeType = file.type || (type === 'apk' ? 'application/vnd.android.package-archive' : 'image/png');
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64}`;

      return NextResponse.json({
        success: true,
        url: dataUrl,
        fileName: originalName,
        savedFileName: uniqueFileName,
        size: sizeInMB,
        type: mimeType,
        isFallback: true,
      });
    }
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
