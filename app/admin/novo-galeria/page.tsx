"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovoGaleriaPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files;
    setFiles(selected);
    if (!selected) { setPreviews([]); return; }
    const readers: Promise<string>[] = Array.from(selected).map(f =>
      new Promise(resolve => {
        const r = new FileReader();
        r.onload = ev => resolve(ev.target?.result as string);
        r.readAsDataURL(f);
      })
    );
    Promise.all(readers).then(setPreviews);
  }

  function removeFile(idx: number) {
    if (!files) return;
    const arr = Array.from(files);
    arr.splice(idx, 1);
    const dt = new DataTransfer();
    arr.forEach(f => dt.items.add(f));
    setFiles(dt.files.length ? dt.files : null);
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    setUploadProgress(0);
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
          setUploadProgress(Math.round(((i + 1) / files.length) * 100));
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
      setUploadProgress(0);
    }
  }

  return (
    <section style={styles.page}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.headerIcon}>🖼️</div>
          <div>
            <h1 style={styles.title}>Nova Postagem na Galeria</h1>
            <p style={styles.subtitle}>Adicione fotos e registros do clube</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="titulo">Título</label>
            <input
              id="titulo"
              style={styles.input}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Reunião de março 2026"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              style={{ ...styles.input, ...styles.textarea }}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Descreva o contexto das fotos..."
              required
              rows={4}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Fotos</label>
            <label style={styles.fileLabel} htmlFor="imagens">
              <span style={styles.fileIcon}>📷</span>
              <div>
                <span style={styles.fileText}>
                  {files && files.length > 0
                    ? `${files.length} foto${files.length > 1 ? 's' : ''} selecionada${files.length > 1 ? 's' : ''}`
                    : 'Clique para selecionar fotos'}
                </span>
                <span style={styles.fileHint}>Múltiplos arquivos permitidos</span>
              </div>
              <input
                id="imagens"
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleFiles}
              />
            </label>

            {previews.length > 0 && (
              <div style={styles.previewGrid}>
                {previews.map((src, idx) => (
                  <div key={idx} style={styles.previewItem}>
                    <img src={src} alt={`preview-${idx}`} style={styles.previewImg} />
                    <button
                      type="button"
                      style={styles.removeBtn}
                      onClick={() => removeFile(idx)}
                      title="Remover"
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {busy && files && files.length > 0 && (
            <div style={styles.progressWrap}>
              <div style={styles.progressLabel}>Enviando fotos... {uploadProgress}%</div>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {error && <div style={styles.errorBox}>⚠️ {error}</div>}

          <div style={styles.actions}>
            <button type="button" style={styles.cancelBtn} onClick={() => router.back()} disabled={busy}>
              Cancelar
            </button>
            <button type="submit" style={styles.submitBtn} disabled={busy}>
              {busy ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={styles.spinner} /> Publicando...
                </span>
              ) : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '32px 16px',
    background: '#f5f7fa',
  },
  card: {
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.05)',
    padding: '32px 36px',
    width: '100%',
    maxWidth: 600,
    border: '1px solid #e8edf3',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
    paddingBottom: 20,
    borderBottom: '1px solid #f0f3f7',
  },
  headerIcon: { fontSize: 32, lineHeight: 1 },
  title: { margin: 0, fontSize: 22, fontWeight: 700, color: '#1e293b' },
  subtitle: { margin: '3px 0 0', fontSize: 13, color: '#94a3b8' },
  form: { display: 'grid', gap: 20 },
  field: { display: 'grid', gap: 5 },
  label: { fontSize: 13, fontWeight: 600, color: '#475569' },
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
  textarea: { resize: 'vertical', minHeight: 100 },
  fileLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '13px 16px',
    borderRadius: 8,
    border: '1.5px dashed #d1dce8',
    background: '#fafcff',
    cursor: 'pointer',
    color: '#64748b',
  },
  fileIcon: { fontSize: 20, flexShrink: 0 },
  fileText: { display: 'block', fontSize: 13, fontWeight: 500, color: '#475569' },
  fileHint: { display: 'block', fontSize: 12, color: '#94a3b8', marginTop: 2 },
  previewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: 8,
    marginTop: 10,
  },
  previewItem: { position: 'relative', borderRadius: 7, overflow: 'hidden' },
  previewImg: { width: '100%', height: 85, objectFit: 'cover', display: 'block' },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    background: 'rgba(0,0,0,0.5)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: 20,
    height: 20,
    fontSize: 10,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    marginTop: 0,
    boxShadow: 'none',
  },
  progressWrap: { display: 'grid', gap: 5 },
  progressLabel: { fontSize: 12, color: '#64748b' },
  progressBar: { background: '#edf0f4', borderRadius: 99, height: 4, overflow: 'hidden' },
  progressFill: {
    background: '#2276ca',
    height: '100%',
    borderRadius: 99,
    transition: 'width 0.3s ease',
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    borderRadius: 8,
    padding: '10px 13px',
    fontSize: 13,
  },
  actions: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid #d1d9e0',
    color: '#64748b',
    fontSize: 14,
    fontWeight: 500,
    borderRadius: 8,
    padding: '10px 20px',
    cursor: 'pointer',
    boxShadow: 'none',
    marginTop: 0,
  },
  submitBtn: {
    background: '#2276ca',
    border: 'none',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 8,
    padding: '10px 24px',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    marginTop: 0,
  },
  spinner: {
    display: 'inline-block',
    width: 14,
    height: 14,
    border: '2px solid rgba(255,255,255,0.35)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
};
