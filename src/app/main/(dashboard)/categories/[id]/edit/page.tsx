import CategoryFormPage from '@/modules/Category/CategoryForm';

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const id = parseInt(params.id);
  return <CategoryFormPage id={isNaN(id) ? undefined : id} />;
}

