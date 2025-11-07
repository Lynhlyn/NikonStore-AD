'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/core/shadcn/components/ui/button';
import { ImageIcon, X, GripVertical, Star, Loader2, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ProductImage } from '@/lib/services/modules/productImageService/type';

interface ImageItem {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
  altText?: string;
  isUploading?: boolean;
  isNew?: boolean;
}

interface ProductImageGalleryProps {
  productId?: number;
  initialImages?: ProductImage[];
  onImagesChange?: (images: ImageItem[]) => void;
  disabled?: boolean;
  value?: ImageItem[];
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  productId,
  initialImages = [],
  onImagesChange,
  disabled = false,
  value,
}) => {
  const [images, setImages] = useState<ImageItem[]>(value || []);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      setImages(value);
    } else if (initialImages && initialImages.length > 0) {
      const mappedImages: ImageItem[] = initialImages.map((img, index) => ({
        id: `existing-${img.id}`,
        imageUrl: img.imageUrl,
        isPrimary: img.isPrimary || false,
        sortOrder: img.sortOrder ?? index,
        altText: img.altText,
        isUploading: false,
        isNew: false,
      }));
      setImages(mappedImages.sort((a, b) => a.sortOrder - b.sortOrder));
    }
  }, [initialImages, value]);

  useEffect(() => {
    onImagesChange?.(images);
  }, [images, onImagesChange]);

  const handleFileSelect = useCallback(async (files: File[]) => {
    if (disabled || files.length === 0) return;

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error('Chỉ hỗ trợ file ảnh');
      return;
    }

    setIsUploading(true);
    const newImages: ImageItem[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const tempId = `temp-${Date.now()}-${i}`;
      const reader = new FileReader();

      const imageItem: ImageItem = {
        id: tempId,
        imageUrl: '',
        isPrimary: images.length === 0 && i === 0,
        sortOrder: images.length + i,
        isUploading: true,
        isNew: true,
      };

      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        imageItem.imageUrl = dataUrl;
        setImages(prev => {
          const updated = [...prev, imageItem];
          return updated.sort((a, b) => a.sortOrder - b.sortOrder);
        });
      };

      reader.readAsDataURL(file);
      newImages.push(imageItem);
    }

    setIsUploading(false);
    toast.success(`Đã thêm ${imageFiles.length} ảnh`);
  }, [disabled, images.length]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (disabled) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || draggedIndex === null) return;
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled || draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    setImages(prev => {
      const newImages = [...prev];
      const draggedItem = newImages[draggedIndex];
      newImages.splice(draggedIndex, 1);
      newImages.splice(dropIndex, 0, draggedItem);
      
      return newImages.map((img, index) => ({
        ...img,
        sortOrder: index,
      }));
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
    toast.success('Đã sắp xếp lại thứ tự ảnh');
  };

  const handleSetPrimary = (index: number) => {
    if (disabled) return;
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    })));
    toast.success('Đã đặt làm ảnh chính');
  };

  const handleRemove = (index: number) => {
    if (disabled) return;
    const image = images[index];
    if (window.confirm('Bạn có chắc chắn muốn xóa ảnh này không?')) {
      setImages(prev => {
        const newImages = prev.filter((_, i) => i !== index);
        if (image.isPrimary && newImages.length > 0) {
          newImages[0].isPrimary = true;
        }
        return newImages.map((img, i) => ({
          ...img,
          sortOrder: i,
        }));
      });
      toast.success('Đã xóa ảnh');
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragActive(false);
    }
  };

  const handleDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handlePaste = useCallback((e: ClipboardEvent) => {
    if (disabled || isUploading) return;
    
    const items = e.clipboardData?.items;
    if (!items) return;

    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }

    if (files.length > 0) {
      e.preventDefault();
      handleFileSelect(files);
    }
  }, [disabled, isUploading, handleFileSelect]);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Hình ảnh sản phẩm</h3>
        <span className="text-sm text-gray-500">{images.length} ảnh</span>
      </div>

      <div
        ref={dropZoneRef}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={handleDropZoneDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 transition-all duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
        `}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          hidden
          onChange={(e) => {
            if (e.target.files) {
              handleFileSelect(Array.from(e.target.files));
            }
          }}
          disabled={disabled}
        />
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className={`w-8 h-8 mb-2 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className={`text-sm font-medium ${isDragActive ? 'text-blue-600' : 'text-gray-600'}`}>
            {isDragActive ? 'Thả ảnh vào đây' : 'Nhấn để chọn ảnh hoặc kéo thả'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Hỗ trợ JPG, PNG, GIF (Ctrl+V để dán)
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable={!disabled && !image.isUploading}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, index)}
              className={`
                relative group border-2 rounded-lg overflow-hidden transition-all duration-200
                ${draggedIndex === index ? 'opacity-50 scale-95' : ''}
                ${dragOverIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
                ${disabled ? 'cursor-not-allowed' : 'cursor-move hover:shadow-lg'}
              `}
            >
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={image.imageUrl}
                  alt={image.altText || `Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {image.isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  </div>
                )}

                {image.isPrimary && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Ảnh chính
                  </div>
                )}

                {!disabled && !image.isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      {!image.isPrimary && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetPrimary(index);
                          }}
                          className="bg-white/90 hover:bg-white text-gray-700"
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(index);
                        }}
                        className="bg-red-500/90 hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {!disabled && !image.isUploading && (
                  <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;

