'use client';

import { useState } from 'react';
import { Button } from '@/core/shadcn/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateStatusOrderMutation, useCancelOrderMutation } from '@/lib/services/modules/orderService';
import { OrderStatus } from '@/common/utils/orderStatusMapper';
import { StatusActionsProps } from './types';
import CancelOrderModal from '@/common/components/CancelOrderModal';
import FailedDeliveryModal from '@/common/components/FailedDeliveryModal';

export function StatusActions({ orderId, currentStatus, onStatusChange, orderNumber }: StatusActionsProps) {
  const [updateStatus, { isLoading }] = useUpdateStatusOrderMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const handleUpdateStatus = async (afterStatus: number, reason?: string) => {
    try {
      await updateStatus({
        orderId,
        afterStatus,
        reason: reason,
      }).unwrap();
      toast.success('Cập nhật trạng thái thành công');
      setShowFailedModal(false);
      onStatusChange?.();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleConfirmCancel = async (reason: string) => {
    try {
      await cancelOrder({
        orderId,
        status: OrderStatus.CANCELLED,
        reason: reason,
      }).unwrap();
      toast.success('Hủy đơn hàng thành công');
      setCancelModalOpen(false);
      onStatusChange?.();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng');
    }
  };

  const handleFailedDelivery = async (reason: string) => {
    await handleUpdateStatus(OrderStatus.FAILED_DELIVERY, reason);
  };

  const handleOpenCancelModal = () => {
    setCancelModalOpen(true);
  };

  const actions: JSX.Element[] = [];

  if (currentStatus === OrderStatus.PENDING_CONFIRMATION) {
    actions.push(
      <Button
        key="confirm"
        onClick={() => handleUpdateStatus(OrderStatus.CONFIRMED)}
        disabled={isLoading}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        Xác nhận đơn hàng
      </Button>
    );
    actions.push(
      <Button
        key="cancel"
        variant="destructive"
        onClick={handleOpenCancelModal}
        className="flex items-center gap-2"
      >
        Hủy đơn hàng
      </Button>
    );
  }

  if (currentStatus === OrderStatus.CONFIRMED) {
    actions.push(
      <Button
        key="preparing"
        onClick={() => handleUpdateStatus(OrderStatus.PREPARING)}
        disabled={isLoading}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-sm"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        Chuẩn bị hàng
      </Button>
    );
    actions.push(
      <Button
        key="cancel"
        variant="destructive"
        onClick={handleOpenCancelModal}
        className="flex items-center gap-2"
      >
        Hủy đơn hàng
      </Button>
    );
  }

  if (currentStatus === OrderStatus.PREPARING) {
    actions.push(
      <Button
        key="shipping"
        onClick={() => handleUpdateStatus(OrderStatus.SHIPPING)}
        disabled={isLoading}
        className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium shadow-sm"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        Giao hàng
      </Button>
    );
  }

  if (currentStatus === OrderStatus.SHIPPING) {
    actions.push(
      <Button
        key="completed"
        onClick={() => handleUpdateStatus(OrderStatus.COMPLETED)}
        disabled={isLoading}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        Hoàn thành
      </Button>
    );
    actions.push(
      <Button
        key="failed"
        variant="outline"
        onClick={() => setShowFailedModal(true)}
        disabled={isLoading}
        className="flex items-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-50 font-medium"
      >
        Giao hàng thất bại
      </Button>
    );
  }

  if (currentStatus === OrderStatus.PENDING_PAYMENT) {
    actions.push(
      <Button
        key="cancel"
        variant="destructive"
        onClick={handleOpenCancelModal}
        className="flex items-center gap-2"
      >
        Hủy đơn hàng
      </Button>
    );
  }

  if (actions.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {actions.map((action, index) => (
          <div key={index}>{action}</div>
        ))}
      </div>
      <CancelOrderModal
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        onConfirm={handleConfirmCancel}
        isLoading={isCancelling}
        orderNumber={orderNumber}
      />
      {showFailedModal && (
        <FailedDeliveryModal
          open={showFailedModal}
          onOpenChange={setShowFailedModal}
          onConfirm={handleFailedDelivery}
          isLoading={isLoading}
          orderNumber={orderNumber}
        />
      )}
    </>
  );
}

