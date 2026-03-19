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
    <section style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.pageTitle}>Galeria</h2>
        <p style={styles.pageSubtitle}>Registros e momentos do Rotary Club Bariri</p>
      </div>

      {loadError && <div style={styles.errorBox}>⚠️ {loadError}</div>}

      {items.length === 0 && !loadError && (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>🖼️</span>
          <p>Nenhuma postagem na galeria ainda.</p>
        </div>
      )}

      <div style={styles.grid}>
        {items.map(item => {
          const imageList: string[] = Array.isArray(item.image_urls) ? item.image_urls : [];
          const date = new Date(item.created_at);
          const cover = imageList[0];

          return (
            <article key={item.id} style={styles.card}>
              {cover && (
                <a href={cover} target="_blank" rel="noopener noreferrer" style={styles.coverLink}>
                  <img src={cover} alt={item.title} loading="lazy" decoding="async" style={styles.cover} />
                  {imageList.length > 1 && (
                    <span style={styles.coverCount}>+{imageList.length - 1}</span>
                  )}
                </a>
              )}

              <div style={styles.cardBody}>
                <div style={styles.cardTop}>
                  <h3 style={styles.cardTitle}>{item.title}</h3>
                  <span style={styles.cardDate}>
                    {date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <p style={styles.cardContent}>{item.content}</p>

                {imageList.length > 1 && (
                  <div style={styles.thumbRow}>
                    {imageList.slice(1).map((u, idx) => (
                      <a key={idx} href={u} target="_blank" rel="noopener noreferrer" style={styles.thumbLink}>
                        <img src={u} alt={`${item.title}-${idx + 2}`} loading="lazy" decoding="async" style={styles.thumb} />
                      </a>
                    ))}
                  </div>
                )}

                {user && (
                  <div style={styles.adminRow}>
                    <DeleteButton url={`/api/galeria/${item.id}`} confirmMessage="Tem certeza que deseja apagar esta postagem?" />
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div style={styles.footer}>
        {user && (
          <Link href="/admin/novo-galeria" style={styles.createBtn}>+ Nova Postagem</Link>
        )}
        <Link href="/" style={styles.backLink}>← Voltar</Link>
      </div>
    </section>
  );
}
export const dynamic = 'force-dynamic';

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 860,
    margin: '0 auto',
    padding: '32px 20px 48px',
  },
  header: {
    textAlign: 'center',
    marginBottom: 36,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: 800,
    color: '#1e293b',
    margin: '0 0 6px',
  },
  pageSubtitle: {
    color: '#94a3b8',
    fontSize: 15,
    margin: 0,
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    borderRadius: 8,
    padding: '11px 14px',
    marginBottom: 24,
    fontSize: 13,
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#94a3b8',
  },
  emptyIcon: {
    fontSize: 44,
    display: 'block',
    marginBottom: 10,
  },
  grid: {
    display: 'grid',
    gap: 20,
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    border: '1px solid #e8edf3',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  coverLink: {
    display: 'block',
    position: 'relative',
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: 240,
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.3s ease',
  },
  coverCount: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    background: 'rgba(15,23,42,0.65)',
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 20,
    backdropFilter: 'blur(4px)',
  },
  cardBody: {
    padding: '18px 22px 20px',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: '#1e293b',
    margin: 0,
    lineHeight: 1.3,
  },
  cardDate: {
    fontSize: 12,
    color: '#94a3b8',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  cardContent: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 1.6,
    margin: '0 0 14px',
    whiteSpace: 'pre-wrap',
  },
  thumbRow: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  thumbLink: {
    display: 'block',
    borderRadius: 6,
    overflow: 'hidden',
    border: '1px solid #e8edf3',
    flexShrink: 0,
  },
  thumb: {
    width: 64,
    height: 52,
    objectFit: 'cover',
    display: 'block',
    transition: 'opacity 0.2s ease',
  },
  adminRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTop: '1px solid #f0f3f7',
  },
  footer: {
    marginTop: 36,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  createBtn: {
    background: '#2276ca',
    color: '#fff',
    padding: '10px 22px',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    textDecoration: 'none',
  },
  backLink: {
    color: '#94a3b8',
    fontSize: 14,
    textDecoration: 'none',
  },
};
