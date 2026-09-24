import { getProductById } from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <h1 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.8rem', marginBottom: '1.5rem' }}>
        Edit: {product.name}
      </h1>
      <ProductForm product={product} />
    </div>
  );
}
