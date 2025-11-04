import ColorFormPage from '@/modules/Color/ColorForm';

interface EditColorPageProps {
  params: {
    id: string;
  };
}

export default function EditColorPage({ params }: EditColorPageProps) {
  const id = parseInt(params.id);
  return <ColorFormPage id={isNaN(id) ? undefined : id} />;
}

