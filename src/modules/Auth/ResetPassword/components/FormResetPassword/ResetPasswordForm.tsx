'use client';
import type React from 'react';
import {
  ResetPasswordFormContext,
  resetPasswordSchema,
  TResetPasswordFormField,
  useResetPasswordFormControlProvider,
} from './useResetPasswordFormControl';
import { useState } from 'react';
import { useResetPasswordMutation } from '@/lib/services/modules/authService';
import { ResetPasswordFormControl } from './ResetPasswordFormControl';
import { IResetPasswordFormProps } from './ResetPasswordForm.type';
import { getErrors } from '@/common/utils/handleForm';
import Link from 'next/link';
import { routerApp } from '@/router';
import { UIButton } from '@/core/ui';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import { useAppNavigation } from '@/common/hooks';
import { VerifyTokenForgotPassword } from '../VerifyTokenForgotPassword';

const ResetPasswordForm: React.FC<IResetPasswordFormProps> = (props) => {
  const { token } = props;
  const form = useResetPasswordFormControlProvider();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const { getRouteWithRole } = useAppNavigation();
  const [resetPassword] = useResetPasswordMutation();
  const [tokenExpired, setTokenExpired] = useState<boolean>(false);
  
  const onSubmit = async (data: TResetPasswordFormField) => {
    setIsLoading(true);
    try {
      await resetPassword({
        token: token,
        newPassword: data.password,
      }).unwrap();
      setIsSubmitted(true);
    } catch (error: any) {
      if (error.status === 401 || error.status === 404 || error.status === 400) {
        setTokenExpired(true);
        return;
      }

      const errorMessage = getErrors<TResetPasswordFormField>(
        error,
        form.setError,
        resetPasswordSchema
      );
      if (errorMessage) {
        form.setError('passwordConfirm', { message: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenExpired) {
    return <VerifyTokenForgotPassword token={token} />;
  }

  return (
    <ResetPasswordFormContext.Provider
      value={{
        ...form,
        isLoading: isLoading,
        onSubmit,
      }}
    >
      {!isSubmitted ? (
        <div className="flex flex-col justify-center w-full max-w-[530px]">
          <div className="w-full mb-[30px]">
            <h3 className="text-[28px] text-[#454A70] dark:text-foreground font-bold leading-[170%] text-center">
              Đặt lại mật khẩu
            </h3>
          </div>
          <div className="w-full bg-white dark:bg-card border border-solid border-[#CCC] dark:border-border py-[50px] px-10 rounded-md">
            <div className="flex flex-col gap-[15px]">
              <ResetPasswordFormControl.Password />
              <ResetPasswordFormControl.PasswordConfirm />
              <ResetPasswordFormControl.Button />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center py-[230px] w-full max-w-[530px]">
          <div className="w-full mb-[34px]">
            <h3 className="text-[28px] text-[#454A70] dark:text-foreground font-bold leading-[170%] text-center">
              Đặt lại mật khẩu thành công
            </h3>
          </div>
          <div className="w-full bg-white dark:bg-card border border-solid border-[#CCC] dark:border-border py-[50px] px-10 rounded-md">
            <p className="text-base leading-[170%] text-[#333] dark:text-foreground text-center mb-[30px]">
              Mật khẩu mới đã được thiết lập thành công.
              <br />
              Vui lòng nhấn nút bên dưới để quay về trang đăng nhập
              <br />
              và đăng nhập bằng mật khẩu mới.
            </p>
            <div>
              <div className="w-full mx-auto">
                <Link href={getRouteWithRole(routerApp.auth.signIn)}>
                  <UIButton
                    className="font-bold h-[50px] w-full mx-auto rounded-[50px] text-[15px] leading-[170%]"
                    size={ESize.XL}
                  >
                    Đăng nhập
                  </UIButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </ResetPasswordFormContext.Provider>
  );
};

export { ResetPasswordForm };

