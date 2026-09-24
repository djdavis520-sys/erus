import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — Exotics R Us',
  robots: 'noindex',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header
        className="sticky top-0 z-50 border-b px-4 py-3 flex items-center justify-between"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="flex items-center gap-3">
          <a href="/" className="text-sm font-semibold no-underline" style={{ color: 'var(--text-muted)' }}>
            ← Storefront
          </a>
          <span style={{ color: 'var(--border)' }}>|</span>
          <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, color: 'var(--primary)' }}>
            Admin
          </span>
        </div>
        <nav className="flex gap-4 text-sm font-semibold">
          <a href="/admin/products" className="no-underline" style={{ color: 'var(--text-muted)' }}>Products</a>
          <a href="/admin/products/new" className="no-underline" style={{ color: 'var(--primary)' }}>+ Add Product</a>
        </nav>
      </header>
      <main className="p-4 sm:p-6 mx-auto" style={{ maxWidth: 960 }}>
        {children}
      </main>
    </div>
  );
}
