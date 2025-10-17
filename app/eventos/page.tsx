import Link from 'next/link';

export default function EventosPage() {
  return (
    <section className="fonte_padrao">
      <h2>Eventos</h2>
      <ul>
        <li><Link href="/reunioes">Reuniões</Link></li>
        <li><Link href="/proximos-eventos">Próximos Eventos</Link></li>
      </ul>
      <p><Link href="/">Voltar</Link></p>
    </section>
  );
}

