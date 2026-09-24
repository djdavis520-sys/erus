'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/db';

export default function AdminProductList({ products: initialProducts }: { products: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  };

  const handleToggleActive = async (product: Product) => {
    const updated = await fetch(`/api/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !product.active }),
    }).then((r) => r.json());
    setProducts((prev) => prev.map((p) => p.id === product.id ? updated : p));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.8rem' }}>
          Products <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontFamily: 'Nunito, sans-serif' }}>({products.length})</span>
        </h1>
        <a
          href="/admin/products/new"
          className="text-white px-4 py-2 rounded-full text-sm font-semibold no-underline"
          style={{ background: 'var(--primary)' }}
        >
          + Add Product
        </a>
      </div>

      <div className="flex flex-col gap-3">
        {products.map((product) => {
          const startingPrice = product.variants[0]?.price ?? 0;
          const mainImage = product.images[0];

          return (
            <div
              key={product.id}
              className="flex items-center gap-4 p-4 rounded-xl border"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
                opacity: product.active ? 1 : 0.6,
              }}
            >
              {/* Thumbnail */}
              <div
                className="flex-shrink-0 rounded-lg overflow-hidden"
                style={{ width: 64, height: 64, background: 'var(--border)' }}
              >
                {mainImage && (
                  <div className="relative w-full h-full">
                    <Image src={mainImage} alt={product.name} fill className="object-cover" sizes="64px" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {product.name}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{product.tagline}</div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span style={{ fontFamily: 'Fredoka, sans-serif', color: 'var(--primary)', fontWeight: 700 }}>
                    from ${startingPrice}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {product.variants.map((v) => v.weight).join(' · ')}
                  </span>
                  {product.isSpecial && (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ background: 'var(--pop)' }}
                    >
                      SPECIAL
                    </span>
                  )}
                  {!product.active && (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--border)', color: 'var(--text-muted)' }}
                    >
                      HIDDEN
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggleActive(product)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors"
                  style={{
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  {product.active ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => router.push(`/admin/products/${product.id}`)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full text-white"
                  style={{ background: 'var(--secondary)', border: 'none', cursor: 'pointer' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  disabled={deleting === product.id}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full text-white disabled:opacity-50"
                  style={{ background: 'var(--pop)', border: 'none', cursor: 'pointer' }}
                >
                  {deleting === product.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
