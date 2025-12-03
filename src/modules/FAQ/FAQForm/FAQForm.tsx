'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Editor } from '@tinymce/tinymce-react';
import {
  useAddFAQMutation,
  useUpdateFAQMutation,
  useFetchFAQByIdQuery,
} from '@/lib/services/modules/faqService';
import {
  useFetchContentCategoriesQuery,
} from '@/lib/services/modules/contentCategoryService';
import {
  useFetchContentTagsQuery,
} from '@/lib/services/modules/contentTagService';
import { Button } from '@/core/shadcn/components/ui/button';
import { Input } from '@/core/shadcn/components/ui/input';
import { Label } from '@/core/shadcn/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shadcn/components/ui/card';
import { ArrowLeft, Save, Loader2, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAppNavigation } from '@/common/hooks';
import { routerApp } from '@/router';
import { UISingleSelect } from '@/core/ui/UISingleSelect';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import { Controller } from 'react-hook-form';
import { EContentType } from '@/lib/services/modules/contentTagService/type';

type FAQFormValues = {
  question: string;
  answer: string;
  categoryId?: number;
  tagId?: number;
  status: boolean;
};

const schema = yup.object({
  question: yup
    .string()
    .required('Câu hỏi là bắt buộc')
    .min(1, 'Câu hỏi không được để trống'),
  answer: yup
    .string()
    .required('Câu trả lời là bắt buộc')
    .min(1, 'Câu trả lời không được để trống'),
  categoryId: yup.number().nullable(),
  tagId: yup.number().nullable(),
  status: yup.boolean().default(true),
});

interface FAQFormProps {
  faqId?: number;
}

const tinymceApiKey = process.env.NEXT_PUBLIC_TINYMCE_PUBLIC_KEY;

export default function FAQForm({ faqId }: FAQFormProps) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const isEdit = !!faqId;

  const { data: faqData, isLoading: isLoadingFAQ } = useFetchFAQByIdQuery(
    faqId!,
    { skip: !isEdit }
  );

  const [addFAQ, { isLoading: isAdding }] = useAddFAQMutation();
  const [updateFAQ, { isLoading: isUpdating }] = useUpdateFAQMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<FAQFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      question: '',
      answer: '',
      categoryId: undefined,
      tagId: undefined,
      status: true,
    },
  });

  const { data: categoriesData } = useFetchContentCategoriesQuery({
    isAll: true,
    type: EContentType.FAQ,
  });

  const { data: tagsData } = useFetchContentTagsQuery({
    isAll: true,
    type: EContentType.FAQ,
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

  const watchedAnswer = watch('answer');
  const watchedQuestion = watch('question');

  useEffect(() => {
    if (isEdit && faqData) {
      reset({
        question: faqData.question || '',
        answer: faqData.answer || '',
        categoryId: faqData.category?.id,
        tagId: faqData.tag?.id,
        status: faqData.status ?? true,
      });
    }
  }, [isEdit, faqData, reset]);

  const onSubmit = async (data: FAQFormValues) => {
    try {
      const payload = {
        question: data.question,
        answer: data.answer,
        categoryId: data.categoryId || undefined,
        tagId: data.tagId || undefined,
        status: data.status,
      };

      if (isEdit && faqId) {
        await updateFAQ({ id: faqId, data: payload }).unwrap();
        toast.success('Cập nhật FAQ thành công');
      } else {
        await addFAQ(payload).unwrap();
        toast.success('Tạo FAQ thành công');
      }

      router.push(getRouteWithRole(routerApp.faq.list));
    } catch (error: any) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra');
    }
  };

  if (isLoadingFAQ) {
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
            {isEdit ? 'Chỉnh sửa FAQ' : 'Tạo FAQ mới'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEdit ? 'Cập nhật thông tin FAQ' : 'Thêm câu hỏi thường gặp mới'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(getRouteWithRole(routerApp.faq.list))}
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
                  <HelpCircle className="h-5 w-5" />
                  Thông tin FAQ
                </CardTitle>
                <CardDescription>
                  Điền thông tin câu hỏi và câu trả lời
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question">
                    Câu hỏi <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="question"
                    placeholder="Nhập câu hỏi..."
                    {...register('question')}
                    className={errors.question ? 'border-red-500' : ''}
                  />
                  {errors.question && (
                    <p className="text-sm text-red-500">{errors.question.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Câu trả lời</CardTitle>
                <CardDescription>
                  Nhập câu trả lời chi tiết cho câu hỏi. Sử dụng editor để định dạng nội dung.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="answer">
                    Câu trả lời <span className="text-red-500">*</span>
                  </Label>
                  <Editor
                    apiKey={tinymceApiKey}
                    value={watchedAnswer}
                    onEditorChange={(content: string) =>
                      setValue('answer', content, { shouldValidate: true })
                    }
                    init={{
                      height: 400,
                      menubar: false,
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
                  {errors.answer && (
                    <p className="text-sm text-red-500">{errors.answer.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="xl:sticky xl:top-6 xl:max-h-[calc(100vh-96px)] xl:overflow-y-auto space-y-4">
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
                  <Label htmlFor="status">Trạng thái</Label>
                  <select
                    id="status"
                    {...register('status', { valueAsNumber: false })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="true">Hiển thị</option>
                    <option value="false">Ẩn</option>
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

