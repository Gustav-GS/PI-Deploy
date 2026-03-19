/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data?.error || 'Usuário ou senha inválidos');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <section style={styles.page}>
      <div style={styles.container}>

        {/* Painel esquerdo */}
        <div style={styles.panel}>
          <img
            src="/img/logo.png"
            alt="Logo Rotary Club Bariri"
            style={styles.logo}
            decoding="async"
            fetchPriority="high"
            loading="eager"
          />
          <h1 style={styles.panelTitle}>Área Administrativa</h1>
          <p style={styles.panelText}>
            Gerencie eventos, galeria de fotos e prestações de contas do Rotary Club Bariri.
          </p>
          <ul style={styles.panelList}>
            <li style={styles.panelItem}>Criar e publicar eventos</li>
            <li style={styles.panelItem}>Gerenciar galeria de fotos</li>
            <li style={styles.panelItem}>Registrar prestações de contas</li>
          </ul>
        </div>

        {/* Formulário */}
        <div style={styles.formWrap}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Entrar</h2>
            <p style={styles.cardSub}>Acesso restrito a membros autorizados</p>

            <form onSubmit={onSubmit} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label} htmlFor="user">Usuário</label>
                <input
                  id="user"
                  style={styles.input}
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Digite seu usuário"
                  autoFocus
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label} htmlFor="pass">Senha</label>
                <div style={styles.passwordWrap}>
                  <input
                    id="pass"
                    style={{ ...styles.input, paddingRight: 80 }}
                    name="password"
                    autoComplete="current-password"
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    style={styles.showBtn}
                    onClick={() => setShow(s => !s)}
                    aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {show ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>

              {error && (
                <div style={styles.errorBox} role="alert" aria-live="polite">
                  {error}
                </div>
              )}

              <button type="submit" style={styles.submitBtn} disabled={busy}>
                {busy ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={styles.spinner} role="status" aria-live="polite" /> Entrando...
                  </span>
                ) : 'Entrar'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 16px',
    background: '#f0f4f9',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    width: '100%',
    maxWidth: 860,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 4px 32px rgba(15,45,94,0.12)',
    border: '1px solid #dde6f0',
  },

  /* Painel esquerdo */
  panel: {
    background: 'linear-gradient(150deg, #1558a8 0%, #2276ca 100%)',
    padding: '48px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 16,
  },
  logo: {
    width: 140,
    height: 'auto',
    marginBottom: 8,
    filter: 'brightness(0) invert(1)',
    opacity: 0.9,
  },
  panelTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 700,
    margin: 0,
    lineHeight: 1.3,
  },
  panelText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    margin: 0,
    lineHeight: 1.6,
  },
  panelList: {
    listStyle: 'none',
    padding: 0,
    margin: '4px 0 0',
    display: 'grid',
    gap: 8,
  },
  panelItem: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    paddingLeft: 14,
    position: 'relative',
    background: 'none',
    boxShadow: 'none',
    borderRadius: 0,
    maxWidth: 'none',
    border: 'none',
    margin: 0,
    padding: '0 0 0 14px',
  },

  /* Formulário */
  formWrap: {
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 40px',
  },
  card: {
    width: '100%',
    maxWidth: 340,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#0f2d5e',
    margin: '0 0 4px',
    textAlign: 'left',
  },
  cardSub: {
    fontSize: 13,
    color: '#94a3b8',
    margin: '0 0 28px',
  },
  form: {
    display: 'grid',
    gap: 18,
  },
  field: {
    display: 'grid',
    gap: 5,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#475569',
  },
  input: {
    padding: '10px 13px',
    borderRadius: 8,
    border: '1px solid #dde3ea',
    fontSize: 14,
    color: '#1e293b',
    background: '#fafbfc',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  passwordWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  showBtn: {
    position: 'absolute',
    right: 10,
    background: 'none',
    border: 'none',
    color: '#2276ca',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    padding: '2px 4px',
    marginTop: 0,
    boxShadow: 'none',
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    borderRadius: 8,
    padding: '10px 13px',
    fontSize: 13,
  },
  submitBtn: {
    background: '#2276ca',
    border: 'none',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    borderRadius: 8,
    padding: '12px',
    cursor: 'pointer',
    width: '100%',
    marginTop: 4,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  },
  spinner: {
    display: 'inline-block',
    width: 15,
    height: 15,
    border: '2px solid rgba(255,255,255,0.35)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
};
