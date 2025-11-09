'use client';

import { ConfirmModal } from '@/common/components/ConfirmModal';
import { EStatusEnumString } from '@/common/enums/status';
import { getStatusEnumString } from '@/common/utils/statusOption';
import { UIFormControl, UISingleSelect, UITextField } from '@/core/ui';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import { UISelectSearch } from '@/core/ui/UISelectSearch';
import { useAddCapacityMutation, useFetchCapacitiesQuery } from '@/lib/services/modules/capacityService';
import { useAddColorMutation, useFetchColorsQuery } from '@/lib/services/modules/colorService';
import { useProductDetailFormContext } from '@/modules/ProductDetail/ProductDetailForm/components/useProductDetailFormControl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounce } from '@/common/hooks';

const formatCurrency = (value: string): string => {
  const numericValue = value.replace(/\D/g, '');
  if (!numericValue) return '';
  return new Intl.NumberFormat('vi-VN').format(parseInt(numericValue));
};

const getNumericValue = (formattedValue: string): number => {
  const numericValue = formattedValue.replace(/\D/g, '');
  return numericValue ? parseInt(numericValue, 10) : 0;
};

const formatNumberDisplay = (value: number): string => {
  if (!value) return '';
  return new Intl.NumberFormat('vi-VN').format(value);
};

const SkuInput = () => {
  const { control, formState: { errors } } = useProductDetailFormContext();

  const formatSku = (value: string) => {
    const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '');
    if (cleanValue.length <= 4) {
      return cleanValue;
    } else if (cleanValue.length <= 7) {
      return `${cleanValue.slice(0, 4)}-${cleanValue.slice(4)}`;
    } else {
      return `${cleanValue.slice(0, 4)}-${cleanValue.slice(4, 7)}-${cleanValue.slice(7, 10)}`;
    }
  };

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>SKU</UIFormControl.Label>
      <Controller
        control={control}
        name="sku"
        render={({ field }) => (
          <UITextField
            value={field.value || ''}
            onChange={(e) => {
              const formattedValue = formatSku(e.target.value);
              field.onChange(formattedValue);
            }}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.sku}
            placeholder="Nhập mã SKU (ví dụ: ABCD-123-456)"
            maxLength={12}
          />
        )}
      />
      {errors.sku && (
        <UIFormControl.ErrorMessage>{errors.sku.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const StockInput = () => {
  const { control, formState: { errors } } = useProductDetailFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Số lượng tồn kho</UIFormControl.Label>
      <Controller
        control={control}
        name="stock"
        render={({ field }) => (
          <UITextField
            type="number"
            value={field.value === 0 ? '0' : field.value || ''}
            onChange={(e) => {
              const value = e.target.value;
              const numericValue = value === '' ? 0 : Number(value);
              field.onChange(numericValue);
            }}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.stock}
            placeholder="Nhập số lượng tồn kho"
            min={0}
          />
        )}
      />
      {errors.stock && (
        <UIFormControl.ErrorMessage>{errors.stock.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const PriceInput = () => {
  const { control, formState: { errors } } = useProductDetailFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Giá (VND)</UIFormControl.Label>
      <Controller
        control={control}
        name="price"
        render={({ field }) => (
          <UITextField
            type="text"
            value={field.value ? formatNumberDisplay(field.value) : ''}
            onChange={(e) => {
              const formattedValue = formatCurrency(e.target.value);
              const numericValue = getNumericValue(formattedValue);
              field.onChange(numericValue);
            }}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.price}
            placeholder="Nhập giá sản phẩm"
          />
        )}
      />
      {errors.price && (
        <UIFormControl.ErrorMessage>{errors.price.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const ColorInput = () => {
  const { control, formState: { errors }, setValue, getValues } = useProductDetailFormContext();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data: colorsData, isFetching, refetch } = useFetchColorsQuery({
    page: 0,
    size: 100,
    isAll: true,
    keyword: debouncedSearchQuery || undefined,
  });

  const [addColor] = useAddColorMutation();

  const colorOptions = colorsData?.data?.map(color => ({
    value: color.id,
    label: color.name,
  })) || [];

  const handleCreateColor = async (colorName: string) => {
    try {
      const hexCode = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

      const newColor = await addColor({
        name: colorName,
        hexCode,
        status: EStatusEnumString.ACTIVE
      }).unwrap();
      toast.success('Đã thêm thành công màu sắc');
      await refetch();
      const currentValue = getValues('colorId');
      if (!currentValue) {
        setValue('colorId', newColor.id, { shouldValidate: true });
      }
    } catch (error: any) {
      toast.error('Đã xảy ra lỗi khi thêm màu sắc: ' + error.message);
    }
  };

  return (
    <UIFormControl>
      <UIFormControl.Label>Màu sắc</UIFormControl.Label>
      <Controller
        control={control}
        name="colorId"
        render={({ field: { onChange, value } }) => {
          const selectedOption = colorOptions.find(option => option.value === value);

          return (
            <UISelectSearch
              options={colorOptions}
              value={selectedOption || null}
              size={ESize.L}
              onChange={(selected) => {
                if (Array.isArray(selected)) {
                  onChange(selected[0]?.value || null);
                } else {
                  onChange(selected?.value || null);
                }
              }}
              onSearch={setSearchQuery}
              onCreateNew={handleCreateColor}
              placeholder="Chọn màu sắc"
              searchable={true}
              loading={isFetching}
              noDataText="Không tìm thấy màu sắc"
              showCreateButton={true}
              createButtonText="Thêm màu sắc"
              className="rounded-md border border-gray-300"
            />
          );
        }}
      />
      {errors.colorId && (
        <UIFormControl.ErrorMessage>{errors.colorId.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const CapacityInput = () => {
  const { control, formState: { errors }, setValue, getValues } = useProductDetailFormContext();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data: capacitiesData, isFetching, refetch } = useFetchCapacitiesQuery({
    page: 0,
    size: 100,
    isAll: true,
    keyword: debouncedSearchQuery || undefined,
  });

  const [addCapacity] = useAddCapacityMutation();

  const capacityOptions = capacitiesData?.data?.map(capacity => ({
    value: capacity.id,
    label: capacity.name,
  })) || [];

  const handleCreateCapacity = async (capacityName: string) => {
    try {
      const newCapacity = await addCapacity({
        name: capacityName,
        status: EStatusEnumString.ACTIVE
      }).unwrap();
      toast.success('Đã thêm thành công dung tích');
      await refetch();
      const currentValue = getValues('capacityId');
      if (!currentValue) {
        setValue('capacityId', newCapacity.id, { shouldValidate: true });
      }
    } catch (error: any) {
      toast.error('Đã xảy ra lỗi khi thêm dung tích: ' + error.message);
    }
  };

  return (
    <UIFormControl>
      <UIFormControl.Label>Dung tích</UIFormControl.Label>
      <Controller
        control={control}
        name="capacityId"
        render={({ field: { onChange, value } }) => {
          const selectedOption = capacityOptions.find(option => option.value === value);

          return (
            <UISelectSearch
              options={capacityOptions}
              value={selectedOption || null}
              size={ESize.L}
              onChange={(selected) => {
                if (Array.isArray(selected)) {
                  onChange(selected[0]?.value || null);
                } else {
                  onChange(selected?.value || null);
                }
              }}
              onSearch={setSearchQuery}
              onCreateNew={handleCreateCapacity}
              placeholder="Chọn dung tích"
              searchable={true}
              loading={isFetching}
              noDataText="Không tìm thấy dung tích"
              showCreateButton={true}
              createButtonText="Thêm dung tích"
              className="rounded-md border border-gray-300"
            />
          );
        }}
      />
      {errors.capacityId && (
        <UIFormControl.ErrorMessage>{errors.capacityId.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const StatusInput = () => {
  const { control, formState: { errors } } = useProductDetailFormContext();
  const statusOptions = getStatusEnumString();

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
              className="rounded-md border border-gray-300"
              placeholder="Chọn trạng thái"
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
  const { isLoading, handleSubmit, onSubmit, router, getRouteWithRole, productId } = useProductDetailFormContext();
  
  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={handleSubmit(onSubmit)}
        disabled={isLoading}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Đang xử lý...' : 'Lưu'}
      </button>
      <button
        type="button"
        onClick={() => router.push(getRouteWithRole(`/products/${productId}/product-details`))}
        disabled={isLoading}
        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Hủy
      </button>
    </div>
  );
};

const ProductDetailFormControl = {
  SkuInput,
  StockInput,
  PriceInput,
  ColorInput,
  CapacityInput,
  StatusInput,
  Button,
};

export { ProductDetailFormControl };

