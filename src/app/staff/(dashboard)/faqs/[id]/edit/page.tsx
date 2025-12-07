import FAQForm from '@/modules/FAQ/FAQForm';

interface EditFAQPageProps {
  params: {
    id: string;
  };
}

export default function EditFAQPage({ params }: EditFAQPageProps) {
  const faqId = parseInt(params.id);
  return <FAQForm faqId={faqId} />;
}

