import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getProductById, updateProduct, deleteProduct } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';
import { validateProductInput } from '@/lib/validate';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  // For PATCH, only validate fields that are present -- allow partial updates
  if (body && 'variants' in body) {
    const validated = validateProductInput(body);
    if (!validated.ok) return NextResponse.json({ error: validated.error }, { status: 400 });
  }
  const product = updateProduct(id, body);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  revalidateTag('products', { expire: 0 });
  return NextResponse.json(product);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const ok = deleteProduct(id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  revalidateTag('products', { expire: 0 });
  return NextResponse.json({ ok: true });
}
