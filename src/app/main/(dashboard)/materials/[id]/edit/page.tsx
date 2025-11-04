import MaterialFormPage from '@/modules/Material/MaterialForm';

interface EditMaterialPageProps {
  params: {
    id: string;
  };
}

export default function EditMaterialPage({ params }: EditMaterialPageProps) {
  const id = parseInt(params.id);
  return <MaterialFormPage id={isNaN(id) ? undefined : id} />;
}

