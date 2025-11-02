'use client';
import { PASSWORD_REGEX } from '@/common/utils/regex';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export type TResetPasswordFormField = {
  password: string;
  passwordConfirm: string;
};

export type TResetPasswordFormContextData = ReturnType<
  typeof useResetPasswordFormControlProvider
> & {
  isLoading: boolean;
  onSubmit: (data: TResetPasswordFormField) => void;
};

export const ResetPasswordFormContext = React.createContext(
  {} as TResetPasswordFormContextData
);

export const resetPasswordSchema = yup.object<TResetPasswordFormField>().shape({
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu mới.')
    .matches(
      PASSWORD_REGEX,
      'Mật khẩu phải có 8-32 ký tự bao gồm chữ và số (có thể sử dụng ký hiệu)'
    ),
  passwordConfirm: yup
    .string()
    .required('Vui lòng nhập xác nhận mật khẩu mới.')
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp.'),
});

const useResetPasswordFormResolver = () => {
  return yupResolver(resetPasswordSchema, { abortEarly: false });
};

export function useResetPasswordFormControlProvider() {
  const resolver = useResetPasswordFormResolver();

  return useForm<TResetPasswordFormField>({
    resolver,
    defaultValues: { password: '', passwordConfirm: '' },
  });
}

export function useResetPasswordFormContext(): TResetPasswordFormContextData {
  return React.useContext(ResetPasswordFormContext);
}

