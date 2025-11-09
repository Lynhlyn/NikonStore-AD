import ProductDetailTable from '@/modules/ProductDetail/ProductDetailTable';

interface ProductDetailTablePageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailTablePage({ params }: ProductDetailTablePageProps) {
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

  return <ProductDetailTable productId={productId} />;
}

