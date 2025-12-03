'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFetchBlogsQuery, useDeleteBlogMutation, useUpdateBlogPublishStatusMutation } from '@/lib/services/modules/blogService';
import { Button } from '@/core/shadcn/components/ui/button';
import { Badge } from '@/core/shadcn/components/ui/badge';
import { Input } from '@/core/shadcn/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shadcn/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/core/shadcn/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/core/shadcn/components/ui/dropdown-menu';
import { UIPagination, UIPaginationResuft } from '@/core/ui/UIPagination';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  FileText,
  Filter,
  Eye as EyeIcon,
  Calendar,
  Globe,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppNavigation } from '@/common/hooks';
import { routerApp } from '@/router';

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function BlogTable() {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  const [{ page, size, keyword, isPublished }, setQuery] = useQueryStates({
    page: parseAsInteger.withDefault(0),
    size: parseAsInteger.withDefault(12),
    keyword: parseAsString.withDefault(''),
    isPublished: parseAsString.withDefault(''),
  });

  const { data: blogsData, isLoading, refetch } = useFetchBlogsQuery({
    page,
    size,
    keyword: keyword || undefined,
    isPublished: isPublished === 'true' ? true : isPublished === 'false' ? false : undefined,
  });

  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const [updatePublishStatus] = useUpdateBlogPublishStatusMutation();

  const blogs = blogsData?.data || [];
  const totalElements = blogsData?.pagination?.totalElements || 0;
  const totalPages = blogsData?.pagination?.totalPages || 0;

  const handleCreate = () => {
    router.push(getRouteWithRole(routerApp.blog.new));
  };

  const handleEdit = (blog: any) => {
    router.push(getRouteWithRole(routerApp.blog.edit({ id: blog.id.toString() })));
  };

  const handleView = (blog: any) => {
    router.push(getRouteWithRole(routerApp.blog.view({ id: blog.id.toString() })));
  };

  const handleDeleteClick = (blog: any) => {
    setSelectedBlog(blog);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBlog) return;
    try {
      await deleteBlog(selectedBlog.id).unwrap();
      toast.success('Xóa blog thành công');
      setDeleteDialogOpen(false);
      setSelectedBlog(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra khi xóa blog');
    }
  };

  const handleTogglePublish = async (blog: any) => {
    try {
      await updatePublishStatus({ id: blog.id, isPublished: !blog.isPublished }).unwrap();
      toast.success(`Đã ${blog.isPublished ? 'ẩn' : 'xuất bản'} blog thành công`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const clearFilters = () => {
    setQuery({ keyword: '', isPublished: '', page: 0 });
  };

  const hasActiveFilters = keyword !== '' || isPublished !== '';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Blog</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý các bài viết blog
          </p>
        </div>
        <Button onClick={handleCreate} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Tạo Blog Mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Bộ lọc
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tiêu đề..."
                  value={keyword}
                  onChange={(e) => setQuery({ keyword: e.target.value, page: 0 })}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái xuất bản</label>
              <select
                value={isPublished}
                onChange={(e) => setQuery({ isPublished: e.target.value, page: 0 })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Tất cả</option>
                <option value="true">Đã xuất bản</option>
                <option value="false">Chưa xuất bản</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {blogs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có blog</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Bắt đầu bằng cách tạo blog mới
            </p>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Tạo Blog Đầu Tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Card key={blog.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 mb-2">{blog.title}</CardTitle>
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
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(blog)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(blog)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTogglePublish(blog)}>
                          {blog.isPublished ? (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Ẩn blog
                            </>
                          ) : (
                            <>
                              <Globe className="h-4 w-4 mr-2" />
                              Xuất bản blog
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(blog)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {blog.thumbnailUrl && (
                      <img 
                        src={blog.thumbnailUrl} 
                        alt={blog.title}
                        className="w-full h-40 object-cover rounded-md mb-2"
                      />
                    )}
                    <div className="text-sm text-muted-foreground line-clamp-3">
                      {blog.summary || blog.content?.replace(/<[^>]*>/g, '').substring(0, 120) || 'Không có tóm tắt'}
                      {blog.summary && blog.summary.length > 120 ? '...' : ''}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <EyeIcon className="h-3 w-3" />
                        <span>{blog.viewCount || 0} lượt xem</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(blog.updatedAt || blog.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <UIPaginationResuft
                currentPage={page + 1}
                totalPage={totalPages}
                totalCount={totalElements}
              />
              <UIPagination
                currentPage={page + 1}
                totalPage={totalPages}
                onChange={(newPage: number) => setQuery({ page: newPage - 1 })}
              />
            </div>
          )}
        </>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa blog</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa blog &quot;{selectedBlog?.title}&quot;? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedBlog(null);
              }}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

