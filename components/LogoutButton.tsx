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
          router.refresh();
          router.push('/');
        } finally {
          setLoading(false);
        }
      }}
      style={{background:'transparent', color:'#64748b', border:'1px solid #1e293b', padding:'3px 10px', borderRadius:5, fontSize:12, fontWeight:500, marginTop:0, boxShadow:'none'}}
    >
      {loading ? <span role="status" aria-live="polite">Saindo…</span> : 'Sair'}
    </button>
  );
}

