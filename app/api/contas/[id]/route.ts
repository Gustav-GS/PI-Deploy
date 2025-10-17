import { NextResponse } from 'next/server';
import { ensureInit, sql } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

type Params = { params: { id: string } };

export async function DELETE(_req: Request, { params }: Params) {
  await ensureInit();
  if (!getSessionUser()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  await sql`DELETE FROM prestacaocontas WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
