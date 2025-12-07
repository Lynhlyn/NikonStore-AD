import TemplateEmailDetail from '@/modules/TemplateEmail/TemplateEmailDetail';

interface ViewTemplateEmailPageProps {
  params: {
    id: string;
  };
}

export default function ViewTemplateEmailPage({ params }: ViewTemplateEmailPageProps) {
  const templateId = parseInt(params.id);
  return <TemplateEmailDetail templateId={templateId} />;
}

