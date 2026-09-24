'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Product, Variant } from '@/lib/db';

type FormState = {
  name: string;
  tagline: string;
  description: string;
  variants: Variant[];
  isSpecial: boolean;
  benefits: string[];
  images: string[];
  active: boolean;
  sortOrder: string;
};

function toFormState(p?: Product): FormState {
  return {
    name: p?.name ?? '',
    tagline: p?.tagline ?? '',
    description: p?.description ?? '',
    variants: p?.variants.length ? p.variants : [{ weight: '3.5g', price: 25 }],
    isSpecial: p?.isSpecial ?? false,
    benefits: p?.benefits ?? [],
    images: p?.images ?? [],
    active: p?.active ?? true,
    sortOrder: p?.sortOrder.toString() ?? '0',
  };
}

export default function ProductForm({ product }: { product?: Product }) {
  const [form, setForm] = useState<FormState>(toFormState(product));
  const [benefitInput, setBenefitInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const set = (key: keyof FormState, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Variant helpers
  const addVariant = () =>
    set('variants', [...form.variants, { weight: '', price: 0 }]);

  const removeVariant = (i: number) =>
    set('variants', form.variants.filter((_, idx) => idx !== i));

  const updateVariant = (i: number, field: keyof Variant, value: string) =>
    set('variants', form.variants.map((v, idx) =>
      idx === i ? { ...v, [field]: field === 'price' ? parseFloat(value) || 0 : value } : v
    ));

  // Benefit helpers
  const addBenefit = () => {
    const b = benefitInput.trim();
    if (b && !form.benefits.includes(b)) set('benefits', [...form.benefits, b]);
    setBenefitInput('');
  };
  const removeBenefit = (b: string) =>
    set('benefits', form.benefits.filter((x) => x !== b));

  // Image upload
  const handleImageUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) uploaded.push((await res.json()).url);
    }
    set('images', [...form.images, ...uploaded]);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.variants.length === 0) { setError('Add at least one size/price option.'); return; }
    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      variants: form.variants,
      isSpecial: form.isSpecial,
      benefits: form.benefits,
      images: form.images,
      active: form.active,
      sortOrder: parseInt(form.sortOrder) || 0,
    };

    const url = product ? `/api/products/${product.id}` : '/api/products';
    const method = product ? 'PATCH' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push('/admin/products');
      router.refresh();
    } else {
      setError((await res.json()).error ?? 'Save failed');
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border text-sm";
  const inputStyle = { background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' };
  const field = (label: string, content: React.ReactNode) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold">{label}</label>
      {content}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="text-sm font-semibold p-3 rounded-lg" style={{ background: '#fee2e2', color: '#dc2626' }}>{error}</div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {field('Product Name *', (
          <input className={inputClass} style={inputStyle} value={form.name}
            onChange={(e) => set('name', e.target.value)} required placeholder="Apple Berry" />
        ))}
        {field('Tagline', (
          <input className={inputClass} style={inputStyle} value={form.tagline}
            onChange={(e) => set('tagline', e.target.value)} placeholder="Sweet & fruity" />
        ))}
      </div>

      {field('Description', (
        <textarea className={inputClass} style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
          value={form.description} onChange={(e) => set('description', e.target.value)}
          placeholder="Describe the product..." />
      ))}

      {/* Variants */}
      {field('Sizes & Prices *', (
        <div className="flex flex-col gap-2">
          {form.variants.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={inputClass}
                style={{ ...inputStyle, maxWidth: 120 }}
                value={v.weight}
                onChange={(e) => updateVariant(i, 'weight', e.target.value)}
                placeholder="3.5g"
                required
              />
              <span style={{ color: 'var(--text-muted)' }}>$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                className={inputClass}
                style={{ ...inputStyle, maxWidth: 100 }}
                value={v.price || ''}
                onChange={(e) => updateVariant(i, 'price', e.target.value)}
                placeholder="25"
                required
              />
              {form.variants.length > 1 && (
                <button type="button" onClick={() => removeVariant(i)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pop)', fontSize: '1.1rem', lineHeight: 1, padding: '4px' }}>
                  &times;
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addVariant}
            className="text-sm font-semibold px-3 py-1.5 rounded-lg border self-start"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-muted)', cursor: 'pointer' }}>
            + Add size
          </button>
        </div>
      ))}

      {/* Toggles */}
      <div className="flex flex-wrap items-center gap-5">
        <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-semibold">
          <input type="checkbox" checked={form.isSpecial} onChange={(e) => set('isSpecial', e.target.checked)} className="w-4 h-4" />
          Mark as Special
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-semibold">
          <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} className="w-4 h-4" />
          Visible on storefront
        </label>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold">Sort Order</label>
          <input type="number" min="0" className={inputClass} style={{ ...inputStyle, width: 70 }}
            value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} />
        </div>
      </div>

      {/* Benefits */}
      {field('Benefits / Tags', (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input className={inputClass + ' flex-1'} style={inputStyle} value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBenefit(); } }}
              placeholder="e.g. Relaxing, Euphoric — press Enter to add" />
            <button type="button" onClick={addBenefit}
              className="px-3 py-2 rounded-lg text-white text-sm font-semibold"
              style={{ background: 'var(--secondary)', border: 'none', cursor: 'pointer' }}>
              Add
            </button>
          </div>
          {form.benefits.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {form.benefits.map((b) => (
                <span key={b} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ background: 'color-mix(in srgb, var(--secondary) 12%, var(--surface))', color: 'var(--secondary)' }}>
                  {b}
                  <button type="button" onClick={() => removeBenefit(b)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, lineHeight: 1, fontSize: '1rem' }}>
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Images */}
      {field('Product Images', (
        <div className="flex flex-col gap-3">
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer"
            style={{ borderColor: 'var(--border)' }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleImageUpload(e.dataTransfer.files); }}>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)} />
            {uploading ? (
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Uploading & compressing...</p>
            ) : (
              <>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Drag & drop or click to upload</p>
                <p style={{ color: 'var(--text-muted)', margin: '4px 0 0', fontSize: '0.8rem' }}>JPEG, PNG, WebP · Auto-compressed to WebP</p>
              </>
            )}
          </div>
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {form.images.map((url) => (
                <div key={url} className="relative" style={{ width: 88, height: 88 }}>
                  <div className="relative w-full h-full rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                    <Image src={url} alt="" fill className="object-cover" sizes="88px" />
                  </div>
                  <button type="button" onClick={() => set('images', form.images.filter((x) => x !== url))}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-white flex items-center justify-center text-xs"
                    style={{ background: 'var(--pop)', border: 'none', cursor: 'pointer', lineHeight: 1 }}>
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-2">
        <button type="submit" disabled={saving}
          className="px-6 py-3 rounded-full text-white font-semibold text-sm disabled:opacity-60"
          style={{ background: 'var(--primary)', border: 'none', cursor: 'pointer', fontFamily: 'Fredoka, sans-serif', fontSize: '1rem' }}>
          {saving ? 'Saving...' : (product ? 'Save Changes' : 'Create Product')}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-3 rounded-full font-semibold text-sm border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-muted)', cursor: 'pointer' }}>
          Cancel
        </button>
        {product && (
          <button type="button"
            onClick={async () => {
              if (!confirm(`Delete "${product.name}"?`)) return;
              await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
              router.push('/admin/products');
            }}
            className="ml-auto px-6 py-3 rounded-full text-white font-semibold text-sm"
            style={{ background: 'var(--pop)', border: 'none', cursor: 'pointer' }}>
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
