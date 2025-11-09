'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/core/shadcn/components/ui/dialog';
import { Button } from '@/core/shadcn/components/ui/button';
import {
  useFetchProductImagesByProductIdQuery,
  useAddProductImageMutation,
  useUpdateProductImageMutation,
  useDeleteProductImageMutation,
} from '@/lib/services/modules/productImageService';
import { useUploadImagesMutation } from '@/lib/services/modules/uploadImageService';
import { toast } from 'sonner';
import { ImageIcon, Loader2, Upload, Trash2, Star, X, GripVertical, Maximize2 } from 'lucide-react';
import { ProductImageGalleryModalProps } from './ProductImageGalleryModal.type';
import { ConfirmModal } from '@/common/components/ConfirmModal';

interface ImageWithState {
  id: number | string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
  altText?: string;
  isUploading?: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

const ProductImageGalleryModal: React.FC<ProductImageGalleryModalProps> = ({
  isOpen,
  onClose,
  productId,
  onSuccess,
}) => {
  const [images, setImages] = useState<ImageWithState[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<ImageWithState | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const { data: imagesData, isLoading: isLoadingImages, refetch } = useFetchProductImagesByProductIdQuery(productId, {
    skip: !isOpen || !productId,
  });

  const [addProductImage, { isLoading: isAdding }] = useAddProductImageMutation();
  const [updateProductImage, { isLoading: isUpdating }] = useUpdateProductImageMutation();
  const [deleteProductImage, { isLoading: isDeleting }] = useDeleteProductImageMutation();
  const [uploadImages, { isLoading: isUploading }] = useUploadImagesMutation();

  const isAnyOperationInProgress = isAdding || isDeleting || isUpdating || isUploading || images.some(img => img.isUploading || img.isDeleting || img.isUpdating);

  useEffect(() => {
    if (imagesData?.data) {
      const mappedImages: ImageWithState[] = imagesData.data
        .map((img) => ({
          id: img.id,
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary || false,
          sortOrder: img.sortOrder ?? 0,
          altText: img.altText,
          isUploading: false,
          isDeleting: false,
          isUpdating: false,
        }))
        .sort((a, b) => a.sortOrder - b.sortOrder);
      setImages(mappedImages);
    }
  }, [imagesData]);


  const handleFileSelect = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error('Chỉ hỗ trợ file ảnh');
      return;
    }

    const newImages: ImageWithState[] = [];
    const maxSortOrder = images.length > 0 ? Math.max(...images.map(img => img.sortOrder)) : -1;

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const tempId = `temp-${Date.now()}-${i}`;
      const isFirstImage = images.length === 0 && i === 0;

      const newImage: ImageWithState = {
        id: tempId,
        imageUrl: '',
        isPrimary: isFirstImage,
        sortOrder: maxSortOrder + i + 1,
        isUploading: true,
        isDeleting: false,
        isUpdating: false,
      };

      setImages(prev => [...prev, newImage]);

      try {
        // Upload image using RTK Query mutation
        const uploadResult = await uploadImages({
          files: [file],
          folder: 'product-images',
        }).unwrap();

        // Get the uploaded URL from response
        const imageUrl = uploadResult.data && uploadResult.data.length > 0 
          ? uploadResult.data[0] 
          : '';

        if (!imageUrl) {
          throw new Error('Upload failed: No URL returned');
        }
        
        const addedImage = await addProductImage({
          productId,
          imageUrl,
          isPrimary: isFirstImage && images.length === 0,
          sortOrder: maxSortOrder + i + 1,
          altText: file.name,
        }).unwrap();

        setImages(prev => prev.map(img => 
          img.id === tempId 
            ? { ...img, id: addedImage.id, imageUrl: addedImage.imageUrl, isUploading: false }
            : img
        ));

        if (isFirstImage && images.length === 0) {
          await refetch();
        }
      } catch (error: any) {
        toast.error(`Lỗi khi upload ảnh: ${error.message || 'Unknown error'}`);
        setImages(prev => prev.filter(img => img.id !== tempId));
      }
    }

    toast.success(`Đã thêm ${imageFiles.length} ảnh`);
    await refetch();
    onSuccess?.();
  }, [productId, images.length, addProductImage, uploadImages, refetch, onSuccess]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (isAnyOperationInProgress) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAnyOperationInProgress || draggedIndex === null) return;
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAnyOperationInProgress || draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const draggedImage = images[draggedIndex];
    const newImages = [...images];
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    
    const reorderedImages = newImages.map((img, index) => ({
      ...img,
      sortOrder: index,
    }));

    setImages(reorderedImages);

    try {
      await updateProductImage({
        id: draggedImage.id as number,
        sortOrder: dropIndex,
      }).unwrap();

      for (let i = 0; i < reorderedImages.length; i++) {
        if (i !== dropIndex && typeof reorderedImages[i].id === 'number') {
          await updateProductImage({
            id: reorderedImages[i].id as number,
            sortOrder: i,
          }).unwrap();
        }
      }

      toast.success('Đã sắp xếp lại thứ tự ảnh');
      await refetch();
    } catch (error: any) {
      toast.error(`Lỗi khi cập nhật thứ tự: ${error.message}`);
      await refetch();
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleSetPrimary = async (index: number) => {
    if (isAnyOperationInProgress) return;

    const image = images[index];
    if (image.isPrimary) return;

    setImages(prev => prev.map((img, i) => ({
      ...img,
      isPrimary: i === index,
      isUpdating: i === index,
    })));

    try {
      await Promise.all([
        updateProductImage({
          id: image.id as number,
          isPrimary: true,
        }).unwrap(),
        ...images
          .filter(img => img.isPrimary && typeof img.id === 'number')
          .map(img => updateProductImage({
            id: img.id as number,
            isPrimary: false,
          }).unwrap()),
      ]);

      toast.success('Đã đặt làm ảnh chính');
      await refetch();
      onSuccess?.();
    } catch (error: any) {
      toast.error(`Lỗi khi đặt ảnh chính: ${error.message}`);
      await refetch();
    }
  };

  const handleDeleteClick = (image: ImageWithState) => {
    setImageToDelete(image);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!imageToDelete || typeof imageToDelete.id !== 'number') return;

    setImages(prev => prev.map(img => 
      img.id === imageToDelete.id ? { ...img, isDeleting: true } : img
    ));

    try {
      await deleteProductImage(imageToDelete.id).unwrap();

      const newImages = images.filter(img => img.id !== imageToDelete.id);
      if (imageToDelete.isPrimary && newImages.length > 0) {
        const firstImage = newImages[0];
        if (typeof firstImage.id === 'number') {
          await updateProductImage({
            id: firstImage.id,
            isPrimary: true,
          }).unwrap();
        }
      }

      toast.success('Đã xóa ảnh');
      setDeleteConfirmOpen(false);
      setImageToDelete(null);
      await refetch();
      onSuccess?.();
    } catch (error: any) {
      toast.error(`Lỗi khi xóa ảnh: ${error.message}`);
      setImages(prev => prev.map(img => 
        img.id === imageToDelete.id ? { ...img, isDeleting: false } : img
      ));
    }
  };

  const handleReplaceImage = async (imageId: number, file: File) => {
    setImages(prev => prev.map(img =>
      img.id === imageId ? { ...img, isUpdating: true } : img
    ));

    try {
      // Upload image using RTK Query mutation
      const uploadResult = await uploadImages({
        files: [file],
        folder: 'product-images',
      }).unwrap();

      // Get the uploaded URL from response
      const imageUrl = uploadResult.data && uploadResult.data.length > 0 
        ? uploadResult.data[0] 
        : '';

      if (!imageUrl) {
        throw new Error('Upload failed: No URL returned');
      }

      await updateProductImage({
        id: imageId,
        imageUrl,
      }).unwrap();

      toast.success('Đã thay thế ảnh');
      await refetch();
      onSuccess?.();
    } catch (error: any) {
      toast.error(`Lỗi khi thay thế ảnh: ${error.message}`);
      setImages(prev => prev.map(img =>
        img.id === imageId ? { ...img, isUpdating: false } : img
      ));
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAnyOperationInProgress) return;
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
    
    if (isAnyOperationInProgress) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handlePaste = useCallback((e: ClipboardEvent) => {
    if (isAnyOperationInProgress || !isOpen) return;
    
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
  }, [isAnyOperationInProgress, isOpen, handleFileSelect]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('paste', handlePaste);
      return () => document.removeEventListener('paste', handlePaste);
    }
  }, [isOpen, handlePaste]);

  const handleClose = () => {
    if (isAnyOperationInProgress) {
      toast.warning('Đang xử lý ảnh, vui lòng đợi hoàn tất...');
      return;
    }
    setPreviewImage(null);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          ref={modalRef}
          className="max-w-6xl w-[95vw] max-h-[95vh] overflow-hidden flex flex-col"
          onPointerDownOutside={isAnyOperationInProgress ? (e) => e.preventDefault() : undefined}
          onEscapeKeyDown={isAnyOperationInProgress ? (e) => e.preventDefault() : undefined}
        >
          <DialogHeader className="flex-shrink-0 pb-4">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              Quản lý hình ảnh sản phẩm
              {isAnyOperationInProgress && (
                <div className="flex items-center gap-1 text-blue-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-normal">Đang xử lý...</span>
                </div>
              )}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Upload, xóa, thay thế và sắp xếp hình ảnh sản phẩm. Kéo thả để sắp xếp thứ tự.
            </DialogDescription>
            {isAnyOperationInProgress && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mt-2">
                <p className="text-sm text-yellow-800 font-medium">
                  Đang xử lý ảnh - Giao diện đã được khóa để tránh gián đoạn
                </p>
              </div>
            )}
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto">
            {isLoadingImages ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mr-3 text-blue-500" />
                <span className="text-gray-600">Đang tải ảnh...</span>
              </div>
            ) : (
              <>
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
                    border-2 border-dashed rounded-lg p-6 mb-4 transition-all duration-200
                    ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
                    ${isAnyOperationInProgress ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
                  `}
                  onClick={() => !isAnyOperationInProgress && inputRef.current?.click()}
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
                        e.target.value = '';
                      }
                    }}
                    disabled={isAnyOperationInProgress}
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

                {images.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Chưa có ảnh nào</p>
                    <p className="text-sm">Upload ảnh để bắt đầu</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                      <div
                        key={image.id}
                        draggable={!isAnyOperationInProgress && !image.isUploading && !image.isDeleting && !image.isUpdating}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`
                          relative group border-2 rounded-lg overflow-hidden transition-all duration-200
                          ${draggedIndex === index ? 'opacity-50 scale-95' : ''}
                          ${dragOverIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
                          ${isAnyOperationInProgress ? 'cursor-not-allowed' : 'cursor-move hover:shadow-lg'}
                        `}
                      >
                        <div className="aspect-square bg-gray-100 relative">
                          <img
                            src={image.imageUrl}
                            alt={image.altText || `Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          
                          {(image.isUploading || image.isDeleting || image.isUpdating) && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <Loader2 className="w-6 h-6 animate-spin text-white" />
                            </div>
                          )}

                          {image.isPrimary && (
                            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1 z-10">
                              <Star className="w-3 h-3 fill-current" />
                              Ảnh chính
                            </div>
                          )}

                          {!isAnyOperationInProgress && !image.isUploading && !image.isDeleting && !image.isUpdating && (
                            <>
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPreviewImage(image.imageUrl);
                                    }}
                                    className="bg-white/90 hover:bg-white text-gray-700"
                                  >
                                    <Maximize2 className="w-4 h-4" />
                                  </Button>
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
                                  <label className="cursor-pointer">
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      asChild
                                      className="bg-white/90 hover:bg-white text-gray-700"
                                    >
                                      <span>
                                        <Upload className="w-4 h-4" />
                                      </span>
                                    </Button>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      hidden
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0] && typeof image.id === 'number') {
                                          handleReplaceImage(image.id, e.target.files[0]);
                                          e.target.value = '';
                                        }
                                      }}
                                    />
                                  </label>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteClick(image);
                                    }}
                                    className="bg-red-500/90 hover:bg-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <GripVertical className="w-4 h-4" />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter className="flex-shrink-0 border-t pt-4">
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-gray-500">
                {isAnyOperationInProgress ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    Đang xử lý - Vui lòng không đóng modal
                  </span>
                ) : (
                  <span>Tổng cộng: {images.length} ảnh</span>
                )}
              </div>
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={isAnyOperationInProgress}
                className="min-w-[100px]"
              >
                {isAnyOperationInProgress ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  'Đóng'
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {previewImage && (
        <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Xem ảnh</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center">
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setImageToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa ảnh"
        message="Bạn có chắc chắn muốn xóa ảnh này không? Hành động này không thể hoàn tác."
        type="danger"
        isLoading={isDeleting}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </>
  );
};

export default ProductImageGalleryModal;

