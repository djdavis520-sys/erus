'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from './db';

export type CartItem = {
  productId: string;
  variantIndex: number;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (productId: string, variantIndex: number, qty?: number) => void;
  removeItem: (productId: string, variantIndex: number) => void;
  updateQty: (productId: string, variantIndex: number, qty: number) => void;
  clear: () => void;
  total: (products: Product[]) => number;
  count: () => number;
};

const key = (productId: string, variantIndex: number) => `${productId}:${variantIndex}`;

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId, variantIndex, qty = 1) =>
        set((s) => {
          const existing = s.items.find(
            (i) => i.productId === productId && i.variantIndex === variantIndex
          );
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === productId && i.variantIndex === variantIndex
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
            };
          }
          return { items: [...s.items, { productId, variantIndex, quantity: qty }] };
        }),

      removeItem: (productId, variantIndex) =>
        set((s) => ({
          items: s.items.filter(
            (i) => !(i.productId === productId && i.variantIndex === variantIndex)
          ),
        })),

      updateQty: (productId, variantIndex, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter(
                  (i) => !(i.productId === productId && i.variantIndex === variantIndex)
                )
              : s.items.map((i) =>
                  i.productId === productId && i.variantIndex === variantIndex
                    ? { ...i, quantity: qty }
                    : i
                ),
        })),

      clear: () => set({ items: [] }),

      total: (products) =>
        get().items.reduce((sum, item) => {
          const p = products.find((p) => p.id === item.productId);
          if (!p) return sum;
          const variant = p.variants[item.variantIndex];
          if (!variant) return sum;
          return sum + variant.price * item.quantity;
        }, 0),

      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'eru-cart-v2' }
  )
);
