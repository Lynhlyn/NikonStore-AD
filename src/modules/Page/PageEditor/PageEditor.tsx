'use client';

import { useEffect } from 'react';
import { PageForm } from '../PageForm';
import {
  useGetPageByKeyQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
} from '@/lib/services/modules/pageService';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PageEditorProps {
  pageKey: string;
}

export default function PageEditor({ pageKey }: PageEditorProps) {
  const { data: pageData, isLoading: isLoadingPage, refetch } = useGetPageByKeyQuery(pageKey);
  const [createPage, { isLoading: isCreating }] = useCreatePageMutation();
  const [updatePage, { isLoading: isUpdating }] = useUpdatePageMutation();

  const isEditMode = pageData && pageData.id;
  const isLoading = isCreating || isUpdating;

  const handleSubmit = async (formData: { title: string; slug: string; content: string }) => {
    try {
      if (isEditMode) {
        await updatePage({
          id: pageData.id,
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
        }).unwrap();
        toast.success('Cập nhật page thành công');
      } else {
        await createPage({
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
        }).unwrap();
        toast.success('Tạo page thành công');
      }
      refetch();
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'data' in error &&
        (error as { data?: { message?: string } }).data?.message
          ? (error as { data?: { message?: string } }).data?.message
          : 'Có lỗi xảy ra';
      toast.error(message);
    }
  };

  if (isLoadingPage) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditMode ? 'Chỉnh sửa Page' : 'Tạo Page Mới'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isEditMode
            ? 'Cập nhật nội dung của trang'
            : 'Tạo mới trang nội dung tĩnh'}
        </p>
      </div>

      <PageForm
        pageData={isEditMode ? pageData : undefined}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
