'use client';

import { useRouter } from 'next/navigation';
import { useFetchBlogByIdQuery } from '@/lib/services/modules/blogService';
import { Button } from '@/core/shadcn/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shadcn/components/ui/card';
import { Badge } from '@/core/shadcn/components/ui/badge';
import { ArrowLeft, Edit, FileText, Globe, Lock, Eye as EyeIcon } from 'lucide-react';
import { useAppNavigation } from '@/common/hooks';
import { routerApp } from '@/router';
import BlogCommentSection from './BlogCommentSection';

interface BlogDetailProps {
  blogId: number;
}

export default function BlogDetail({ blogId }: BlogDetailProps) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const { data: blog, isLoading } = useFetchBlogByIdQuery(blogId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy blog</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chi tiết Blog</h1>
          <p className="text-muted-foreground mt-2">Xem thông tin chi tiết blog</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(getRouteWithRole(routerApp.blog.list))}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Button
            onClick={() => router.push(getRouteWithRole(routerApp.blog.edit({ id: blog.id.toString() })))}
          >
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{blog.title}</CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={blog.isPublished ? 'default' : 'secondary'}>
                  {blog.isPublished ? (
                    <><Globe className="h-3 w-3 mr-1" /> Đã xuất bản</>
                  ) : (
                    <><Lock className="h-3 w-3 mr-1" /> Chưa xuất bản</>
                  )}
                </Badge>
                {blog.category && (
                  <Badge variant="outline">{blog.category.name}</Badge>
                )}
                {blog.tag && (
                  <Badge variant="outline">{blog.tag.name}</Badge>
                )}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <EyeIcon className="h-3 w-3" />
                  {blog.viewCount || 0} lượt xem
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {blog.thumbnailUrl && (
              <img
                src={blog.thumbnailUrl}
                alt={blog.title}
                className="w-full h-64 object-cover rounded-md"
              />
            )}
            {blog.summary && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Tóm tắt:</h3>
                <p className="text-muted-foreground">{blog.summary}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold mb-2">Nội dung:</h3>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
            {blog.createdAt && (
              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Ngày tạo: {new Date(blog.createdAt).toLocaleDateString('vi-VN')}</p>
                {blog.updatedAt && (
                  <p>Ngày cập nhật: {new Date(blog.updatedAt).toLocaleDateString('vi-VN')}</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <BlogCommentSection blogId={blog.id} />
    </div>
  );
}

