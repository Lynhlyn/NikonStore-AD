'use client';

import { EStatusEnumString } from '@/common/enums';
import { useAppNavigation } from '@/common/hooks';
import { getErrors } from '@/common/utils/handleForm';
import {
  useAddProductMutation,
  useFetchProductByIdQuery,
  useUpdateProductMutation
} from '@/lib/services/modules/productService';
import {
  useFetchProductTagsByProductIdQuery,
  useUpdateProductTagsMutation
} from '@/lib/services/modules/productTagService';
import {
  useFetchProductFeaturesByProductIdQuery,
  useUpdateProductFeaturesMutation
} from '@/lib/services/modules/productFeatureService';
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
  const { data: productTags, isFetching: isTagsFetching } = useFetchProductTagsByProductIdQuery(id!, { skip: !id });
  const { data: productFeatures, isFetching: isFeaturesFetching } = useFetchProductFeaturesByProductIdQuery(id!, { skip: !id });
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
  const [updateProductTags] = useUpdateProductTagsMutation();
  const [updateProductFeatures] = useUpdateProductFeaturesMutation();

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
      const tagIds = productTags?.map(pt => pt.tagId) || [];
      const featureIds = productFeatures?.map(pf => pf.featureId) || [];

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
  }, [product, productTags, productFeatures, id, methods]);

  const isLoading = isAddLoading || isUpdateLoading || (id ? (isProductFetching || isTagsFetching || isFeaturesFetching) : false);

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
      };

      let productId: number;

      if (id) {
        const updatedProduct = await updateProduct({ id, ...productData }).unwrap();
        productId = updatedProduct.id;
      } else {
        const newProduct = await addProduct(productData).unwrap();
        productId = newProduct.id;
      }

      try {
        if (data.tagIds && data.tagIds.length > 0) {
          await updateProductTags({
            productId: productId,
            tagIds: data.tagIds,
          }).unwrap();
        } else if (id) {
          await updateProductTags({
            productId: productId,
            tagIds: [],
          }).unwrap();
        }

        if (data.featureIds && data.featureIds.length > 0) {
          await updateProductFeatures({
            productId: productId,
            featureIds: data.featureIds,
          }).unwrap();
        } else if (id) {
          await updateProductFeatures({
            productId: productId,
            featureIds: [],
          }).unwrap();
        }
      } catch (relationError) {
        console.error('Error updating product relations:', relationError);
        toast.warning('Sản phẩm đã được tạo/cập nhật nhưng có lỗi khi cập nhật tags/features');
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
    product,
  };
}

export function useProductFormContext() {
  return useContext(ProductFormContext);
}

