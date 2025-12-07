import { PageEditor } from '@/modules/Page/PageEditor';

interface PageEditorPageProps {
  params: {
    pageKey: string;
  };
}

export default function PageEditorPage({ params }: PageEditorPageProps) {
  return <PageEditor pageKey={params.pageKey} />;
}

