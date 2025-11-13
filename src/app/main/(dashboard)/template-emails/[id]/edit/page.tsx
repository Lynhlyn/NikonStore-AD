import TemplateEmailForm from '@/modules/TemplateEmail/TemplateEmailForm';

interface EditTemplateEmailPageProps {
  params: {
    id: string;
  };
}

export default function EditTemplateEmailPage({ params }: EditTemplateEmailPageProps) {
  const templateId = parseInt(params.id);
  return <TemplateEmailForm templateId={templateId} />;
}

