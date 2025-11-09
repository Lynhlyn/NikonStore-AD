'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter, notFound } from 'next/navigation';
import { useAddStaffMutation, useUpdateStaffMutation, useFetchStaffByIdQuery } from '@/lib/services/modules/staffService';
import { toast } from 'sonner';
import { routerApp } from '@/router';
import { useAppNavigation } from '@/common/hooks';
import { TStaffFormField } from './StaffForm.type';
import { EStatusEnumString, EUserRole } from '@/common/enums';

export type StaffFormContextData = ReturnType<typeof useStaffFormProvider>;
export const StaffFormContext = createContext({} as StaffFormContextData);

const staffSchema: yup.ObjectSchema<TStaffFormField> = yup.object({
  username: yup.string()
    .transform((value) => value ?? '')
    .when('$isEditMode', {
      is: false,
      then: (schema) => schema.required('Username là bắt buộc'),
      otherwise: (schema) => schema.notRequired(),
    }),
  fullName: yup.string().required('Họ tên là bắt buộc'),
  password: yup.string()
    .transform((value) => value ?? '')
    .when('$isEditMode', {
      is: false,
      then: (schema) => schema.required('Mật khẩu là bắt buộc'),
      otherwise: (schema) => schema.notRequired(),
    }),
  phoneNumber: yup.string().required('Số điện thoại là bắt buộc'),
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng'),
  role: yup.mixed<EUserRole>().required('Vai trò là bắt buộc'),
  status: yup.mixed<EStatusEnumString>().required('Trạng thái là bắt buộc'),
});

export function useStaffFormProvider(id?: number) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    title: '',
    message: '',
    type: 'default' as 'default' | 'danger' | 'warning',
    isLoading: false,
  });

  const { data: staff, isFetching, error } = useFetchStaffByIdQuery(id!, { skip: !id });

  if (error) {
    router.push(getRouteWithRole(notFound()));
  }

  const [addStaff, { isLoading: isAddLoading }] = useAddStaffMutation();
  const [updateStaff, { isLoading: isUpdateLoading }] = useUpdateStaffMutation();

  const methods = useForm<TStaffFormField>({
    resolver: yupResolver(staffSchema),
    defaultValues: {
      username: '',
      fullName: '',
      password: '',
      phoneNumber: '',
      email: '',
      role: EUserRole.MASTER,
      status: EStatusEnumString.ACTIVE,
    },
    mode: 'onTouched',
    context: { isEditMode: !!id },
  });

  useEffect(() => {
    if (id && staff) {
      methods.reset({
        username: staff.username,
        fullName: staff.fullName,
        phoneNumber: staff.phoneNumber,
        email: staff.email,
        role: staff.role as EUserRole,
        status: staff.status,
      });
    }
  }, [staff, id, methods]);

  const isLoading = isAddLoading || isUpdateLoading || (id ? isFetching : false);

  const onSubmit: SubmitHandler<TStaffFormField> = async (data) => {
    try {
      if (id) {
        await updateStaff({ id, ...data }).unwrap();
        toast.success('Đã cập nhật nhân viên thành công');
      } else {
        await addStaff(data).unwrap();
        toast.success('Đã thêm nhân viên thành công');
      }
      router.push(getRouteWithRole(routerApp.staff.list));
    } catch (error: any) {
      if (error?.data?.data && typeof error.data.data === 'object') {
        const fieldErrors = error.data.data;
 
        Object.entries(fieldErrors).forEach(([field, message]) => {
          const errorText = Array.isArray(message) ? message[0] : message;
          toast.error(errorText);
          let formFieldName = field;
        
          if (['username', 'email', 'phoneNumber', 'fullName'].includes(formFieldName)) {
            methods.setError(formFieldName as keyof TStaffFormField, {
              message: errorText
            });
          }
        });
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại');
      }
    }
  };

  const handleConfirmSubmit = async (data: TStaffFormField) => {
    setIsConfirmModalOpen(false);
    await onSubmit(data);
  };

  return {
    ...methods,
    isLoading,
    onSubmit,
    handleSubmit: methods.handleSubmit,
    handleConfirmSubmit,
    router,
    getRouteWithRole,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    confirmModalConfig,
    setConfirmModalConfig,
  };
}

export function useStaffFormContext() {
  return useContext(StaffFormContext);
}

