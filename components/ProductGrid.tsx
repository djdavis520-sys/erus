'use client';

import type { Product } from '@/lib/db';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products,
  onProductClick,
}: {
  products: Product[];
  onProductClick: (product: Product, index: number) => void;
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
        No products found.
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
        gap: 20,
      }}
    >
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          index={i}
          onClick={() => onProductClick(product, i)}
        />
      ))}
    </div>
  );
}
