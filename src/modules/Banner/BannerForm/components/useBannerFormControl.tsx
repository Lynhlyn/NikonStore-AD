'use client';

import { EStatusEnumString } from '@/common/enums';
import { useAppNavigation } from '@/common/hooks';
import { getErrors } from '@/common/utils/handleForm';
import {
  useAddBannerMutation,
  useFetchBannerByIdQuery,
  useUpdateBannerMutation,
} from '@/lib/services/modules/bannerService';
import { useUploadImagesMutation } from '@/lib/services/modules/uploadImageService';
import { TBannerFormField } from '@/modules/Banner/BannerForm/components/BannerForm.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { notFound, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

export type BannerFormContextData = ReturnType<typeof useBannerFormProvider>;

export const BannerFormContext = createContext({} as BannerFormContextData);

const bannerSchema: yup.ObjectSchema<TBannerFormField> = yup.object({
  name: yup.string().required('Tên banner là bắt buộc').max(255, 'Tên banner không được vượt quá 255 ký tự'),
  description: yup.string().optional().max(500, 'Mô tả không được vượt quá 500 ký tự'),
  url: yup.string().required('URL là bắt buộc').url('URL không hợp lệ'),
  status: yup.mixed<EStatusEnumString>().required('Trạng thái là bắt buộc'),
  imageUrl: yup.string().required('URL hình ảnh là bắt buộc'),
  position: yup.number().required('Vị trí là bắt buộc').min(0, 'Vị trí phải từ 0-3').max(3, 'Vị trí phải từ 0-3'),
  displayOrder: yup.number().optional().min(0, 'Thứ tự hiển thị phải lớn hơn hoặc bằng 0'),
});

export function useBannerFormProvider(id?: number) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const { data: banner, isFetching, error } = useFetchBannerByIdQuery(id!, { skip: !id });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'warning' | 'danger' | 'info' | 'success',
    isLoading: false,
  });
  const [isUploading, setIsUploading] = useState(false);

  if (error) {
    router.push(getRouteWithRole(notFound()));
  }

  const [addBanner, { isLoading: isAddLoading }] = useAddBannerMutation();
  const [updateBanner, { isLoading: isUpdateLoading }] = useUpdateBannerMutation();
  const [uploadImages] = useUploadImagesMutation();

  const methods = useForm<TBannerFormField>({
    resolver: yupResolver(bannerSchema),
    defaultValues: {
      name: '',
      description: '',
      url: '',
      status: EStatusEnumString.ACTIVE,
      imageUrl: '',
      position: 0,
      displayOrder: 0,
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (id && banner) {
      methods.reset({
        name: banner.name,
        description: banner.description || '',
        url: banner.url,
        status: banner.status,
        imageUrl: banner.imageUrl,
        position: banner.position,
        displayOrder: banner.displayOrder || 0,
      });
    }
  }, [banner, id, methods]);

  const isLoading = isAddLoading || isUpdateLoading || (id ? isFetching : false) || isUploading;

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ hỗ trợ file ảnh');
      return;
    }

    setIsUploading(true);
    try {
      const uploadResult = await uploadImages({
        files: [file],
        folder: 'banners',
      }).unwrap();

      const imageUrl = uploadResult.data && uploadResult.data.length > 0 ? uploadResult.data[0] : '';

      if (!imageUrl) {
        throw new Error('Upload failed: No URL returned');
      }

      methods.setValue('imageUrl', imageUrl, { shouldValidate: true });
      toast.success('Đã upload ảnh thành công');
    } catch (error: any) {
      toast.error(`Lỗi khi upload ảnh: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmSubmit = async (data: TBannerFormField) => {
    setConfirmModalConfig((prev) => ({ ...prev, isLoading: true }));

    try {
      const payload = {
        ...data,
        displayOrder: data.displayOrder ?? 0,
      };

      if (id) {
        await updateBanner({ id, ...payload }).unwrap();
        toast.success('Đã cập nhật thành công banner');
        router.push(getRouteWithRole('/banners'));
      } else {
        await addBanner(payload).unwrap();
        toast.success('Đã thêm thành công banner');
        router.push(getRouteWithRole('/banners'));
      }
      setIsConfirmModalOpen(false);
    } catch (error: any) {
      const generalError = getErrors(error, methods.setError, bannerSchema);
      if (generalError) {
        toast.error(generalError);
      }
      setIsConfirmModalOpen(false);
    } finally {
      setConfirmModalConfig((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const onSubmit: SubmitHandler<TBannerFormField> = async (data) => {
    const actionText = id ? 'cập nhật' : 'thêm mới';
    setConfirmModalConfig({
      title: `Xác nhận ${actionText} banner`,
      message: `Bạn có chắc chắn muốn ${actionText} banner "${data.name}" không?`,
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
    handleImageUpload,
    isUploading,
  };
}

export function useBannerFormContext() {
  return useContext(BannerFormContext);
}

