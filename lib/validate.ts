import type { Variant } from './db';

export type ProductInput = {
  name: string;
  tagline: string;
  description: string;
  variants: Variant[];
  isSpecial: boolean;
  benefits: string[];
  images: string[];
  active: boolean;
  sortOrder: number;
};

export function validateProductInput(body: unknown): { ok: true; data: ProductInput } | { ok: false; error: string } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Invalid request body' };
  }
  const b = body as Record<string, unknown>;

  if (!b.name || typeof b.name !== 'string' || !b.name.trim()) {
    return { ok: false, error: 'name is required' };
  }
  if (!Array.isArray(b.variants) || b.variants.length === 0) {
    return { ok: false, error: 'variants must be a non-empty array' };
  }
  for (const v of b.variants) {
    if (!v || typeof v !== 'object' || typeof (v as Variant).weight !== 'string' || typeof (v as Variant).price !== 'number') {
      return { ok: false, error: 'each variant must have weight (string) and price (number)' };
    }
  }

  return {
    ok: true,
    data: {
      name: (b.name as string).trim(),
      tagline: typeof b.tagline === 'string' ? b.tagline.trim() : '',
      description: typeof b.description === 'string' ? b.description.trim() : '',
      variants: b.variants as Variant[],
      isSpecial: b.isSpecial === true,
      benefits: Array.isArray(b.benefits) ? (b.benefits as string[]).filter((x) => typeof x === 'string') : [],
      images: Array.isArray(b.images) ? (b.images as string[]).filter((x) => typeof x === 'string') : [],
      active: b.active !== false,
      sortOrder: typeof b.sortOrder === 'number' ? Math.floor(b.sortOrder) : 0,
    },
  };
}
