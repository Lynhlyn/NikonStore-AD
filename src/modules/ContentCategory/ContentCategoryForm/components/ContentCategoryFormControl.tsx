'use client';

import { UIFormControl, UITextField, UISingleSelect } from '@/core/ui';
import { Controller } from 'react-hook-form';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import FormAction from '@/common/components/FormAction/FormAction';
import { EContentType } from '@/lib/services/modules/contentTagService/type';
import { useContentCategoryFormContext } from '@/modules/ContentCategory/ContentCategoryForm/components/useContentCategoryFormControl';

const typeOptions = [
  { value: EContentType.BLOG, label: 'Blog' },
  { value: EContentType.FAQ, label: 'FAQ' },
];

const NameInput = () => {
  const { control, formState: { errors } } = useContentCategoryFormContext();

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

const SlugInput = () => {
  const { control, formState: { errors } } = useContentCategoryFormContext();

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
  const { control, formState: { errors } } = useContentCategoryFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label>Mô tả</UIFormControl.Label>
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <textarea
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      />
      {errors.description && (
        <UIFormControl.ErrorMessage>{errors.description.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const TypeInput = () => {
  const { control, formState: { errors } } = useContentCategoryFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Loại danh mục</UIFormControl.Label>
      <Controller
        control={control}
        name="type"
        render={({ field: { onChange, value } }) => {
          const selectedOption = typeOptions.find((option) => option.value === value);

          return (
            <UISingleSelect
              options={typeOptions}
              onChange={(selected) => onChange(selected?.value)}
              selected={selectedOption}
              bindLabel="label"
              bindValue="value"
              size={ESize.L}
              placeholder="Chọn loại"
              className="rounded-md border border-gray-300"
              renderOption={(props) => <UISingleSelect.Option {...props} />}
              renderSelected={(props) => <UISingleSelect.Selected {...props} />}
            />
          );
        }}
      />
      {errors.type && (
        <UIFormControl.ErrorMessage>{errors.type.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const Button = () => {
  const { isLoading, handleSubmit, onSubmit, router, getRouteWithRole } =
    useContentCategoryFormContext();

  return (
    <FormAction
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      onCancel={() => router.push(getRouteWithRole('/content-categories'))}
    />
  );
};

const ContentCategoryFormControl = {
  NameInput,
  SlugInput,
  DescriptionInput,
  TypeInput,
  Button,
};

export { ContentCategoryFormControl };

