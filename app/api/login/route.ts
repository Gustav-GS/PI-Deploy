import { NextResponse } from 'next/server';
import { ensureInit, sql } from '@/lib/db';
import { SessionUser, signToken, setSessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  await ensureInit();
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }
  const { rows } = await sql<{ id: number; username: string }>`
    SELECT id, username FROM users WHERE username = ${username} AND password = ${password} LIMIT 1
  `;
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const user: SessionUser = { id: rows[0].id, username: rows[0].username };
  const token = signToken(user);
  setSessionCookie(token);
  return NextResponse.json({ ok: true, user });
}

