'use client';

import { EContentType } from '@/lib/services/modules/contentTagService/type';
import { useAppNavigation } from '@/common/hooks';
import { getErrors } from '@/common/utils/handleForm';
import {
  useAddContentCategoryMutation,
  useFetchContentCategoryByIdQuery,
  useUpdateContentCategoryMutation,
} from '@/lib/services/modules/contentCategoryService';
import { TContentCategoryFormField } from '@/modules/ContentCategory/ContentCategoryForm/components/ContentCategoryForm.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { notFound, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

export type ContentCategoryFormContextData = ReturnType<typeof useContentCategoryFormProvider>;

export const ContentCategoryFormContext = createContext({} as ContentCategoryFormContextData);

const contentCategorySchema: yup.ObjectSchema<TContentCategoryFormField> = yup.object({
  name: yup
    .string()
    .required('Tên danh mục là bắt buộc')
    .max(255, 'Tên danh mục không được vượt quá 255 ký tự'),
  slug: yup
    .string()
    .required('Slug là bắt buộc')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug chỉ chứa chữ thường, số và dấu gạch nối'),
  description: yup.string(),
  type: yup.mixed<EContentType>().required('Loại danh mục là bắt buộc'),
});

export function useContentCategoryFormProvider(id?: number) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const { data: contentCategory, isFetching, error } = useFetchContentCategoryByIdQuery(id!, {
    skip: !id,
  });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'warning' | 'danger' | 'info' | 'success',
    isLoading: false,
  });

  if (error) {
    router.push(getRouteWithRole(notFound()));
  }

  const [addContentCategory, { isLoading: isAddLoading }] = useAddContentCategoryMutation();
  const [updateContentCategory, { isLoading: isUpdateLoading }] =
    useUpdateContentCategoryMutation();

  const methods = useForm<TContentCategoryFormField>({
    resolver: yupResolver(contentCategorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      type: EContentType.BLOG,
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (id && contentCategory) {
      methods.reset({
        name: contentCategory.name,
        slug: contentCategory.slug,
        description: contentCategory.description || '',
        type: contentCategory.type,
      });
    }
  }, [contentCategory, id, methods]);

  const isLoading = isAddLoading || isUpdateLoading || (id ? isFetching : false);

  const handleConfirmSubmit = async (data: TContentCategoryFormField) => {
    setConfirmModalConfig((prev) => ({ ...prev, isLoading: true }));

    try {
      if (id) {
        await updateContentCategory({ id, ...data }).unwrap();
        toast.success('Đã cập nhật thành công content category');
        router.push(getRouteWithRole('/content-categories'));
      } else {
        await addContentCategory(data).unwrap();
        toast.success('Đã thêm thành công content category');
        router.push(getRouteWithRole('/content-categories'));
      }
      setIsConfirmModalOpen(false);
    } catch (error: any) {
      const generalError = getErrors(error, methods.setError, contentCategorySchema);
      if (generalError) {
        toast.error(generalError);
      }
      setIsConfirmModalOpen(false);
    } finally {
      setConfirmModalConfig((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const onSubmit: SubmitHandler<TContentCategoryFormField> = async (data) => {
    const actionText = id ? 'cập nhật' : 'thêm mới';
    setConfirmModalConfig({
      title: `Xác nhận ${actionText} content category`,
      message: `Bạn có chắc chắn muốn ${actionText} content category "${data.name}" không?`,
      type: 'info',
      isLoading: false,
    });
    setIsConfirmModalOpen(true);
  };

  return {
    ...methods,
    isLoading,
    onSubmit,
    router,
    getRouteWithRole,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    confirmModalConfig,
    handleConfirmSubmit,
  };
}

export function useContentCategoryFormContext() {
  return useContext(ContentCategoryFormContext);
}

