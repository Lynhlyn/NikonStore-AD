'use client';
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/shadcn/components/ui/dialog";
import { Button } from "@/core/shadcn/components/ui/button";
import { Badge } from "@/core/shadcn/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/shadcn/components/ui/card";
import { User } from "lucide-react";
import { Customer } from "@/lib/services/modules/customerService/type";

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onCustomerDataChange?: () => void;
}

export const CustomerDetailModal = ({ isOpen, onClose, customer, onCustomerDataChange }: CustomerDetailModalProps) => {
  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Chi tiết khách hàng</DialogTitle>
        </DialogHeader>
        
        <Card className="h-fit">
          <CardHeader className="pb-4 flex flex-col items-center text-center">
            <CardTitle className="flex items-center gap-2 justify-center">
              <User className="w-5 h-5 text-gray-700" />
              <span className="text-lg font-semibold tracking-wide md:text-xl">Tài khoản</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-3 ring-1 ring-gray-200">
                  <span className="text-2xl font-semibold text-gray-500">
                    {customer.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <h3 className="text-base font-semibold leading-tight break-words max-w-[200px]">
                  {customer.fullName}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{customer.gender || 'Chưa rõ'}</p>
              </div>

              <div className="w-full space-y-2 text-sm">
                <div className="flex gap-2 justify-center">
                  <span className="text-black font-semibold">Email:</span>
                  <span className="font-medium break-all text-gray-700">{customer.email}</span>
                </div>
                <div className="flex gap-2 justify-center">
                  <span className="text-black font-semibold">SĐT:</span>
                  <span className="font-medium break-all text-gray-700">{customer.phoneNumber}</span>
                </div>
                <div className="flex gap-2 justify-center">
                  <span className="text-black font-semibold">Username:</span>
                  <span className="font-medium break-all text-gray-700">{customer.username}</span>
                </div>
                
                <div className="flex gap-2 justify-center items-center">
                  <span className="text-black font-semibold">Loại:</span>
                  <Badge
                    className={
                      `text-xs px-1.5 py-0 h-4 border-0 ${
                        customer.isGuest
                          ? 'bg-amber-100 text-amber-800 pointer-events-none'
                          : 'bg-blue-100 text-blue-700 pointer-events-none'
                      }`
                    }
                  >
                    {customer.isGuest ? 'Vãng lai' : 'Thành viên'}
                  </Badge>
                </div>
                <div className="flex gap-2 justify-center items-center">
                  <span className="text-black font-semibold">Trạng thái:</span>
                  <Badge className={
                    ((customer.status === 1 || customer.status === 'ACTIVE') ? 'bg-green-100 text-green-700' :
                    (customer.status === 11 || customer.status === 'BLOCKED') ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700') + ' pointer-events-none'
                  }>
                    {(customer.status === 1 || customer.status === 'ACTIVE') ? 'Hoạt động' :
                      (customer.status === 11 || customer.status === 'BLOCKED') ? 'Khoá' : 'Vô hiệu hóa'}
                  </Badge>
                </div>
                {customer.dateOfBirth && (
                  <div className="flex gap-2 justify-center">
                    <span className="text-black font-semibold">Ngày sinh:</span>
                    <span className="font-medium break-all text-gray-700">{customer.dateOfBirth}</span>
                  </div>
                )}
                {customer.createdAt && (
                  <div className="flex gap-2 justify-center">
                    <span className="text-black font-semibold">Ngày tạo:</span>
                    <span className="font-medium break-all text-gray-700">
                      {new Date(customer.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

