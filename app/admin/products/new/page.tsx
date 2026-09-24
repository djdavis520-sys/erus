import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.8rem', marginBottom: '1.5rem' }}>
        Add Product
      </h1>
      <ProductForm />
    </div>
  );
}
