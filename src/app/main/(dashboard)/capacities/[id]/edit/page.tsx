import CapacityFormPage from '@/modules/Capacity/CapacityForm';

interface EditCapacityPageProps {
  params: {
    id: string;
  };
}

export default function EditCapacityPage({ params }: EditCapacityPageProps) {
  const id = parseInt(params.id);
  return <CapacityFormPage id={isNaN(id) ? undefined : id} />;
}

