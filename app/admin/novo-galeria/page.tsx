"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovoGaleriaPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const imageUrls: string[] = [];
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const fd = new FormData();
          fd.append('file', files[i]);
          const up = await fetch('/api/upload', { method: 'POST', body: fd });
          if (!up.ok) throw new Error('Falha no upload');
          const data = await up.json();
          imageUrls.push(data.url);
        }
      }
      const res = await fetch('/api/galeria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, imageUrls })
      });
      if (!res.ok) throw new Error('Erro ao criar');
      router.push('/galeria');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erro');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h1>Nova Postagem na Galeria</h1>
      <form onSubmit={handleSubmit} style={{display:'grid', gap:12, maxWidth:520}}>
        <label>Título<input value={title} onChange={e=>setTitle(e.target.value)} required /></label>
        <label>Descrição<textarea value={content} onChange={e=>setContent(e.target.value)} required rows={4} /></label>
        <label>Imagens<input type="file" accept="image/*" multiple onChange={e=>setFiles(e.target.files)} /></label>
        {error && <p style={{color:'crimson'}}>{error}</p>}
        <button type="submit" disabled={busy}>{busy ? 'Enviando...' : 'Criar'}</button>
      </form>
    </section>
  );
}

