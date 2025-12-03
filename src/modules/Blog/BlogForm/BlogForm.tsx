'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Editor } from '@tinymce/tinymce-react';
import {
  useAddBlogMutation,
  useUpdateBlogMutation,
  useFetchBlogByIdQuery,
} from '@/lib/services/modules/blogService';
import {
  useFetchContentCategoriesQuery,
} from '@/lib/services/modules/contentCategoryService';
import {
  useFetchContentTagsQuery,
} from '@/lib/services/modules/contentTagService';
import { useUploadImagesMutation } from '@/lib/services/modules/uploadImageService';
import { Button } from '@/core/shadcn/components/ui/button';
import { Input } from '@/core/shadcn/components/ui/input';
import { Label } from '@/core/shadcn/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shadcn/components/ui/card';
import { ArrowLeft, Save, Loader2, FileText, Image as ImageIcon, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useAppNavigation } from '@/common/hooks';
import { routerApp } from '@/router';
import { useState } from 'react';
import { UISingleSelect } from '@/core/ui/UISingleSelect';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import { EContentType } from '@/lib/services/modules/contentTagService/type';

type BlogFormValues = {
  title: string;
  slug: string;
  summary?: string;
  content: string;
  thumbnailUrl?: string;
  staffId?: number;
  categoryId?: number;
  tagId?: number;
  isPublished: boolean;
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
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug chỉ chứa chữ thường, số và dấu gạch nối'),
  summary: yup.string(),
  content: yup
    .string()
    .required('Nội dung là bắt buộc')
    .min(1, 'Nội dung không được để trống'),
  thumbnailUrl: yup.string(),
  staffId: yup.number().nullable(),
  categoryId: yup.number().nullable(),
  tagId: yup.number().nullable(),
  isPublished: yup.boolean().default(false),
});

interface BlogFormProps {
  blogId?: number;
}

const tinymceApiKey = process.env.NEXT_PUBLIC_TINYMCE_PUBLIC_KEY;

export default function BlogForm({ blogId }: BlogFormProps) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const isEdit = !!blogId;
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const { data: blogData, isLoading: isLoadingBlog } = useFetchBlogByIdQuery(
    blogId!,
    { skip: !isEdit }
  );

  const [addBlog, { isLoading: isAdding }] = useAddBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [uploadImages] = useUploadImagesMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<BlogFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      slug: '',
      summary: '',
      content: '',
      thumbnailUrl: undefined,
      staffId: undefined,
      categoryId: undefined,
      tagId: undefined,
      isPublished: false,
    },
  });

  const { data: categoriesData } = useFetchContentCategoriesQuery({
    isAll: true,
    type: EContentType.BLOG,
  });

  const { data: tagsData } = useFetchContentTagsQuery({
    isAll: true,
    type: EContentType.BLOG,
  });

  const categoryOptions = useMemo(() => {
    if (!categoriesData?.data) return [];
    return categoriesData.data.map((cat) => ({
      value: cat.id,
      label: cat.name,
    }));
  }, [categoriesData]);

  const tagOptions = useMemo(() => {
    if (!tagsData?.data) return [];
    return tagsData.data.map((tag) => ({
      value: tag.id,
      label: tag.name,
    }));
  }, [tagsData]);

  const watchedContent = watch('content');
  const watchedThumbnailUrl = watch('thumbnailUrl');

  useEffect(() => {
    if (isEdit && blogData) {
      reset({
        title: blogData.title || '',
        slug: blogData.slug || '',
        summary: blogData.summary || '',
        content: blogData.content || '',
        thumbnailUrl: blogData.thumbnailUrl,
        staffId: blogData.staff?.id,
        categoryId: blogData.category?.id,
        tagId: blogData.tag?.id,
        isPublished: blogData.isPublished ?? false,
      });
    }
  }, [isEdit, blogData, reset]);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    try {
      const result = await uploadImages({ files: [file], folder: 'blog' }).unwrap();
      if (result.data && result.data.length > 0) {
        setValue('thumbnailUrl', result.data[0]);
        toast.success('Upload ảnh thành công');
      }
    } catch (error: any) {
      toast.error('Có lỗi xảy ra khi upload ảnh');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const onSubmit = async (data: BlogFormValues) => {
    try {
      const payload = {
        title: data.title,
        slug: data.slug,
        summary: data.summary || undefined,
        content: data.content,
        thumbnailUrl: data.thumbnailUrl || undefined,
        staffId: data.staffId || undefined,
        categoryId: data.categoryId || undefined,
        tagId: data.tagId || undefined,
        isPublished: data.isPublished,
      };

      if (isEdit && blogId) {
        await updateBlog({ id: blogId, data: payload }).unwrap();
        toast.success('Cập nhật blog thành công');
      } else {
        await addBlog(payload).unwrap();
        toast.success('Tạo blog thành công');
      }

      router.push(getRouteWithRole(routerApp.blog.list));
    } catch (error: any) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra');
    }
  };

  if (isLoadingBlog) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? 'Chỉnh sửa Blog' : 'Tạo Blog mới'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEdit ? 'Cập nhật thông tin blog' : 'Thêm bài viết blog mới'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(getRouteWithRole(routerApp.blog.list))}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Thông tin Blog
                </CardTitle>
                <CardDescription>
                  Điền thông tin cơ bản cho blog
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Tiêu đề <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Nhập tiêu đề blog..."
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
                  <Input
                    id="slug"
                    placeholder="bai-viet-blog"
                    {...register('slug')}
                    className={errors.slug ? 'border-red-500' : ''}
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500">{errors.slug.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Tóm tắt</Label>
                  <textarea
                    id="summary"
                    placeholder="Nhập tóm tắt blog..."
                    {...register('summary')}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nội dung Blog</CardTitle>
                <CardDescription>
                  Nhập nội dung chi tiết của blog. Sử dụng editor để định dạng nội dung.
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
                        'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
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
          </div>

          <div className="xl:sticky xl:top-6 xl:max-h-[calc(100vh-96px)] xl:overflow-y-auto space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh đại diện</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {watchedThumbnailUrl && (
                  <div className="relative">
                    <img
                      src={watchedThumbnailUrl}
                      alt="Thumbnail"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setValue('thumbnailUrl', undefined)}
                    >
                      Xóa
                    </Button>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Upload ảnh đại diện</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={uploadingThumbnail}
                      className="hidden"
                    />
                    <Label
                      htmlFor="thumbnail"
                      className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4" />
                      {uploadingThumbnail ? 'Đang upload...' : 'Chọn ảnh'}
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thiết lập</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Danh mục</Label>
                  <Controller
                    control={control}
                    name="categoryId"
                    render={({ field: { onChange, value } }) => {
                      const selectedOption = categoryOptions.find((opt) => opt.value === value);
                      return (
                        <UISingleSelect
                          options={categoryOptions}
                          onChange={(selected) => onChange(selected?.value || undefined)}
                          selected={selectedOption}
                          bindLabel="label"
                          bindValue="value"
                          size={ESize.M}
                          placeholder="Chọn danh mục"
                          className="rounded-md border border-gray-300"
                          renderOption={(props) => <UISingleSelect.Option {...props} />}
                          renderSelected={(props) => <UISingleSelect.Selected {...props} />}
                        />
                      );
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagId">Tag</Label>
                  <Controller
                    control={control}
                    name="tagId"
                    render={({ field: { onChange, value } }) => {
                      const selectedOption = tagOptions.find((opt) => opt.value === value);
                      return (
                        <UISingleSelect
                          options={tagOptions}
                          onChange={(selected) => onChange(selected?.value || undefined)}
                          selected={selectedOption}
                          bindLabel="label"
                          bindValue="value"
                          size={ESize.M}
                          placeholder="Chọn tag"
                          className="rounded-md border border-gray-300"
                          renderOption={(props) => <UISingleSelect.Option {...props} />}
                          renderSelected={(props) => <UISingleSelect.Selected {...props} />}
                        />
                      );
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isPublished">Trạng thái xuất bản</Label>
                  <select
                    id="isPublished"
                    {...register('isPublished', { valueAsNumber: false })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="false">Chưa xuất bản</option>
                    <option value="true">Đã xuất bản</option>
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isAdding || isUpdating}
                  >
                    {isAdding || isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isEdit ? 'Cập nhật' : 'Tạo mới'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

