'use client';

import { UIFormControl, UITextField, UISingleSelect } from '@/core/ui';
import { Controller } from 'react-hook-form';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import FormAction from '@/common/components/FormAction/FormAction';
import { getStatusEnumString } from '@/common/utils/statusOption';
import { routerApp } from '@/router';
import { useStaffFormContext } from '@/modules/Staff/StaffForm/components/useStaffFormControl';
import { EUserRole } from '@/common/enums/role';

interface UsernameInputProps {
  isEditMode?: boolean;
}

const UsernameInput = ({ isEditMode = false }: UsernameInputProps) => {
  const {
    control,
    formState: { errors },
  } = useStaffFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Tên đăng nhập</UIFormControl.Label>
      <Controller
        control={control}
        name="username"
        render={({ field }) => (
          <UITextField
            value={field.value || ''}
            onChange={(e) => {
              if (!isEditMode) field.onChange(e.target.value);
            }}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.username}
            placeholder="Nhập tên đăng nhập"
            disabled={isEditMode}
          />
        )}
      />
      {errors.username && (
        <UIFormControl.ErrorMessage>
          {errors.username.message}
        </UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const FullnameInput = () => {
  const { control, formState: { errors } } = useStaffFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Họ tên</UIFormControl.Label>
      <Controller
        control={control}
        name="fullName"
        render={({ field }) => (
          <UITextField
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.fullName}
            placeholder="Nhập họ tên"
          />
        )}
      />
      {errors.fullName && (
        <UIFormControl.ErrorMessage>{errors.fullName.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

interface PasswordInputProps {
  isEditMode?: boolean;
}

const PasswordInput = ({ isEditMode = false }: PasswordInputProps) => {
  const { control, formState: { errors } } = useStaffFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Mật khẩu</UIFormControl.Label>
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <UITextField
            type="password"
            value={isEditMode ? '********' : field.value || ''}
            onChange={(e) => {
              if (!isEditMode) field.onChange(e.target.value);
            }}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.password}
            placeholder="Nhập mật khẩu"
            disabled={isEditMode}
          />
        )}
      />
      {errors.password && (
        <UIFormControl.ErrorMessage>{errors.password.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const PhonenumberInput = () => {
  const { control, formState: { errors } } = useStaffFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Số điện thoại</UIFormControl.Label>
      <Controller
        control={control}
        name="phoneNumber"
        render={({ field }) => (
          <UITextField
            type="tel"
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.phoneNumber}
            placeholder="Nhập số điện thoại"
          />
        )}
      />
      {errors.phoneNumber && (
        <UIFormControl.ErrorMessage>{errors.phoneNumber.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const EmailInput = () => {
  const { control, formState: { errors } } = useStaffFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Email</UIFormControl.Label>
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <UITextField
            type="email"
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.email}
            placeholder="Nhập email"
          />
        )}
      />
      {errors.email && (
        <UIFormControl.ErrorMessage>{errors.email.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const RoleInput = () => {
  const {
    control,
    formState: { errors },
  } = useStaffFormContext();

  const roleOptions = [
    { label: 'Quản lý', value: EUserRole.ADMIN },
    { label: 'Nhân viên', value: EUserRole.STAFF },
  ];

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Vai trò</UIFormControl.Label>
      <Controller
        control={control}
        name="role"
        render={({ field }) => {
          const selectedOption = roleOptions.find((opt) => opt.value === field.value);

          return (
            <UISingleSelect
              options={roleOptions}
              onChange={(selected) => field.onChange(selected?.value)}
              selected={selectedOption}
              bindLabel="label"
              bindValue="value"
              size={ESize.L}
              className="rounded-[10px] border-1 border-[#CCCCCC]"
              renderOption={(props) => <UISingleSelect.Option {...props} />}
              renderSelected={(props) => <UISingleSelect.Selected {...props} />}
            />
          );
        }}
      />
      {errors.role && (
        <UIFormControl.ErrorMessage>{errors.role.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const StatusInput = () => {
  const { control, formState: { errors } } = useStaffFormContext();
  const statusOptions = getStatusEnumString();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Trạng thái</UIFormControl.Label>
      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value } }) => {
          const selectedOption = statusOptions.find(option => option.value === value);

          return (
            <UISingleSelect
              options={statusOptions}
              onChange={(selected) => onChange(selected?.value)}
              selected={selectedOption}
              bindLabel="label"
              bindValue="value"
              size={ESize.L}
              className="rounded-[10px] border-1 border-[#CCCCCC]"
              renderOption={(props) => <UISingleSelect.Option {...props} />}
              renderSelected={(props) => <UISingleSelect.Selected {...props} />}
            />
          );
        }}
      />
      {errors.status && (
        <UIFormControl.ErrorMessage>{errors.status.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const Button = () => {
  const { isLoading, handleSubmit, onSubmit, router, getRouteWithRole } = useStaffFormContext();

  return (
    <FormAction
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      onCancel={() => router.push(getRouteWithRole(routerApp.staff.list))}
    />
  );
};

const StaffFormControl = {
  UsernameInput,
  FullnameInput,
  PasswordInput,
  PhonenumberInput,
  EmailInput,
  RoleInput,
  StatusInput,
  Button,
};

export { StaffFormControl };

