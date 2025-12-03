import FAQDetail from '@/modules/FAQ/FAQDetail';

interface ViewFAQPageProps {
  params: {
    id: string;
  };
}

export default function ViewFAQPage({ params }: ViewFAQPageProps) {
  const faqId = parseInt(params.id);
  return <FAQDetail faqId={faqId} />;
}

