'use client';

import { UIFormControl, UITextField, UISingleSelect, UITextArea } from '@/core/ui';
import { Controller } from 'react-hook-form';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import FormAction from '@/common/components/FormAction/FormAction';
import { getStatusEnumString } from '@/common/utils/statusOption';
import { useBannerFormContext } from '@/modules/Banner/BannerForm/components/useBannerFormControl';
import { Upload, Loader2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button as ShadcnButton } from '@/core/shadcn/components/ui/button';
import { POSITION_OPTIONS } from '@/common/utils/bannerPosition';

const positionOptions = POSITION_OPTIONS.filter(opt => opt.value !== -1); // Exclude "Tất cả vị trí" from form

const NameInput = () => {
  const { control, formState: { errors } } = useBannerFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label>Tên banner</UIFormControl.Label>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <UITextField
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value || null)}
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
  const { control, formState: { errors } } = useBannerFormContext();

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

const UrlInput = () => {
  const { control, formState: { errors } } = useBannerFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>URL liên kết</UIFormControl.Label>
      <Controller
        control={control}
        name="url"
        render={({ field }) => (
          <UITextField
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.url}
            placeholder="https://example.com"
          />
        )}
      />
      {errors.url && (
        <UIFormControl.ErrorMessage>{errors.url.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const StatusInput = () => {
  const { control, formState: { errors } } = useBannerFormContext();
  const statusOptions = getStatusEnumString();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Trạng thái</UIFormControl.Label>
      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value } }) => {
          const selectedOption = statusOptions.find((option) => option.value === value);

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

const PositionInput = () => {
  const { control, formState: { errors } } = useBannerFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Vị trí</UIFormControl.Label>
      <Controller
        control={control}
        name="position"
        render={({ field: { onChange, value } }) => {
          const selectedOption = positionOptions.find((option) => option.value === value);

          return (
            <UISingleSelect
              options={positionOptions}
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
      {errors.position && (
        <UIFormControl.ErrorMessage>{errors.position.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const DisplayOrderInput = () => {
  const { control, formState: { errors } } = useBannerFormContext();

  return (
    <UIFormControl>
      <UIFormControl.Label>Thứ tự hiển thị</UIFormControl.Label>
      <Controller
        control={control}
        name="displayOrder"
        render={({ field }) => (
          <UITextField
            type="number"
            value={field.value?.toString() || '0'}
            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
            onBlur={field.onBlur}
            name={field.name}
            isInvalid={!!errors.displayOrder}
            min={0}
          />
        )}
      />
      {errors.displayOrder && (
        <UIFormControl.ErrorMessage>{errors.displayOrder.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const ImageUploadInput = () => {
  const { control, formState: { errors }, handleImageUpload, isUploading, watch } = useBannerFormContext();
  const imageUrl = watch('imageUrl');
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      await handleImageUpload(file);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const displayImage = preview || imageUrl;

  return (
    <UIFormControl>
      <UIFormControl.Label isRequired>Hình ảnh</UIFormControl.Label>
      <div className="space-y-4">
        <div
          className="border-2 border-dashed rounded-lg p-6 transition-all duration-200 border-gray-300 bg-gray-50 cursor-pointer hover:border-gray-400"
          onClick={() => !isUploading && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          <div className="flex flex-col items-center justify-center text-center">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 mb-2 animate-spin text-blue-500" />
                <p className="text-sm font-medium text-blue-600">Đang upload ảnh...</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm font-medium text-gray-600">
                  {displayImage ? 'Nhấn để thay thế ảnh' : 'Nhấn để chọn ảnh'}
                </p>
                <p className="text-xs text-gray-400 mt-1">Hỗ trợ JPG, PNG, GIF</p>
              </>
            )}
          </div>
        </div>

        {displayImage && (
          <div className="relative border-2 rounded-lg overflow-hidden border-gray-200 max-w-md">
            <div className="aspect-video bg-gray-100 relative">
              <img src={displayImage} alt="Banner preview" className="w-full h-full object-cover" />
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                </div>
              )}
              {!isUploading && (
                <div className="absolute top-2 right-2">
                  <ShadcnButton
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview(null);
                      control.setValue('imageUrl', '', { shouldValidate: true });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </ShadcnButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {errors.imageUrl && (
        <UIFormControl.ErrorMessage>{errors.imageUrl.message}</UIFormControl.ErrorMessage>
      )}
    </UIFormControl>
  );
};

const Button = () => {
  const { isLoading, handleSubmit, onSubmit, router, getRouteWithRole } = useBannerFormContext();

  return (
    <FormAction
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      onCancel={() => router.push(getRouteWithRole('/banners'))}
    />
  );
};

const BannerFormControl = {
  NameInput,
  DescriptionInput,
  UrlInput,
  StatusInput,
  PositionInput,
  DisplayOrderInput,
  ImageUploadInput,
  Button,
};

export { BannerFormControl };

