import ContentTagFormPage from '@/modules/ContentTag/ContentTagForm';

interface EditContentTagPageProps {
  params: {
    id: string;
  };
}

export default function EditContentTagPage({ params }: EditContentTagPageProps) {
  const id = parseInt(params.id);
  return <ContentTagFormPage id={isNaN(id) ? undefined : id} />;
}

