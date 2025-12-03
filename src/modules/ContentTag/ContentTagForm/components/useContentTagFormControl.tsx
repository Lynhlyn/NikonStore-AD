'use client';

import { EContentType } from '@/lib/services/modules/contentTagService/type';
import { useAppNavigation } from '@/common/hooks';
import { getErrors } from '@/common/utils/handleForm';
import {
  useAddContentTagMutation,
  useFetchContentTagByIdQuery,
  useUpdateContentTagMutation,
} from '@/lib/services/modules/contentTagService';
import { TContentTagFormField } from '@/modules/ContentTag/ContentTagForm/components/ContentTagForm.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { notFound, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

export type ContentTagFormContextData = ReturnType<typeof useContentTagFormProvider>;

export const ContentTagFormContext = createContext({} as ContentTagFormContextData);

const contentTagSchema: yup.ObjectSchema<TContentTagFormField> = yup.object({
  name: yup
    .string()
    .required('Tên tag là bắt buộc')
    .max(255, 'Tên tag không được vượt quá 255 ký tự'),
  slug: yup
    .string()
    .required('Slug là bắt buộc')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug chỉ chứa chữ thường, số và dấu gạch nối'),
  type: yup.mixed<EContentType>().required('Loại tag là bắt buộc'),
});

export function useContentTagFormProvider(id?: number) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const { data: contentTag, isFetching, error } = useFetchContentTagByIdQuery(id!, { skip: !id });
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

  const [addContentTag, { isLoading: isAddLoading }] = useAddContentTagMutation();
  const [updateContentTag, { isLoading: isUpdateLoading }] = useUpdateContentTagMutation();

  const methods = useForm<TContentTagFormField>({
    resolver: yupResolver(contentTagSchema),
    defaultValues: {
      name: '',
      slug: '',
      type: EContentType.BLOG,
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (id && contentTag) {
      methods.reset({
        name: contentTag.name,
        slug: contentTag.slug,
        type: contentTag.type,
      });
    }
  }, [contentTag, id, methods]);

  const isLoading = isAddLoading || isUpdateLoading || (id ? isFetching : false);

  const handleConfirmSubmit = async (data: TContentTagFormField) => {
    setConfirmModalConfig((prev) => ({ ...prev, isLoading: true }));

    try {
      if (id) {
        await updateContentTag({ id, ...data }).unwrap();
        toast.success('Đã cập nhật thành công content tag');
        router.push(getRouteWithRole('/content-tags'));
      } else {
        await addContentTag(data).unwrap();
        toast.success('Đã thêm thành công content tag');
        router.push(getRouteWithRole('/content-tags'));
      }
      setIsConfirmModalOpen(false);
    } catch (error: any) {
      const generalError = getErrors(error, methods.setError, contentTagSchema);
      if (generalError) {
        toast.error(generalError);
      }
      setIsConfirmModalOpen(false);
    } finally {
      setConfirmModalConfig((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const onSubmit: SubmitHandler<TContentTagFormField> = async (data) => {
    const actionText = id ? 'cập nhật' : 'thêm mới';
    setConfirmModalConfig({
      title: `Xác nhận ${actionText} content tag`,
      message: `Bạn có chắc chắn muốn ${actionText} content tag "${data.name}" không?`,
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

export function useContentTagFormContext() {
  return useContext(ContentTagFormContext);
}

