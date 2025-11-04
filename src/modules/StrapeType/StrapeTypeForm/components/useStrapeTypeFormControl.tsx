'use client';

import { EStatusEnumString } from '@/common/enums';
import { useAppNavigation } from '@/common/hooks';
import { getErrors } from '@/common/utils/handleForm';
import { useAddStrapTypeMutation, useFetchStrapTypeByIdQuery, useUpdateStrapTypeMutation } from '@/lib/services/modules/strapTypeService';
import { TStrapeTypeFormField } from '@/modules/StrapeType/StrapeTypeForm/components/StrapeTypeForm.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { notFound, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

export type StrapeTypeFormContextData = ReturnType<typeof useStrapeTypeFormProvider>;

export const StrapeTypeFormContext = createContext({} as StrapeTypeFormContextData);

const strapeTypeSchema: yup.ObjectSchema<TStrapeTypeFormField> = yup.object({
  name: yup.string().required('Tên loại dây đeo là bắt buộc').max(255, 'Tên loại dây đeo không được vượt quá 255 ký tự'),
  description: yup.string().nullable().max(1000, 'Mô tả không được vượt quá 1000 ký tự'),
  status: yup.mixed<EStatusEnumString>().required('Trạng thái là bắt buộc'),
});

export function useStrapeTypeFormProvider(id?: number) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const { data: strapeType, isFetching, error } = useFetchStrapTypeByIdQuery(id!, { skip: !id });
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

  const [addStrapType, { isLoading: isAddLoading }] = useAddStrapTypeMutation();
  const [updateStrapType, { isLoading: isUpdateLoading }] = useUpdateStrapTypeMutation();

  const methods = useForm<TStrapeTypeFormField>({
    resolver: yupResolver(strapeTypeSchema),
    defaultValues: {
      name: '',
      description: '',
      status: EStatusEnumString.ACTIVE,
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (id && strapeType) {
      methods.reset({
        name: strapeType.name,
        description: strapeType.description || '',
        status: strapeType.status,
      });
    }
  }, [strapeType, id, methods]);

  const isLoading = isAddLoading || isUpdateLoading || (id ? isFetching : false);

  const handleConfirmSubmit = async (data: TStrapeTypeFormField) => {
    setConfirmModalConfig(prev => ({ ...prev, isLoading: true }));

    try {
      if (id) {
        await updateStrapType({ id, ...data, description: data.description ?? undefined }).unwrap();
        toast.success('Đã cập nhật thành công loại dây đeo');
        router.push(getRouteWithRole('/strap-types'));
      } else {
        await addStrapType({ ...data, description: data.description ?? undefined }).unwrap();
        toast.success('Đã thêm thành công loại dây đeo');
        router.push(getRouteWithRole('/strap-types'));
      }
      setIsConfirmModalOpen(false);
    } catch (error: any) {
      const generalError = getErrors(error, methods.setError, strapeTypeSchema);
      if (generalError) {
        toast.error(generalError);
      }
      setIsConfirmModalOpen(false);
    } finally {
      setConfirmModalConfig(prev => ({ ...prev, isLoading: false }));
    }
  };

  const onSubmit: SubmitHandler<TStrapeTypeFormField> = async (data) => {
    const actionText = id ? 'cập nhật' : 'thêm mới';
    setConfirmModalConfig({
      title: `Xác nhận ${actionText} loại dây đeo`,
      message: `Bạn có chắc chắn muốn ${actionText} loại dây đeo "${data.name}" không?`,
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

export function useStrapeTypeFormContext() {
  return useContext(StrapeTypeFormContext);
}

