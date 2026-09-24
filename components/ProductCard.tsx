'use client';

import Image from 'next/image';
import type { Product } from '@/lib/db';

const PLACEHOLDER_GRADIENTS = [
  ['#4A6CF7', '#7B5EA7'],
  ['#2EC4B6', '#0A8F85'],
  ['#E76F51', '#F4A261'],
  ['#44CF6C', '#2D8A4E'],
  ['#F9C74F', '#F8961E'],
];

export function productGradient(index: number) {
  return PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];
}

export function PlaceholderImage({ index, className }: { index: number; className?: string }) {
  const [c1, c2] = productGradient(index);
  return (
    <div
      className={className}
      style={{ background: `linear-gradient(135deg, ${c1}, ${c2})`, width: '100%', height: '100%' }}
    />
  );
}

export default function ProductCard({
  product,
  index,
  onClick,
}: {
  product: Product;
  index: number;
  onClick: () => void;
}) {
  const startingPrice = product.variants[0]?.price ?? 0;
  const mainImage = product.images[0];
  const hasMultipleVariants = product.variants.length > 1;

  return (
    <article
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      tabIndex={0}
      role="button"
      className="rounded-[var(--radius)] overflow-hidden border cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Image */}
      <div className="relative" style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <PlaceholderImage index={index} className="absolute inset-0" />
        )}
        {product.isSpecial && (
          <span
            className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-xl"
            style={{ background: 'var(--pop)', fontFamily: 'Fredoka, sans-serif', letterSpacing: '0.03em' }}
          >
            SPECIAL
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="font-semibold mb-0.5" style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.1rem' }}>
          {product.name}
        </div>
        <div className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          {product.tagline}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: 'var(--primary)' }}>
              from ${startingPrice}
            </span>
            {hasMultipleVariants && (
              <span className="block text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {product.variants.map((v) => v.weight).join(' · ')}
              </span>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="text-sm font-bold text-white px-4 py-2 rounded-full transition-colors flex-shrink-0 whitespace-nowrap"
            style={{ background: 'var(--primary)', border: 'none', cursor: 'pointer' }}
          >
            {hasMultipleVariants ? 'Select' : 'Add'}
          </button>
        </div>
      </div>
    </article>
  );
}
