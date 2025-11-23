'use client';

import FormAction from '@/common/components/FormAction/FormAction';
import { ProductDetailSelector } from '@/common/components/ProductDetailSelector';
import { EStatusEnumString } from '@/common/enums/status';
import { getStatusEnumStringWithAll } from '@/common/utils/statusOption';
import { UIFormControl, UISingleSelect, UITextField, UITextArea } from '@/core/ui';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import { usePromotionFormContext } from '@/modules/Promotion/PromotionForm/components/usePromotionFormControl';
import { routerApp } from '@/router';
import { Controller } from 'react-hook-form';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/core/shadcn/components/ui/dialog';
import { Button as UIButton } from '@/core/shadcn/components/ui/button';

const NameInput = () => {
  const { control, formState: { errors }, isViewMode } = usePromotionFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Tên chương trình</UIFormControl.Label>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <UITextField
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.name}
            placeholder="Nhập tên chương trình khuyến mãi"
            disabled={isViewMode}
          />
        )}
      />
      {errors.name && (
        <UIFormControl.ErrorMessage>{errors.name.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const TitleInput = () => {
  const { control, formState: { errors }, isViewMode } = usePromotionFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Tiêu đề</UIFormControl.Label>
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <UITextField
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.title}
            placeholder="Nhập tiêu đề chương trình"
            disabled={isViewMode}
          />
        )}
      />
      {errors.title && (
        <UIFormControl.ErrorMessage>{errors.title.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const CodeInput = () => {
  const { control, formState: { errors }, isViewMode } = usePromotionFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label>Mã khuyến mãi</UIFormControl.Label>
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
            placeholder="Nhập mã khuyến mãi (tùy chọn)"
            disabled={isViewMode}
          />
        )}
      />
      {errors.code && (
        <UIFormControl.ErrorMessage>{errors.code.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const DiscountTypeInput = () => {
  const { control, formState: { errors }, isViewMode } = usePromotionFormContext();

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
              className="rounded-lg border border-gray-300"
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
  const { control, formState: { errors }, watch, isViewMode } = usePromotionFormContext();
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
            onChange={(e) => field.onChange(Number(e.target.value))}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.discountValue}
            placeholder={discountType === 'percentage' ? 'Nhập % giảm giá (1-100)' : 'Nhập số tiền giảm'}
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

const StartDateInput = () => {
  const { control, formState: { errors }, isViewMode } = usePromotionFormContext();

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
            disabled={isViewMode}
            min={formatDateForInput(new Date())}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
  const { control, formState: { errors }, watch, isViewMode } = usePromotionFormContext();
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
            min={startDate ? formatDateForInput(startDate) : formatDateForInput(new Date())}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        )}
      />
      {errors.endDate && (
        <UIFormControl.ErrorMessage>{errors.endDate.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const DescriptionInput = () => {
  const { control, formState: { errors }, isViewMode } = usePromotionFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label>Mô tả</UIFormControl.Label>
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <UITextArea
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.description}
            placeholder="Nhập mô tả chương trình khuyến mãi"
            disabled={isViewMode}
            rows={4}
          />
        )}
      />
      {errors.description && (
        <UIFormControl.ErrorMessage>{errors.description.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const StatusInput = () => {
  const { control, formState: { errors }, isViewMode } = usePromotionFormContext();
  const statusOptions = getStatusEnumStringWithAll();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Trạng thái</UIFormControl.Label>
      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value } }) => {
          const selectedOption = statusOptions.find((option) => option.value === value);

          return (
            <UISingleSelect
              options={statusOptions}
              onChange={(selected) => onChange(selected?.value)}
              selected={selectedOption}
              bindLabel="label"
              bindValue="value"
              size={ESize.L}
              className="rounded-lg border border-gray-300"
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

const ProductSelectionInput = () => {
  const {
    setValue,
    watch,
    formState: { errors },
    currentPromotionId,
    isViewMode,
  } = usePromotionFormContext();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const selectedProductDetailIds = watch("productDetailIds") || [];

  const handleProductDetailSelectChange = (productDetailIds: number[]) => {
    setValue("productDetailIds", productDetailIds, { shouldValidate: true });
  };

  if (isViewMode) {
    return (
      <div className="space-y-4">
        <UIFormControl>
          <UIFormControl.Label>Sản phẩm chi tiết áp dụng khuyến mãi</UIFormControl.Label>
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-600">
              {selectedProductDetailIds.length > 0
                ? `Đã áp dụng cho ${selectedProductDetailIds.length} sản phẩm chi tiết`
                : "Chưa áp dụng cho sản phẩm nào"}
            </p>
          </div>
        </UIFormControl>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UIFormControl>
        <UIFormControl.Label isRequired>Sản phẩm chi tiết áp dụng khuyến mãi</UIFormControl.Label>
        <div className="space-y-3">
          <div className="flex items-center justify-between border rounded-lg border-gray-200 p-4 bg-gray-50">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">
                Đã chọn: <span className="text-indigo-600">{selectedProductDetailIds.length}</span> sản phẩm chi tiết
              </p>
              {selectedProductDetailIds.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">Chưa có sản phẩm nào được chọn</p>
              )}
            </div>
            <UIButton
              type="button"
              onClick={() => setIsDialogOpen(true)}
              variant="outline"
              className="ml-4"
            >
              {selectedProductDetailIds.length > 0 ? 'Chỉnh sửa' : 'Chọn sản phẩm'}
            </UIButton>
          </div>
          {errors.productDetailIds && (
            <UIFormControl.ErrorMessage>
              {errors.productDetailIds.message}
            </UIFormControl.ErrorMessage>
          )}
        </div>
      </UIFormControl>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Chọn sản phẩm chi tiết áp dụng khuyến mãi</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <ProductDetailSelector
              selectedIds={selectedProductDetailIds}
              onSelectChange={handleProductDetailSelectChange}
              currentPromotionId={currentPromotionId}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Button = () => {
  const { isLoading, handleSubmit, onSubmit, router, getRouteWithRole } = usePromotionFormContext();

  return (
    <FormAction
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      onCancel={() => router.push(getRouteWithRole(routerApp.promotion.list))}
    />
  );
};

const PromotionFormControl = {
  NameInput,
  TitleInput,
  CodeInput,
  DiscountTypeInput,
  DiscountValueInput,
  StartDateInput,
  EndDateInput,
  DescriptionInput,
  StatusInput,
  ProductSelectionInput,
  Button,
};

export { PromotionFormControl };

