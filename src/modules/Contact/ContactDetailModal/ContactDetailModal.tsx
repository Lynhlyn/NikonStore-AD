'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/core/shadcn/components/ui/dialog";
import { Badge } from "@/core/shadcn/components/ui/badge";
import { Label } from "@/core/shadcn/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/shadcn/components/ui/select";
import { Contact } from "@/lib/services/modules/contactService/type";

interface ContactDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  onContactDataChange: () => void;
  onUpdateStatus: (contact: Contact, newStatus: string) => Promise<void>;
}

export const ContactDetailModal = ({
  isOpen,
  onClose,
  contact,
  onContactDataChange,
  onUpdateStatus,
}: ContactDetailModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>(contact?.status || 'INACTIVE');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (contact) {
      setSelectedStatus(contact.status);
    }
  }, [contact]);

  if (!contact) return null;

  const getStatusText = (status: string) => {
    if (status === "INACTIVE") {
      return "Chưa xem";
    } else if (status === "ACTIVE") {
      return "Đã xem";
    } else if (status === "COMPLETED") {
      return "Đã hỗ trợ";
    } else {
      return status;
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "INACTIVE") {
      return "bg-gray-100 text-gray-800";
    } else if (status === "ACTIVE") {
      return "bg-blue-100 text-blue-800";
    } else if (status === "COMPLETED") {
      return "bg-green-100 text-green-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailableStatuses = (currentStatus: string): string[] => {
    if (currentStatus === "INACTIVE") {
      return ["ACTIVE"];
    } else if (currentStatus === "ACTIVE") {
      return ["COMPLETED"];
    } else if (currentStatus === "COMPLETED") {
      return [];
    }
    return [];
  };

  const availableStatuses = getAvailableStatuses(contact.status);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === contact.status) return;
    
    if (!availableStatuses.includes(newStatus)) {
      return;
    }
    
    setIsUpdating(true);
    try {
      await onUpdateStatus(contact, newStatus);
      setSelectedStatus(newStatus);
      onContactDataChange();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết liên hệ</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về yêu cầu hỗ trợ từ khách hàng
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Tên khách hàng</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <p className="text-sm">{contact.name}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Số điện thoại</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <p className="text-sm">{contact.phone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Nội dung liên hệ</Label>
            <div className="p-4 bg-gray-50 rounded-md border min-h-[150px]">
              <p className="text-sm whitespace-pre-wrap">{contact.content}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Trạng thái hiện tại</Label>
              <div className="p-3">
                <Badge className={getStatusColor(contact.status)}>
                  {getStatusText(contact.status)}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Ngày gửi</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <p className="text-sm">
                  {new Date(contact.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Cập nhật trạng thái</Label>
            {availableStatuses.length > 0 ? (
              <Select
                value={selectedStatus}
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusText(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="p-3 bg-gray-50 rounded-md border">
                <p className="text-sm text-gray-500">
                  Trạng thái đã đạt mức cuối cùng, không thể cập nhật
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

