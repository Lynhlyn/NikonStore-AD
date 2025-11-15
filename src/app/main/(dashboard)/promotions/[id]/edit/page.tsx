import { PromotionForm } from '@/modules/Promotion/PromotionForm/components/PromotionForm';

interface EditPromotionPageProps {
  params: {
    id: string;
  };
}

export default function EditPromotionPage({ params }: EditPromotionPageProps) {
  const id = parseInt(params.id);
  return <PromotionForm id={id} />;
}

