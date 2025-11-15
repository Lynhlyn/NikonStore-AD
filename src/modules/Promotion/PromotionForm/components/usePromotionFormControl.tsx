'use client';

import { EStatusEnumString } from '@/common/enums/status';
import { useAppNavigation } from '@/common/hooks';
import { formatLocalDateTime } from '@/common/utils/formatDateToVN';
import { getErrors } from '@/common/utils/handleForm';
import { useAddPromotionMutation, useFetchPromotionByIdQuery, useUpdatePromotionMutation } from '@/lib/services/modules/promotionService';
import { TPromotionFormField } from '@/modules/Promotion/PromotionForm/components/PromotionForm.type';
import { routerApp } from '@/router';
import { yupResolver } from '@hookform/resolvers/yup';
import { notFound, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

export type PromotionFormContextData = ReturnType<typeof usePromotionFormProvider>;

export const PromotionFormContext = createContext({} as PromotionFormContextData);

const promotionSchema: yup.ObjectSchema<TPromotionFormField> = yup.object({
  name: yup
    .string()
    .required('Tên chương trình là bắt buộc')
    .max(255, 'Tên chương trình không được vượt quá 255 ký tự'),
  title: yup
    .string()
    .required('Tiêu đề là bắt buộc')
    .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
  code: yup
    .string()
    .optional()
    .max(50, 'Mã khuyến mãi không được vượt quá 50 ký tự'),
  discountType: yup
    .mixed<'percentage' | 'fixed_amount'>()
    .required('Loại giảm giá là bắt buộc'),
  discountValue: yup
    .number()
    .required('Giá trị giảm giá là bắt buộc')
    .min(0.01, 'Giá trị giảm giá phải lớn hơn 0')
    .test('discount-value-validation', 'Giá trị giảm giá không hợp lệ', function (value) {
      const { discountType } = this.parent;
      if (discountType === 'percentage') {
        return value >= 1 && value <= 100;
      }
      return true;
    }),
  startDate: yup
    .date()
    .required('Ngày bắt đầu là bắt buộc'),
  endDate: yup
    .date()
    .required('Ngày kết thúc là bắt buộc')
    .min(yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
  description: yup
    .string()
    .optional()
    .max(1000, 'Mô tả không được vượt quá 1000 ký tự'),
  status: yup
    .mixed<EStatusEnumString>()
    .required('Trạng thái là bắt buộc'),
  productDetailIds: yup
    .array()
    .of(yup.number().required())
    .optional()
    .default([]),
});

export function usePromotionFormProvider(id?: number, isViewMode?: boolean) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const { data: promotion, isFetching, error } = useFetchPromotionByIdQuery(id!, { skip: !id });
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

  const [addPromotion, { isLoading: isAddLoading }] = useAddPromotionMutation();
  const [updatePromotion, { isLoading: isUpdateLoading }] = useUpdatePromotionMutation();

  const methods = useForm<TPromotionFormField>({
    resolver: yupResolver(promotionSchema),
    defaultValues: {
      name: '',
      title: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      startDate: new Date(),
      endDate: new Date(),
      description: '',
      status: EStatusEnumString.ACTIVE,
      productDetailIds: [],
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (id && promotion) {
      const currentValues = methods.getValues();
      const hasFormData = currentValues.name || currentValues.title;

      if (!hasFormData) {
        const productDetailIds = promotion.productDetails?.map(pd => pd.id) || [];
        methods.reset({
          name: promotion.name,
          title: promotion.title,
          code: promotion.code || '',
          discountType: promotion.discountType,
          discountValue: promotion.discountValue,
          startDate: new Date(promotion.startDate),
          endDate: new Date(promotion.endDate),
          description: promotion.description || '',
          status: promotion.status,
          productDetailIds: productDetailIds,
        });
      }
    }
  }, [promotion, id, methods]);

  const isLoading = isAddLoading || isUpdateLoading || (id ? isFetching : false);

  const handleConfirmSubmit = async (data: TPromotionFormField) => {
    setConfirmModalConfig(prev => ({ ...prev, isLoading: true }));

    try {
      const submitData = {
        name: data.name,
        title: data.title,
        code: data.code || undefined,
        discountType: data.discountType,
        discountValue: data.discountValue,
        startDate: formatLocalDateTime(data.startDate as Date),
        endDate: formatLocalDateTime(data.endDate as Date),
        description: data.description || undefined,
        productDetailIds: data.productDetailIds && data.productDetailIds.length > 0 ? data.productDetailIds : undefined,
      };

      if (id) {
        await updatePromotion({ id, ...submitData, status: data.status }).unwrap();
        toast.success('Đã cập nhật thành công chương trình khuyến mãi');
        router.push(getRouteWithRole(routerApp.promotion.list));
      } else {
        await addPromotion(submitData).unwrap();
        toast.success('Đã thêm thành công chương trình khuyến mãi');
        router.push(getRouteWithRole(routerApp.promotion.list));
      }
      setIsConfirmModalOpen(false);
    } catch (error: any) {
      const generalError = getErrors(error, methods.setError, promotionSchema);

      if (error.data?.message && typeof error.data.message === 'string') {
        toast.error(error.data.message);
      } else if (generalError) {
        toast.error(generalError);
      } else {
        toast.error('Có lỗi xảy ra khi xử lý yêu cầu');
      }

      setIsConfirmModalOpen(false);
    } finally {
      setConfirmModalConfig(prev => ({ ...prev, isLoading: false }));
    }
  };

  const onSubmit: SubmitHandler<TPromotionFormField> = async (data) => {
    const actionText = id ? 'cập nhật' : 'thêm mới';
    setConfirmModalConfig({
      title: `Xác nhận ${actionText} chương trình khuyến mãi`,
      message: `Bạn có chắc chắn muốn ${actionText} chương trình khuyến mãi "${data.name}" không?`,
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
    isViewMode: isViewMode || false,
    isEditMode: !!id && !isViewMode,
    currentPromotionId: id,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    confirmModalConfig,
    handleConfirmSubmit,
  };
}

export function usePromotionFormContext() {
  return useContext(PromotionFormContext);
}

