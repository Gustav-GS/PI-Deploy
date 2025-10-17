import { sql } from '@vercel/postgres';

// Ensure tables exist (lightweight idempotent init)
let initialized: Promise<void> | null = null;
export function ensureInit() {
  if (!initialized) {
    initialized = (async () => {
      // users
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `;

      // posts (events)
      await sql`
        CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          image_url TEXT
        )
      `;

      // galeria with multiple image urls
      await sql`
        CREATE TABLE IF NOT EXISTS galeria (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          image_urls JSONB DEFAULT '[]'::jsonb
        )
      `;

      // prestacao de contas
      await sql`
        CREATE TABLE IF NOT EXISTS prestacaocontas (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          image_urls JSONB DEFAULT '[]'::jsonb
        )
      `;
    })();
  }
  return initialized;
}

export { sql };

