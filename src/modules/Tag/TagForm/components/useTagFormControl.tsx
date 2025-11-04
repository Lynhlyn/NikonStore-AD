'use client';

import { EStatusEnumString } from '@/common/enums';
import { useAppNavigation } from '@/common/hooks';
import { getErrors } from '@/common/utils/handleForm';
import { useAddTagMutation, useFetchTagByIdQuery, useUpdateTagMutation } from '@/lib/services/modules/tagService';
import { TTagFormField } from '@/modules/Tag/TagForm/components/TagForm.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { notFound, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

export type TagFormContextData = ReturnType<typeof useTagFormProvider>;

export const TagFormContext = createContext({} as TagFormContextData);

const tagSchema: yup.ObjectSchema<TTagFormField> = yup.object({
  name: yup.string().required('Tên thẻ là bắt buộc').max(255, 'Tên thẻ không được vượt quá 255 ký tự'),
  slug: yup.string().required('Slug là bắt buộc').max(255, 'Slug không được vượt quá 255 ký tự')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'),
  description: yup.string().optional().max(500, 'Mô tả không được vượt quá 500 ký tự'),
  status: yup.mixed<EStatusEnumString>().required('Trạng thái là bắt buộc'),
});

export function useTagFormProvider(id?: number) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const { data: tag, isFetching, error } = useFetchTagByIdQuery(id!, { skip: !id });
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

  const [addTag, { isLoading: isAddLoading }] = useAddTagMutation();
  const [updateTag, { isLoading: isUpdateLoading }] = useUpdateTagMutation();

  const methods = useForm<TTagFormField>({
    resolver: yupResolver(tagSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      status: EStatusEnumString.ACTIVE,
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (id && tag) {
      methods.reset({
        name: tag.name,
        slug: tag.slug,
        description: tag.description || '',
        status: tag.status,
      });
    }
  }, [tag, id, methods]);

  const isLoading = isAddLoading || isUpdateLoading || (id ? isFetching : false);

  const handleConfirmSubmit = async (data: TTagFormField) => {
    setConfirmModalConfig(prev => ({ ...prev, isLoading: true }));

    try {
      if (id) {
        await updateTag({ id, ...data }).unwrap();
        toast.success('Đã cập nhật thành công thẻ');
        router.push(getRouteWithRole('/tags'));
      } else {
        await addTag(data).unwrap();
        toast.success('Đã thêm thành công thẻ');
        router.push(getRouteWithRole('/tags'));
      }
      setIsConfirmModalOpen(false);
    } catch (error: any) {
      const generalError = getErrors(error, methods.setError, tagSchema);
      if (generalError) {
        toast.error(generalError);
      }
      setIsConfirmModalOpen(false);
    } finally {
      setConfirmModalConfig(prev => ({ ...prev, isLoading: false }));
    }
  };

  const onSubmit: SubmitHandler<TTagFormField> = async (data) => {
    const actionText = id ? 'cập nhật' : 'thêm mới';
    setConfirmModalConfig({
      title: `Xác nhận ${actionText} thẻ`,
      message: `Bạn có chắc chắn muốn ${actionText} thẻ "${data.name}" không?`,
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

export function useTagFormContext() {
  return useContext(TagFormContext);
}

