/* eslint-disable @next/next/no-img-element */
import { ensureInit, sql } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import DeleteButton from '@/components/DeleteButton';
import Link from 'next/link';

export default async function ProximosEventosPage() {
  let posts: { id: number; created_at: string; event_date: string | null; title: string; content: string; image_url: string | null }[] = [];
  let loadError: string | null = null;
  try {
    await ensureInit();
    const { rows } = await sql<{ id: number; created_at: string; event_date: string | null; title: string; content: string; image_url: string | null }>`
      SELECT id, created_at, event_date, title, content, image_url FROM posts ORDER BY created_at DESC
    `;
    posts = rows as any;
  } catch (e: any) {
    loadError = 'Erro ao conectar ao banco de dados. Verifique POSTGRES_URL.';
  }
  const user = getSessionUser();

  return (
    <section style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.pageTitle}>Próximos Eventos</h2>
        <p style={styles.pageSubtitle}>Confira as atividades e eventos do Rotary Club Bariri</p>
      </div>

      {loadError && <div style={styles.errorBox}>⚠️ {loadError}</div>}

      {posts.length === 0 && !loadError && (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>📅</span>
          <p>Nenhum evento cadastrado ainda.</p>
        </div>
      )}

      <div style={styles.grid}>
        {posts.map(p => {
          const hasDate = !!p.event_date;
          const eventDate = hasDate ? new Date(p.event_date!) : null;
          const isPast = eventDate ? eventDate < new Date() : false;

          return (
            <article key={p.id} style={{ ...styles.card, ...(isPast ? styles.cardPast : {}) }}>
              {p.image_url && (
                <div style={styles.imageWrap}>
                  <img src={p.image_url} alt={p.title} loading="lazy" decoding="async" style={styles.image} />
                  {isPast && <span style={styles.badgePast}>Encerrado</span>}
                  {!isPast && hasDate && <span style={styles.badgeFuture}>Em breve</span>}
                </div>
              )}

              <div style={styles.cardBody}>
                {!p.image_url && (
                  <div style={{ marginBottom: 4 }}>
                    {isPast && <span style={styles.badgePast}>Encerrado</span>}
                    {!isPast && hasDate && <span style={styles.badgeFuture}>Em breve</span>}
                  </div>
                )}

                <h3 style={styles.cardTitle}>{p.title}</h3>

                {eventDate && (
                  <div style={styles.dateRow}>
                    <span style={styles.dateIcon}>📅</span>
                    <span style={styles.dateText}>
                      {eventDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                      {' às '}
                      {eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}

                <p style={styles.cardContent}>{p.content}</p>

                {user && (
                  <div style={styles.adminRow}>
                    <DeleteButton url={`/api/posts/${p.id}`} confirmMessage="Tem certeza que deseja apagar este evento?" />
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div style={styles.footer}>
        {user && (
          <Link href="/admin/novo-evento" style={styles.createBtn}>+ Criar Novo Evento</Link>
        )}
        <Link href="/eventos" style={styles.backLink}>← Voltar</Link>
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
    boxShadow: '0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)',
    overflow: 'hidden',
    border: '1px solid #e8eef5',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'grid',
    gridTemplateColumns: '1fr',
  },
  cardPast: {
    opacity: 0.65,
    filter: 'grayscale(30%)',
  },
  imageWrap: {
    position: 'relative',
    width: '100%',
    maxHeight: 280,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 260,
    objectFit: 'cover',
    display: 'block',
  },
  badgeFuture: {
    position: 'absolute',
    top: 14,
    right: 14,
    background: 'linear-gradient(135deg, #2276ca, #1558a8)',
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: 20,
    boxShadow: '0 2px 8px rgba(34,118,202,0.4)',
    letterSpacing: '0.03em',
  },
  badgePast: {
    display: 'inline-block',
    background: '#f1f5f9',
    color: '#64748b',
    fontSize: 12,
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: 20,
    letterSpacing: '0.02em',
  },
  cardBody: {
    padding: '22px 26px 24px',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#0f2d5e',
    margin: '0 0 10px',
    lineHeight: 1.3,
  },
  dateRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    marginBottom: 14,
  },
  dateIcon: {
    fontSize: 15,
  },
  dateText: {
    fontSize: 14,
    color: '#2276ca',
    fontWeight: 600,
    textTransform: 'capitalize',
  },
  cardContent: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 1.65,
    margin: '0 0 8px',
    whiteSpace: 'pre-wrap',
  },
  adminRow: {
    marginTop: 16,
    paddingTop: 14,
    borderTop: '1px solid #f0f4f9',
  },
  footer: {
    marginTop: 40,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  createBtn: {
    background: 'linear-gradient(135deg, #2276ca 0%, #1558a8 100%)',
    color: '#fff',
    padding: '11px 24px',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 15,
    boxShadow: '0 4px 14px rgba(34,118,202,0.3)',
    textDecoration: 'none',
  },
  backLink: {
    color: '#64748b',
    fontSize: 14,
    textDecoration: 'none',
  },
};
