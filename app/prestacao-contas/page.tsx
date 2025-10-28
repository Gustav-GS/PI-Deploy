/* eslint-disable @next/next/no-img-element */
import { ensureInit, sql } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import DeleteButton from '@/components/DeleteButton';
import Link from 'next/link';

export default async function PrestacaoContasPage() {
  let items: { id: number; created_at: string; title: string; content: string; image_urls: any }[] = [];
  let loadError: string | null = null;
  try {
    await ensureInit();
    const { rows } = await sql<{ id: number; created_at: string; title: string; content: string; image_urls: any }>`
      SELECT id, created_at, title, content, image_urls FROM prestacaocontas ORDER BY created_at DESC
    `;
    items = rows as any;
  } catch (e: any) {
    loadError = 'Erro ao conectar ao banco de dados. Verifique POSTGRES_URL.';
  }
  const user = getSessionUser();
  return (
    <section className="fonte_padrao">
      <h2>Prestação de Contas</h2>
      {loadError && <p style={{color:'crimson'}}>{loadError}</p>}
      {items.length === 0 && <p>Sem registros no momento.</p>}
      <div style={{display:'grid', gap:24}}>
        {items.map(item => (
          <article key={item.id}>
            <strong>{item.title}</strong>
            <p>{item.content}</p>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:12}}>
              {Array.isArray(item.image_urls) && item.image_urls.map((u: string, idx: number) => (
                <img key={idx} src={u} alt={`${item.title}-${idx+1}`} loading="lazy" decoding="async" />
              ))}
            </div>
            {user && (
              <div style={{marginTop: 8}}>
                <DeleteButton url={`/api/contas/${item.id}`} confirmMessage="Tem certeza que deseja apagar esta postagem?" />
              </div>
            )}
          </article>
        ))}
      </div>
      {user && (
        <p><Link href="/admin/novo-contas">Criar Nova Postagem</Link></p>
      )}
      <p><Link href="/">Voltar</Link></p>
    </section>
  );
}
export const dynamic = 'force-dynamic';
