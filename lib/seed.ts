import { createProduct, getProducts } from './db';

const SEED_PRODUCTS = [
  {
    name: 'Lemon Cherry Gelato',
    tagline: 'Indica-dominant Hybrid · 19–30% THC, dessert finish',
    description: 'Popularized by Backpackboyz from Sunset Sherbet × Girl Scout Cookies. Tart citrus and sour lemon peel on the nose, with tangy lemon, rich cherry, and a creamy dessert-like finish on the palate. Delivers an initial mood boost and happy head change that transitions into a tingly, deeply relaxed body high. Great for chronic pain, stress, and anxiety.',
    variants: [
      { weight: '3.5g', price: 25 },
      { weight: '1/2 oz', price: 40 },
      { weight: '1 oz', price: 90 },
    ],
    isSpecial: true,
    benefits: ['Lemon & Cherry', 'Mood Boost', 'Deep Body Relax'],
    images: ['/uploads/lemon-cherry-gelato.webp'],
    active: true,
    sortOrder: 0,
  },
  {
    name: 'Jet Fuel',
    tagline: 'Sativa-dominant Hybrid · 17–25% THC, diesel & citrus',
    description: 'Also known as G6, this 70/30 sativa-dominant cross of Aspen OG × High Country Diesel is built for energy. Sharp diesel, gas, and skunk on the nose with citrus peel and pine. Pungent fuel and earthy pine on the palate. Hits fast with a cerebral lift that brings focus and an upbeat mood, easing into a warm body finish.',
    variants: [
      { weight: '3.5g', price: 25 },
      { weight: '1/2 oz', price: 45 },
      { weight: '1 oz', price: 100 },
    ],
    isSpecial: false,
    benefits: ['Diesel & Pine', 'Energy & Focus', 'Upbeat Mood'],
    images: ['/uploads/jet-fuel.webp'],
    active: true,
    sortOrder: 1,
  },
  {
    name: 'Hiroshima',
    tagline: 'Indica-dominant Hybrid · 25–30% THC, tropical fruit',
    description: 'An indica-dominant 75/25 cross of Papaya Colada × Candy Kush from Renegade Seed Co. Dense light green buds with a complex fruit-forward aroma of strawberry, tropical, and sweet notes with a skunky edge. Effects are euphoric, relaxing, and uplifting — heavy-hitting without the knockout.',
    variants: [
      { weight: '3.5g', price: 25 },
      { weight: '1/2 oz', price: 60 },
      { weight: '1 oz', price: 125 },
    ],
    isSpecial: false,
    benefits: ['Tropical & Strawberry', 'Euphoric Relax', 'High Potency'],
    images: ['/uploads/hiroshima.webp'],
    active: true,
    sortOrder: 2,
  },
  {
    name: 'Titan Express',
    tagline: 'Sativa-dominant · 28–34% THC, electric citrus',
    description: 'Created by Grassroots from Citradelic Sunset × Modified Muffins. Sharp electric citrus, lemon candy, and pine on the nose with a spicy-sour cedar finish. Hits fast and hard with a clear-headed, tingly euphoric surge of sativa energy. Great for daytime productivity, creative sessions, or fighting fatigue.',
    variants: [
      { weight: '3.5g', price: 25 },
      { weight: '1/2 oz', price: 60 },
      { weight: '1 oz', price: 125 },
    ],
    isSpecial: false,
    benefits: ['Electric Citrus', 'Euphoric Energy', 'High Potency'],
    images: ['/uploads/titan-express.webp'],
    active: true,
    sortOrder: 3,
  },
  {
    name: 'Ocean Beach',
    tagline: 'Balanced Hybrid · London Pound Cake × Kush Mints',
    description: 'Bred by Cookies and Seed Junkie Genetics from London Pound Cake 75 × Kush Mints 11. Frosty white trichomes cover bright green buds with vivid orange hairs. Sweet fruit tart and woody, peppery flavor with a pine finish. Delivers an instant head high followed by deeply relaxing full-body calm, boosted mood, and light mental clarity.',
    variants: [
      { weight: '3.5g', price: 25 },
      { weight: '1/2 oz', price: 60 },
      { weight: '1 oz', price: 125 },
    ],
    isSpecial: false,
    benefits: ['Sweet & Spicy Kush', 'Full-Body Calm', 'Mood Boost'],
    images: ['/uploads/ocean-beach.webp'],
    active: true,
    sortOrder: 4,
  },
  {
    name: 'El Capitan',
    tagline: 'Hybrid · Apples & Bananas × White Runtz, hits fast',
    description: 'A cross of Apples & Bananas × White Runtz. Sweet gassy smoke with pungent hints of apple and grape, finishing with coffee and earthy spice. Dominant myrcene with pinene and caryophyllene rounding out a rich terpene profile. Hits fast — effects are creative, happy, and euphoric, loosening stress and tension in both mind and body.',
    variants: [
      { weight: '3.5g', price: 25 },
      { weight: '1/2 oz', price: 60 },
      { weight: '1 oz', price: 125 },
    ],
    isSpecial: false,
    benefits: ['Apple & Grape Gas', 'Creative & Happy', 'Fast Onset'],
    images: ['/uploads/el-capitan.webp'],
    active: true,
    sortOrder: 5,
  },
  {
    name: 'Sundae Driver',
    tagline: 'Hybrid · Creamy chocolate, deeply relaxing',
    description: 'An evenly balanced hybrid (50% indica/50% sativa) crossed from Fruity Pebbles x Grape Pie. Packs a sweet creamy chocolate flavor with a lightly sugary fruity exhale. The high is just as delightful — a euphoric onset fills your mind with giddy happiness while your body fades into deep relaxation. Great for stress, anxiety, insomnia, and chronic pain.',
    variants: [
      { weight: '3.5g', price: 25 },
      { weight: '1/2 oz', price: 40 },
      { weight: '1 oz', price: 90 },
    ],
    isSpecial: true,
    benefits: ['Creamy Chocolate', 'Euphoric', 'Deep Relaxation'],
    images: ['/uploads/sundae-driver.webp'],
    active: true,
    sortOrder: 6,
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
