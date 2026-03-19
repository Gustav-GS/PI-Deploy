import { NextResponse } from 'next/server';
import { ensureInit, sql } from '@/lib/db';

export async function GET() {
  await ensureInit();
  const { rows } = await sql`
    SELECT id, created_at, event_date, title, content, image_url
    FROM posts
    WHERE event_date IS NULL OR event_date >= NOW()
    ORDER BY event_date ASC NULLS LAST, created_at DESC
  `;
  return NextResponse.json(rows);
}
