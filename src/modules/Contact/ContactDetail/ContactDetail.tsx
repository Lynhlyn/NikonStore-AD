'use client';

import { useRouter } from 'next/navigation';
import { useFetchContactByIdQuery, useUpdateContactMutation } from '@/lib/services/modules/contactService';
import { Button } from '@/core/shadcn/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shadcn/components/ui/card';
import { Badge } from '@/core/shadcn/components/ui/badge';
import { Label } from '@/core/shadcn/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/shadcn/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useAppNavigation } from '@/common/hooks';
import { routerApp } from '@/router';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

interface ContactDetailProps {
  contactId: number;
}

export default function ContactDetail({ contactId }: ContactDetailProps) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const { data: contact, isLoading, refetch } = useFetchContactByIdQuery(contactId);
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    if (contact) {
      setSelectedStatus(contact.status);
    }
  }, [contact]);

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

  const handleStatusChange = async (newStatus: string) => {
    if (!contact || newStatus === contact.status) return;
    
    try {
      await updateContact({
        id: contact.id,
        data: {
          name: contact.name,
          phone: contact.phone,
          content: contact.content,
          status: newStatus,
        },
      }).unwrap();
      toast.success('Cập nhật trạng thái thành công');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Cập nhật trạng thái thất bại');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy liên hệ</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push(getRouteWithRole(routerApp.contact.list))}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chi tiết liên hệ</h1>
          <p className="text-muted-foreground mt-2">Thông tin chi tiết về yêu cầu hỗ trợ từ khách hàng</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(getRouteWithRole(routerApp.contact.list))}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin liên hệ</CardTitle>
          <CardDescription>Chi tiết yêu cầu hỗ trợ từ khách hàng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
            <Select
              value={selectedStatus}
              onValueChange={(value) => {
                setSelectedStatus(value);
                handleStatusChange(value);
              }}
              disabled={isUpdating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INACTIVE">Chưa xem</SelectItem>
                <SelectItem value="ACTIVE">Đã xem</SelectItem>
                <SelectItem value="COMPLETED">Đã hỗ trợ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

