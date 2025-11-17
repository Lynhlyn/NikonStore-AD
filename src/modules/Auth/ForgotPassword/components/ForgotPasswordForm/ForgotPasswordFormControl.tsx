'use client';
import { UIButton, UIFormControl, UITextField } from '@/core/ui';
import {
  useForgotPasswordFormContext,
} from './useForgotPasswordFormControl';
import { Controller } from 'react-hook-form';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';

const Email = () => {
  const {
    control,
    formState: { errors },
    isLoading,
  } = useForgotPasswordFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label className='leading-[170%] text-white font-bold'>Địa chỉ email</UIFormControl.Label>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value }, fieldState: { invalid } }) => (
          <UITextField
            placeholder={'abc123@sample.com'}
            type="text"
            onChange={(e) => onChange(e.target.value)}
            disabled={isLoading}
            autoCapitalize="none"
            value={value}
            isInvalid={invalid}
            textFieldSize={ESize.XXL}
          />
        )}
      />
      <UIFormControl.ErrorMessage>
        {errors.email?.message}
      </UIFormControl.ErrorMessage>
    </UIFormControl>
  );
};

const Button = () => {
  const { isLoading, handleSubmit, onSubmit } = useForgotPasswordFormContext();
  return (
    <div className='gap-4 flex flex-col'>
      <UIButton
      isLoading={isLoading}
      onClick={handleSubmit(onSubmit)}
      className="font-medium mt-10 h-[50px] w-full mx-auto rounded-[50px] text-[15px] leading-[170%] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
    >
      Gửi email
    </UIButton>
    <UIButton
      isLoading={isLoading}
      onClick={() => window.history.back()}
      className="font-medium mt-2 h-[50px] w-full mx-auto rounded-[50px] text-[15px] leading-[170%] text-white bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm"
    >
      Quay lại
    </UIButton>
    </div>
  );
};

const ForgotPasswordFormControl = { Email, Button };

export { ForgotPasswordFormControl };

