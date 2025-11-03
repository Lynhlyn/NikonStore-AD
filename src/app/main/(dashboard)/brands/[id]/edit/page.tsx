import BrandFormPage from '@/modules/Brand/BrandForm';

interface EditBrandPageProps {
  params: {
    id: string;
  };
}

export default function EditBrandPage({ params }: EditBrandPageProps) {
  const id = parseInt(params.id);
  return <BrandFormPage id={isNaN(id) ? undefined : id} />;
}

