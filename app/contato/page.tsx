import Link from 'next/link';

export default function ContatoPage() {
  return (
    <section className="fonte_padrao">
      <h2>Contato</h2>
      <ul>
        <li>E-mail: contato@rotarybariri.org</li>
        <li>Telefone: (14) 1234-5678</li>
        <li>Endereço: Av. João Lemos, 311 - Centro <br/> Bariri/SP CEP: 17.257-000</li>
      </ul>
      <p><Link href="/">Voltar</Link></p>
    </section>
  );
}

