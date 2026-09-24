import { getProducts } from '@/lib/db';
import { seedIfEmpty } from '@/lib/seed';
import AdminProductList from '@/components/admin/AdminProductList';

export const dynamic = 'force-dynamic';

export default function AdminProductsPage() {
  seedIfEmpty();
  const products = getProducts();
  return <AdminProductList products={products} />;
}
