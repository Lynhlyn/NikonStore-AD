'use client';
import { ILoginFormProps, TLoginFormField } from '@/modules/Auth/SignIn/components/LoginForm/LoginForm.type';
import { useState } from 'react';
import { useLoginMutation } from '@/lib/services/modules/authService';
import * as yup from 'yup';
import { EMAIL_REGEX, PASSWORD_REGEX } from '@/common/utils/regex';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { UIButton, UIFormControl, UITextField } from '@/core/ui';
import { getErrors } from '@/common/utils/handleForm';
import Link from 'next/link';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import { useAppNavigation } from '@/common/hooks';
import { getRoleFromPathName } from '@/common/utils/pathname';
import { setCredentials } from '@/lib/features/authSlice';
import TokenService from '@/common/utils/tokenService';
import { useDispatch } from 'react-redux';
import { routerApp } from '@/router';

const LoginForm: React.FC<ILoginFormProps> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [login] = useLoginMutation();
  const { goToHome } = useAppNavigation();
  const { getRouteWithRole } = useAppNavigation();
  const dispatch = useDispatch();

  const schema = yup.object<TLoginFormField>().shape({
    email: yup
      .string()
      .trim()
      .required('Vui lòng nhập địa chỉ email.')
      .max(100, "Địa chỉ email không được vượt quá 100 ký tự.")
      .email('Định dạng email không hợp lệ. Vui lòng nhập lại.')
      .test(
        'is-email',
        'Định dạng email không hợp lệ. Vui lòng nhập lại.',
        (value) => {
          if (!value) return false;
          return EMAIL_REGEX.test(value.trim());
        }
      ),
    password: yup
      .string()
      .required('Vui lòng nhập mật khẩu.')
      .matches(
        PASSWORD_REGEX,
        'Vui lòng nhập mật khẩu từ 8 đến 32 ký tự, bao gồm chữ và số (có thể sử dụng ký hiệu).'
      ),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<TLoginFormField>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: TLoginFormField) => {
    setIsLoading(true);
    try {
      const dataLogin = {
        email: data.email,
        password: data.password,
        role: getRoleFromPathName(),
      };

      const response = await login(dataLogin).unwrap();

      const loginData = response.data;

      dispatch(setCredentials({
        accessToken: loginData.accessToken,
        refreshToken: loginData.refreshToken,
        role: getRoleFromPathName()
      }));

      TokenService.setToken(loginData.accessToken);

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (loginData) {
        window.location.href = `/${getRoleFromPathName()}`
      }
    } catch (error) {
      const errorMessage = getErrors<TLoginFormField>(
        error,
        setError,
        schema
      );
      if (errorMessage) {
        setError('password', { message: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl px-10 py-[50px] border border-white/20">
      <div
        className="flex flex-1 flex-col gap-7 w-full xl:text-base lg:text-sm text-sm"
      >
        <UIFormControl>
          <UIFormControl.Label className='font-bold text-white leading-[170%]'>Email</UIFormControl.Label>
          <Controller
            control={control}
            name="email"
            render={({
              field: { onChange, value },
              fieldState: { invalid },
            }) => (
              <UITextField
                placeholder={'abc123@sample.com'}
                type="text"
                onChange={(e) => onChange(e.target.value)}
                disabled={isLoading}
                autoCapitalize="none"
                textFieldSize={ESize.XXL}
                value={value}
                isInvalid={invalid}
              />
            )}
          />
          <UIFormControl.ErrorMessage>
            {errors.email?.message}
          </UIFormControl.ErrorMessage>
        </UIFormControl>
        <UIFormControl>
          <div className='flex justify-between items-center '>
            <UIFormControl.Label className='font-bold text-white leading-[170%]'>Password</UIFormControl.Label>
            <Link className='text-[15px] leading-[170%] text-blue-300 hover:text-blue-200 transition-colors' href={getRouteWithRole(routerApp.auth.forgotPassword)}>Quên mật khẩu?</Link>
          </div>
          <Controller
            control={control}
            name="password"
            render={({
              field: { onChange, value },
              fieldState: { invalid },
            }) => (
              <UITextField
                placeholder={'8 đến 32 ký tự chữ và số'}
                type="password"
                onChange={onChange}
                disabled={isLoading}
                maxLength={32}
                textFieldSize={ESize.XXL}
                value={value}
                isInvalid={invalid}
              />
            )}
          />
          {
            errors.password ? (<UIFormControl.ErrorMessage>
              {errors.password?.message}
            </UIFormControl.ErrorMessage>) : (<span className='text-sm leading-[150%] text-slate-300'>Vui lòng nhập mật khẩu gồm từ 8 đến 32 ký tự chữ và số (có thể sử dụng ký hiệu).</span>)
          }
        </UIFormControl>
        <UIButton
          isLoading={isLoading}
          onClick={handleSubmit(onSubmit)}
          className="font-medium h-[50px] mt-1 w-full mx-auto rounded-[50px] text-[15px] leading-[170%] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
        >
          Đăng nhập
        </UIButton>
      </div>
    </div>
  );
};

export { LoginForm };

