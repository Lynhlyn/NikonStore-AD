'use client';

import { EStatusEnumString } from '@/common/enums/status';
import { useAppNavigation } from '@/common/hooks';
import { formatLocalDateTime } from '@/common/utils/formatDateToVN';
import { getErrors } from '@/common/utils/handleForm';
import { useAddVoucherMutation, useFetchVoucherByIdQuery, useUpdateVoucherMutation } from '@/lib/services/modules/voucherService';
import { TVoucherFormField } from '@/modules/Voucher/VoucherForm/components/VoucherForm.type';
import { routerApp } from '@/router';
import { yupResolver } from '@hookform/resolvers/yup';
import { notFound, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

export type VoucherFormContextData = ReturnType<typeof useVoucherFormProvider>;

export const VoucherFormContext = createContext({} as VoucherFormContextData);

const voucherSchema: yup.ObjectSchema<TVoucherFormField> = yup.object({
  code: yup
    .string()
    .required('Mã voucher là bắt buộc')
    .max(50, 'Mã voucher không được vượt quá 50 ký tự'),
  description: yup
    .string()
    .optional()
    .max(500, 'Mô tả không được vượt quá 500 ký tự'),
  quantity: yup
    .number()
    .required('Số lượng là bắt buộc')
    .min(1, 'Số lượng phải lớn hơn 0'),
  discountType: yup
    .mixed<'percentage' | 'fixed_amount'>()
    .required('Loại giảm giá là bắt buộc'),
  discountValue: yup
    .number()
    .required('Giá trị giảm giá là bắt buộc')
    .min(0, 'Giá trị giảm giá phải lớn hơn hoặc bằng 0')
    .test('discount-value-validation', 'Giá trị giảm giá không hợp lệ', function (value) {
      const { discountType } = this.parent;
      if (discountType === 'percentage') {
        return value <= 100;
      }
      return true;
    }),
  minOrderValue: yup
    .number()
    .required('Giá trị đơn hàng tối thiểu là bắt buộc')
    .min(0, 'Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0'),
  maxDiscount: yup
    .number()
    .required('Giá trị giảm giá tối đa là bắt buộc')
    .min(0, 'Giá trị giảm giá tối đa phải lớn hơn hoặc bằng 0'),
  startDate: yup
    .date()
    .required('Ngày bắt đầu là bắt buộc'),
  endDate: yup
    .date()
    .required('Ngày kết thúc là bắt buộc')
    .min(yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
  isPublic: yup
    .boolean()
    .required('Trạng thái công khai là bắt buộc'),
  status: yup
    .mixed<EStatusEnumString>()
    .required('Trạng thái là bắt buộc'),
});

export function useVoucherFormProvider(id?: number, isViewMode?: boolean) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const { data: voucher, isFetching, error } = useFetchVoucherByIdQuery(id!, { skip: !id });
  const [isPrivateVoucher, setIsPrivateVoucher] = useState(false);
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

  const [addVoucher, { isLoading: isAddLoading }] = useAddVoucherMutation();
  const [updateVoucher, { isLoading: isUpdateLoading }] = useUpdateVoucherMutation();

  const methods = useForm<TVoucherFormField>({
    resolver: yupResolver(voucherSchema),
    defaultValues: {
      code: '',
      description: '',
      quantity: 1,
      discountType: 'percentage',
      discountValue: 0,
      minOrderValue: undefined,
      maxDiscount: undefined,
      startDate: new Date(),
      endDate: new Date(),
      isPublic: true,
      status: EStatusEnumString.ACTIVE,
    },
    mode: 'onTouched',
  });

  const watchedIsPublic = methods.watch('isPublic');

  useEffect(() => {
    if (!id || !voucher) {
      setIsPrivateVoucher(watchedIsPublic === false);
    }
  }, [watchedIsPublic, id, voucher]);

  useEffect(() => {
    if (id && voucher) {
      const currentValues = methods.getValues();
      const hasFormData = currentValues.code || currentValues.description || currentValues.quantity > 1;

      if (!hasFormData) {
        methods.reset({
          code: voucher.code,
          description: voucher.description || '',
          quantity: voucher.quantity,
          discountType: voucher.discountType,
          discountValue: voucher.discountValue,
          minOrderValue: voucher.minOrderValue,
          maxDiscount: voucher.maxDiscount,
          startDate: new Date(voucher.startDate),
          endDate: new Date(voucher.endDate),
          isPublic: voucher.isPublic,
          status: voucher.status,
        });
      }
      if (!hasFormData) {
        setIsPrivateVoucher(voucher.isPublic === false);
      }
    }
  }, [voucher, id, methods]);

  const isLoading = isAddLoading || isUpdateLoading || (id ? isFetching : false);

  const handleConfirmSubmit = async (data: TVoucherFormField) => {
    setConfirmModalConfig(prev => ({ ...prev, isLoading: true }));

    try {
      const submitData = {
        ...data,
        startDate: formatLocalDateTime(data.startDate as Date),
        endDate: formatLocalDateTime(data.endDate as Date),
      };

      if (id) {
        await updateVoucher({ id, ...submitData }).unwrap();
        toast.success('Đã cập nhật thành công voucher');
        router.push(getRouteWithRole(routerApp.voucher.list));
      } else {
        await addVoucher(submitData).unwrap();
        toast.success('Đã thêm thành công voucher');
        router.push(getRouteWithRole(routerApp.voucher.list));
      }
      setIsConfirmModalOpen(false);
    } catch (error: any) {
      const generalError = getErrors(error, methods.setError, voucherSchema);

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

  const onSubmit: SubmitHandler<TVoucherFormField> = async (data) => {
    const actionText = id ? 'cập nhật' : 'thêm mới';
    setConfirmModalConfig({
      title: `Xác nhận ${actionText} voucher`,
      message: `Bạn có chắc chắn muốn ${actionText} voucher "${data.code}" không?`,
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
    isPrivateVoucher,
    isViewMode: isViewMode || false,
    isEditMode: !!id && !isViewMode,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    confirmModalConfig,
    handleConfirmSubmit,
  };
}

export function useVoucherFormContext() {
  return useContext(VoucherFormContext);
}

