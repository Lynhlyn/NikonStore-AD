'use client';

import { UIFormControl, UITextField, UITextArea } from '@/core/ui';
import { Controller } from 'react-hook-form';
import FormAction from '@/common/components/FormAction/FormAction';
import { useFeatureFormContext } from '@/modules/Feature/FeatureForm/components/useFeatureFormControl';

const NameInput = () => {
  const { control, formState: { errors } } = useFeatureFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Tên tính năng</UIFormControl.Label>
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
          />
        )}
      />
      {errors.name && (
        <UIFormControl.ErrorMessage>{errors.name.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const DescriptionInput = () => {
  const { control, formState: { errors } } = useFeatureFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label>Mô tả</UIFormControl.Label>
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <UITextArea
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.description}
            placeholder="Nhập mô tả cho tính năng..."
            rows={4}
          />
        )}
      />
      {errors.description && (
        <UIFormControl.ErrorMessage>{errors.description.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const FeatureGroupInput = () => {
  const { control, formState: { errors } } = useFeatureFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label>Nhóm tính năng</UIFormControl.Label>
      <Controller
        control={control}
        name="featureGroup"
        render={({ field }) => (
          <UITextField
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.featureGroup}
            placeholder="Nhập nhóm tính năng..."
          />
        )}
      />
      {errors.featureGroup && (
        <UIFormControl.ErrorMessage>{errors.featureGroup.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const Button = () => {
  const { isLoading, handleSubmit, onSubmit, router, getRouteWithRole } = useFeatureFormContext();

  return (
    <FormAction
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      onCancel={() => router.push(getRouteWithRole('/features'))}
    />
  );
};

const FeatureFormControl = {
  NameInput,
  DescriptionInput,
  FeatureGroupInput,
  Button,
};

export { FeatureFormControl };

