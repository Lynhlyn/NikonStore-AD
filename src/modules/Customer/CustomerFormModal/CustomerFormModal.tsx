'use client';
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/shadcn/components/ui/dialog";
import { Button } from "@/core/shadcn/components/ui/button";
import { Input } from "@/core/shadcn/components/ui/input";
import { Label } from "@/core/shadcn/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/shadcn/components/ui/select";
import { Badge } from "@/core/shadcn/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/shadcn/components/ui/card";
import { CalendarDays, User, UserCheck } from "lucide-react";
import { 
  useAddCustomerMutation, 
  useUpdateCustomerMutation 
} from "@/lib/services/modules/customerService";
import { Customer } from "@/lib/services/modules/customerService/type";
import { ConfirmModal } from "@/common/components/ConfirmModal";
import { genderMapper } from "@/lib/utils/genderMapper";

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSuccess?: () => void;
}

const schema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .max(50, "Tên đăng nhập không được quá 50 ký tự")
    .matches(/^[a-zA-Z0-9_]+$/, "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới")
    .nullable()
    .transform((value) => value === '' ? null : value),
  fullName: yup
    .string()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên không được quá 100 ký tự")
    .nullable()
    .transform((value) => value === '' ? null : value),
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email là bắt buộc")
    .max(255, "Email không được quá 255 ký tự"),
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại phải gồm 10 số và bắt đầu bằng 0"),
  gender: yup
    .string()
    .oneOf(["Nam", "Nữ", "Khác", ""], "Giới tính không hợp lệ"),
  dateOfBirth: yup.string(),
  status: yup
    .number()
    .oneOf([0, 1, 11], "Trạng thái không hợp lệ"),
  isGuest: yup.boolean().default(false),
});

const RequiredLabel = ({ htmlFor, children, required = false }: { 
  htmlFor: string; 
  children: React.ReactNode; 
  required?: boolean;
}) => (
  <Label htmlFor={htmlFor}>
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </Label>
);

export const CustomerFormModal = ({ isOpen, onClose, customer, onSuccess }: CustomerFormModalProps) => {
  const [addCustomer, { isLoading: isAdding }] = useAddCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  
  const isEdit = !!customer;
  const isLoading = isAdding || isUpdating;

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'info' as 'warning' | 'danger' | 'info' | 'success',
    confirmText: 'Xác nhận',
    isLoading: false,
  });
  const [pendingFormData, setPendingFormData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: customer?.username || "",
      fullName: customer?.fullName || "",
      email: customer?.email || "",
      phoneNumber: customer?.phoneNumber || "",
      gender: customer?.gender ? genderMapper.toVietnamese(customer.gender) : (customer ? "" : "Nam"),
      dateOfBirth: customer?.dateOfBirth || "",
      status: customer?.status === 'ACTIVE' ? 1 : 
              customer?.status === 'INACTIVE' ? 0 : 
              customer?.status === 'BLOCKED' ? 11 :
              typeof customer?.status === 'number' ? customer?.status : 1,
      isGuest: customer?.isGuest ?? false,
    },
  });

  const watchedGender = watch("gender");
  const watchedStatus = watch("status");

  useEffect(() => {
    if (customer) {
      const statusValue = customer.status === 'ACTIVE' ? 1 : 
                         customer.status === 'INACTIVE' ? 0 : 
                         customer.status === 'BLOCKED' ? 11 :
                         typeof customer.status === 'number' ? customer.status : 1;
      
      const formData = {
        username: customer.username || "",
        fullName: customer.fullName || "",
        email: customer.email || "",
        phoneNumber: customer.phoneNumber || "",
        gender: customer.gender ? genderMapper.toVietnamese(customer.gender) : "",
        dateOfBirth: customer.dateOfBirth || "",
        status: statusValue,
        isGuest: customer.isGuest ?? false,
      };
      
      reset(formData);
      
      setTimeout(() => {
        setValue("status", statusValue);
        setValue("gender", customer.gender ? genderMapper.toVietnamese(customer.gender) : "");
        setValue("isGuest", customer.isGuest ?? false);
      }, 0);
    } else {
      reset({
        username: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        gender: "Nam",
        dateOfBirth: "",
        status: 1,
        isGuest: false,
      });
    }
  }, [customer, reset, setValue]);

  const clearFieldError = (fieldName: string) => {
    if (errors[fieldName as keyof typeof errors]?.type === 'manual') {
      setError(fieldName as any, { type: '', message: '' });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const onSubmit = async (data: any) => {
    const action = isEdit ? 'cập nhật' : 'thêm mới';
    const actionTitle = isEdit ? 'Xác nhận cập nhật khách hàng' : 'Xác nhận thêm khách hàng mới';
    const actionMessage = isEdit 
      ? `Bạn có chắc chắn muốn cập nhật thông tin khách hàng "${data.fullName || data.email}"?`
      : `Bạn có chắc chắn muốn thêm khách hàng mới với email "${data.email}"?`;

    setPendingFormData(data);
    setConfirmModalConfig({
      title: actionTitle,
      message: actionMessage,
      type: isEdit ? 'info' : 'success',
      confirmText: isEdit ? 'Cập nhật' : 'Thêm mới',
      onConfirm: () => performSubmit(data),
      isLoading: false,
    });
    setIsConfirmModalOpen(true);
  };

  const performSubmit = async (data: any) => {
    setConfirmModalConfig(prev => ({ ...prev, isLoading: true }));
    
    try {
      if (isEdit && customer) {
        await updateCustomer({
          id: customer.id,
          data: {
            username: data.username,
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            gender: genderMapper.toEnglish(data.gender),
            dateOfBirth: data.dateOfBirth,
            status: data.status,
          },
        }).unwrap();
        toast.success('Cập nhật khách hàng thành công');
      } else {
        await addCustomer({
          username: data.username,
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          gender: genderMapper.toEnglish(data.gender),
          dateOfBirth: data.dateOfBirth,
          isGuest: false,
          status: data.status,
        }).unwrap();
        toast.success('Thêm khách hàng thành công');
      }
      setIsConfirmModalOpen(false);
      onClose();
      reset();
      onSuccess?.();
    } catch (error: any) {
      if (error?.status === 422) {
        const errors = error.data;
        if (errors.username) {
          setError('username', {
            type: 'manual',
            message: errors.username || 'Tên đăng nhập đã tồn tại trong hệ thống'
          });
        }
        if (errors.email) {
          setError('email', {
            type: 'manual',
            message: errors.email || 'Email đã tồn tại trong hệ thống'
          });
        }
        if (errors.phone) {
          setError('phoneNumber', {
            type: 'manual',
            message: errors.phone || 'Số điện thoại đã tồn tại trong hệ thống'
          });
        }
        setIsConfirmModalOpen(false);
        toast.error(error?.message || 'Có lỗi xảy ra khi xử lý dữ liệu');
      } else {
        setIsConfirmModalOpen(false);
        toast.error('Có lỗi xảy ra! Vui lòng thử lại');
      }
    } finally {
      setConfirmModalConfig(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? (
              <>
                <User className="h-5 w-5" />
                Chỉnh sửa khách hàng
              </>
            ) : (
              <>
                <User className="h-5 w-5" />
                Thêm khách hàng mới
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {isEdit && customer && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Thông tin hiện tại</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Ngày tạo:</span>
                  <span className="font-medium">
                    {customer.createdAt ? formatDate(new Date(customer.createdAt)) : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Loại tài khoản:</span>
                  <Badge variant={customer.isGuest ? "secondary" : "default"}>
                    {customer.isGuest ? "Guest" : "Thành viên"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" key={customer?.id || 'new'} noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <RequiredLabel htmlFor="username">Tên đăng nhập</RequiredLabel>
              <Input
                id="username"
                placeholder="Tên đăng nhập"
                {...register("username")}
                onChange={(e) => {
                  register("username").onChange(e);
                  clearFieldError('username');
                }}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <RequiredLabel htmlFor="fullName">Họ và tên</RequiredLabel>
              <Input
                id="fullName"
                placeholder="Họ và tên"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <RequiredLabel htmlFor="email" required>Email</RequiredLabel>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                {...register("email")}
                onChange={(e) => {
                  register("email").onChange(e);
                  clearFieldError('email');
                }}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <RequiredLabel htmlFor="phoneNumber" required>Số điện thoại</RequiredLabel>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Nhập số điện thoại"
                inputMode="numeric"
                pattern="\\d*"
                maxLength={11}
                {...register("phoneNumber")}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0,11);
                  if (e.target.value !== digits) e.target.value = digits;
                  register("phoneNumber").onChange(e);
                  clearFieldError('phoneNumber');
                }}
                onKeyDown={(e) => {
                  const allowed = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End'];
                  if (/^\d$/.test(e.key) || allowed.includes(e.key)) return;
                  e.preventDefault();
                }}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <RequiredLabel htmlFor="gender">Giới tính</RequiredLabel>
              <Select
                value={watchedGender}
                onValueChange={(value) => setValue("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nam">Nam</SelectItem>
                  <SelectItem value="Nữ">Nữ</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <RequiredLabel htmlFor="dateOfBirth">Ngày sinh</RequiredLabel>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <RequiredLabel htmlFor="status">Trạng thái</RequiredLabel>
              <Select
                value={watchedStatus?.toString()}
                onValueChange={(value) => setValue("status", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Hoạt động</SelectItem>
                  <SelectItem value="0">Không hoạt động</SelectItem>
                  <SelectItem value="11">Khoá</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-black text-white hover:bg-gray-800">
              {isLoading ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </DialogContent>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmModalConfig.onConfirm}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        type={confirmModalConfig.type}
        confirmText={confirmModalConfig.confirmText}
        isLoading={confirmModalConfig.isLoading}
      />
    </Dialog>
  );
};

