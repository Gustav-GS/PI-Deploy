"use client";
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
      }}
      style={{background:'transparent', color:'#fff', border:'1px solid #fff', padding:'4px 8px', borderRadius:6}}
    >
      Sair
    </button>
  );
}

