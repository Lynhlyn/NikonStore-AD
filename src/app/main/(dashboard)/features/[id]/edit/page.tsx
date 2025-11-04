import FeatureFormPage from '@/modules/Feature/FeatureForm';

interface EditFeaturePageProps {
  params: {
    id: string;
  };
}

export default function EditFeaturePage({ params }: EditFeaturePageProps) {
  const id = parseInt(params.id);
  return <FeatureFormPage id={isNaN(id) ? undefined : id} />;
}

