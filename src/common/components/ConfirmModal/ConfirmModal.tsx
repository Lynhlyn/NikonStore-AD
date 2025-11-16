import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/core/shadcn/components/ui/dialog';
import { Button } from '@/core/shadcn/components/ui/button';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';


export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info' | 'success';
  isLoading?: boolean;
}

const getIconByType = (type: string) => {
  switch (type) {
    case 'warning':
      return <AlertTriangle className="h-6 w-6 text-amber-500" />;
    case 'danger':
      return <XCircle className="h-6 w-6 text-red-500" />;
    case 'success':
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    case 'info':
    default:
      return <Info className="h-6 w-6 text-blue-500" />;
  }
};

const getConfirmButtonStyle = (type: string) => {
  switch (type) {
    case 'warning':
      return 'bg-amber-500 hover:bg-amber-600 text-white';
    case 'danger':
      return 'bg-red-500 hover:bg-red-600 text-white';
    case 'success':
      return 'bg-green-500 hover:bg-green-600 text-white';
    case 'info':
    default:
      return 'bg-bgPrimarySolidDefault hover:bg-bgPrimarySolidHover text-white';
  }
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'info',
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getIconByType(type)}
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          </div>
        </DialogHeader>
        
        <DialogDescription className="text-gray-600 py-4">
          {message}
        </DialogDescription>

        <DialogFooter className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="min-w-[80px]"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`min-w-[80px] ${getConfirmButtonStyle(type)}`}
          >
            {isLoading ? 'Đang xử lý...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

