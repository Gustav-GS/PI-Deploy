/* eslint-disable @next/next/no-img-element */
import './globals.css';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { ReactNode } from 'react';
import { getSessionUser } from '@/lib/auth';
import Script from 'next/script';
import LogoutButton from '@/components/LogoutButton';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = getSessionUser();
  return (
    <html lang="pt-BR">
      <head>
        <link rel="stylesheet" href="/css/estilos.css" />
        {/* Evita tela branca caso JS não carregue */}
        <noscript>
          <style>{`body{opacity:1 !important}`}</style>
        </noscript>
      </head>
      <body>
        <a href="#conteudo-principal" className="skip-link">Ir para o conteúdo principal</a>
        <header>
          <div style={{position: 'absolute', top: 10, right: 10, display:'flex', gap:12}}>
            {user ? (
              <>
                <Link href="/admin/novo-evento" style={{color:'#fff'}}>Criar Evento</Link>
                <Link href="/admin/novo-galeria" style={{color:'#fff'}}>Nova Postagem</Link>
                <LogoutButton />
              </>
            ) : (
              <Link href="/login" style={{color:'#fff'}}>Login</Link>
            )}
          </div>

          <img className="titulo slide-in logo" src="/img/logo.png" alt="Logo Rotary" decoding="async" fetchPriority="high" loading="eager" />
          <Script src="/js/script.js" strategy="afterInteractive" />

          <div className="patrocinadores">
            <Link href="/">
              <img src="/img/empresaamiga.png" alt="Patrocinador 1" loading="lazy" decoding="async" />
            </Link>
            <a href="https://loja.cafefazendapessegueiro.com.br" target="_blank" rel="noopener noreferrer">
              <img src="/img/fazendacafe.png" alt="Patrocinador 2" loading="lazy" decoding="async" />
            </a>
            <img src="/img/grupomonjojpeg.png" alt="Patrocinador 3" loading="lazy" decoding="async" />
            <img src="/img/wordclean.png" alt="Patrocinador 4" loading="lazy" decoding="async" />
            <a href="https://pt-br.facebook.com/BARIRITECCAR/" target="_blank" rel="noopener noreferrer">
              <img src="/img/teccar.png" alt="Patrocinador 5" loading="lazy" decoding="async" />
            </a>
          </div>

          <nav aria-label="Navegação principal">
            <Link href="/">Home</Link>
            <Link href="/quem-somos">Quem Somos</Link>
            <Link href="/eventos">Eventos</Link>
            <Link href="/doacao">Doação</Link>
            <Link href="/prestacao-contas">Contas</Link>
            <Link href="/contato">Contato</Link>
            <Link href="/redes-sociais">Redes Sociais</Link>
            <Link href="/galeria">Galeria</Link>
          </nav>
        </header>

        <main id="conteudo-principal" tabIndex={-1}>
          {children}
        </main>

        <footer>
          Rotary Club Bariri 16 de Junho - Todos os direitos reservados
        </footer>
      </body>
    </html>
  );
}
