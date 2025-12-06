import BannerFormPage from '@/modules/Banner/BannerForm';

interface EditBannerPageProps {
  params: {
    id: string;
  };
}

export default function EditBannerPage({ params }: EditBannerPageProps) {
  const id = parseInt(params.id);
  return <BannerFormPage id={isNaN(id) ? undefined : id} />;
}

