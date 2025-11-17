'use client';
import type React from 'react';
import {
  ForgotPasswordFormContext,
  forgotPasswordSchema,
  useForgotPasswordFormControlProvider,
} from './useForgotPasswordFormControl';
import { useState } from 'react';
import { ForgotPasswordFormControl } from './ForgotPasswordFormControl';
import { IForgotPasswordFormProps } from './ForgotPasswordForm.type';
import { useForgotPasswordMutation } from '@/lib/services/modules/authService';
import { getErrors } from '@/common/utils/handleForm';
import { getRoleFromPathName } from '@/common/utils/pathname';

const ForgotPasswordForm: React.FC<IForgotPasswordFormProps> = (props) => {
  const { handleSubmitFrom } = props;
  const form = useForgotPasswordFormControlProvider();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preForgotPassword] = useForgotPasswordMutation();

  const onSubmit = async ({ email }: { email: string }) => {
    setIsLoading(true);
    try {
      const formForgotPassword = {
        email: email,
        role: getRoleFromPathName(),
      };

      await preForgotPassword(formForgotPassword).unwrap();
      handleSubmitFrom(true);
    } catch (error) {
      const errorMessage = getErrors<{ email: string }>(
        error,
        form.setError,
        forgotPasswordSchema
      );
      if (errorMessage) {
        form.setError('email', { message: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ForgotPasswordFormContext.Provider
      value={{
        ...form,
        isLoading: isLoading,
        onSubmit,
      }}
    >
      <div className="flex flex-col justify-center w-full max-w-md">
        <div className="w-full mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Đặt lại mật khẩu
          </h1>
          <p className="text-slate-300 text-sm">
            Chúng tôi sẽ gửi email đặt lại mật khẩu tới địa chỉ email bạn đã đăng ký
          </p>
        </div>
        <div className="w-full backdrop-blur-xl bg-white/10 border border-white/20 py-[50px] px-10 rounded-2xl shadow-2xl">
          <div className="text-base leading-[170%] text-white text-center mb-10">
            Vui lòng nhập địa chỉ email của bạn để nhận liên kết đặt lại mật khẩu
          </div>
          <div>
            <ForgotPasswordFormControl.Email />
            <ForgotPasswordFormControl.Button />
          </div>
        </div>
      </div>
    </ForgotPasswordFormContext.Provider>
  );
};

export { ForgotPasswordForm };

