import { ProductDetailForm } from '@/modules/ProductDetail/ProductDetailForm';

interface ProductDetailFormEditPageProps {
  params: {
    id: string;
    detailId: string;
  };
}

export default function ProductDetailFormEditPage({ params }: ProductDetailFormEditPageProps) {
  const productId = parseInt(params.id, 10);
  const detailId = parseInt(params.detailId, 10);

  if (!productId || isNaN(productId)) {
    return (
      <div className="py-8 px-6">
        <div className="text-xl font-semibold text-red-600">
          Lỗi: ID sản phẩm không hợp lệ
        </div>
      </div>
    );
  }

  if (!detailId || isNaN(detailId)) {
    return (
      <div className="py-8 px-6">
        <div className="text-xl font-semibold text-red-600">
          Lỗi: ID chi tiết sản phẩm không hợp lệ
        </div>
      </div>
    );
  }

  return <ProductDetailForm productId={productId} id={detailId} />;
}

