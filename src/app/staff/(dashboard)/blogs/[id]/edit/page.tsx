import BlogForm from '@/modules/Blog/BlogForm';

interface EditBlogPageProps {
  params: {
    id: string;
  };
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const blogId = parseInt(params.id);
  return <BlogForm blogId={blogId} />;
}

