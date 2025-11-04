'use client';

import { UIFormControl, UITextField, UISingleSelect, UITextArea } from '@/core/ui';
import { Controller } from 'react-hook-form';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import FormAction from '@/common/components/FormAction/FormAction';
import { getStatusEnumString } from '@/common/utils/statusOption';
import { useTagFormContext } from '@/modules/Tag/TagForm/components/useTagFormControl';

const NameInput = () => {
  const { control, formState: { errors } } = useTagFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Tên thẻ</UIFormControl.Label>
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

const SlugInput = () => {
  const { control, formState: { errors } } = useTagFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Slug</UIFormControl.Label>
      <Controller
        control={control}
        name="slug"
        render={({ field }) => (
          <UITextField
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.slug}
            placeholder="vd: tag-slug"
          />
        )}
      />
      {errors.slug && (
        <UIFormControl.ErrorMessage>{errors.slug.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const DescriptionInput = () => {
  const { control, formState: { errors } } = useTagFormContext();

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
            placeholder="Nhập mô tả cho thẻ..."
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
  const { control, formState: { errors } } = useTagFormContext();
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
  const { isLoading, handleSubmit, onSubmit, router, getRouteWithRole } = useTagFormContext();

  return (
    <FormAction
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      onCancel={() => router.push(getRouteWithRole('/tags'))}
    />
  );
};

const TagFormControl = {
  NameInput,
  SlugInput,
  DescriptionInput,
  StatusInput,
  Button,
};

export { TagFormControl };

