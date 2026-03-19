"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovoContasPage() {
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
      const res = await fetch('/api/contas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, imageUrls })
      });
      if (!res.ok) throw new Error('Erro ao criar');
      router.push('/prestacao-contas');
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
          <div style={styles.headerIcon}>📊</div>
          <div>
            <h1 style={styles.title}>Nova Prestação de Contas</h1>
            <p style={styles.subtitle}>Registre um novo relatório financeiro</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Título */}
          <div style={styles.field}>
            <label style={styles.label} htmlFor="titulo">Título</label>
            <input
              id="titulo"
              style={styles.input}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Prestação de contas — Março 2026"
              required
            />
          </div>

          {/* Descrição */}
          <div style={styles.field}>
            <label style={styles.label} htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              style={{ ...styles.input, ...styles.textarea }}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Descreva as movimentações financeiras, saldo, observações..."
              required
              rows={5}
            />
          </div>

          {/* Imagens */}
          <div style={styles.field}>
            <label style={styles.label}>Comprovantes / Imagens</label>
            <label style={styles.fileLabel} htmlFor="imagens">
              <span style={styles.fileIcon}>📎</span>
              <div>
                <span style={styles.fileText}>
                  {files && files.length > 0
                    ? `${files.length} arquivo${files.length > 1 ? 's' : ''} selecionado${files.length > 1 ? 's' : ''}`
                    : 'Clique para selecionar imagens'}
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

          {/* Progresso do upload */}
          {busy && files && files.length > 0 && (
            <div style={styles.progressWrap}>
              <div style={styles.progressLabel}>
                Enviando imagens... {uploadProgress}%
              </div>
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
                  <span style={styles.spinner} /> Salvando...
                </span>
              ) : '✓ Salvar Registro'}
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
    background: 'linear-gradient(135deg, #eef4fb 0%, #f5f8fd 100%)',
  },
  card: {
    background: '#fff',
    borderRadius: 18,
    boxShadow: '0 8px 40px rgba(21, 88, 168, 0.1), 0 2px 8px rgba(0,0,0,0.05)',
    padding: '36px 40px',
    width: '100%',
    maxWidth: 620,
    border: '1px solid #e4edf7',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
    paddingBottom: 24,
    borderBottom: '1px solid #eef2f7',
  },
  headerIcon: { fontSize: 36, lineHeight: 1 },
  title: { margin: 0, fontSize: 24, fontWeight: 700, color: '#0f2d5e' },
  subtitle: { margin: '4px 0 0', fontSize: 14, color: '#64748b' },
  form: { display: 'grid', gap: 22 },
  field: { display: 'grid', gap: 6 },
  label: { fontSize: 14, fontWeight: 600, color: '#334155' },
  input: {
    padding: '11px 14px',
    borderRadius: 10,
    border: '1.5px solid #d0dae8',
    fontSize: 15,
    color: '#1e293b',
    background: '#f8fafc',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  textarea: { resize: 'vertical', minHeight: 120 },
  fileLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 18px',
    borderRadius: 10,
    border: '2px dashed #c0d0e8',
    background: '#f5f9ff',
    cursor: 'pointer',
    color: '#4a6fa5',
    transition: 'border-color 0.18s',
  },
  fileIcon: { fontSize: 22, flexShrink: 0 },
  fileText: { display: 'block', fontSize: 14, fontWeight: 500 },
  fileHint: { display: 'block', fontSize: 12, color: '#94a3b8', marginTop: 2 },
  previewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
    gap: 10,
    marginTop: 10,
  },
  previewItem: { position: 'relative', borderRadius: 8, overflow: 'hidden' },
  previewImg: { width: '100%', height: 90, objectFit: 'cover', display: 'block' },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    background: 'rgba(0,0,0,0.55)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: 22,
    height: 22,
    fontSize: 11,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    marginTop: 0,
    boxShadow: 'none',
  },
  progressWrap: { display: 'grid', gap: 6 },
  progressLabel: { fontSize: 13, color: '#4a6fa5', fontWeight: 500 },
  progressBar: { background: '#e4edf7', borderRadius: 99, height: 6, overflow: 'hidden' },
  progressFill: {
    background: 'linear-gradient(90deg, #2276ca, #1558a8)',
    height: '100%',
    borderRadius: 99,
    transition: 'width 0.3s ease',
  },
  errorBox: {
    background: '#fee4e2',
    border: '1px solid #fca5a5',
    color: '#b91c1c',
    borderRadius: 10,
    padding: '11px 14px',
    fontSize: 14,
  },
  actions: { display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 6 },
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
    width: 15,
    height: 15,
    border: '2px solid rgba(255,255,255,0.4)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
};
