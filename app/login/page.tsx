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
    <section className="auth-hero">
      <div className="auth-grid">
        <div className="auth-panel">
          <img src="/img/logo.png" alt="Logo" style={{width:160, height:'auto', marginBottom:16}} />
          <h1>Bem-vindo de volta</h1>
          <p>Acesse a área administrativa para gerenciar eventos, galeria e prestações de contas.</p>
          <div className="auth-bullets">
            <span>Crie e edite publicações com imagens</span>
            <span>Gerencie próximas atividades e registros</span>
          </div>
        </div>
        <div>
          <div className="glass-card">
            <h2 className="auth-title">Entrar</h2>
            <p className="auth-sub">Use seu usuário e senha</p>
            <form onSubmit={onSubmit}>
              <div className="auth-field">
                <label className="auth-label" htmlFor="user">Usuário</label>
                <div className="input-wrap">
                  <span className="input-icon" aria-hidden>👤</span>
                  <input id="user" className="auth-input" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Digite seu usuário" autoFocus required />
                </div>
              </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="pass">Senha</label>
            <div className="input-wrap with-action">
              <span className="input-icon" aria-hidden>🔒</span>
              <input id="pass" className="auth-input" type={show ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required />
              <button type="button" className="btn-ghost input-action" onClick={()=>setShow(s=>!s)} aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}>
                {show ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
              {error && <div className="auth-error" role="alert" aria-live="polite">{error}</div>}
              <div className="auth-actions">
                <button type="submit" className="btn-primary" disabled={busy}>
                  {busy ? (<span>Entrando<span className="spinner" /></span>) : 'Entrar'}
                </button>
              </div>
              <p className="muted">Apenas membros autorizados podem acessar.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
