'use client';

import { EStatusEnumString } from '@/common/enums';
import { useAppNavigation } from '@/common/hooks';
import { getErrors } from '@/common/utils/handleForm';
import { useAddCapacityMutation, useFetchCapacityByIdQuery, useUpdateCapacityMutation } from '@/lib/services/modules/capacityService';
import { TCapacityFormField } from '@/modules/Capacity/CapacityForm/components/CapacityForm.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { notFound, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

export type CapacityFormContextData = ReturnType<typeof useCapacityFormProvider>;

export const CapacityFormContext = createContext({} as CapacityFormContextData);

const capacitySchema: yup.ObjectSchema<TCapacityFormField> = yup.object({
  name: yup.string().required('Tên dung tích là bắt buộc').max(255, 'Tên dung tích không được vượt quá 255 ký tự'),
  status: yup.mixed<EStatusEnumString>().required('Trạng thái là bắt buộc'),
});

export function useCapacityFormProvider(id?: number) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const { data: capacity, isFetching, error } = useFetchCapacityByIdQuery(id!, { skip: !id });
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

  const [addCapacity, { isLoading: isAddLoading }] = useAddCapacityMutation();
  const [updateCapacity, { isLoading: isUpdateLoading }] = useUpdateCapacityMutation();

  const methods = useForm<TCapacityFormField>({
    resolver: yupResolver(capacitySchema),
    defaultValues: {
      name: '',
      status: EStatusEnumString.ACTIVE,
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (id && capacity) {
      methods.reset({
        name: capacity.name,
        status: capacity.status,
      });
    }
  }, [capacity, id, methods]);

  const isLoading = isAddLoading || isUpdateLoading || (id ? isFetching : false);

  const handleConfirmSubmit = async (data: TCapacityFormField) => {
    setConfirmModalConfig(prev => ({ ...prev, isLoading: true }));

    try {
      if (id) {
        await updateCapacity({ id, ...data }).unwrap();
        toast.success('Đã cập nhật thành công dung tích');
        router.push(getRouteWithRole('/capacities'));
      } else {
        await addCapacity(data).unwrap();
        toast.success('Đã thêm thành công dung tích');
        router.push(getRouteWithRole('/capacities'));
      }
      setIsConfirmModalOpen(false);
    } catch (error: any) {
      const generalError = getErrors(error, methods.setError, capacitySchema);
      if (generalError) {
        toast.error(generalError);
      }
      setIsConfirmModalOpen(false);
    } finally {
      setConfirmModalConfig(prev => ({ ...prev, isLoading: false }));
    }
  };

  const onSubmit: SubmitHandler<TCapacityFormField> = async (data) => {
    const actionText = id ? 'cập nhật' : 'thêm mới';
    setConfirmModalConfig({
      title: `Xác nhận ${actionText} dung tích`,
      message: `Bạn có chắc chắn muốn ${actionText} dung tích "${data.name}" không?`,
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

export function useCapacityFormContext() {
  return useContext(CapacityFormContext);
}

