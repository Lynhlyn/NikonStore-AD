export interface ColorImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  colorId: number;
  onSuccess?: () => void;
}

