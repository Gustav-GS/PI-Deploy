import Link from 'next/link';
import dynamic from 'next/dynamic';

const MapStatic = dynamic(() => import('@/components/MapStatic'), { ssr: false });

export default function ReunioesPage() {
  return (
    <section className="fonte_padrao">
      <h2>Reuniões</h2>
      <ul>
        <li>Todas as Terças-feiras das 20h às 21h30 (Exceto feriados)</li>
        <li>
          Endereço: Av. João Lemos, 311 - Centro <br/> Bariri/SP <br/> CEP: 17.257-000
          <div style={{ marginTop: 12 }}>
            <MapStatic />
          </div>
        </li>
      </ul>
      <p><Link href="/eventos">Voltar</Link></p>
    </section>
  );
}

