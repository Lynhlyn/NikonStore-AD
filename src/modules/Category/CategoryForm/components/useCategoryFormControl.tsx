'use client';

import { EStatusEnumString } from '@/common/enums';
import { useAppNavigation } from '@/common/hooks';
import { getErrors } from '@/common/utils/handleForm';
import {
  useAddCategoryMutation,
  useFetchCategoriesQuery,
  useFetchCategoryByIdQuery,
  useUpdateCategoryMutation
} from '@/lib/services/modules/categoryService';
import { TCategoryFormField } from '@/modules/Category/CategoryForm/components/CategoryForm.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { notFound, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

export type CategoryFormContextData = ReturnType<typeof useCategoryFormProvider>;

export const CategoryFormContext = createContext({} as CategoryFormContextData);

const categorySchema: yup.ObjectSchema<TCategoryFormField> = yup.object({
  name: yup.string().required('Tên danh mục là bắt buộc').max(255, 'Tên danh mục không được vượt quá 255 ký tự'),
  parentId: yup.number().optional(),
  description: yup.string().optional().max(500, 'Mô tả không được vượt quá 500 ký tự'),
  status: yup.mixed<EStatusEnumString>().required('Trạng thái là bắt buộc'),
});

export function useCategoryFormProvider(id?: number) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const { data: category, isFetching, error } = useFetchCategoryByIdQuery(id!, { skip: !id });
  const { data: parentCategoriesData } = useFetchCategoriesQuery({
    isAll: true,
    status: EStatusEnumString.ACTIVE
  });
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

  const [addCategory, { isLoading: isAddLoading }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdateLoading }] = useUpdateCategoryMutation();

  const methods = useForm<TCategoryFormField>({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: '',
      parentId: undefined,
      description: '',
      status: EStatusEnumString.ACTIVE,
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (id && category) {
      methods.reset({
        name: category.name,
        parentId: category.parentId,
        description: category.description || '',
        status: category.status,
      });
    }
  }, [category, id, methods]);

  const parentCategoryOptions = useMemo(() => {
    if (!parentCategoriesData?.data) return [{ value: undefined, label: 'Không có danh mục cha' }];

    const options = [{ value: undefined, label: 'Không có danh mục cha' }];

    const filteredCategories = parentCategoriesData.data.filter(cat => {
      if (id && cat.id === id) return false;
      return true;
    });

    const categoryOptions = filteredCategories.map(cat => ({
      value: cat.id,
      label: cat.name,
    }));

    return [...options, ...categoryOptions];
  }, [parentCategoriesData, id]);

  const isLoading = isAddLoading || isUpdateLoading || (id ? isFetching : false);

  const handleConfirmSubmit = async (data: TCategoryFormField) => {
    setConfirmModalConfig(prev => ({ ...prev, isLoading: true }));

    try {
      const payload = {
        ...data,
        ...(data.parentId === undefined ? {} : { parentId: data.parentId }),
      };

      if (id) {
        await updateCategory({ id, ...payload }).unwrap();
        toast.success('Đã cập nhật thành công danh mục');
        router.push(getRouteWithRole('/categories'));
      } else {
        await addCategory(payload).unwrap();
        toast.success('Đã thêm thành công danh mục');
        router.push(getRouteWithRole('/categories'));
      }
      setIsConfirmModalOpen(false);
    } catch (error: any) {
      const generalError = getErrors(error, methods.setError, categorySchema);
      if (generalError) {
        toast.error(generalError);
      }
      setIsConfirmModalOpen(false);
    } finally {
      setConfirmModalConfig(prev => ({ ...prev, isLoading: false }));
    }
  };

  const onSubmit: SubmitHandler<TCategoryFormField> = async (data) => {
    const actionText = id ? 'cập nhật' : 'thêm mới';
    setConfirmModalConfig({
      title: `Xác nhận ${actionText} danh mục`,
      message: `Bạn có chắc chắn muốn ${actionText} danh mục "${data.name}" không?`,
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
    parentCategoryOptions,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    confirmModalConfig,
    handleConfirmSubmit,
  };
}

export function useCategoryFormContext() {
  return useContext(CategoryFormContext);
}

