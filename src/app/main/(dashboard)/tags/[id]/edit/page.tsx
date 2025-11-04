import TagFormPage from '@/modules/Tag/TagForm';

interface EditTagPageProps {
  params: {
    id: string;
  };
}

export default function EditTagPage({ params }: EditTagPageProps) {
  const id = parseInt(params.id);
  return <TagFormPage id={isNaN(id) ? undefined : id} />;
}

