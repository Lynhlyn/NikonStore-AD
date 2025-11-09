import { ProductDetailForm } from '@/modules/ProductDetail/ProductDetailForm';

interface ProductDetailFormPageProps {
  params: {
    id: string;
  };
  searchParams: {
    productId?: string;
  };
}

export default function ProductDetailFormNewPage({ params }: ProductDetailFormPageProps) {
  const productId = parseInt(params.id, 10);

  if (!productId || isNaN(productId)) {
    return (
      <div className="py-8 px-6">
        <div className="text-xl font-semibold text-red-600">
          Lỗi: ID sản phẩm không hợp lệ
        </div>
      </div>
    );
  }

  return <ProductDetailForm productId={productId} />;
}

