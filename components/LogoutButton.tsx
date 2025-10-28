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
      style={{background:'transparent', color:'#fff', border:'1px solid #fff', padding:'4px 8px', borderRadius:6}}
    >
      {loading ? <span role="status" aria-live="polite">Saindo…</span> : 'Sair'}
    </button>
  );
}

