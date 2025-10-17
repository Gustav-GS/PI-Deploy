import Link from 'next/link';

export default function DoacaoPage() {
  return (
    <section className="fonte_padrao">
      <h2>Ajude-nos a criar mudanças duradouras</h2>
      <p>Resolver alguns dos problemas mais complexos e prementes do mundo requer compromisso e visão reais.</p>
      <p>Os associados do Rotary acreditam que compartilhamos a responsabilidade de entrar em ação para melhorar nossas comunidades.</p>
      <p>Junte-se a nós para que possamos ter um impacto ainda maior.</p>

      <p><Link className="button_doacao" href="/contas-doacao">Fazer Doação</Link></p>

      <p><Link href="/">Voltar</Link></p>
    </section>
  );
}

