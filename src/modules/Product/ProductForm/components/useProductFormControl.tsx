'use client';

import { EStatusEnumString } from '@/common/enums';
import { useAppNavigation } from '@/common/hooks';
import { getErrors } from '@/common/utils/handleForm';
import {
  useAddProductMutation,
  useFetchProductByIdQuery,
  useUpdateProductMutation
} from '@/lib/services/modules/productService';
import { TProductFormField } from '@/modules/Product/ProductForm/components/ProductForm.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { notFound, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

export type ProductFormContextData = ReturnType<typeof useProductFormProvider>;

export const ProductFormContext = createContext({} as ProductFormContextData);

const productSchema: yup.ObjectSchema<TProductFormField> = yup.object({
  name: yup.string().required('Tên sản phẩm là bắt buộc').max(255, 'Tên sản phẩm không được vượt quá 255 ký tự'),
  description: yup.string().optional(),
  weight: yup.number().optional().min(0, 'Trọng lượng phải lớn hơn hoặc bằng 0'),
  dimensions: yup.string().optional(),
  brandId: yup.number().required('Thương hiệu là bắt buộc'),
  categoryId: yup.number().required('Danh mục là bắt buộc'),
  materialId: yup.number().optional(),
  strapTypeId: yup.number().optional(),
  status: yup.mixed<EStatusEnumString>().required('Trạng thái là bắt buộc'),
  tagIds: yup.array().of(yup.number().required()).optional(),
  featureIds: yup.array().of(yup.number().required()).optional(),
});

export function useProductFormProvider(id?: number) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();

  const { data: product, isFetching: isProductFetching, error } = useFetchProductByIdQuery(id!, { skip: !id });
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

  const [addProduct, { isLoading: isAddLoading }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdateLoading }] = useUpdateProductMutation();

  const methods = useForm<TProductFormField>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      weight: 0,
      dimensions: '',
      brandId: 0,
      categoryId: 0,
      materialId: undefined,
      strapTypeId: undefined,
      status: EStatusEnumString.ACTIVE,
      tagIds: [],
      featureIds: [],
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (id && product) {
      const tagIds = product.tags?.map(t => t.id) || [];
      const featureIds = product.features?.map(f => f.id) || [];

      const brandId = product.brand?.id || 0;
      const categoryId = product.category?.id || 0;
      const materialId = product.material?.id || undefined;
      const strapTypeId = product.strapType?.id || undefined;

      methods.reset({
        name: product.name,
        description: product.description || '',
        weight: product.weight || 0,
        dimensions: product.dimensions || '',
        brandId: brandId,
        categoryId: categoryId,
        materialId: materialId,
        strapTypeId: strapTypeId,
        status: product.status,
        tagIds: tagIds,
        featureIds: featureIds,
      });
    }
  }, [product, id, methods]);

  const isLoading = isAddLoading || isUpdateLoading || (id ? isProductFetching : false);

  const handleConfirmSubmit = async (data: TProductFormField) => {
    setConfirmModalConfig(prev => ({ ...prev, isLoading: true }));

    try {
      const productData = {
        name: data.name,
        description: data.description,
        weight: data.weight,
        dimensions: data.dimensions,
        brandId: data.brandId,
        categoryId: data.categoryId,
        materialId: data.materialId || undefined,
        strapTypeId: data.strapTypeId || undefined,
        status: data.status,
        tagIds: data.tagIds || [],
        featureIds: data.featureIds || [],
      };

      if (id) {
        await updateProduct({ id, ...productData }).unwrap();
      } else {
        await addProduct(productData).unwrap();
      }

      toast.success(id ? 'Đã cập nhật thành công sản phẩm' : 'Đã thêm thành công sản phẩm');
      router.push(getRouteWithRole('/products'));
      setIsConfirmModalOpen(false);
    } catch (error: any) {
      console.error('Submit error:', error);
      const generalError = getErrors(error, methods.setError, productSchema);
      if (generalError) {
        toast.error(generalError);
      }
      setIsConfirmModalOpen(false);
    } finally {
      setConfirmModalConfig(prev => ({ ...prev, isLoading: false }));
    }
  };

  const onSubmit: SubmitHandler<TProductFormField> = async (data) => {
    const actionText = id ? 'cập nhật' : 'thêm mới';
    setConfirmModalConfig({
      title: `Xác nhận ${actionText} sản phẩm`,
      message: `Bạn có chắc chắn muốn ${actionText} sản phẩm "${data.name}" không?`,
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

export function useProductFormContext() {
  return useContext(ProductFormContext);
}

