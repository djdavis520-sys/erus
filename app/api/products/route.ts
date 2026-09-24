import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getProducts, createProduct } from '@/lib/db';
import { seedIfEmpty } from '@/lib/seed';
import { isAdminAuthenticated } from '@/lib/auth';
import { validateProductInput } from '@/lib/validate';

export async function GET(req: Request) {
  seedIfEmpty();
  const { searchParams } = new URL(req.url);
  const specials = searchParams.get('filter') === 'specials';
  const products = getProducts({ active: true, specials: specials || undefined });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  if (!await isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const validated = validateProductInput(body);
  if (!validated.ok) return NextResponse.json({ error: validated.error }, { status: 400 });

  const product = createProduct(validated.data);
  revalidateTag('products', { expire: 0 });
  return NextResponse.json(product, { status: 201 });
}
