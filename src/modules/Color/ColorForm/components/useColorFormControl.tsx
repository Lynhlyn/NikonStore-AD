'use client';

import { EStatusEnumString } from '@/common/enums';
import { useAppNavigation } from '@/common/hooks';
import { getErrors } from '@/common/utils/handleForm';
import { useAddColorMutation, useFetchColorByIdQuery, useUpdateColorMutation } from '@/lib/services/modules/colorService';
import { TColorFormField } from '@/modules/Color/ColorForm/components/ColorForm.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { notFound, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

export type ColorFormContextData = ReturnType<typeof useColorFormProvider>;

export const ColorFormContext = createContext({} as ColorFormContextData);

const colorSchema: yup.ObjectSchema<TColorFormField> = yup.object({
  name: yup.string().required('Tên màu là bắt buộc').max(255, 'Tên màu không được vượt quá 255 ký tự'),
  hexCode: yup.string()
    .required('Mã màu là bắt buộc')
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Mã màu phải có định dạng hex hợp lệ (vd: #FF0000)'),
  status: yup.mixed<EStatusEnumString>().required('Trạng thái là bắt buộc'),
});

export function useColorFormProvider(id?: number) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const { data: color, isFetching, error } = useFetchColorByIdQuery(id!, { skip: !id });
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

  const [addColor, { isLoading: isAddLoading }] = useAddColorMutation();
  const [updateColor, { isLoading: isUpdateLoading }] = useUpdateColorMutation();

  const methods = useForm<TColorFormField>({
    resolver: yupResolver(colorSchema),
    defaultValues: {
      name: '',
      hexCode: '#000000',
      status: EStatusEnumString.ACTIVE,
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (id && color) {
      methods.reset({
        name: color.name,
        hexCode: color.hexCode,
        status: color.status,
      });
    }
  }, [color, id, methods]);

  const isLoading = isAddLoading || isUpdateLoading || (id ? isFetching : false);

  const handleConfirmSubmit = async (data: TColorFormField) => {
    setConfirmModalConfig(prev => ({ ...prev, isLoading: true }));

    try {
      if (id) {
        await updateColor({ id, ...data }).unwrap();
        toast.success('Đã cập nhật thành công màu');
        router.push(getRouteWithRole('/colors'));
      } else {
        await addColor(data).unwrap();
        toast.success('Đã thêm thành công màu');
        router.push(getRouteWithRole('/colors'));
      }
      setIsConfirmModalOpen(false);
    } catch (error: any) {
      const generalError = getErrors(error, methods.setError, colorSchema);
      if (generalError) {
        toast.error(generalError);
      }
      setIsConfirmModalOpen(false);
    } finally {
      setConfirmModalConfig(prev => ({ ...prev, isLoading: false }));
    }
  };

  const onSubmit: SubmitHandler<TColorFormField> = async (data) => {
    const actionText = id ? 'cập nhật' : 'thêm mới';
    setConfirmModalConfig({
      title: `Xác nhận ${actionText} màu`,
      message: `Bạn có chắc chắn muốn ${actionText} màu "${data.name}" không?`,
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

export function useColorFormContext() {
  return useContext(ColorFormContext);
}

