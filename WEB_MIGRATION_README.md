# Migração para Next.js + Postgres (Vercel)

Este diretório agora contém um app Next.js (App Router) que substitui o back-end Flask/SQLite por APIs em Node/TypeScript com Postgres e armazenamento de imagens no Vercel Blob.

## O que foi migrado

- Modelos equivalentes aos do Flask:
  - `posts` (eventos): `id, created_at, title, content, image_url`
  - `galeria`: `id, created_at, title, content, image_urls (jsonb)`
  - `prestacaocontas`: `id, created_at, title, content, image_urls (jsonb)`
  - `users`: `id, username, password`
- Rotas API em `app/api/*` para CRUD básico.
- Páginas React:
  - `/proximos-eventos`, `/galeria`, `/prestacao-contas`
  - Admin: `/admin/novo-evento`, `/admin/novo-galeria`, `/admin/novo-contas`
  - `/login` simples (cookie JWT).

Observação: Para Vercel o sistema de arquivos é somente leitura. Por isso, uploads salvam no Vercel Blob e o banco armazena as URLs públicas.

## Configuração local

1. Copie `.env.local.example` para `.env.local` e preencha:
   - `POSTGRES_URL` (ou use o Vercel Postgres com variáveis automáticas no deploy)
   - `JWT_SECRET` (string aleatória longa)
   - `BLOB_READ_WRITE_TOKEN` (do Vercel Blob)
2. Instale dependências e rode:
   ```bash
   npm install
   npm run dev
   ```

O app irá criar as tabelas automaticamente ao primeiro acesso às APIs.

### Copiar assets estáticos

Copie os arquivos de imagem do Flask para o Next:

- De `Projeto_02/static/img` para `public/img`
- Se houver nomes com acento (ex.: `fazendacaf.png`), renomeie para ASCII (ex.: `fazendacafe.png`) e ajuste onde for referenciado.
- CSS e JS já foram copiados para `public/css/estilos.css` e `public/js/script.js`.

### Criar usuário admin

No Postgres execute (apenas para testes; produção deve usar hash de senha):

```sql
INSERT INTO users (username, password) VALUES ('admin', 'admin');
```

Depois faça login em `/login`.

## Deploy na Vercel

1. Conecte o repositório à Vercel.
2. Em Project Settings → Environment Variables, defina:
   - `POSTGRES_URL` (ou conecte o add-on Vercel Postgres)
   - `JWT_SECRET`
   - `BLOB_READ_WRITE_TOKEN`
3. Deploy. A Vercel detecta o Next.js pela `package.json` na raiz.

## Notas de compatibilidade

- Templates Jinja originais não foram copiados 1:1. As páginas dinâmicas foram reimplementadas em React. Você pode adaptar o layout em `app/layout.tsx` e estilos em `app/globals.css`.
- Uploads locais do Flask foram substituídos por upload para Blob via `/api/upload`. As URLs são salvas no banco (campo `image_url` ou `image_urls`).
- Autenticação simples com JWT em cookie HttpOnly (sem hash de senha). Para produção, substitua por hash (ex.: bcrypt) e/ou um provedor como NextAuth.
