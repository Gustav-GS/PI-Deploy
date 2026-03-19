"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovoEventoPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = ev => setPreview(ev.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }

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
        body: JSON.stringify({ title, content, imageUrl, eventDate: eventDate ? new Date(eventDate).toISOString() : undefined })
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
    <section style={styles.page}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.headerIcon}>📋</div>
          <div>
            <h1 style={styles.title}>Novo Evento</h1>
            <p style={styles.subtitle}>Preencha as informações do evento abaixo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Título */}
          <div style={styles.field}>
            <label style={styles.label} htmlFor="titulo">Título do Evento</label>
            <input
              id="titulo"
              style={styles.input}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Reunião mensal de março"
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
              placeholder="Descreva os detalhes do evento..."
              required
              rows={5}
            />
          </div>

          {/* Data */}
          <div style={styles.field}>
            <label style={styles.label} htmlFor="data">Data e Hora do Evento</label>
            <input
              id="data"
              type="datetime-local"
              style={styles.input}
              value={eventDate}
              onChange={e => setEventDate(e.target.value)}
            />
            <span style={styles.hint}>Opcional — deixe em branco se a data ainda não foi definida</span>
          </div>

          {/* Imagem */}
          <div style={styles.field}>
            <label style={styles.label}>Imagem de Capa</label>
            <label style={styles.fileLabel} htmlFor="imagem">
              <span style={styles.fileIcon}>🖼️</span>
              <span style={styles.fileText}>
                {file ? file.name : 'Clique para selecionar uma imagem'}
              </span>
              <input
                id="imagem"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFile}
              />
            </label>
            {preview && (
              <div style={styles.previewWrap}>
                <img src={preview} alt="Pré-visualização" style={styles.preview} />
                <button
                  type="button"
                  style={styles.removeBtn}
                  onClick={() => { setFile(null); setPreview(null); }}
                >
                  Remover imagem
                </button>
              </div>
            )}
          </div>

          {error && (
            <div style={styles.errorBox}>
              ⚠️ {error}
            </div>
          )}

          <div style={styles.actions}>
            <button type="button" style={styles.cancelBtn} onClick={() => router.back()} disabled={busy}>
              Cancelar
            </button>
            <button type="submit" style={styles.submitBtn} disabled={busy}>
              {busy ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={styles.spinner} /> Criando evento...
                </span>
              ) : '✓ Criar Evento'}
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
    maxWidth: 580,
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
  headerIcon: {
    fontSize: 36,
    lineHeight: 1,
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: '#0f2d5e',
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: 14,
    color: '#64748b',
  },
  form: {
    display: 'grid',
    gap: 22,
  },
  field: {
    display: 'grid',
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: '#334155',
  },
  input: {
    padding: '11px 14px',
    borderRadius: 10,
    border: '1.5px solid #d0dae8',
    fontSize: 15,
    color: '#1e293b',
    background: '#f8fafc',
    outline: 'none',
    transition: 'border-color 0.18s, box-shadow 0.18s',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  textarea: {
    resize: 'vertical',
    minHeight: 110,
  },
  hint: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  fileLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 18px',
    borderRadius: 10,
    border: '2px dashed #c0d0e8',
    background: '#f5f9ff',
    cursor: 'pointer',
    color: '#4a6fa5',
    fontSize: 14,
    fontWeight: 500,
    transition: 'border-color 0.18s, background 0.18s',
  },
  fileIcon: {
    fontSize: 22,
    flexShrink: 0,
  },
  fileText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  previewWrap: {
    marginTop: 10,
    display: 'grid',
    gap: 8,
  },
  preview: {
    width: '100%',
    maxHeight: 220,
    objectFit: 'cover',
    borderRadius: 10,
    border: '1px solid #dde6f0',
  },
  removeBtn: {
    background: 'none',
    border: '1px solid #e0e7ef',
    color: '#64748b',
    fontSize: 13,
    borderRadius: 8,
    padding: '5px 12px',
    cursor: 'pointer',
    marginTop: 0,
    boxShadow: 'none',
  },
  errorBox: {
    background: '#fee4e2',
    border: '1px solid #fca5a5',
    color: '#b91c1c',
    borderRadius: 10,
    padding: '11px 14px',
    fontSize: 14,
  },
  actions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  cancelBtn: {
    background: 'none',
    border: '1.5px solid #d0dae8',
    color: '#64748b',
    fontSize: 15,
    fontWeight: 600,
    borderRadius: 10,
    padding: '11px 22px',
    cursor: 'pointer',
    boxShadow: 'none',
    marginTop: 0,
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #2276ca 0%, #1558a8 100%)',
    border: 'none',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    borderRadius: 10,
    padding: '11px 28px',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(34, 118, 202, 0.35)',
    marginTop: 0,
    transition: 'filter 0.15s, transform 0.15s',
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
