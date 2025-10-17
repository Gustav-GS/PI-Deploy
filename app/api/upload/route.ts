import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getSessionUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const maxDuration = 60; // seconds

export async function POST(req: Request) {
  if (!getSessionUser()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }
  // Save publicly accessible file under uploads/
  const pathname = `uploads/${Date.now()}-${file.name}`;
  const blob = await put(pathname, file, { access: 'public' });
  return NextResponse.json({ url: blob.url });
}
