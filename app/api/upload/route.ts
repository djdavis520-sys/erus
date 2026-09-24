import { NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';
import { isAdminAuthenticated } from '@/lib/auth';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB input limit
const OUTPUT_QUALITY = 82;
const OUTPUT_WIDTH = 1200;

export async function POST(req: Request) {
  if (!await isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Compress and convert to WebP
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const outputPath = path.join(process.cwd(), 'public', 'uploads', filename);

  try {
    await sharp(buffer)
      .resize(OUTPUT_WIDTH, undefined, { withoutEnlargement: true })
      .webp({ quality: OUTPUT_QUALITY })
      .toFile(outputPath);
  } catch {
    return NextResponse.json({ error: 'Invalid or unreadable image' }, { status: 400 });
  }

  return NextResponse.json({ url: `/uploads/${filename}` });
}
