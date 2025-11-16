'use client';
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/shadcn/components/ui/dialog";
import { Button } from "@/core/shadcn/components/ui/button";
import { Textarea } from "@/core/shadcn/components/ui/textarea";
import { Label } from "@/core/shadcn/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/shadcn/components/ui/select";
import { AlertTriangle } from "lucide-react";
import { Customer } from "@/lib/services/modules/customerService/type";
import { useBlockCustomerMutation } from "@/lib/services/modules/customerService";
import { toast } from "sonner";

interface BlockCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSuccess?: () => void;
}

const schema = yup.object().shape({
  reason: yup
    .string()
    .required("Lý do khoá tài khoản là bắt buộc")
    .min(5, "Lý do phải có ít nhất 5 ký tự")
    .max(500, "Lý do không được quá 500 ký tự"),
});

const PREDEFINED_REASONS = [
  "Vi phạm điều khoản sử dụng",
  "Hành vi gian lận trong thanh toán",
  "Spam hoặc quảng cáo không mong muốn",
  "Sử dụng thông tin giả mạo",
  "Hành vi xúc phạm người dùng khác",
  "Vi phạm bản quyền",
  "Hoạt động đáng ngờ",
  "Yêu cầu từ khách hàng",
  "Khác (nhập lý do cụ thể)"
];

export const BlockCustomerModal = ({ isOpen, onClose, customer, onSuccess }: BlockCustomerModalProps) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [blockCustomer, { isLoading }] = useBlockCustomerMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      reason: "",
    },
  });

  const watchedReason = watch("reason");

  const handleReasonChange = (value: string) => {
    setSelectedReason(value);
    if (value !== "Khác (nhập lý do cụ thể)") {
      setValue("reason", value);
    } else {
      setValue("reason", "");
    }
  };

  const onSubmit = async (data: { reason: string }) => {
    if (!customer) return;

    try {
      await blockCustomer({ id: customer.id, reason: data.reason }).unwrap();
      toast.success('Khoá tài khoản thành công');
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Khoá tài khoản thất bại');
    }
  };

  const handleClose = () => {
    onClose();
    reset();
    setSelectedReason("");
  };

  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            Khoá tài khoản khách hàng
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Thông tin khách hàng:</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Tên:</span> {customer.fullName}</p>
              <p><span className="font-medium">Email:</span> {customer.email}</p>
              <p><span className="font-medium">SĐT:</span> {customer.phoneNumber}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Chọn lý do khoá tài khoản</Label>
              <Select value={selectedReason} onValueChange={handleReasonChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lý do..." />
                </SelectTrigger>
                <SelectContent>
                  {PREDEFINED_REASONS.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedReason === "Khác (nhập lý do cụ thể)" && (
              <div className="space-y-2">
                <Label htmlFor="reason">Nhập lý do cụ thể</Label>
                <Textarea
                  id="reason"
                  placeholder="Nhập lý do khoá tài khoản..."
                  rows={3}
                  {...register("reason")}
                />
                {errors.reason && (
                  <p className="text-sm text-red-500">{errors.reason.message}</p>
                )}
              </div>
            )}

            {watchedReason && (
              <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                <p className="text-sm text-orange-800">
                  <span className="font-medium">Lý do sẽ gửi:</span> {watchedReason}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || !watchedReason}
                variant="default"
              >
                {isLoading ? "Đang xử lý..." : "Khoá tài khoản"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

