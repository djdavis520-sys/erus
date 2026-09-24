'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/db';
import { useCart } from '@/lib/cart';
import { PlaceholderImage } from './ProductCard';

export default function CartDrawer({
  open,
  onClose,
  products,
  showToast,
}: {
  open: boolean;
  onClose: () => void;
  products: Product[];
  showToast: (msg: string) => void;
}) {
  const { items, removeItem, updateQty, clear, total } = useCart();

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const cartTotal = total(products);

  const sendOrder = () => {
    if (!items.length) return;
    showToast(`Order sent! $${cartTotal.toFixed(2)}`);
    clear();
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[300] transition-opacity duration-250"
        style={{ background: 'rgba(0,0,0,0.45)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
        onClick={onClose}
      />

      <aside
        className="fixed top-0 right-0 bottom-0 z-[301] flex flex-col"
        style={{
          width: 'min(420px, 92vw)',
          background: 'var(--surface)',
          boxShadow: 'var(--shadow-lg)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <div className="flex items-center justify-between flex-shrink-0 border-b px-5 py-4" style={{ borderColor: 'var(--border)' }}>
          <h2 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.3rem' }}>Your Cart</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.6rem', cursor: 'pointer', color: 'var(--text-muted)', lineHeight: 1, padding: '4px 8px' }}
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3">
          {items.length === 0 ? (
            <div className="text-center py-14" style={{ color: 'var(--text-muted)' }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 opacity-25">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
              </svg>
              <p className="font-semibold">Cart is empty</p>
            </div>
          ) : (
            items.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;
              const variant = product.variants[item.variantIndex];
              if (!variant) return null;
              const mainImage = product.images[0];
              const productIndex = products.indexOf(product);

              return (
                <div
                  key={`${item.productId}-${item.variantIndex}`}
                  className="flex gap-3 py-3.5 border-b items-start"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 60, height: 60 }}>
                    {mainImage ? (
                      <div className="relative w-full h-full">
                        <Image src={mainImage} alt={product.name} fill className="object-cover" sizes="60px" />
                      </div>
                    ) : (
                      <PlaceholderImage index={productIndex} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{product.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {variant.weight} &bull; ${variant.price} each
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.productId, item.variantIndex, item.quantity - 1)}
                        className="flex items-center justify-center font-bold rounded border"
                        style={{ width: 26, height: 26, background: 'var(--surface)', borderColor: 'var(--border)', cursor: 'pointer', color: 'var(--text)', fontSize: '0.85rem' }}
                      >
                        &minus;
                      </button>
                      <span className="font-bold text-sm" style={{ minWidth: 18, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.productId, item.variantIndex, item.quantity + 1)}
                        className="flex items-center justify-center font-bold rounded border"
                        style={{ width: 26, height: 26, background: 'var(--surface)', borderColor: 'var(--border)', cursor: 'pointer', color: 'var(--text)', fontSize: '0.85rem' }}
                      >
                        +
                      </button>
                      <span className="ml-auto font-bold text-sm" style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--primary)' }}>
                        ${(variant.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variantIndex)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem', padding: '2px', lineHeight: 1, flexShrink: 0 }}
                    aria-label="Remove"
                  >
                    &times;
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="flex-shrink-0 border-t p-5" style={{ borderColor: 'var(--border)' }}>
          <div className="flex justify-between mb-4" style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.2rem', fontWeight: 700 }}>
            <span>Total</span>
            <span style={{ color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={sendOrder}
            disabled={items.length === 0}
            className="w-full py-4 rounded-full font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--secondary)', border: 'none', fontFamily: 'Fredoka, sans-serif', fontSize: '1.05rem', cursor: 'pointer' }}
          >
            Send My Order
          </button>
        </div>
      </aside>
    </>
  );
}
