import StrapeTypeFormPage from '@/modules/StrapeType/StrapeTypeForm';

interface EditStrapTypePageProps {
  params: {
    id: string;
  };
}

export default function EditStrapTypePage({ params }: EditStrapTypePageProps) {
  const id = parseInt(params.id);
  return <StrapeTypeFormPage id={isNaN(id) ? undefined : id} />;
}

