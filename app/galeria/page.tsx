/* eslint-disable @next/next/no-img-element */
import { ensureInit, sql } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import DeleteButton from '@/components/DeleteButton';
import Link from 'next/link';

export default async function GaleriaPage() {
  let items: { id: number; created_at: string; title: string; content: string; image_urls: any }[] = [];
  let loadError: string | null = null;
  try {
    await ensureInit();
    const { rows } = await sql<{ id: number; created_at: string; title: string; content: string; image_urls: any }>`
      SELECT id, created_at, title, content, image_urls FROM galeria ORDER BY created_at DESC
    `;
    items = rows as any;
  } catch (e: any) {
    loadError = 'Erro ao conectar ao banco de dados. Verifique POSTGRES_URL.';
  }
  const user = getSessionUser();
  return (
    <section className="fonte_eventos">
      <h2>Galeria</h2>
      {loadError && <p style={{color:'crimson'}}>{loadError}</p>}
      {items.length === 0 && <p>Sem postagens na galeria.</p>}
      <div style={{display:'grid', gap:24}}>
        {items.map(g => (
          <article key={g.id}>
            <strong>{g.title}</strong>
            <p>{g.content}</p>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px,1fr))', gap:12}}>
              {Array.isArray(g.image_urls) && g.image_urls.map((u: string, idx: number) => (
                <img key={idx} src={u} alt={`${g.title}-${idx+1}`} loading="lazy" decoding="async" />
              ))}
            </div>
            {user && (
              <div style={{marginTop: 8}}>
                <DeleteButton url={`/api/galeria/${g.id}`} confirmMessage="Tem certeza que deseja apagar esta postagem?" />
              </div>
            )}
          </article>
        ))}
      </div>
      {user && (
        <p><Link href="/admin/novo-galeria">Criar Nova Postagem</Link></p>
      )}
      <p><Link href="/galeria">Voltar</Link></p>
    </section>
  );
}
export const dynamic = 'force-dynamic';
