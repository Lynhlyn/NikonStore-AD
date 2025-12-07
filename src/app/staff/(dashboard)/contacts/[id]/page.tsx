import ContactDetail from '@/modules/Contact/ContactDetail/ContactDetail';

interface ContactDetailPageProps {
  params: {
    id: string;
  };
}

export default function ContactDetailPage({ params }: ContactDetailPageProps) {
  const contactId = parseInt(params.id);
  return <ContactDetail contactId={contactId} />;
}

