'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Editor } from '@tinymce/tinymce-react';
import type { EmailAction as EmailActionType } from '@/lib/services/modules/templateEmailService/type';
import {
  useAddTemplateEmailMutation,
  useUpdateTemplateEmailMutation,
  useFetchTemplateEmailByIdQuery,
} from '@/lib/services/modules/templateEmailService';
import { Button } from '@/core/shadcn/components/ui/button';
import { Input } from '@/core/shadcn/components/ui/input';
import { Label } from '@/core/shadcn/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shadcn/components/ui/card';
import { UISingleSelect } from '@/core/ui/UISingleSelect';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import { ArrowLeft, Save, Eye, Code, Mail, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppNavigation } from '@/common/hooks';
import { routerApp } from '@/router';
import { EMAIL_ACTION_OPTIONS } from '@/modules/TemplateEmail/emailActions';

type TemplateEmailFormValues = {
  action: EmailActionType | '';
  subject: string;
  content: string;
};

type VariableHint = {
  key: string;
  label: string;
  description: string;
};

const EMAIL_VARIABLE_HINTS: Record<EmailActionType | 'DEFAULT', VariableHint[]> = {
  REGISTER_SUCCESS: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'fullName', label: 'Họ tên đầy đủ', description: 'Họ tên khách hàng' },
    { key: 'frontendUrl', label: 'Trang chủ', description: 'Link trang web chính' },
  ],
  CLIENT_FORGOT_PASSWORD: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'fullName', label: 'Họ tên đầy đủ', description: 'Họ tên khách hàng' },
    {
      key: 'resetToken',
      label: 'Token đặt lại mật khẩu',
      description: 'Chuỗi token dùng để tạo link đặt lại mật khẩu',
    },
    { key: 'frontendUrl', label: 'URL frontend', description: 'Domain frontend để ghép link đặt lại mật khẩu' },
  ],
  FORGOT_PASSWORD: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'fullName', label: 'Họ tên đầy đủ', description: 'Họ tên khách hàng' },
    { key: 'resetToken', label: 'Token đặt lại mật khẩu', description: 'Chuỗi token dùng để tạo link đặt lại mật khẩu' },
    { key: 'frontendUrl', label: 'URL frontend', description: 'Domain frontend để ghép link đặt lại mật khẩu' },
  ],
  ADMIN_FORGOT_PASSWORD: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'fullName', label: 'Họ tên đầy đủ', description: 'Họ tên khách hàng hoặc admin' },
    {
      key: 'resetToken',
      label: 'Token đặt lại mật khẩu',
      description: 'Token dùng trong link đặt lại mật khẩu',
    },
    { key: 'role', label: 'Vai trò', description: 'Vai trò tài khoản admin nếu có' },
    { key: 'frontendAdminUrl', label: 'URL admin', description: 'Domain trang admin để ghép link đặt lại' },
  ],
  RESET_PASSWORD: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'fullName', label: 'Họ tên đầy đủ', description: 'Họ tên khách hàng hoặc admin' },
    { key: 'resetToken', label: 'Token đặt lại mật khẩu', description: 'Token dùng trong link đặt lại mật khẩu' },
    { key: 'role', label: 'Vai trò', description: 'Vai trò tài khoản admin nếu có' },
    { key: 'frontendAdminUrl', label: 'URL admin', description: 'Domain trang admin để ghép link đặt lại' },
  ],
  PASSWORD_RESET: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'fullName', label: 'Họ tên đầy đủ', description: 'Họ tên khách hàng' },
    { key: 'frontendUrl', label: 'Trang chủ', description: 'Link trang web chính' },
  ],
  PASSWORD_CHANGED: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'fullName', label: 'Họ tên đầy đủ', description: 'Họ tên khách hàng' },
    { key: 'frontendUrl', label: 'Trang chủ', description: 'Link quay lại website sau khi đổi mật khẩu' },
  ],
  VERIFY_EMAIL: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'fullName', label: 'Họ tên đầy đủ', description: 'Họ tên khách hàng' },
    { key: 'verificationToken', label: 'Token xác thực', description: 'Token dùng để tạo link xác thực email' },
    { key: 'frontendUrl', label: 'URL frontend', description: 'Domain frontend để ghép link xác thực' },
  ],
  WELCOME: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'fullName', label: 'Họ tên đầy đủ', description: 'Họ tên khách hàng' },
    { key: 'frontendUrl', label: 'Trang chủ', description: 'Link trang web chính' },
  ],
  ORDER_PENDING_CONFIRMATION: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'customerName', label: 'Tên khách hàng', description: 'Tên khách hàng trong đơn hàng' },
    { key: 'orderNumber', label: 'Mã đơn hàng', description: 'Mã đơn hàng hiển thị cho khách' },
    { key: 'orderTotal', label: 'Tổng tiền', description: 'Tổng giá trị đơn hàng' },
    { key: 'frontendUrl', label: 'Trang chủ', description: 'Link tra cứu đơn hàng' },
  ],
  ORDER_CONFIRMATION: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'orderNumber', label: 'Mã đơn hàng', description: 'Mã đơn hàng hiển thị cho khách' },
    { key: 'orderTotal', label: 'Tổng tiền', description: 'Tổng giá trị đơn hàng' },
  ],
  ORDER_CONFIRM: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'orderNumber', label: 'Mã đơn hàng', description: 'Mã đơn hàng hiển thị cho khách' },
    { key: 'orderTotal', label: 'Tổng tiền', description: 'Tổng giá trị đơn hàng' },
  ],
  CONFIRMATION: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'orderNumber', label: 'Mã đơn hàng', description: 'Mã đơn hàng hiển thị cho khách' },
  ],
  ORDER_CONFIRMED: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'customerName', label: 'Tên khách hàng', description: 'Tên khách hàng trong đơn hàng' },
    { key: 'orderNumber', label: 'Mã đơn hàng', description: 'Mã đơn hàng hiển thị cho khách' },
    { key: 'orderTotal', label: 'Tổng tiền', description: 'Tổng giá trị đơn hàng' },
    { key: 'frontendUrl', label: 'Trang chủ', description: 'Link tra cứu đơn hàng' },
  ],
  ORDER_PREPARING: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'customerName', label: 'Tên khách hàng', description: 'Tên khách hàng trong đơn hàng' },
    { key: 'orderNumber', label: 'Mã đơn hàng', description: 'Mã đơn hàng hiển thị cho khách' },
    { key: 'orderTotal', label: 'Tổng tiền', description: 'Tổng giá trị đơn hàng' },
    { key: 'frontendUrl', label: 'Trang chủ', description: 'Link tra cứu đơn hàng' },
  ],
  ORDER_SHIPPING: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'customerName', label: 'Tên khách hàng', description: 'Tên khách hàng trong đơn hàng' },
    { key: 'orderNumber', label: 'Mã đơn hàng', description: 'Mã đơn hàng hiển thị cho khách' },
    { key: 'orderTotal', label: 'Tổng tiền', description: 'Tổng giá trị đơn hàng' },
    { key: 'frontendUrl', label: 'Trang chủ', description: 'Link tra cứu đơn hàng' },
  ],
  ORDER_COMPLETED: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'customerName', label: 'Tên khách hàng', description: 'Tên khách hàng trong đơn hàng' },
    { key: 'orderNumber', label: 'Mã đơn hàng', description: 'Mã đơn hàng hiển thị cho khách' },
    { key: 'orderTotal', label: 'Tổng tiền', description: 'Tổng giá trị đơn hàng' },
    { key: 'frontendUrl', label: 'Trang chủ', description: 'Link đánh giá hoặc mua lại' },
  ],
  ORDER_CANCELLED: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'customerName', label: 'Tên khách hàng', description: 'Tên khách hàng trong đơn hàng' },
    { key: 'orderNumber', label: 'Mã đơn hàng', description: 'Mã đơn hàng hiển thị cho khách' },
    { key: 'reason', label: 'Lý do hủy', description: 'Lý do hủy đơn hàng' },
    { key: 'frontendUrl', label: 'Trang chủ', description: 'Link quay lại cửa hàng' },
  ],
  ORDER_PENDING_PAYMENT: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'customerName', label: 'Tên khách hàng', description: 'Tên khách hàng trong đơn hàng' },
    { key: 'orderNumber', label: 'Mã đơn hàng', description: 'Mã đơn hàng hiển thị cho khách' },
    { key: 'orderTotal', label: 'Tổng tiền', description: 'Tổng giá trị đơn hàng' },
    { key: 'paymentUrl', label: 'Link thanh toán', description: 'Đường dẫn thanh toán online' },
    { key: 'frontendUrl', label: 'Trang chủ', description: 'Link quay lại cửa hàng' },
  ],
  ORDER_FAILED_DELIVERY: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'customerName', label: 'Tên khách hàng', description: 'Tên khách hàng trong đơn hàng' },
    { key: 'orderNumber', label: 'Mã đơn hàng', description: 'Mã đơn hàng hiển thị cho khách' },
    { key: 'reason', label: 'Lý do giao thất bại', description: 'Lý do không giao được hàng' },
    { key: 'frontendUrl', label: 'Trang chủ', description: 'Link hỗ trợ khách hàng' },
  ],
  ACCOUNT_LOCKED: [
    { key: 'fullName', label: 'Họ tên đầy đủ', description: 'Họ tên chủ tài khoản' },
    { key: 'email', label: 'Email', description: 'Email tài khoản bị khóa' },
    { key: 'reason', label: 'Lý do khóa', description: 'Lý do tài khoản bị khóa' },
  ],
  ACCOUNT_UNLOCKED: [
    { key: 'fullName', label: 'Họ tên đầy đủ', description: 'Họ tên chủ tài khoản' },
    { key: 'email', label: 'Email', description: 'Email tài khoản được mở khóa' },
  ],
  ACCOUNT_DISABLED: [
    { key: 'fullName', label: 'Họ tên đầy đủ', description: 'Họ tên chủ tài khoản' },
    { key: 'email', label: 'Email', description: 'Email tài khoản bị vô hiệu hóa' },
    { key: 'reason', label: 'Lý do', description: 'Lý do vô hiệu hóa tài khoản' },
  ],
  PROMOTION: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'frontendUrl', label: 'Trang chủ', description: 'Link xem chi tiết khuyến mãi' },
  ],
  NEWSLETTER: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'frontendUrl', label: 'Trang chủ', description: 'Link xem bài viết mới' },
  ],
  BRANDSNEW: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'frontendUrl', label: 'Trang chủ', description: 'Link xem thương hiệu mới' },
  ],
  AUTHENTICATION_CODE: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'code', label: 'Mã xác thực', description: 'Mã OTP hoặc code xác thực' },
    { key: 'frontendUrl', label: 'Trang chủ', description: 'Link quay lại website' },
  ],
  VOUCHER_ASSIGNED: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'fullName', label: 'Họ tên đầy đủ', description: 'Họ tên khách hàng' },
    { key: 'voucherCode', label: 'Mã voucher', description: 'Mã giảm giá được gán' },
    { key: 'voucherName', label: 'Tên voucher', description: 'Tên chiến dịch voucher' },
    { key: 'discountValue', label: 'Giá trị giảm', description: 'Số tiền hoặc phần trăm giảm giá đã format' },
    { key: 'discountType', label: 'Loại giảm giá', description: 'Đơn vị giảm: % hoặc đ' },
    { key: 'expiryDate', label: 'Ngày hết hạn', description: 'Thời gian hết hạn voucher' },
    { key: 'frontendUrl', label: 'Trang chủ', description: 'Link áp dụng voucher' },
  ],
  DEFAULT: [
    { key: 'name', label: 'Tên hiển thị', description: 'Tên thân mật người nhận' },
    { key: 'fullName', label: 'Họ tên đầy đủ', description: 'Họ tên khách hàng' },
    { key: 'frontendUrl', label: 'Trang chủ', description: 'Link quay lại website' },
  ],
};

const schema = yup.object({
  action: yup
    .mixed<EmailActionType | ''>()
    .oneOf([...EMAIL_ACTION_OPTIONS.map((opt) => opt.value), ''])
    .required('Loại email là bắt buộc'),
  subject: yup
    .string()
    .required('Tiêu đề là bắt buộc')
    .min(1, 'Tiêu đề không được để trống')
    .max(255, 'Tiêu đề không được quá 255 ký tự'),
  content: yup
    .string()
    .required('Nội dung là bắt buộc')
    .min(1, 'Nội dung không được để trống'),
});

interface TemplateEmailFormProps {
  templateId?: number;
}

const tinymceApiKey = process.env.NEXT_PUBLIC_TINYMCE_PUBLIC_KEY;

export default function TemplateEmailForm({ templateId }: TemplateEmailFormProps) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const isEdit = !!templateId;

  const { data: templateData, isLoading: isLoadingTemplate } = useFetchTemplateEmailByIdQuery(
    templateId!,
    { skip: !isEdit }
  );

  const [addTemplate, { isLoading: isAdding }] = useAddTemplateEmailMutation();
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateTemplateEmailMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TemplateEmailFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      action: '',
      subject: '',
      content: '',
    },
  });

  const watchedContent = watch('content');
  const watchedSubject = watch('subject');
  const watchedAction = watch('action');

  const variableHints = useMemo(() => {
    if (!watchedAction) {
      return EMAIL_VARIABLE_HINTS.DEFAULT;
    }
    return EMAIL_VARIABLE_HINTS[watchedAction] ?? EMAIL_VARIABLE_HINTS.DEFAULT;
  }, [watchedAction]);

  useEffect(() => {
    if (isEdit && templateData) {
      reset({
        action: templateData.action,
        subject: templateData.subject,
        content: templateData.content,
      });
    }
  }, [isEdit, templateData, reset]);

  const onSubmit = async (data: TemplateEmailFormValues) => {
    try {
      const payload = {
        ...data,
        action: data.action as EmailActionType,
      };

      if (isEdit && templateId) {
        await updateTemplate({
          id: templateId,
          ...payload,
        }).unwrap();
        toast.success('Cập nhật template email thành công');
      } else {
        await addTemplate(payload).unwrap();
        toast.success('Tạo template email thành công');
      }
      router.push(getRouteWithRole(routerApp.templateEmail.list));
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'data' in error &&
        (error as { data?: { message?: string } }).data?.message
          ? (error as { data?: { message?: string } }).data?.message
          : 'Có lỗi xảy ra';
      toast.error(message);
    }
  };

  const handleBack = () => {
    router.push(getRouteWithRole(routerApp.templateEmail.list));
  };

  if (isEdit && isLoadingTemplate) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEdit ? 'Chỉnh sửa Template Email' : 'Tạo Template Email Mới'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isEdit 
                ? 'Cập nhật thông tin và nội dung của template email' 
                : 'Tạo mới template email để sử dụng trong hệ thống'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-6 items-start">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Thông tin Template
                </CardTitle>
                <CardDescription>
                  Điền thông tin cơ bản cho template email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="action">
                    Loại Email <span className="text-red-500">*</span>
                  </Label>
                  <UISingleSelect
                    options={EMAIL_ACTION_OPTIONS}
                    selected={EMAIL_ACTION_OPTIONS.find(opt => opt.value === watchedAction) || null}
                    onChange={(selected) => setValue('action', selected?.value || '')}
                    placeholder="Chọn loại email"
                    size={ESize.M}
                    renderSelected={(props) => <UISingleSelect.Selected {...props} />}
                    renderOption={(props) => <UISingleSelect.Option {...props} />}
                  />
                  {errors.action && (
                    <p className="text-sm text-red-500">{errors.action.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">
                    Tiêu đề Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Nhập tiêu đề email..."
                    {...register('subject')}
                    className={errors.subject ? 'border-red-500' : ''}
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-500">{errors.subject.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Nội dung HTML
                </CardTitle>
                <CardDescription>
                  Nhập nội dung HTML của email. Bạn có thể sử dụng các biến như {'{{name}}'}, {'{{email}}'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="content">
                    Nội dung <span className="text-red-500">*</span>
                  </Label>
                  <Editor
                    apiKey={tinymceApiKey}
                    value={watchedContent}
                    onEditorChange={(content: string) =>
                      setValue('content', content, { shouldValidate: true })
                    }
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: ['link', 'lists', 'table'],
                      toolbar:
                        'undo redo | bold italic underline | forecolor | alignleft aligncenter alignright | bullist numlist | link table removeformat',
                      content_style:
                        'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size:14px }',
                      valid_elements:
                        'a[href|target=_blank],strong/b,em/i,span[style],p,br,ul,ol,li,table,tr,td,th,tbody,thead,tfoot,img[src|alt|width|height|style],h1,h2,h3,h4,h5,h6',
                      valid_styles: {
                        '*': 'color,text-decoration,font-weight,font-style,text-align',
                      },
                      forced_root_block: 'p',
                    }}
                  />
                  {errors.content && (
                    <p className="text-sm text-red-500">{errors.content.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Sử dụng HTML để định dạng email. Các biến động sẽ được thay thế khi gửi email.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="xl:sticky xl:top-6 xl:max-h-[calc(100vh-96px)] xl:overflow-y-auto space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Code className="h-4 w-4" />
                    Biến gợi ý theo loại email
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {watchedAction
                      ? EMAIL_ACTION_OPTIONS.find(opt => opt.value === watchedAction)?.label
                      : 'Chưa chọn loại email'}
                  </span>
                </CardTitle>
                <CardDescription>
                  Nhấp vào biến để copy và dán vào nội dung bên trái
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {variableHints.map((hint) => (
                    <button
                      key={hint.key}
                      type="button"
                      onClick={() =>
                        setValue(
                          'content',
                          `${watchedContent || ''} {{${hint.key}}}`,
                          { shouldValidate: true },
                        )
                      }
                      className="w-full flex items-start justify-between gap-3 rounded-md border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-left hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-2">
                          <code className="bg-white px-2 py-0.5 rounded text-xs font-mono">
                            {`{{${hint.key}}}`}
                          </code>
                          <span className="font-medium text-xs">{hint.label}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {hint.description}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Xem trước Email
                </CardTitle>
                <CardDescription>
                  Xem trước cách email sẽ hiển thị khi được gửi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg bg-white shadow-sm p-6 min-h-[400px]">
                  {watchedSubject || watchedContent ? (
                    <div className="space-y-4">
                      {watchedSubject && (
                        <div className="border-b pb-3">
                          <h2 className="text-xl font-semibold">{watchedSubject}</h2>
                        </div>
                      )}
                      {watchedContent ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: watchedContent }}
                          className="prose max-w-none"
                        />
                      ) : (
                        <p className="text-muted-foreground italic">
                          Nhập nội dung để xem trước...
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[280px] text-center">
                      <FileText className="h-16 w-16 text-gray-300 mb-4" />
                      <p className="text-muted-foreground">
                        Nhập thông tin bên trái để xem trước email tại đây
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={handleBack}>
            Hủy
          </Button>
          <Button 
            type="submit" 
            disabled={isAdding || isUpdating}
            className="gap-2"
          >
            {(isAdding || isUpdating) ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEdit ? 'Cập nhật' : 'Tạo mới'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

