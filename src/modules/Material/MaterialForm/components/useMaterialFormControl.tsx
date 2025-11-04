'use client';

import { EStatusEnumString } from '@/common/enums';
import { useAppNavigation } from '@/common/hooks';
import { getErrors } from '@/common/utils/handleForm';
import { useAddMaterialMutation, useFetchMaterialByIdQuery, useUpdateMaterialMutation } from '@/lib/services/modules/materialService';
import { TMaterialFormField } from '@/modules/Material/MaterialForm/components/MaterialForm.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { notFound, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

export type MaterialFormContextData = ReturnType<typeof useMaterialFormProvider>;

export const MaterialFormContext = createContext({} as MaterialFormContextData);

const materialSchema: yup.ObjectSchema<TMaterialFormField> = yup.object({
  name: yup.string().required('Tên chất liệu là bắt buộc').max(255, 'Tên chất liệu không được vượt quá 255 ký tự'),
  description: yup.string().optional().max(500, 'Mô tả không được vượt quá 500 ký tự'),
  status: yup.mixed<EStatusEnumString>().required('Trạng thái là bắt buộc'),
});

export function useMaterialFormProvider(id?: number) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const { data: material, isFetching, error } = useFetchMaterialByIdQuery(id!, { skip: !id });
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

  const [addMaterial, { isLoading: isAddLoading }] = useAddMaterialMutation();
  const [updateMaterial, { isLoading: isUpdateLoading }] = useUpdateMaterialMutation();

  const methods = useForm<TMaterialFormField>({
    resolver: yupResolver(materialSchema),
    defaultValues: {
      name: '',
      description: '',
      status: EStatusEnumString.ACTIVE,
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (id && material) {
      methods.reset({
        name: material.name,
        description: material.description || '',
        status: material.status,
      });
    }
  }, [material, id, methods]);

  const isLoading = isAddLoading || isUpdateLoading || (id ? isFetching : false);

  const handleConfirmSubmit = async (data: TMaterialFormField) => {
    setConfirmModalConfig(prev => ({ ...prev, isLoading: true }));

    try {
      if (id) {
        await updateMaterial({ id, ...data }).unwrap();
        toast.success('Đã cập nhật thành công chất liệu');
        router.push(getRouteWithRole('/materials'));
      } else {
        await addMaterial(data).unwrap();
        toast.success('Đã thêm thành công chất liệu');
        router.push(getRouteWithRole('/materials'));
      }
      setIsConfirmModalOpen(false);
    } catch (error: any) {
      const generalError = getErrors(error, methods.setError, materialSchema);
      if (generalError) {
        toast.error(generalError);
      }
      setIsConfirmModalOpen(false);
    } finally {
      setConfirmModalConfig(prev => ({ ...prev, isLoading: false }));
    }
  };

  const onSubmit: SubmitHandler<TMaterialFormField> = async (data) => {
    const actionText = id ? 'cập nhật' : 'thêm mới';
    setConfirmModalConfig({
      title: `Xác nhận ${actionText} chất liệu`,
      message: `Bạn có chắc chắn muốn ${actionText} chất liệu "${data.name}" không?`,
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

export function useMaterialFormContext() {
  return useContext(MaterialFormContext);
}

