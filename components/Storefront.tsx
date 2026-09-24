'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/lib/db';
import { useCart } from '@/lib/cart';
import Header from './Header';
import Hero from './Hero';
import ProductGrid from './ProductGrid';
import ProductModal from './ProductModal';
import CartDrawer from './CartDrawer';
import Toast from './Toast';

type SortOption = 'default' | 'price-asc' | 'price-desc';
type Filter = 'all' | 'specials';

export default function Storefront({ initialProducts }: { initialProducts: Product[] }) {
  const [products] = useState<Product[]>(initialProducts);
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<SortOption>('default');
  const [selectedProduct, setSelectedProduct] = useState<{ product: Product; index: number } | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  }, []);

  const { addItem } = useCart();

  const handleAddToCart = useCallback((productId: string, variantIndex: number, qty = 1) => {
    addItem(productId, variantIndex, qty);
    showToast('Added to cart');
  }, [addItem, showToast]);

  const filtered = products.filter((p) => filter === 'specials' ? p.isSpecial : true);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') {
      return (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0);
    }
    if (sort === 'price-desc') {
      return (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0);
    }
    return a.sortOrder - b.sortOrder;
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedProduct) setSelectedProduct(null);
        else if (cartOpen) setCartOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedProduct, cartOpen]);

  return (
    <>
      {/* Announcement bar -- sticky, sits above the nav header */}
      <div
        className="sticky top-0 z-[101] border-b"
        style={{ background: 'var(--primary)', borderColor: 'transparent' }}
      >
        <div
          className="flex items-center justify-between gap-3 px-4 py-1.5"
          style={{ maxWidth: 1200, margin: '0 auto' }}
        >
          <a
            href="tel:+18727316376"
            className="flex items-center gap-2 font-bold text-white hover:underline text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5 19.79 19.79 0 01.06 2.84a2 2 0 012-2.18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
            </svg>
            (872) 731-6376
          </a>
          <div className="hidden md:flex items-center gap-2 text-white text-xs font-semibold opacity-90">
            <span>We accept:</span>
            {['Cash', 'Debit', 'Credit'].map((m) => (
              <span key={m} className="px-2 py-0.5 rounded-full border border-white/40 bg-white/10">{m}</span>
            ))}
          </div>
          <span className="md:hidden text-white/80 text-xs">Call or text to order</span>
        </div>
      </div>

      <Header
        filter={filter}
        onFilterChange={setFilter}
        onCartOpen={() => setCartOpen(true)}
        products={products}
      />

      {/* Mobile filters */}
      <div className="md:hidden flex gap-1 px-4 pt-3" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {(['all', 'specials'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-full text-sm font-semibold border transition-colors"
            style={filter === f
              ? { background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' }
              : { color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'var(--surface)' }}
          >
            {f === 'all' ? 'All Products' : 'Specials'}
          </button>
        ))}
      </div>

      <Hero />

      <section className="py-10 pb-16 md:pb-16 pb-28" id="products">
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-7">
            <h2 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.6rem' }}>
              {filter === 'specials' ? 'Specials' : 'All Products'}
            </h2>
            <div className="flex items-center gap-3">
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {sorted.length} item{sorted.length !== 1 ? 's' : ''}
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="text-sm font-semibold px-3 py-1.5 rounded-lg border"
                style={{ background: 'var(--surface)', color: 'var(--text)', borderColor: 'var(--border)' }}
              >
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <ProductGrid
            products={sorted}
            onProductClick={(product, index) => setSelectedProduct({ product, index })}
          />
        </div>
      </section>

      <footer className="border-t" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {/* Contact + payment strip */}
        <div className="py-8 px-4" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>Contact Us</span>
              <a
                href="tel:+18727316376"
                className="text-2xl font-bold tracking-tight hover:underline"
                style={{ fontFamily: 'Fredoka, sans-serif', color: 'var(--text)' }}
              >
                (872) 731-6376
              </a>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Call or text to place your order</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>We Accept</span>
              <div className="flex items-center gap-3 flex-wrap justify-center">
                {[
                  { label: 'Cash', icon: '💵' },
                  { label: 'Debit', icon: '💳' },
                  { label: 'Credit', icon: '💳' },
                ].map(({ label, icon }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--bg)' }}
                  >
                    {icon} {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-4 text-xs border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} Exotics R Us &mdash; Exotic Herbs &amp; Wellness
        </div>
      </footer>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct.product}
          index={selectedProduct.index}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        products={products}
        showToast={showToast}
      />

      <Toast message={toast} />

      {/* Mobile sticky bottom call bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-[200] border-t"
        style={{ background: 'var(--primary)', borderColor: 'transparent' }}
      >
        <a
          href="tel:+18727316376"
          className="flex items-center justify-center gap-3 py-3.5 text-white font-bold text-base"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5 19.79 19.79 0 01.06 2.84a2 2 0 012-2.18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
          </svg>
          Call or Text to Order
        </a>
      </div>
    </>
  );
}
