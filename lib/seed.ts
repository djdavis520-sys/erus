import { createProduct, getProducts } from './db';

const SEED_PRODUCTS = [
  {
    name: 'Apple Berry',
    tagline: 'Hybrid · Apple & berry aroma',
    description: 'Cross of (Dynamite x Bubblicious) x White Widow. Named for its distinct apple-and-berry aroma, it delivers deeply relaxing, full-body effects with a warm, calming character. Won 1st place Bio category at the 2016 Highlife Cup in Amsterdam.',
    variants: [
      { weight: '3.5g', price: 25 },
      { weight: '1/2 oz', price: 65 },
      { weight: '1 oz', price: 125 },
    ],
    isSpecial: false,
    benefits: ['Apple & Berry Aroma', 'Body Relaxation', 'Stress Relief'],
    images: ['/uploads/apple-berry.webp'],
    active: true,
    sortOrder: 0,
  },
  {
    name: 'Black Ice',
    tagline: 'Indica-dominant · Deep calm, high potency',
    description: 'Cross of Black Domina x White Widow. Dense, frosty buds with an earthy pine-and-resin aroma finishing with dark berry and pepper. Known for a euphoric yet deeply calming effect with high potency (~24% THC).',
    variants: [
      { weight: '3.5g', price: 25 },
      { weight: '1/2 oz', price: 65 },
      { weight: '1 oz', price: 125 },
    ],
    isSpecial: false,
    benefits: ['Earthy Pine', 'Deep Calm', 'Euphoric'],
    images: ['/uploads/black-ice.webp'],
    active: true,
    sortOrder: 1,
  },
  {
    name: 'Zkittlez',
    tagline: 'Indica-dominant · Candy sweet, award-winning',
    description: 'Cross of Grape Ape x Grapefruit. Famous for its multi-layered candy sweetness and balanced effects — keeps you alert and happy while delivering a relaxing body buzz. One of the most decorated strains of its generation.',
    variants: [
      { weight: '3.5g', price: 25 },
      { weight: '1/2 oz', price: 45 },
      { weight: '1 oz', price: 100 },
    ],
    isSpecial: true,
    benefits: ['Candy Sweet', 'Focused & Happy', 'Body Buzz'],
    images: ['/uploads/zkittlez.webp'],
    active: true,
    sortOrder: 2,
  },
  {
    name: 'Blue Widow',
    tagline: 'Hybrid · Sweet berry meets classic Widow genetics',
    description: 'Cross of Blueberry x White Widow by Dinafem. Sweet berry aroma with hints of sour citrus and pine. Delivers both a cerebral uplift and muscle relaxation — a classic combination from its legendary parent genetics.',
    variants: [
      { weight: '3.5g', price: 25 },
      { weight: '1/2 oz', price: 65 },
      { weight: '1 oz', price: 125 },
    ],
    isSpecial: false,
    benefits: ['Sweet Berry', 'Uplifting', 'Muscle Relaxation'],
    images: ['/uploads/blue-widow.webp'],
    active: true,
    sortOrder: 3,
  },
  {
    name: 'Shrooms',
    tagline: 'Psilocybin · Introspective & mind-expanding',
    description: 'Premium psilocybin mushrooms (Psilocybe cubensis). Earthy, introspective experience with effects that vary by dose — from mild perceptual shifts at low doses to more profound sensory experiences at higher doses. Sourced carefully and handled with care.',
    variants: [
      { weight: '3.5g', price: 25 },
      { weight: '14g', price: 60 },
      { weight: '1 oz', price: 125 },
    ],
    isSpecial: false,
    benefits: ['Introspective', 'Earthy', 'Mind Expanding'],
    images: ['/uploads/shrooms.webp'],
    active: true,
    sortOrder: 4,
  },
];

export function seedIfEmpty() {
  const existing = getProducts();
  if (existing.length === 0) {
    for (const p of SEED_PRODUCTS) {
      createProduct(p);
    }
  }
}
