export interface ProductImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  onSuccess?: () => void;
}

