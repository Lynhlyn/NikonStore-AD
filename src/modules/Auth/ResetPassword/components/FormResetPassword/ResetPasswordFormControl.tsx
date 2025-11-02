'use client';
import { UIButton, UIFormControl, UITextField } from '@/core/ui';
import { useResetPasswordFormContext } from './useResetPasswordFormControl';
import { Controller } from 'react-hook-form';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';

const Password = () => {
  const {
    control,
    formState: { errors },
    isLoading,
  } = useResetPasswordFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label className="text-[#333] dark:text-foreground leading-[150%]" isRequired>
        Mật khẩu mới
      </UIFormControl.Label>
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value }, fieldState: { invalid } }) => (
          <UITextField
            placeholder={'8-32 ký tự bao gồm chữ và số (có thể sử dụng ký hiệu)'}
            type="password"
            onChange={(e) => onChange(e.target.value)}
            disabled={isLoading}
            autoCapitalize="none"
            textFieldSize={ESize.XXL}
            maxLength={32}
            value={value}
            isInvalid={invalid}
          />
        )}
      />
      {errors.password ? (
        <UIFormControl.ErrorMessage>
          {errors.password?.message}
        </UIFormControl.ErrorMessage>
      ) : (
        <span className="text-sm leading-[150%] text-[#757388] dark:text-muted-foreground">
          Vui lòng nhập mật khẩu
        </span>
      )}
    </UIFormControl>
  );
};

const PasswordConfirm = () => {
  const {
    control,
    formState: { errors },
    isLoading,
  } = useResetPasswordFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label className="text-[#333] dark:text-foreground leading-[150%]" isRequired>
        Xác nhận mật khẩu mới
      </UIFormControl.Label>
      <Controller
        control={control}
        name="passwordConfirm"
        render={({ field: { onChange, value }, fieldState: { invalid } }) => (
          <UITextField
            placeholder="Vui lòng nhập lại để xác nhận"
            type="password"
            onChange={(e) => onChange(e.target.value)}
            disabled={isLoading}
            autoCapitalize="none"
            textFieldSize={ESize.XXL}
            maxLength={32}
            value={value}
            isInvalid={invalid}
          />
        )}
      />
      <UIFormControl.ErrorMessage>
        {errors.passwordConfirm?.message}
      </UIFormControl.ErrorMessage>
    </UIFormControl>
  );
};

const Button = () => {
  const { isLoading, handleSubmit, onSubmit } = useResetPasswordFormContext();
  return (
    <UIButton
      isLoading={isLoading}
      onClick={handleSubmit(onSubmit)}
      className="font-bold mt-[35px] h-[50px] w-full mx-auto rounded-[50px] text-[15px] leading-[170%]"
    >
      Hoàn tất
    </UIButton>
  );
};

const ResetPasswordFormControl = { Password, PasswordConfirm, Button };

export { ResetPasswordFormControl };

