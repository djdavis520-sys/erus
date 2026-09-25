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
    tagline: 'Sativa-dominant · Fuel-forward, energizing',
    description: 'Cross of Aspen OG x High Country Diesel. Pungent diesel and pine aroma with a sour citrus edge. A high-energy, clear-headed sativa that hits fast and keeps you locked in — perfect for creative sessions or powering through your day.',
    variants: [
      { weight: '3.5g', price: 25 },
      { weight: '1/2 oz', price: 45 },
      { weight: '1 oz', price: 100 },
    ],
    isSpecial: false,
    benefits: ['Diesel Aroma', 'Energizing', 'Clear-Headed'],
    images: ['/uploads/jet-fuel.webp'],
    active: true,
    sortOrder: 1,
  },
  {
    name: 'Hiroshima',
    tagline: 'Hybrid · Potent, complex, unforgettable',
    description: 'A powerhouse hybrid built for impact. Heavy trichome coverage with a complex profile of gas, citrus, and spice. Fast-acting and long-lasting — this one commands respect. Not for the faint-hearted, and impossible to forget once you\'ve experienced it.',
    variants: [
      { weight: '3.5g', price: 25 },
      { weight: '1/2 oz', price: 60 },
      { weight: '1 oz', price: 125 },
    ],
    isSpecial: false,
    benefits: ['High Potency', 'Gas & Citrus', 'Long-Lasting'],
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
    tagline: 'Hybrid · Bold, commanding, premium grade',
    description: 'Named for one of the most iconic peaks in the world, El Capitan stands tall among premium hybrids. Rich terpene profile with notes of pine, earth, and sweet floral undertones. Balanced head-and-body effects that deliver confidence and calm in equal measure.',
    variants: [
      { weight: '3.5g', price: 25 },
      { weight: '1/2 oz', price: 60 },
      { weight: '1 oz', price: 125 },
    ],
    isSpecial: false,
    benefits: ['Pine & Earth', 'Balanced Effects', 'Premium Grade'],
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
