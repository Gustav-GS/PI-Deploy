/* eslint-disable @next/next/no-img-element */
import { ensureInit, sql } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import DeleteButton from '@/components/DeleteButton';
import Link from 'next/link';

export default async function ProximosEventosPage() {
  let posts: { id: number; created_at: string; title: string; content: string; image_url: string | null }[] = [];
  let loadError: string | null = null;
  try {
    await ensureInit();
    const { rows } = await sql<{ id: number; created_at: string; title: string; content: string; image_url: string | null }>`
      SELECT id, created_at, title, content, image_url FROM posts ORDER BY created_at DESC
    `;
    posts = rows as any;
  } catch (e: any) {
    loadError = 'Erro ao conectar ao banco de dados. Verifique POSTGRES_URL.';
  }
  const user = getSessionUser();
  return (
    <section className="fonte_eventos">
      <h2>Próximos Eventos</h2>
      {loadError && <p style={{color:'crimson'}}>{loadError}</p>}
      {posts.length === 0 && <p>Nenhum evento cadastrado.</p>}
      <ul style={{listStyle:'none', padding:0, display:'grid', gap:16}}>
        {posts.map(p => (
          <li key={p.id} style={{border:'1px solid #eee', padding:16, borderRadius:8}}>
            <strong>{p.title}</strong><br/>
            <small>{new Date(p.created_at).toLocaleString('pt-BR')}</small>
            <p>{p.content}</p>
            {p.image_url && <img src={p.image_url} alt={p.title} loading="lazy" decoding="async" />}
            {user && (
              <div style={{marginTop: 8}}>
                <DeleteButton url={`/api/posts/${p.id}`} confirmMessage="Tem certeza que deseja apagar este evento?" />
              </div>
            )}
          </li>
        ))}
      </ul>
      {user && (
        <p><Link href="/admin/novo-evento">Criar Novo Evento</Link></p>
      )}
      <p><Link href="/eventos">Voltar</Link></p>
    </section>
  );
}
export const dynamic = 'force-dynamic';
