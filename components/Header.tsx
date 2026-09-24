'use client';

import { useCart } from '@/lib/cart';
import type { Product } from '@/lib/db';

type Filter = 'all' | 'specials';

export default function Header({
  filter,
  onFilterChange,
  onCartOpen,
  products,
}: {
  filter: Filter;
  onFilterChange: (f: Filter) => void;
  onCartOpen: () => void;
  products: Product[];
}) {
  const count = useCart((s) => s.count());

  return (
    <header
      className="sticky top-0 z-[100] border-b"
      style={{
        background: 'var(--header-bg)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderColor: 'var(--border)',
      }}
    >
      <div
        className="flex items-center justify-between gap-3 px-4 py-3"
        style={{ maxWidth: 1200, margin: '0 auto' }}
      >
        {/* Logo */}
        <a
          href="#"
          className="flex items-baseline gap-0.5 no-underline flex-shrink-0"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text)' }}>
            EXOTICS
          </span>
          <span
            style={{
              fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '2rem',
              color: 'var(--primary)', display: 'inline-block', transform: 'scaleX(-1)',
              margin: '0 1px', lineHeight: 1,
            }}
          >
            R
          </span>
          <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text)' }}>
            US
          </span>
        </a>

        <div className="flex items-center gap-4">
          {/* Desktop filter tabs */}
          <div
            className="hidden md:flex gap-1 rounded-full p-0.5 border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            {(['all', 'specials'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => onFilterChange(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  filter === f ? 'text-white' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
                style={filter === f ? { background: 'var(--primary)' } : {}}
              >
                {f === 'all' ? 'All Products' : 'Specials'}
              </button>
            ))}
          </div>

          {/* Cart button */}
          <button
            onClick={onCartOpen}
            aria-label="Open cart"
            className="relative flex items-center gap-1.5 font-semibold text-sm p-1.5"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
            {count > 0 && (
              <span
                className="absolute -top-0.5 -right-1.5 text-white text-[0.7rem] font-bold flex items-center justify-center rounded-full"
                style={{
                  background: 'var(--pop)',
                  minWidth: 18, height: 18,
                  padding: '0 4px',
                }}
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
