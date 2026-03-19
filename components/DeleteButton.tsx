"use client";
import { useRouter } from 'next/navigation';

export default function DeleteButton({ url, confirmMessage = 'Tem certeza que deseja apagar?' }: { url: string; confirmMessage?: string }) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        if (!confirm(confirmMessage)) return;
        const res = await fetch(url, { method: 'DELETE' });
        if (res.ok) {
          router.refresh();
        } else {
          const data = await res.json().catch(() => ({}));
          alert(data?.error || 'Erro ao apagar');
        }
      }}
      style={{
        background: 'transparent',
        border: '1px solid #fca5a5',
        color: '#dc2626',
        fontSize: 13,
        fontWeight: 500,
        padding: '5px 14px',
        borderRadius: 6,
        cursor: 'pointer',
        marginTop: 0,
        boxShadow: 'none',
      }}
    >
      Apagar
    </button>
  );
}

