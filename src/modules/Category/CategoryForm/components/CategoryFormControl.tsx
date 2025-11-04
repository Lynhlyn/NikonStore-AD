'use client';

import { UIFormControl, UITextField, UISingleSelect, UITextArea } from '@/core/ui';
import { Controller } from 'react-hook-form';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import FormAction from '@/common/components/FormAction/FormAction';
import { getStatusEnumString } from '@/common/utils/statusOption';
import { useCategoryFormContext } from '@/modules/Category/CategoryForm/components/useCategoryFormControl';

const NameInput = () => {
  const { control, formState: { errors } } = useCategoryFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Tên danh mục</UIFormControl.Label>
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

const ParentCategoryInput = () => {
  const { control, formState: { errors }, parentCategoryOptions } = useCategoryFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label>Danh mục cha</UIFormControl.Label>
      <Controller
        control={control}
        name="parentId"
        render={({ field: { onChange, value } }) => {
          const selectedOption = parentCategoryOptions.find(option => option.value === value);

          return (
            <UISingleSelect
              options={parentCategoryOptions}
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
      {errors.parentId && (
        <UIFormControl.ErrorMessage>{errors.parentId.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const DescriptionInput = () => {
  const { control, formState: { errors } } = useCategoryFormContext();

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

const StatusInput = () => {
  const { control, formState: { errors } } = useCategoryFormContext();
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
  const { isLoading, handleSubmit, onSubmit, router, getRouteWithRole } = useCategoryFormContext();

  return (
    <FormAction
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      onCancel={() => router.push(getRouteWithRole('/categories'))}
    />
  );
};

const CategoryFormControl = {
  NameInput,
  ParentCategoryInput,
  DescriptionInput,
  StatusInput,
  Button,
};

export { CategoryFormControl };

