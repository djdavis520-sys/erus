import { createProduct, getProducts } from './db';

const SEED_PRODUCTS = [
  {
    name: 'Lemon Cherry Gelato',
    tagline: 'Hybrid · Sweet citrus, smooth finish',
    description: 'A crowd-favorite cross of Sunset Sherbet x Girl Scout Cookies. Bursts with a bright lemon-cherry sweetness layered over a creamy gelato finish. Delivers a balanced euphoric and relaxing experience — uplifting enough for daytime, smooth enough for evenings.',
    variants: [
      { weight: '3.5g', price: 25 },
      { weight: '1/2 oz', price: 40 },
      { weight: '1 oz', price: 90 },
    ],
    isSpecial: true,
    benefits: ['Lemon & Cherry Aroma', 'Euphoric', 'Smooth Finish'],
    images: [],
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
    images: [],
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
    images: [],
    active: true,
    sortOrder: 2,
  },
  {
    name: 'Titan Express',
    tagline: 'Indica-dominant · Heavy hitter, deep relax',
    description: 'A titan in every sense — massive dense nugs, thick resin production, and effects that hit with serious weight. Earthy, kushy notes with hints of dark fruit lead into a deeply sedating full-body experience. Built for winding down and letting go.',
    variants: [
      { weight: '3.5g', price: 25 },
      { weight: '1/2 oz', price: 60 },
      { weight: '1 oz', price: 125 },
    ],
    isSpecial: false,
    benefits: ['Deep Relaxation', 'Earthy & Kushy', 'Sedating'],
    images: [],
    active: true,
    sortOrder: 3,
  },
  {
    name: 'Ocean Beach',
    tagline: 'Hybrid · Tropical, breezy, mellow vibes',
    description: 'A smooth coastal hybrid with a tropical fruit and ocean air aroma — think mango, fresh citrus, and a hint of pine. Delivers a mellow, feel-good euphoria with a relaxing body warmth. Ideal for kicking back, unwinding, and enjoying the moment.',
    variants: [
      { weight: '3.5g', price: 25 },
      { weight: '1/2 oz', price: 60 },
      { weight: '1 oz', price: 125 },
    ],
    isSpecial: false,
    benefits: ['Tropical Aroma', 'Mellow Euphoria', 'Body Warmth'],
    images: [],
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
    images: [],
    active: true,
    sortOrder: 5,
  },
  {
    name: 'Sundae Driver',
    tagline: 'Indica-dominant · Creamy, sweet, laid-back',
    description: 'Cross of Fruity Pebbles OG x Grape Pie. Unmistakably dessert-forward — creamy vanilla, fresh grape, and a sweet candy exhale. The effects match the name: smooth, easy, and wonderfully relaxing without putting you completely to sleep. A perfect evening treat.',
    variants: [
      { weight: '3.5g', price: 25 },
      { weight: '1/2 oz', price: 40 },
      { weight: '1 oz', price: 90 },
    ],
    isSpecial: true,
    benefits: ['Creamy & Sweet', 'Relaxing', 'Mood Lifting'],
    images: [],
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
