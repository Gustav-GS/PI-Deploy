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
        <noscript>
          <style>{`body{opacity:1 !important}`}</style>
        </noscript>
      </head>
      <body>
        <a href="#conteudo-principal" className="skip-link">Ir para o conteúdo principal</a>

        <header>
          <img className="titulo slide-in logo" src="/img/logo.png" alt="Logo Rotary" decoding="async" fetchPriority="high" loading="eager" />
          <Script src="/js/script.js" strategy="afterInteractive" />

          <nav aria-label="Navegação principal">
            <Link href="/">Home</Link>
            <Link href="/quem-somos">Quem Somos</Link>
            <Link href="/eventos">Eventos</Link>
            <Link href="/doacao">Doação</Link>
            <Link href="/prestacao-contas">Contas</Link>
            <Link href="/contato">Contato</Link>
            <Link href="/redes-sociais">Redes Sociais</Link>
            <Link href="/galeria">Galeria</Link>
            {user ? <LogoutButton /> : <Link href="/login" className="nav-login">Entrar</Link>}
          </nav>
        </header>

        <main id="conteudo-principal" tabIndex={-1}>
          {children}
        </main>

        <footer>
          <div className="footer-content">
            <span>Rotary Club Bariri 16 de Junho — Todos os direitos reservados</span>
            <Link href="/api-docs" className="footer-api-link">Documentação da API</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
