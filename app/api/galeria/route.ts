import { NextResponse } from 'next/server';
import { ensureInit, sql } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  await ensureInit();
  const { rows } = await sql`SELECT id, created_at, title, content, image_urls FROM galeria ORDER BY created_at DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await ensureInit();
  if (!getSessionUser()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { title, content, imageUrls } = await req.json();
  if (!title || !content) return NextResponse.json({ error: 'Missing title or content' }, { status: 400 });
  const urls = Array.isArray(imageUrls) ? imageUrls : [];
  const { rows } = await sql<{ id: number }>`
    INSERT INTO galeria (title, content, image_urls) VALUES (${title}, ${content}, ${JSON.stringify(urls)}::jsonb) RETURNING id
  `;
  return NextResponse.json({ id: rows[0].id });
}
