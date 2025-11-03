'use client';

import { EStatusEnumString } from '@/common/enums';
import { useAppNavigation } from '@/common/hooks';
import { getErrors } from '@/common/utils/handleForm';
import { useAddBrandMutation, useFetchBrandByIdQuery, useUpdateBrandMutation } from '@/lib/services/modules/brandService';
import { TBrandFormField } from '@/modules/Brand/BrandForm/components/BrandForm.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { notFound, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

export type BrandFormContextData = ReturnType<typeof useBrandFormProvider>;

export const BrandFormContext = createContext({} as BrandFormContextData);

const brandSchema: yup.ObjectSchema<TBrandFormField> = yup.object({
  name: yup.string().required('Tên thương hiệu là bắt buộc').max(255, 'Tên thương hiệu không được vượt quá 255 ký tự'),
  status: yup.mixed<EStatusEnumString>().required('Trạng thái là bắt buộc'),
});

export function useBrandFormProvider(id?: number) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const { data: brand, isFetching, error } = useFetchBrandByIdQuery(id!, { skip: !id });
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

  const [addBrand, { isLoading: isAddLoading }] = useAddBrandMutation();
  const [updateBrand, { isLoading: isUpdateLoading }] = useUpdateBrandMutation();

  const methods = useForm<TBrandFormField>({
    resolver: yupResolver(brandSchema),
    defaultValues: {
      name: '',
      status: EStatusEnumString.ACTIVE,
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (id && brand) {
      methods.reset({
        name: brand.name,
        status: brand.status,
      });
    }
  }, [brand, id, methods]);

  const isLoading = isAddLoading || isUpdateLoading || (id ? isFetching : false);

  const handleConfirmSubmit = async (data: TBrandFormField) => {
    setConfirmModalConfig(prev => ({ ...prev, isLoading: true }));

    try {
      if (id) {
        await updateBrand({ id, ...data }).unwrap();
        toast.success('Đã cập nhật thành công thương hiệu');
        router.push(getRouteWithRole('/brands'));
      } else {
        await addBrand(data).unwrap();
        toast.success('Đã thêm thành công thương hiệu');
        router.push(getRouteWithRole('/brands'));
      }
      setIsConfirmModalOpen(false);
    } catch (error: any) {
      const generalError = getErrors(error, methods.setError, brandSchema);
      if (generalError) {
        toast.error(generalError);
      }
      setIsConfirmModalOpen(false);
    } finally {
      setConfirmModalConfig(prev => ({ ...prev, isLoading: false }));
    }
  };

  const onSubmit: SubmitHandler<TBrandFormField> = async (data) => {
    const actionText = id ? 'cập nhật' : 'thêm mới';
    setConfirmModalConfig({
      title: `Xác nhận ${actionText} thương hiệu`,
      message: `Bạn có chắc chắn muốn ${actionText} thương hiệu "${data.name}" không?`,
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

export function useBrandFormContext() {
  return useContext(BrandFormContext);
}

