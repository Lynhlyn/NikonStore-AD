'use client';
import { EMAIL_REGEX } from '@/common/utils/regex';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export type ForgotPasswordFormContextData = ReturnType<
  typeof useForgotPasswordFormControlProvider
> & {
  isLoading: boolean;
  onSubmit: (data: {email: string}) => void;
};

export const ForgotPasswordFormContext = React.createContext({} as ForgotPasswordFormContextData);
export const forgotPasswordSchema = yup.object<{email: string}>().shape({
  email: yup
  .string()
  .trim()
  .required('Địa chỉ email là bắt buộc.').max(100,"Địa chỉ email phải có tối đa 100 ký tự.")
  .email('Địa chỉ email không hợp lệ. Vui lòng nhập lại.')
  .test(
    'is-email',
    'Địa chỉ email không hợp lệ. Vui lòng nhập lại.',
    (value) => {
      if (!value) return false;
      return EMAIL_REGEX.test(value.trim()); 
    }
  ),
  });
const useForgotPasswordFormResolver = () => {
  return yupResolver(forgotPasswordSchema, { abortEarly: false });
};

export function useForgotPasswordFormControlProvider() {
  const resolver = useForgotPasswordFormResolver();
  
  return useForm<{email: string}>({ resolver, defaultValues: { email: '' } });
}

export function useForgotPasswordFormContext(): ForgotPasswordFormContextData {
  return React.useContext(ForgotPasswordFormContext);
}

