"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      type="button"
      aria-busy={loading}
      disabled={loading}
      onClick={async () => {
        try {
          setLoading(true);
          await fetch('/api/logout', { method: 'POST' });
          window.location.href = '/';
        } catch {
          setLoading(false);
        }
      }}
      style={{background:'rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.92)', border:'1px solid rgba(255,255,255,0.35)', padding:'6px 13px', borderRadius:8, fontSize:15, fontWeight:500, marginTop:0, boxShadow:'none', cursor:'pointer'}}
    >
      {loading ? <span role="status" aria-live="polite">Saindo…</span> : 'Sair'}
    </button>
  );
}

