import ProductFormPage from '@/modules/Product/ProductForm';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const id = parseInt(params.id);
  return <ProductFormPage id={isNaN(id) ? undefined : id} />;
}

