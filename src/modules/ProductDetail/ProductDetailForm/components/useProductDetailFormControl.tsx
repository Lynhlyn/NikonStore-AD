'use client';

import { EStatusEnumString } from '@/common/enums/status';
import { useAppNavigation } from '@/common/hooks';
import { getErrors } from '@/common/utils/handleForm';
import {
  useAddProductDetailMutation,
  useFetchProductDetailByIdQuery,
  useUpdateProductDetailMutation
} from '@/lib/services/modules/productDetailService';
import { TProductDetailFormField } from '@/modules/ProductDetail/ProductDetailForm/components/ProductDetailForm.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { notFound, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

export type ProductDetailFormContextData = ReturnType<typeof useProductDetailFormProvider>;

export const ProductDetailFormContext = createContext({} as ProductDetailFormContextData);

const productDetailSchema: yup.ObjectSchema<TProductDetailFormField> = yup.object({
  sku: yup
    .string()
    .required('SKU là bắt buộc')
    .matches(/^[a-zA-Z0-9]{4}-[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}$/, 'SKU phải có định dạng xxxx-xxx-xxx (chỉ gồm chữ và số, đủ 11 ký tự, có 2 dấu gạch ngang)'),
  stock: yup
    .number()
    .required('Số lượng tồn kho là bắt buộc')
    .min(0, 'Số lượng tồn kho phải lớn hơn hoặc bằng 0')
    .max(10000, 'Số lượng tồn kho không được vượt quá 10000'),
  productId: yup
    .number()
    .required('Product ID là bắt buộc')
    .positive('Product ID phải là số dương')
    .integer('Product ID phải là số nguyên'),
  colorId: yup
    .number()
    .optional()
    .nullable(),
  capacityId: yup
    .number()
    .optional()
    .nullable(),
  price: yup
    .number()
    .required('Giá là bắt buộc')
    .min(1000, 'Giá phải lớn hơn hoặc bằng 1000')
    .max(100000000, 'Giá không được vượt quá 100 triệu'),
  status: yup
    .mixed<EStatusEnumString>()
    .required('Trạng thái là bắt buộc')
    .oneOf(Object.values(EStatusEnumString), 'Trạng thái không hợp lệ'),
});

export function useProductDetailFormProvider(productId: number, id?: number) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();

  const { data: productDetail, isFetching: isProductDetailFetching, error } = useFetchProductDetailByIdQuery(id!, { skip: !id });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'warning' | 'danger' | 'info' | 'success',
    isLoading: false,
  });

  if (error) {
    router.push(getRouteWithRole('/products'));
  }

  const [addProductDetail, { isLoading: isAddLoading }] = useAddProductDetailMutation();
  const [updateProductDetail, { isLoading: isUpdateLoading }] = useUpdateProductDetailMutation();

  const methods = useForm<TProductDetailFormField>({
    resolver: yupResolver(productDetailSchema),
    defaultValues: {
      sku: '',
      stock: 0,
      productId: productId,
      colorId: undefined,
      capacityId: undefined,
      price: 0,
      status: EStatusEnumString.ACTIVE,
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (id && productDetail) {
      methods.reset({
        sku: productDetail.sku,
        stock: productDetail.stock,
        productId: productId,
        colorId: productDetail.color?.id,
        capacityId: productDetail.capacity?.id,
        price: productDetail.price,
        status: productDetail.status,
      });
    }
  }, [productDetail, id, methods, productId]);

  const isLoading = isAddLoading || isUpdateLoading || (id ? isProductDetailFetching : false);

  const handleConfirmSubmit = async (data: TProductDetailFormField) => {
    setConfirmModalConfig(prev => ({ ...prev, isLoading: true }));

    try {
      const formatSkuForSubmission = (sku: string) => {
        if (/^[a-zA-Z0-9]{4}-[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}$/.test(sku)) {
          return sku;
        }

        const cleanSku = sku.replace(/[^a-zA-Z0-9]/g, '');
        if (cleanSku.length <= 4) {
          return cleanSku;
        } else if (cleanSku.length <= 7) {
          return `${cleanSku.slice(0, 4)}-${cleanSku.slice(4)}`;
        } else {
          return `${cleanSku.slice(0, 4)}-${cleanSku.slice(4, 7)}-${cleanSku.slice(7, 10)}`;
        }
      };

      const productDetailData = {
        sku: formatSkuForSubmission(data.sku),
        stock: data.stock,
        productId: data.productId,
        colorId: data.colorId || undefined,
        capacityId: data.capacityId || undefined,
        price: data.price,
        status: data.status,
      };

      if (id) {
        await updateProductDetail({ id, ...productDetailData }).unwrap();
        toast.success('Đã cập nhật thành công chi tiết sản phẩm');
      } else {
        await addProductDetail(productDetailData).unwrap();
        toast.success('Đã thêm thành công chi tiết sản phẩm');
      }

      router.push(getRouteWithRole(`/products/${productId}/product-details`));
      setIsConfirmModalOpen(false);
    } catch (error: any) {
      console.error('Submit error:', error);
      const generalError = getErrors(error, methods.setError, productDetailSchema);
      if (generalError) {
        toast.error(generalError);
      } else {
        toast.error('Đã xảy ra lỗi không xác định');
      }
      setIsConfirmModalOpen(false);
    } finally {
      setConfirmModalConfig(prev => ({ ...prev, isLoading: false }));
    }
  };

  const onSubmit: SubmitHandler<TProductDetailFormField> = async (data) => {
    const actionText = id ? 'cập nhật' : 'thêm mới';
    setConfirmModalConfig({
      title: `Xác nhận ${actionText} chi tiết sản phẩm`,
      message: `Bạn có chắc chắn muốn ${actionText} chi tiết sản phẩm với SKU "${data.sku}" không?`,
      type: 'info',
      isLoading: false,
    });
    setIsConfirmModalOpen(true);
  };

  const getValues = () => {
    return methods.getValues();
  };

  return {
    ...methods,
    isLoading,
    onSubmit,
    router,
    getRouteWithRole,
    productId,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    confirmModalConfig,
    handleConfirmSubmit,
    getValues,
  };
}

export function useProductDetailFormContext() {
  return useContext(ProductDetailFormContext);
}

