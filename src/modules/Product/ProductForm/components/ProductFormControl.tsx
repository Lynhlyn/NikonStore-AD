'use client';

import { UIFormControl, UITextField, UISingleSelect, UITextArea, UISelectSearch } from '@/core/ui';
import { Controller } from 'react-hook-form';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import FormAction from '@/common/components/FormAction/FormAction';
import { getStatusEnumString } from '@/common/utils/statusOption';
import { useProductFormContext } from '@/modules/Product/ProductForm/components/useProductFormControl';
import { useFetchBrandsQuery } from '@/lib/services/modules/brandService';
import { useFetchCategoriesQuery } from '@/lib/services/modules/categoryService';
import { useFetchMaterialsQuery } from '@/lib/services/modules/materialService';
import { useFetchStrapTypesQuery } from '@/lib/services/modules/strapTypeService';
import { useFetchTagsQuery } from '@/lib/services/modules/tagService';
import { useFetchFeaturesQuery } from '@/lib/services/modules/featureService';
import { EStatusEnumString } from '@/common/enums/status';
import type { SelectOption } from '@/core/ui/UISelectSearch/UISelectSearch.types';

const NameInput = () => {
  const { control, formState: { errors } } = useProductFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Tên sản phẩm</UIFormControl.Label>
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
  const { control, formState: { errors } } = useProductFormContext();

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

const WeightInput = () => {
  const { control, formState: { errors } } = useProductFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label>Trọng lượng (kg)</UIFormControl.Label>
      <Controller
        control={control}
        name="weight"
        render={({ field }) => (
          <UITextField
            type="number"
            step="0.01"
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.weight}
          />
        )}
      />
      {errors.weight && (
        <UIFormControl.ErrorMessage>{errors.weight.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const DimensionsInput = () => {
  const { control, formState: { errors } } = useProductFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label>Kích thước</UIFormControl.Label>
      <Controller
        control={control}
        name="dimensions"
        render={({ field }) => (
          <UITextField
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.dimensions}
            placeholder="VD: 30x20x10 cm"
          />
        )}
      />
      {errors.dimensions && (
        <UIFormControl.ErrorMessage>{errors.dimensions.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const BrandInput = () => {
  const { control, formState: { errors } } = useProductFormContext();
  const { data: brandsData } = useFetchBrandsQuery({
    page: 0,
    size: 100,
    isAll: true,
  });

  const brandOptions: SelectOption[] = (brandsData?.data || []).map(brand => ({
    value: brand.id,
    label: brand.name,
  }));

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Thương hiệu</UIFormControl.Label>
      <Controller
        control={control}
        name="brandId"
        render={({ field: { onChange, value } }) => {
          const selectedOption = brandOptions.find(option => option.value === value);

          return (
            <UISingleSelect
              options={brandOptions}
              onChange={(selected) => onChange(selected?.value || 0)}
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
      {errors.brandId && (
        <UIFormControl.ErrorMessage>{errors.brandId.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const CategoryInput = () => {
  const { control, formState: { errors } } = useProductFormContext();
  const { data: categoriesData } = useFetchCategoriesQuery({
    page: 0,
    size: 100,
    isAll: true,
  });

  const categoryOptions: SelectOption[] = (categoriesData?.data || []).map(category => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Danh mục</UIFormControl.Label>
      <Controller
        control={control}
        name="categoryId"
        render={({ field: { onChange, value } }) => {
          const selectedOption = categoryOptions.find(option => option.value === value);

          return (
            <UISingleSelect
              options={categoryOptions}
              onChange={(selected) => onChange(selected?.value || 0)}
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
      {errors.categoryId && (
        <UIFormControl.ErrorMessage>{errors.categoryId.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const MaterialInput = () => {
  const { control, formState: { errors } } = useProductFormContext();
  const { data: materialsData } = useFetchMaterialsQuery({
    page: 0,
    size: 100,
    isAll: true,
  });

  const materialOptions: SelectOption[] = (materialsData?.data || []).map(material => ({
    value: material.id,
    label: material.name,
  }));

  return (
    <UIFormControl>
      <UIFormControl.Label>Chất liệu</UIFormControl.Label>
      <Controller
        control={control}
        name="materialId"
        render={({ field: { onChange, value } }) => {
          const selectedOption = materialOptions.find(option => option.value === value);

          return (
            <UISingleSelect
              options={materialOptions}
              onChange={(selected) => onChange(selected?.value || undefined)}
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
      {errors.materialId && (
        <UIFormControl.ErrorMessage>{errors.materialId.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const StrapTypeInput = () => {
  const { control, formState: { errors } } = useProductFormContext();
  const { data: strapTypesData } = useFetchStrapTypesQuery({
    page: 0,
    size: 100,
    isAll: true,
  });

  const strapTypeOptions: SelectOption[] = (strapTypesData?.data || []).map(strapType => ({
    value: strapType.id,
    label: strapType.name,
  }));

  return (
    <UIFormControl>
      <UIFormControl.Label>Loại dây đeo</UIFormControl.Label>
      <Controller
        control={control}
        name="strapTypeId"
        render={({ field: { onChange, value } }) => {
          const selectedOption = strapTypeOptions.find(option => option.value === value);

          return (
            <UISingleSelect
              options={strapTypeOptions}
              onChange={(selected) => onChange(selected?.value || undefined)}
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
      {errors.strapTypeId && (
        <UIFormControl.ErrorMessage>{errors.strapTypeId.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const TagsInput = () => {
  const { control, formState: { errors } } = useProductFormContext();
  const { data: tagsData } = useFetchTagsQuery({
    page: 0,
    size: 100,
    isAll: true,
  });

  const tagOptions: SelectOption[] = (tagsData?.data || []).map(tag => ({
    value: tag.id,
    label: tag.name,
  }));

  return (
    <UIFormControl>
      <UIFormControl.Label>Tags</UIFormControl.Label>
      <Controller
        control={control}
        name="tagIds"
        render={({ field: { onChange, value } }) => {
          const selectedValues = Array.isArray(value) 
            ? tagOptions.filter(opt => value.includes(opt.value))
            : [];

          return (
            <UISelectSearch
              multiple
              options={tagOptions}
              value={selectedValues.length > 0 ? selectedValues : null}
              onChange={(selected) => {
                if (Array.isArray(selected)) {
                  onChange(selected.map(s => s.value));
                } else {
                  onChange([]);
                }
              }}
              placeholder="Chọn tags..."
              searchable
              size={ESize.L}
              className="rounded-md border border-gray-300"
            />
          );
        }}
      />
      {errors.tagIds && (
        <UIFormControl.ErrorMessage>{errors.tagIds.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const FeaturesInput = () => {
  const { control, formState: { errors } } = useProductFormContext();
  const { data: featuresData } = useFetchFeaturesQuery({
    page: 0,
    size: 100,
    isAll: true,
  });

  const featureOptions: SelectOption[] = (featuresData?.data || []).map(feature => ({
    value: feature.id,
    label: feature.name,
  }));

  return (
    <UIFormControl>
      <UIFormControl.Label>Features</UIFormControl.Label>
      <Controller
        control={control}
        name="featureIds"
        render={({ field: { onChange, value } }) => {
          const selectedValues = Array.isArray(value)
            ? featureOptions.filter(opt => value.includes(opt.value))
            : [];

          return (
            <UISelectSearch
              multiple
              options={featureOptions}
              value={selectedValues.length > 0 ? selectedValues : null}
              onChange={(selected) => {
                if (Array.isArray(selected)) {
                  onChange(selected.map(s => s.value));
                } else {
                  onChange([]);
                }
              }}
              placeholder="Chọn features..."
              searchable
              size={ESize.L}
              className="rounded-md border border-gray-300"
            />
          );
        }}
      />
      {errors.featureIds && (
        <UIFormControl.ErrorMessage>{errors.featureIds.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const StatusInput = () => {
  const { control, formState: { errors } } = useProductFormContext();
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
              onChange={(selected) => onChange(selected?.value || EStatusEnumString.ACTIVE)}
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
  const { isLoading, handleSubmit, onSubmit, router, getRouteWithRole } = useProductFormContext();

  return (
    <FormAction
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      onCancel={() => router.push(getRouteWithRole('/products'))}
    />
  );
};

const ProductFormControl = {
  NameInput,
  DescriptionInput,
  WeightInput,
  DimensionsInput,
  BrandInput,
  CategoryInput,
  MaterialInput,
  StrapTypeInput,
  TagsInput,
  FeaturesInput,
  StatusInput,
  Button,
};

export { ProductFormControl };

