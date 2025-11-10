'use client';

import FormAction from '@/common/components/FormAction/FormAction';
import { EStatusEnumString } from '@/common/enums/status';
import { getStatusEnumStringWithAll } from '@/common/utils/statusOption';
import { UIFormControl, UISingleSelect, UITextField } from '@/core/ui';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import { useVoucherFormContext } from '@/modules/Voucher/VoucherForm/components/useVoucherFormControl';
import { routerApp } from '@/router';
import { Controller } from 'react-hook-form';

const CodeInput = () => {
  const { control, formState: { errors }, isViewMode, isEditMode } = useVoucherFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Mã voucher</UIFormControl.Label>
      <Controller
        control={control}
        name="code"
        render={({ field }) => (
          <UITextField
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.code}
            placeholder="Nhập mã voucher"
            disabled={isViewMode || isEditMode}
          />
        )}
      />
      {errors.code && (
        <UIFormControl.ErrorMessage>{errors.code.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const DescriptionInput = () => {
  const { control, formState: { errors }, isViewMode } = useVoucherFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label>Mô tả</UIFormControl.Label>
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <UITextField
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.description}
            placeholder="Nhập mô tả voucher"
            disabled={isViewMode}
          />
        )}
      />
      {errors.description && (
        <UIFormControl.ErrorMessage>{errors.description.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const QuantityInput = () => {
  const { control, formState: { errors }, isViewMode } = useVoucherFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Số lượng</UIFormControl.Label>
      <Controller
        control={control}
        name="quantity"
        render={({ field }) => (
          <UITextField
            type="number"
            value={field.value?.toString() || ''}
            onChange={(e) => field.onChange(Number(e.target.value))}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.quantity}
            placeholder="Nhập số lượng"
            disabled={isViewMode}
          />
        )}
      />
      {errors.quantity && (
        <UIFormControl.ErrorMessage>{errors.quantity.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const DiscountTypeInput = () => {
  const { control, formState: { errors }, isViewMode } = useVoucherFormContext();

  const discountTypeOptions = [
    { label: 'Phần trăm', value: 'percentage' },
    { label: 'Số tiền cố định', value: 'fixed_amount' }
  ];

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Loại giảm giá</UIFormControl.Label>
      <Controller
        control={control}
        name="discountType"
        render={({ field: { onChange, value } }) => {
          const selectedOption = discountTypeOptions.find(option => option.value === value);

          return (
            <UISingleSelect
              options={discountTypeOptions}
              onChange={(selected) => onChange(selected?.value)}
              selected={selectedOption}
              bindLabel="label"
              bindValue="value"
              size={ESize.L}
              className="rounded-[10px] border-1 border-[#CCCCCC]"
              disabled={isViewMode}
              renderOption={(props) => <UISingleSelect.Option {...props} />}
              renderSelected={(props) => <UISingleSelect.Selected {...props} />}
            />
          );
        }}
      />
      {errors.discountType && (
        <UIFormControl.ErrorMessage>{errors.discountType.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const DiscountValueInput = () => {
  const { control, formState: { errors }, watch, isViewMode, setValue } = useVoucherFormContext();
  const discountType = watch('discountType');

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Giá trị giảm giá</UIFormControl.Label>
      <Controller
        control={control}
        name="discountValue"
        render={({ field }) => (
          <UITextField
            type="number"
            value={field.value?.toString() || ''}
            onChange={(e) => {
              const value = Number(e.target.value);
              field.onChange(value);
              if (discountType === 'fixed_amount') {
                setValue('maxDiscount', value);
              }
            }}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.discountValue}
            placeholder={discountType === 'percentage' ? 'Nhập % giảm giá' : 'Nhập số tiền giảm'}
            disabled={isViewMode}
          />
        )}
      />
      {errors.discountValue && (
        <UIFormControl.ErrorMessage>{errors.discountValue.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const MinOrderValueInput = () => {
  const { control, formState: { errors }, isViewMode } = useVoucherFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Giá trị đơn hàng tối thiểu</UIFormControl.Label>
      <Controller
        control={control}
        name="minOrderValue"
        render={({ field }) => (
          <UITextField
            type="number"
            value={field.value?.toString() || ''}
            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.minOrderValue}
            placeholder="Nhập giá trị tối thiểu"
            disabled={isViewMode}
          />
        )}
      />
      {errors.minOrderValue && (
        <UIFormControl.ErrorMessage>{errors.minOrderValue.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const MaxDiscountInput = () => {
  const { control, formState: { errors }, watch, isViewMode } = useVoucherFormContext();
  const discountType = watch('discountType');

  if (discountType === 'fixed_amount') {
    return null;
  }

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Giá trị giảm giá tối đa</UIFormControl.Label>
      <Controller
        control={control}
        name="maxDiscount"
        render={({ field }) => (
          <UITextField
            type="number"
            value={field.value?.toString() || ''}
            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.maxDiscount}
            placeholder="Nhập Giá trị giảm giá tối đa"
            disabled={isViewMode}
          />
        )}
      />
      {errors.maxDiscount && (
        <UIFormControl.ErrorMessage>{errors.maxDiscount.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const StartDateInput = () => {
  const { control, formState: { errors }, watch, isViewMode, isEditMode } = useVoucherFormContext();
  const status = watch('status');

  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Ngày bắt đầu</UIFormControl.Label>
      <Controller
        control={control}
        name="startDate"
        render={({ field }) => (
          <input
            type="datetime-local"
            value={formatDateForInput(field.value)}
            onChange={(e) => {
              if (e.target.value) {
                field.onChange(new Date(e.target.value));
              }
            }}
            onBlur={field.onBlur}
            disabled={isViewMode || (isEditMode && status !== EStatusEnumString.PENDING_START)}
            min={formatDateForInput(new Date())}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        )}
      />
      {errors.startDate && (
        <UIFormControl.ErrorMessage>{errors.startDate.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const EndDateInput = () => {
  const { control, formState: { errors }, watch, isViewMode } = useVoucherFormContext();
  const startDate = watch('startDate');

  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Ngày kết thúc</UIFormControl.Label>
      <Controller
        control={control}
        name="endDate"
        render={({ field }) => (
          <input
            type="datetime-local"
            value={formatDateForInput(field.value)}
            onChange={(e) => {
              if (e.target.value) {
                field.onChange(new Date(e.target.value));
              }
            }}
            onBlur={field.onBlur}
            disabled={isViewMode}
            min={startDate ? formatDateForInput(startDate) : undefined}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        )}
      />
      {errors.endDate && (
        <UIFormControl.ErrorMessage>{errors.endDate.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const IsPublicInput = () => {
  const { control, formState: { errors }, isViewMode } = useVoucherFormContext();

  const publicOptions = [
    { label: 'Công khai', value: true },
    { label: 'Riêng tư', value: false }
  ];

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Trạng thái công khai</UIFormControl.Label>
      <Controller
        control={control}
        name="isPublic"
        render={({ field: { onChange, value } }) => {
          const selectedOption = publicOptions.find(option => option.value === value);

          return (
            <UISingleSelect
              options={publicOptions}
              onChange={(selected) => onChange(selected?.value)}
              selected={selectedOption}
              bindLabel="label"
              bindValue="value"
              size={ESize.L}
              className="rounded-[10px] border-1 border-[#CCCCCC]"
              disabled={isViewMode}
              renderOption={(props) => <UISingleSelect.Option {...props} />}
              renderSelected={(props) => <UISingleSelect.Selected {...props} />}
            />
          );
        }}
      />
      {errors.isPublic && (
        <UIFormControl.ErrorMessage>{errors.isPublic.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const StatusInput = () => {
  const { control, formState: { errors }, isViewMode } = useVoucherFormContext();
  const statusOptions = getStatusEnumStringWithAll();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Trạng thái</UIFormControl.Label>
      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value } }) => {
          const selectedOption = statusOptions.find(option => option.value === value);

          return (
            <UISingleSelect
              options={statusOptions}
              onChange={(selected) => onChange(selected?.value)}
              selected={selectedOption}
              bindLabel="label"
              bindValue="value"
              size={ESize.L}
              className="rounded-[10px] border-1 border-[#CCCCCC]"
              disabled={isViewMode}
              renderOption={(props) => <UISingleSelect.Option {...props} />}
              renderSelected={(props) => <UISingleSelect.Selected {...props} />}
            />
          );
        }}
      />
      {errors.status && (
        <UIFormControl.ErrorMessage>{errors.status.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const Button = () => {
  const { isLoading, handleSubmit, onSubmit, router, getRouteWithRole, isViewMode, watch } = useVoucherFormContext();
  const status = watch('status');

  if (isViewMode) {
    const currentPath = window.location.pathname;
    const voucherId = currentPath.split('/').pop();

    return (
      <div className="flex gap-3">
        <button
          onClick={() => router.push(getRouteWithRole(routerApp.voucher.list))}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <FormAction
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      onCancel={() => router.push(getRouteWithRole(routerApp.voucher.list))}
    />
  );
};

const VoucherFormControl = {
  CodeInput,
  DescriptionInput,
  QuantityInput,
  DiscountTypeInput,
  DiscountValueInput,
  MinOrderValueInput,
  MaxDiscountInput,
  StartDateInput,
  EndDateInput,
  IsPublicInput,
  StatusInput,
  Button,
};

export { VoucherFormControl };

