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
      <div className="flex flex-col justify-center  w-full max-w-[530px]">
        <div className="w-full mb-[35px]">
          <h3 className="text-[28px] text-[#454A70] dark:text-foreground font-bold heading-[170%] text-center">
            Đặt lại mật khẩu
          </h3>
        </div>
        <div className="w-full bg-white border border-solid border-[#CCC] dark:bg-card dark:border-border py-[50px] px-10 rounded-md">
          <div className="text-base heading[170%] text-[#333] dark:text-foreground text-center mb-10">
            Chúng tôi sẽ gửi email đặt lại mật khẩu
            <br />
            tới địa chỉ email bạn đã đăng ký
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

