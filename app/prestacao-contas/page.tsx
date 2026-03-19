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
    <section style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.pageTitle}>Prestação de Contas</h2>
        <p style={styles.pageSubtitle}>Transparência financeira do Rotary Club Bariri</p>
      </div>

      {loadError && <div style={styles.errorBox}>⚠️ {loadError}</div>}

      {items.length === 0 && !loadError && (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>📊</span>
          <p>Nenhum registro disponível no momento.</p>
        </div>
      )}

      <div style={styles.grid}>
        {items.map(item => {
          const imageList: string[] = Array.isArray(item.image_urls) ? item.image_urls : [];
          const date = new Date(item.created_at);

          return (
            <article key={item.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={styles.iconWrap}>📄</div>
                <div style={styles.cardMeta}>
                  <h3 style={styles.cardTitle}>{item.title}</h3>
                  <span style={styles.cardDate}>
                    Publicado em {date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                {imageList.length > 0 && (
                  <span style={styles.badge}>{imageList.length} doc{imageList.length > 1 ? 's' : ''}</span>
                )}
              </div>

              <p style={styles.cardContent}>{item.content}</p>

              {imageList.length > 0 && (
                <div style={styles.imageSection}>
                  <p style={styles.imageLabel}>Comprovantes</p>
                  <div style={styles.imageGrid}>
                    {imageList.map((u, idx) => (
                      <a key={idx} href={u} target="_blank" rel="noopener noreferrer" style={styles.imageLink}>
                        <img
                          src={u}
                          alt={`${item.title} — doc ${idx + 1}`}
                          loading="lazy"
                          decoding="async"
                          style={styles.image}
                        />
                        <span style={styles.imageOverlay}>🔍 Ver</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {user && (
                <div style={styles.adminRow}>
                  <DeleteButton url={`/api/contas/${item.id}`} confirmMessage="Tem certeza que deseja apagar esta postagem?" />
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div style={styles.footer}>
        {user && (
          <Link href="/admin/novo-contas" style={styles.createBtn}>+ Nova Prestação de Contas</Link>
        )}
        <Link href="/" style={styles.backLink}>← Voltar</Link>
      </div>
    </section>
  );
}
export const dynamic = 'force-dynamic';

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '32px 20px 48px',
  },
  header: {
    textAlign: 'center',
    marginBottom: 36,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 800,
    color: '#0f2d5e',
    margin: '0 0 8px',
  },
  pageSubtitle: {
    color: '#64748b',
    fontSize: 16,
    margin: 0,
  },
  errorBox: {
    background: '#fee4e2',
    border: '1px solid #fca5a5',
    color: '#b91c1c',
    borderRadius: 10,
    padding: '12px 16px',
    marginBottom: 24,
    fontSize: 14,
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#94a3b8',
  },
  emptyIcon: {
    fontSize: 48,
    display: 'block',
    marginBottom: 12,
  },
  grid: {
    display: 'grid',
    gap: 24,
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #e4edf7',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    overflow: 'hidden',
    padding: '24px 28px',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 14,
  },
  iconWrap: {
    fontSize: 28,
    lineHeight: 1,
    flexShrink: 0,
    marginTop: 2,
  },
  cardMeta: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#0f2d5e',
    margin: '0 0 4px',
    lineHeight: 1.3,
  },
  cardDate: {
    fontSize: 13,
    color: '#94a3b8',
  },
  badge: {
    flexShrink: 0,
    background: '#eef4fb',
    color: '#2276ca',
    fontSize: 12,
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: 20,
    border: '1px solid #cddff5',
  },
  cardContent: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 1.65,
    margin: '0 0 20px',
    whiteSpace: 'pre-wrap',
    paddingLeft: 42,
  },
  imageSection: {
    paddingLeft: 42,
  },
  imageLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    margin: '0 0 10px',
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 10,
  },
  imageLink: {
    position: 'relative',
    display: 'block',
    borderRadius: 10,
    overflow: 'hidden',
    border: '1px solid #e4edf7',
  },
  image: {
    width: '100%',
    height: 130,
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.2s ease',
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(15, 45, 94, 0.55)',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s ease',
  },
  adminRow: {
    marginTop: 16,
    paddingTop: 14,
    borderTop: '1px solid #f0f4f9',
    paddingLeft: 42,
  },
  footer: {
    marginTop: 40,
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
    color: '#64748b',
    fontSize: 14,
    textDecoration: 'none',
  },
};
