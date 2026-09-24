import { unstable_cache } from 'next/cache';
import { getProducts } from '@/lib/db';
import { seedIfEmpty } from '@/lib/seed';
import Storefront from '@/components/Storefront';

// Cache product fetches for 60 seconds; revalidated on admin saves via revalidateTag
const getCachedProducts = unstable_cache(
  async () => {
    seedIfEmpty();
    return getProducts({ active: true });
  },
  ['products'],
  { revalidate: 60, tags: ['products'] }
);

export default async function HomePage() {
  const products = await getCachedProducts();
  return <Storefront initialProducts={products} />;
}
