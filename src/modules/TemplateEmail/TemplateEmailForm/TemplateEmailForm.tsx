'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  useAddTemplateEmailMutation, 
  useUpdateTemplateEmailMutation,
  useFetchTemplateEmailByIdQuery 
} from '@/lib/services/modules/templateEmailService';
import { Button } from '@/core/shadcn/components/ui/button';
import { Input } from '@/core/shadcn/components/ui/input';
import { Label } from '@/core/shadcn/components/ui/label';
import { Textarea } from '@/core/shadcn/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shadcn/components/ui/card';
import { UISingleSelect } from '@/core/ui/UISingleSelect';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import { ArrowLeft, Save, Eye, Code, Mail, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppNavigation } from '@/common/hooks';
import { routerApp } from '@/router';

const EMAIL_ACTION_OPTIONS = [
  { value: 'REGISTER_SUCCESS', label: 'Đăng ký thành công' },
  { value: 'FORGOT_PASSWORD', label: 'Quên mật khẩu' },
  { value: 'RESET_PASSWORD', label: 'Đặt lại mật khẩu' },
  { value: 'PASSWORD_CHANGED', label: 'Mật khẩu đã được thay đổi' },
  { value: 'VERIFY_EMAIL', label: 'Xác thực email' },
  { value: 'WELCOME', label: 'Chào mừng' },
  { value: 'ORDER_PENDING_CONFIRMATION', label: 'Đơn hàng chờ xác nhận' },
  { value: 'ORDER_CONFIRMED', label: 'Đơn hàng đã xác nhận' },
  { value: 'ORDER_PREPARING', label: 'Đơn hàng đang chuẩn bị' },
  { value: 'ORDER_SHIPPING', label: 'Đơn hàng đang giao' },
  { value: 'ORDER_COMPLETED', label: 'Đơn hàng hoàn thành' },
  { value: 'ORDER_CANCELLED', label: 'Đơn hàng đã hủy' },
  { value: 'ORDER_PENDING_PAYMENT', label: 'Đơn hàng chờ thanh toán' },
  { value: 'ORDER_FAILED_DELIVERY', label: 'Đơn hàng giao thất bại' },
  { value: 'ACCOUNT_LOCKED', label: 'Tài khoản bị khóa' },
  { value: 'ACCOUNT_UNLOCKED', label: 'Tài khoản được mở khóa' },
  { value: 'VOUCHER_ASSIGNED', label: 'Voucher được gán' },
];

const schema = yup.object().shape({
  action: yup.string().required('Loại email là bắt buộc'),
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
  } = useForm({
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

  useEffect(() => {
    if (isEdit && templateData) {
      reset({
        action: templateData.action,
        subject: templateData.subject,
        content: templateData.content,
      });
    }
  }, [isEdit, templateData, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && templateId) {
        await updateTemplate({
          id: templateId,
          ...data,
        }).unwrap();
        toast.success('Cập nhật template email thành công');
      } else {
        await addTemplate(data).unwrap();
        toast.success('Tạo template email thành công');
      }
      router.push(getRouteWithRole(routerApp.templateEmail.list));
    } catch (error: any) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra');
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Form Editor */}
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
                  <Textarea
                    id="content"
                    placeholder="Nhập nội dung HTML của email..."
                    rows={20}
                    {...register('content')}
                    className={`${errors.content ? 'border-red-500' : ''} font-mono text-sm`}
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

          {/* Right Side - Live Preview */}
          <div className="space-y-6">
            <Card className="sticky top-6">
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
                <div className="border rounded-lg bg-white shadow-sm p-6 min-h-[500px]">
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
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                      <FileText className="h-16 w-16 text-gray-300 mb-4" />
                      <p className="text-muted-foreground">
                        Nhập thông tin bên trái để xem trước email tại đây
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Gợi ý biến</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{'{{name}}'}</code>
                    <span className="text-muted-foreground">Tên người nhận</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{'{{email}}'}</code>
                    <span className="text-muted-foreground">Email người nhận</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{'{{orderNumber}}'}</code>
                    <span className="text-muted-foreground">Số đơn hàng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{'{{voucherCode}}'}</code>
                    <span className="text-muted-foreground">Mã voucher</span>
                  </div>
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

