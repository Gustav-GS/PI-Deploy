"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
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
      setError(data?.error || 'Erro ao autenticar');
    }
  }

  return (
    <section>
      <h1>Login</h1>
      <form onSubmit={onSubmit} style={{display:'grid', gap:12, maxWidth:360}}>
        <label>
          Usuário
          <input value={username} onChange={e=>setUsername(e.target.value)} required />
        </label>
        <label>
          Senha
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </label>
        {error && <p style={{color:'crimson'}}>{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </section>
  );
}

