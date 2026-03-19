/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const slides = [
  { src: '/img/combatemosfome.png', alt: 'Combatemos a Fome' },
  { src: '/img/salvamosvidas.png',  alt: 'Salvamos Vidas' },
  { src: '/img/promovendopaz.png',  alt: 'Promovendo a Paz' },
];

const sponsors = [
  { src: '/img/empresaamiga.png', alt: 'Empresa Amiga', href: '/' },
  { src: '/img/fazendacafe.png',  alt: 'Fazenda Café Pessegueiro', href: 'https://loja.cafefazendapessegueiro.com.br' },
  { src: '/img/grupomonjojpeg.png', alt: 'Grupo Monjo', href: null },
  { src: '/img/wordclean.png',    alt: 'Word Clean', href: null },
  { src: '/img/teccar.png',       alt: 'Teccar', href: 'https://pt-br.facebook.com/BARIRITECCAR/' },
];

export default function HomePage() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);
  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section style={styles.page}>
      {/* ── CARROSSEL ── */}
      <div
        style={styles.carouselWrap}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div style={styles.carousel}>
          {slides.map((s, i) => (
            <img
              key={i}
              src={s.src}
              alt={s.alt}
              style={{
                ...styles.slide,
                opacity: i === current ? 1 : 0,
                zIndex: i === current ? 1 : 0,
              }}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          ))}

          {/* Setas */}
          <button style={{ ...styles.arrow, left: 14 }} onClick={prev} aria-label="Anterior">‹</button>
          <button style={{ ...styles.arrow, right: 14 }} onClick={next} aria-label="Próximo">›</button>
        </div>

        {/* Dots */}
        <div style={styles.dots}>
          {slides.map((_, i) => (
            <button
              key={i}
              style={{ ...styles.dot, ...(i === current ? styles.dotActive : {}) }}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── CHAMADA ── */}
      <div style={styles.cta}>
        <h2 style={styles.ctaTitle}>Rotary Club Bariri 16 de Junho</h2>
        <p style={styles.ctaText}>
          Juntos transformamos comunidades. Conheça nossas ações, eventos e como você pode fazer parte.
        </p>
        <div style={styles.ctaButtons}>
          <Link href="/quem-somos" style={styles.btnPrimary}>Conheça o Clube</Link>
          <Link href="/doacao" style={styles.btnOutline}>Fazer uma Doação</Link>
        </div>
      </div>

      {/* ── APOIADORES ── */}
      <div style={styles.sponsors}>
        <p style={styles.sponsorsLabel}>Apoiadores</p>
        <div style={styles.sponsorsGrid}>
          {sponsors.map((s, i) => {
            const img = (
              <img
                src={s.src}
                alt={s.alt}
                style={styles.sponsorImg}
                loading="lazy"
                decoding="async"
              />
            );
            return s.href ? (
              <a
                key={i}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={styles.sponsorCard}
              >
                {img}
              </a>
            ) : (
              <div key={i} style={styles.sponsorCard}>{img}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 960,
    margin: '0 auto',
    padding: '0 0 48px',
    display: 'grid',
    gap: 0,
  },

  /* Carrossel */
  carouselWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  carousel: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 6',
    borderRadius: 14,
    overflow: 'hidden',
    background: '#e8edf3',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
  },
  slide: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.7s ease',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    background: 'rgba(255,255,255,0.75)',
    border: 'none',
    borderRadius: '50%',
    width: 36,
    height: 36,
    fontSize: 22,
    lineHeight: 1,
    cursor: 'pointer',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
    padding: 0,
    marginTop: 0,
  },
  dots: {
    display: 'flex',
    gap: 7,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#cbd5e1',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    marginTop: 0,
    boxShadow: 'none',
    transition: 'background 0.2s ease, transform 0.2s ease',
  },
  dotActive: {
    background: '#2276ca',
    transform: 'scale(1.3)',
  },

  /* CTA */
  cta: {
    textAlign: 'center',
    padding: '36px 20px 28px',
  },
  ctaTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: '#0f2d5e',
    margin: '0 0 10px',
  },
  ctaText: {
    color: '#64748b',
    fontSize: 16,
    maxWidth: 560,
    margin: '0 auto 22px',
    lineHeight: 1.6,
  },
  ctaButtons: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    background: '#2276ca',
    color: '#fff',
    padding: '11px 26px',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 15,
    textDecoration: 'none',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  },
  btnOutline: {
    background: 'transparent',
    color: '#2276ca',
    padding: '10px 26px',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 15,
    textDecoration: 'none',
    border: '1.5px solid #2276ca',
  },

  /* Apoiadores */
  sponsors: {
    borderTop: '1px solid #e8edf3',
    paddingTop: 28,
    paddingLeft: 20,
    paddingRight: 20,
  },
  sponsorsLabel: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#94a3b8',
    textTransform: 'uppercase',
    margin: '0 0 18px',
  },
  sponsorsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  sponsorCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 16px',
    borderRadius: 10,
    border: '1px solid #e8edf3',
    background: '#fff',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    textDecoration: 'none',
  },
  sponsorImg: {
    height: 48,
    width: 'auto',
    maxWidth: 120,
    objectFit: 'contain',
    filter: 'grayscale(20%)',
    transition: 'filter 0.2s ease',
  },
};
