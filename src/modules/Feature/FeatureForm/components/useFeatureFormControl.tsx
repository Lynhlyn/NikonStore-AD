'use client';

import { useAppNavigation } from '@/common/hooks';
import { getErrors } from '@/common/utils/handleForm';
import { useAddFeatureMutation, useFetchFeatureByIdQuery, useUpdateFeatureMutation } from '@/lib/services/modules/featureService';
import { TFeatureFormField } from '@/modules/Feature/FeatureForm/components/FeatureForm.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { notFound, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

export type FeatureFormContextData = ReturnType<typeof useFeatureFormProvider>;

export const FeatureFormContext = createContext({} as FeatureFormContextData);

const featureSchema: yup.ObjectSchema<TFeatureFormField> = yup.object({
  name: yup.string().required('Tên tính năng là bắt buộc').max(255, 'Tên tính năng không được vượt quá 255 ký tự'),
  description: yup.string().optional().max(500, 'Mô tả không được vượt quá 500 ký tự'),
  featureGroup: yup.string().optional().max(255, 'Nhóm tính năng không được vượt quá 255 ký tự'),
});

export function useFeatureFormProvider(id?: number) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const { data: feature, isFetching, error } = useFetchFeatureByIdQuery(id!, { skip: !id });
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

  const [addFeature, { isLoading: isAddLoading }] = useAddFeatureMutation();
  const [updateFeature, { isLoading: isUpdateLoading }] = useUpdateFeatureMutation();

  const methods = useForm<TFeatureFormField>({
    resolver: yupResolver(featureSchema),
    defaultValues: {
      name: '',
      description: '',
      featureGroup: '',
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (id && feature) {
      methods.reset({
        name: feature.name,
        description: feature.description || '',
        featureGroup: feature.featureGroup || '',
      });
    }
  }, [feature, id, methods]);

  const isLoading = isAddLoading || isUpdateLoading || (id ? isFetching : false);

  const handleConfirmSubmit = async (data: TFeatureFormField) => {
    setConfirmModalConfig(prev => ({ ...prev, isLoading: true }));

    try {
      if (id) {
        await updateFeature({ id, ...data }).unwrap();
        toast.success('Đã cập nhật thành công tính năng');
        router.push(getRouteWithRole('/features'));
      } else {
        await addFeature(data).unwrap();
        toast.success('Đã thêm thành công tính năng');
        router.push(getRouteWithRole('/features'));
      }
      setIsConfirmModalOpen(false);
    } catch (error: any) {
      const generalError = getErrors(error, methods.setError, featureSchema);
      if (generalError) {
        toast.error(generalError);
      }
      setIsConfirmModalOpen(false);
    } finally {
      setConfirmModalConfig(prev => ({ ...prev, isLoading: false }));
    }
  };

  const onSubmit: SubmitHandler<TFeatureFormField> = async (data) => {
    const actionText = id ? 'cập nhật' : 'thêm mới';
    setConfirmModalConfig({
      title: `Xác nhận ${actionText} tính năng`,
      message: `Bạn có chắc chắn muốn ${actionText} tính năng "${data.name}" không?`,
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

export function useFeatureFormContext() {
  return useContext(FeatureFormContext);
}

