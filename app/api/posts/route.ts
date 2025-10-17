import { NextResponse } from 'next/server';
import { ensureInit, sql } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  await ensureInit();
  const { rows } = await sql`SELECT id, created_at, title, content, image_url FROM posts ORDER BY created_at DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await ensureInit();
  if (!getSessionUser()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { title, content, imageUrl } = body;
  if (!title || !content) {
    return NextResponse.json({ error: 'Missing title or content' }, { status: 400 });
  }
  const { rows } = await sql<{ id: number }>`
    INSERT INTO posts (title, content, image_url) VALUES (${title}, ${content}, ${imageUrl || null}) RETURNING id
  `;
  return NextResponse.json({ id: rows[0].id });
}
