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
  useFetchColorImageByProductIdAndColorIdQuery,
  useAddColorImageMutation,
  useUpdateColorImageMutation,
  useDeleteColorImageByProductAndColorMutation,
} from '@/lib/services/modules/colorImageService';
import { useUploadImagesMutation } from '@/lib/services/modules/uploadImageService';
import { toast } from 'sonner';
import { ImageIcon, Loader2, Upload, Trash2, X, Maximize2 } from 'lucide-react';
import { ColorImageGalleryModalProps } from './ColorImageGalleryModal.type';
import { ConfirmModal } from '@/common/components/ConfirmModal';

const ColorImageGalleryModal: React.FC<ColorImageGalleryModalProps> = ({
  isOpen,
  onClose,
  productId,
  colorId,
  onSuccess,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const { data: colorImageData, isLoading: isLoadingImage, refetch } = useFetchColorImageByProductIdAndColorIdQuery(
    { productId, colorId },
    { skip: !isOpen || !productId || !colorId }
  );

  const [addColorImage, { isLoading: isAdding }] = useAddColorImageMutation();
  const [updateColorImage, { isLoading: isUpdating }] = useUpdateColorImageMutation();
  const [deleteColorImage, { isLoading: isDeleting }] = useDeleteColorImageByProductAndColorMutation();
  const [uploadImages, { isLoading: isUploadingFile }] = useUploadImagesMutation();

  const colorImage = colorImageData?.data;
  const isAnyOperationInProgress = isAdding || isDeleting || isUpdating || isUploadingFile || isUploading || isReplacing;

  const handleFileSelect = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    const imageFile = files[0];
    if (!imageFile.type.startsWith('image/')) {
      toast.error('Chỉ hỗ trợ file ảnh');
      return;
    }

    setIsUploading(true);

    try {
      const uploadResult = await uploadImages({
        files: [imageFile],
        folder: 'color-images',
      }).unwrap();

      const imageUrl = uploadResult.data && uploadResult.data.length > 0 
        ? uploadResult.data[0] 
        : '';

      if (!imageUrl) {
        throw new Error('Upload failed: No URL returned');
      }

      if (colorImage) {
        await updateColorImage({
          id: colorImage.id,
          productId,
          colorId,
          imageUrl,
          altText: imageFile.name,
        }).unwrap();
        toast.success('Đã cập nhật ảnh');
      } else {
        await addColorImage({
          productId,
          colorId,
          imageUrl,
          altText: imageFile.name,
        }).unwrap();
        toast.success('Đã thêm ảnh');
      }

      await refetch();
      onSuccess?.();
    } catch (error: any) {
      toast.error(`Lỗi khi upload ảnh: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  }, [productId, colorId, colorImage, addColorImage, updateColorImage, uploadImages, refetch, onSuccess]);

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!colorImage) return;

    try {
      await deleteColorImage({ productId, colorId }).unwrap();
      toast.success('Đã xóa ảnh');
      setDeleteConfirmOpen(false);
      await refetch();
      onSuccess?.();
    } catch (error: any) {
      toast.error(`Lỗi khi xóa ảnh: ${error.message}`);
    }
  };

  const handleReplaceImage = async (file: File) => {
    if (!colorImage) return;

    setIsReplacing(true);

    try {
      const uploadResult = await uploadImages({
        files: [file],
        folder: 'color-images',
      }).unwrap();

      const imageUrl = uploadResult.data && uploadResult.data.length > 0 
        ? uploadResult.data[0] 
        : '';

      if (!imageUrl) {
        throw new Error('Upload failed: No URL returned');
      }

      await updateColorImage({
        id: colorImage.id,
        productId,
        colorId,
        imageUrl,
        altText: file.name,
      }).unwrap();

      toast.success('Đã thay thế ảnh');
      await refetch();
      onSuccess?.();
    } catch (error: any) {
      toast.error(`Lỗi khi thay thế ảnh: ${error.message}`);
    } finally {
      setIsReplacing(false);
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
          className="max-w-4xl w-[95vw] max-h-[95vh] overflow-hidden flex flex-col"
          onPointerDownOutside={isAnyOperationInProgress ? (e) => e.preventDefault() : undefined}
          onEscapeKeyDown={isAnyOperationInProgress ? (e) => e.preventDefault() : undefined}
        >
          <DialogHeader className="flex-shrink-0 pb-4">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              Quản lý hình ảnh theo màu sắc
              {isAnyOperationInProgress && (
                <div className="flex items-center gap-1 text-blue-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-normal">Đang xử lý...</span>
                </div>
              )}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Upload, xóa hoặc thay thế hình ảnh cho màu sắc này của sản phẩm.
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
            {isLoadingImage ? (
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
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(Array.from(e.target.files));
                        e.target.value = '';
                      }
                    }}
                    disabled={isAnyOperationInProgress}
                  />
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload className={`w-8 h-8 mb-2 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${isDragActive ? 'text-blue-600' : 'text-gray-600'}`}>
                      {isDragActive ? 'Thả ảnh vào đây' : colorImage ? 'Nhấn để thay thế ảnh hoặc kéo thả' : 'Nhấn để chọn ảnh hoặc kéo thả'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Hỗ trợ JPG, PNG, GIF (Ctrl+V để dán)
                    </p>
                  </div>
                </div>

                {!colorImage ? (
                  <div className="text-center py-12 text-gray-500">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Chưa có ảnh nào</p>
                    <p className="text-sm">Upload ảnh để bắt đầu</p>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="relative group border-2 rounded-lg overflow-hidden transition-all duration-200 border-gray-200 hover:shadow-lg max-w-md w-full">
                      <div className="aspect-square bg-gray-100 relative">
                        <img
                          src={colorImage.imageUrl}
                          alt={colorImage.altText || 'Color image'}
                          className="w-full h-full object-cover"
                        />
                        
                        {(isUploading || isReplacing) && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-white" />
                          </div>
                        )}

                        {!isAnyOperationInProgress && (
                          <>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewImage(colorImage.imageUrl);
                                  }}
                                  className="bg-white/90 hover:bg-white text-gray-700"
                                >
                                  <Maximize2 className="w-4 h-4" />
                                </Button>
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
                                      if (e.target.files && e.target.files[0]) {
                                        handleReplaceImage(e.target.files[0]);
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
                                    handleDeleteClick();
                                  }}
                                  className="bg-red-500/90 hover:bg-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
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
                  <span>{colorImage ? 'Đã có ảnh' : 'Chưa có ảnh'}</span>
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

export default ColorImageGalleryModal;

