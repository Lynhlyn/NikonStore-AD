import BlogDetail from '@/modules/Blog/BlogDetail';

interface ViewBlogPageProps {
  params: {
    id: string;
  };
}

export default function ViewBlogPage({ params }: ViewBlogPageProps) {
  const blogId = parseInt(params.id);
  return <BlogDetail blogId={blogId} />;
}

