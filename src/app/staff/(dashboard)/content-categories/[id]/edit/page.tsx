import ContentCategoryFormPage from '@/modules/ContentCategory/ContentCategoryForm';

interface EditContentCategoryPageProps {
  params: {
    id: string;
  };
}

export default function EditContentCategoryPage({ params }: EditContentCategoryPageProps) {
  const id = parseInt(params.id);
  return <ContentCategoryFormPage id={isNaN(id) ? undefined : id} />;
}

