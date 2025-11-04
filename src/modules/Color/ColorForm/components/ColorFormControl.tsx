'use client';

import { UIFormControl, UITextField, UISingleSelect } from '@/core/ui';
import { Controller } from 'react-hook-form';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import FormAction from '@/common/components/FormAction/FormAction';
import { getStatusEnumString } from '@/common/utils/statusOption';
import { useColorFormContext } from '@/modules/Color/ColorForm/components/useColorFormControl';

const NameInput = () => {
  const { control, formState: { errors } } = useColorFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Tên màu</UIFormControl.Label>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <UITextField
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.name}
            placeholder="Nhập tên màu"
          />
        )}
      />
      {errors.name && (
        <UIFormControl.ErrorMessage>{errors.name.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const HexCodeInput = () => {
  const { control, formState: { errors } } = useColorFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Mã màu</UIFormControl.Label>
      <Controller
        control={control}
        name="hexCode"
        render={({ field }) => (
          <div className="flex items-center gap-3">
            <UITextField
              value={field.value || '#000000'}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              name={field.name}
              isInvalid={!!errors.hexCode}
              placeholder="#000000"
              className="flex-1"
            />
            <div
              className="w-12 h-12 rounded border border-gray-300 flex-shrink-0"
              style={{ backgroundColor: field.value || '#000000' }}
            />
          </div>
        )}
      />
      {errors.hexCode && (
        <UIFormControl.ErrorMessage>{errors.hexCode.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const StatusInput = () => {
  const { control, formState: { errors } } = useColorFormContext();
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
              className="rounded-md border border-gray-300"
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
  const { isLoading, handleSubmit, onSubmit, router, getRouteWithRole } = useColorFormContext();

  return (
    <FormAction
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      onCancel={() => router.push(getRouteWithRole('/colors'))}
    />
  );
};

const ColorFormControl = {
  NameInput,
  HexCodeInput,
  StatusInput,
  Button,
};

export { ColorFormControl };

