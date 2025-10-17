"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovoEventoPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      let imageUrl: string | undefined;
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        const up = await fetch('/api/upload', { method: 'POST', body: fd });
        if (!up.ok) throw new Error('Falha no upload');
        const data = await up.json();
        imageUrl = data.url;
      }
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, imageUrl })
      });
      if (!res.ok) throw new Error('Erro ao criar');
      router.push('/proximos-eventos');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erro');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h1>Novo Evento</h1>
      <form onSubmit={handleSubmit} style={{display:'grid', gap:12, maxWidth:520}}>
        <label>Título<input value={title} onChange={e=>setTitle(e.target.value)} required /></label>
        <label>Descrição<textarea value={content} onChange={e=>setContent(e.target.value)} required rows={4} /></label>
        <label>Imagem<input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] || null)} /></label>
        {error && <p style={{color:'crimson'}}>{error}</p>}
        <button type="submit" disabled={busy}>{busy ? 'Enviando...' : 'Criar'}</button>
      </form>
    </section>
  );
}

