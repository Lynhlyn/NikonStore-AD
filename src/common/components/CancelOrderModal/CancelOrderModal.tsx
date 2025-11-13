'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/core/shadcn/components/ui/dialog";
import { Button } from "@/core/shadcn/components/ui/button";
import { UITextArea } from "@/core/ui/UITextArea";
import { ORDER_CANCEL_REASONS, EOrderCancelReason } from "@/common/enums/order";

interface CancelOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string, note?: string) => void;
  isLoading?: boolean;
  orderNumber?: string;
}

interface CancelReasonOption {
  value: string;
  label: string;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  orderNumber
}) => {
  const [selectedReason, setSelectedReason] = useState<CancelReasonOption | null>(null);
  const [note, setNote] = useState('');

  const handleConfirm = () => {
    if (selectedReason) {
      const reason = selectedReason.value === EOrderCancelReason.OTHER 
        ? note 
        : selectedReason.label;
      onConfirm(reason, note);
    }
  };

  const handleClose = () => {
    setSelectedReason(null);
    setNote('');
    onOpenChange(false);
  };

  const isConfirmDisabled = !selectedReason || (selectedReason.value === EOrderCancelReason.OTHER && !note.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Hủy đơn hàng
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {orderNumber && `Bạn đang hủy đơn hàng #${orderNumber}. Vui lòng chọn lý do hủy đơn.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lý do hủy đơn <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {ORDER_CANCEL_REASONS.map((reason) => (
                <label key={reason.value} className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-50">
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason.value}
                    checked={selectedReason?.value === reason.value}
                    onChange={() => setSelectedReason(reason)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason?.value === EOrderCancelReason.OTHER && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do khác <span className="text-red-500">*</span>
              </label>
              <UITextArea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập lý do hủy đơn..."
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isConfirmDisabled || isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Đang xử lý...' : 'Xác nhận hủy'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelOrderModal;

