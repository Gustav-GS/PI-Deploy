import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  const env = {
    POSTGRES_URL: Boolean(process.env.POSTGRES_URL),
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    JWT_SECRET: Boolean(process.env.JWT_SECRET),
    BLOB_READ_WRITE_TOKEN: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    GEOCODER_CONTACT: Boolean(process.env.GEOCODER_CONTACT),
  };

  let dbOk = false;
  let now: string | null = null;
  let error: string | undefined;
  try {
    const { rows } = await sql`SELECT NOW() as now`;
    dbOk = true;
    const v = (rows?.[0] as any)?.now;
    now = v ? String(v) : null;
  } catch (e: any) {
    error = e?.message || 'connection_error';
  }

  const body = {
    env,
    db: { ok: dbOk, now, error: dbOk ? undefined : error },
  };

  return NextResponse.json(body, { status: dbOk ? 200 : 500 });
}

