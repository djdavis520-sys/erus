import Database from 'better-sqlite3';
import path from 'path';

// Vercel's project root is read-only; /tmp is the only writable path on serverless
const DB_PATH = process.env.VERCEL
  ? '/tmp/data.db'
  : path.join(process.cwd(), 'data.db');

let db: Database.Database;

// Schema version -- bump when making breaking schema changes
const SCHEMA_VERSION = 2;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    migrate(db);
  }
  return db;
}

function migrate(db: Database.Database) {
  const currentVersion = (db.pragma('user_version', { simple: true }) as number) ?? 0;
  if (currentVersion >= SCHEMA_VERSION) return;

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id           TEXT PRIMARY KEY,
      name         TEXT NOT NULL,
      tagline      TEXT NOT NULL DEFAULT '',
      description  TEXT NOT NULL DEFAULT '',
      variants     TEXT NOT NULL DEFAULT '[]',
      is_special   INTEGER NOT NULL DEFAULT 0,
      benefits     TEXT NOT NULL DEFAULT '[]',
      images       TEXT NOT NULL DEFAULT '[]',
      active       INTEGER NOT NULL DEFAULT 1,
      sort_order   INTEGER NOT NULL DEFAULT 0,
      created_at   TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  db.pragma(`user_version = ${SCHEMA_VERSION}`);
}

export type Variant = {
  weight: string;
  price: number;
};

export type ProductRow = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  variants: string;
  is_special: number;
  benefits: string;
  images: string;
  active: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  variants: Variant[];
  isSpecial: boolean;
  benefits: string[];
  images: string[];
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

function safeParse<T>(json: string, fallback: T): T {
  try { return JSON.parse(json); } catch { return fallback; }
}

export function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    variants: safeParse(row.variants, []),
    isSpecial: row.is_special === 1,
    benefits: safeParse(row.benefits, []),
    images: safeParse(row.images, []),
    active: row.active === 1,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getProducts(filter?: { specials?: boolean; active?: boolean }): Product[] {
  const db = getDb();
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params: unknown[] = [];

  if (filter?.active !== undefined) {
    sql += ' AND active = ?';
    params.push(filter.active ? 1 : 0);
  }
  if (filter?.specials) {
    sql += ' AND is_special = 1';
  }

  sql += ' ORDER BY sort_order ASC, created_at ASC';
  const rows = db.prepare(sql).all(...params) as ProductRow[];
  return rows.map(rowToProduct);
}

export function getProductById(id: string): Product | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as ProductRow | undefined;
  return row ? rowToProduct(row) : null;
}

export function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO products (id, name, tagline, description, variants, is_special, benefits, images, active, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, data.name, data.tagline, data.description,
    JSON.stringify(data.variants),
    data.isSpecial ? 1 : 0,
    JSON.stringify(data.benefits), JSON.stringify(data.images),
    data.active ? 1 : 0, data.sortOrder, now, now
  );
  return getProductById(id)!;
}

export function updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Product | null {
  const db = getDb();
  const existing = getProductById(id);
  if (!existing) return null;

  const merged = { ...existing, ...data };
  db.prepare(`
    UPDATE products SET
      name = ?, tagline = ?, description = ?, variants = ?, is_special = ?,
      benefits = ?, images = ?, active = ?, sort_order = ?, updated_at = ?
    WHERE id = ?
  `).run(
    merged.name, merged.tagline, merged.description,
    JSON.stringify(merged.variants),
    merged.isSpecial ? 1 : 0,
    JSON.stringify(merged.benefits), JSON.stringify(merged.images),
    merged.active ? 1 : 0, merged.sortOrder, new Date().toISOString(), id
  );
  return getProductById(id);
}

export function deleteProduct(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
  return result.changes > 0;
}
