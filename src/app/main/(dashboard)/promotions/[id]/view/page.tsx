import { PromotionForm } from '@/modules/Promotion/PromotionForm/components/PromotionForm';

interface ViewPromotionPageProps {
  params: {
    id: string;
  };
}

export default function ViewPromotionPage({ params }: ViewPromotionPageProps) {
  const id = parseInt(params.id);
  return <PromotionForm id={id} isViewMode={true} />;
}

