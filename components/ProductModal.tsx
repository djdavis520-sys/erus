'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/db';
import { PlaceholderImage, productGradient } from './ProductCard';

export default function ProductModal({
  product,
  index,
  onClose,
  onAddToCart,
}: {
  product: Product;
  index: number;
  onClose: () => void;
  onAddToCart: (productId: string, variantIndex: number, qty: number) => void;
}) {
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    setQty(1);
    setActiveImg(0);
    setSelectedVariant(0);
  }, [product.id]);

  const variant = product.variants[selectedVariant];
  const images = product.images.length > 0 ? product.images : null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div
        className="relative w-full overflow-y-auto"
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          maxWidth: 760,
          maxHeight: '92vh',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 flex items-center justify-center rounded-full border"
          style={{
            width: 36, height: 36,
            background: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '1.2rem',
            lineHeight: 1,
          }}
        >
          &times;
        </button>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
          }}
          className="modal-two-col"
        >
          <style>{`@media(min-width:560px){.modal-two-col{grid-template-columns:1fr 1fr !important}}`}</style>

          {/* Gallery */}
          <div style={{ background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{ aspectRatio: '1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {images ? (
                <Image src={images[activeImg]} alt={product.name} fill className="object-cover" sizes="380px" priority />
              ) : (
                <PlaceholderImage index={index} className="absolute inset-0" />
              )}
            </div>
            {/* Thumbnails */}
            {images && images.length > 1 && (
              <div className="flex gap-2 p-2.5 overflow-x-auto" style={{ background: 'var(--surface)' }}>
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className="flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors"
                    style={{ width: 52, height: 52, borderColor: activeImg === i ? 'var(--primary)' : 'transparent' }}
                  >
                    <div className="relative w-full h-full">
                      <Image src={src} alt="" fill className="object-cover" sizes="52px" />
                    </div>
                  </button>
                ))}
              </div>
            )}
            {!images && (
              <div className="flex gap-2 p-2.5 overflow-x-auto" style={{ background: 'var(--surface)' }}>
                {[0, 1, 2].map((i) => {
                  const [c1, c2] = productGradient(index + i);
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className="flex-shrink-0 rounded-lg border-2 transition-colors"
                      style={{
                        width: 52, height: 52,
                        background: `linear-gradient(${i * 60}deg, ${c1}, ${c2})`,
                        borderColor: activeImg === i ? 'var(--primary)' : 'transparent',
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4 p-5 sm:p-6">
            <div>
              <h2 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.6rem' }}>{product.name}</h2>
              <div className="mt-0.5" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{product.tagline}</div>
            </div>

            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>{product.description}</p>

            {/* Benefits */}
            {product.benefits.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.benefits.map((b) => (
                  <span
                    key={b}
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'color-mix(in srgb, var(--secondary) 12%, var(--surface))', color: 'var(--secondary)' }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}

            {/* Weight / variant selector */}
            <div>
              <div className="text-sm font-semibold mb-2">Select Size</div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedVariant(i); setQty(1); }}
                    className="flex flex-col items-center px-4 py-2.5 rounded-xl border-2 transition-all text-sm font-semibold"
                    style={{
                      borderColor: selectedVariant === i ? 'var(--primary)' : 'var(--border)',
                      background: selectedVariant === i
                        ? 'color-mix(in srgb, var(--primary) 10%, var(--surface))'
                        : 'var(--surface)',
                      color: selectedVariant === i ? 'var(--primary)' : 'var(--text)',
                      cursor: 'pointer',
                      minWidth: 72,
                    }}
                  >
                    <span>{v.weight}</span>
                    <span style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1rem', marginTop: 2 }}>${v.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Add */}
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="flex items-center justify-center font-bold transition-colors"
                  style={{ width: 36, height: 36, background: 'var(--surface)', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.1rem' }}
                  aria-label="Decrease"
                >
                  &minus;
                </button>
                <span className="text-center font-bold" style={{ width: 36, fontVariantNumeric: 'tabular-nums' }}>{qty}</span>
                <button
                  onClick={() => setQty(Math.min(99, qty + 1))}
                  className="flex items-center justify-center font-bold transition-colors"
                  style={{ width: 36, height: 36, background: 'var(--surface)', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.1rem' }}
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => { if (variant) { onAddToCart(product.id, selectedVariant, qty); onClose(); } }}
                disabled={!variant}
                className="flex-1 text-white font-semibold rounded-full transition-colors disabled:opacity-50"
                style={{
                  background: 'var(--primary)',
                  border: 'none',
                  padding: '11px 20px',
                  fontFamily: 'Fredoka, sans-serif',
                  fontSize: '1rem',
                  cursor: variant ? 'pointer' : 'not-allowed',
                  whiteSpace: 'nowrap',
                }}
              >
                Add to Cart {variant ? `— $${(variant.price * qty).toFixed(2)}` : ''}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
