'use client';

import { useState } from 'react';
import { Button } from '@/core/shadcn/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateStatusOrderMutation } from '@/lib/services/modules/orderService';
import { OrderStatus } from '@/common/utils/orderStatusMapper';
import { StatusActionsProps } from './types';

export function StatusActions({ orderId, currentStatus, onStatusChange }: StatusActionsProps) {
  const [updateStatus, { isLoading }] = useUpdateStatusOrderMutation();
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [failedReason, setFailedReason] = useState('');

  const handleFailedDelivery = async () => {
    if (!failedReason.trim()) {
      toast.error('Vui lòng nhập lý do giao hàng thất bại');
      return;
    }

    try {
      await updateStatus({
        orderId,
        afterStatus: OrderStatus.FAILED_DELIVERY,
        reason: failedReason,
      }).unwrap();
      toast.success('Cập nhật trạng thái thành công');
      setShowFailedModal(false);
      setFailedReason('');
      onStatusChange?.();
    } catch {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  if (currentStatus === OrderStatus.SHIPPING) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setShowFailedModal(true)}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Giao hàng thất bại
        </Button>
        {showFailedModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Giao hàng thất bại</h3>
              <textarea
                value={failedReason}
                onChange={(e) => setFailedReason(e.target.value)}
                placeholder="Nhập lý do giao hàng thất bại..."
                className="w-full p-2 border rounded mb-4 min-h-[100px]"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowFailedModal(false);
                    setFailedReason('');
                  }}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleFailedDelivery}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Xác nhận
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

