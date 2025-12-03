'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from '@/core/shadcn/components/ui/button';
import { Input } from '@/core/shadcn/components/ui/input';
import { Label } from '@/core/shadcn/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shadcn/components/ui/card';
import { Save, Loader2, FileText } from 'lucide-react';
import type { PageResponse } from '@/lib/services/modules/pageService/type';

type PageFormValues = {
  title: string;
  slug: string;
  content: string;
};

const schema = yup.object({
  title: yup
    .string()
    .required('Tiêu đề là bắt buộc')
    .min(1, 'Tiêu đề không được để trống')
    .max(255, 'Tiêu đề không được quá 255 ký tự'),
  slug: yup
    .string()
    .required('Slug là bắt buộc')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug chỉ chứa chữ thường, số và dấu gạch nối')
    .max(255, 'Slug không được quá 255 ký tự'),
  content: yup
    .string()
    .required('Nội dung là bắt buộc')
    .min(1, 'Nội dung không được để trống'),
});

interface PageFormProps {
  pageData?: PageResponse;
  onSubmit: (data: PageFormValues) => Promise<void>;
  isLoading: boolean;
  slug?: string;
}

const tinymceApiKey = process.env.NEXT_PUBLIC_TINYMCE_PUBLIC_KEY;

export default function PageForm({ pageData, onSubmit, isLoading, slug }: PageFormProps) {
  const isEditMode = !!pageData?.id;
  const isSlugFromProps = !!slug;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PageFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
    },
  });

  const watchedContent = watch('content');

  useEffect(() => {
    if (isSlugFromProps && slug) {
      setValue('slug', slug);
    }
  }, [isSlugFromProps, slug, setValue]);

  useEffect(() => {
    if (pageData && pageData.id) {
      reset({
        title: pageData.title ?? '',
        slug: pageData.slug ?? '',
        content: pageData.content ?? '',
      });
    }
  }, [pageData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Thông tin Page
          </CardTitle>
          <CardDescription>
            Điền thông tin cơ bản cho trang nội dung
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Tiêu đề <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Nhập tiêu đề trang..."
              {...register('title')}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-red-500">*</span>
            </Label>
            {isSlugFromProps ? (
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-700">
                {slug}
              </div>
            ) : (
              <>
                <Input
                  id="slug"
                  placeholder="nhap-slug-khong-dau"
                  {...register('slug')}
                  className={errors.slug ? 'border-red-500' : ''}
                />
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug.message}</p>
                )}
              </>
            )}
            <p className="text-xs text-muted-foreground">
              Slug được dùng để xác định trang khi gọi API.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nội dung HTML</CardTitle>
          <CardDescription>
            Nhập nội dung HTML của trang. Sử dụng editor để định dạng nội dung.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="content">
              Nội dung <span className="text-red-500">*</span>
            </Label>
            <Editor
              apiKey={tinymceApiKey}
              value={watchedContent}
              onEditorChange={(content: string) =>
                setValue('content', content, { shouldValidate: true })
              }
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic underline | ' +
                  'alignleft aligncenter alignright alignjustify | ' +
                  'bullist numlist outdent indent | link image table | ' +
                  'code fullscreen',
                content_style:
                  'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size:14px }',
              }}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEditMode ? 'Cập nhật' : 'Tạo mới'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
