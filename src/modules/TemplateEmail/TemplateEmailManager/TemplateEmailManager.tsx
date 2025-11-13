'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFetchTemplateEmailsQuery, useDeleteTemplateEmailMutation } from '@/lib/services/modules/templateEmailService';
import { Button } from '@/core/shadcn/components/ui/button';
import { Badge } from '@/core/shadcn/components/ui/badge';
import { Input } from '@/core/shadcn/components/ui/input';
import { UISingleSelect } from '@/core/ui/UISingleSelect';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shadcn/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/core/shadcn/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/core/shadcn/components/ui/dropdown-menu';
import { UIPagination, UIPaginationResuft } from '@/core/ui/UIPagination';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { 
  Mail, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  FileText,
  Calendar,
  Filter
} from 'lucide-react';
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

const getActionLabel = (action: string) => {
  const option = EMAIL_ACTION_OPTIONS.find(opt => opt.value === action);
  return option ? option.label : action;
};

const getActionColor = (action: string) => {
  if (action.includes('ORDER')) {
    return 'bg-blue-100 text-blue-800 border-blue-200';
  }
  if (action.includes('PASSWORD') || action.includes('ACCOUNT')) {
    return 'bg-orange-100 text-orange-800 border-orange-200';
  }
  if (action.includes('VOUCHER') || action.includes('PROMOTION')) {
    return 'bg-purple-100 text-purple-800 border-purple-200';
  }
  return 'bg-gray-100 text-gray-800 border-gray-200';
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function TemplateEmailManager() {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const [{ page, size, keyword, action }, setQuery] = useQueryStates({
    page: parseAsInteger.withDefault(0),
    size: parseAsInteger.withDefault(12),
    keyword: parseAsString.withDefault(''),
    action: parseAsString.withDefault(''),
  });

  const { data: templatesData, isLoading, refetch } = useFetchTemplateEmailsQuery({
    page,
    size,
    keyword: keyword || undefined,
    action: action || undefined,
    isAll: false,
  });

  const [deleteTemplate, { isLoading: isDeleting }] = useDeleteTemplateEmailMutation();

  const templates = templatesData?.data || [];
  const totalElements = templatesData?.pagination?.totalElements || 0;
  const totalPages = templatesData?.pagination?.totalPages || 0;

  const actionOptions = [
    { value: '', label: 'Tất cả loại email' },
    ...EMAIL_ACTION_OPTIONS,
  ];

  const handleCreate = () => {
    router.push(getRouteWithRole(routerApp.templateEmail.new));
  };

  const handleEdit = (template: any) => {
    router.push(getRouteWithRole(routerApp.templateEmail.edit({ id: template.id.toString() })));
  };

  const handleView = (template: any) => {
    router.push(getRouteWithRole(routerApp.templateEmail.view({ id: template.id.toString() })));
  };

  const handleDeleteClick = (template: any) => {
    setSelectedTemplate(template);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTemplate) return;
    try {
      await deleteTemplate(selectedTemplate.id).unwrap();
      toast.success('Xóa template email thành công');
      setDeleteDialogOpen(false);
      setSelectedTemplate(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra khi xóa template email');
    }
  };

  const handleSearchChange = (value: string) => {
    setQuery({ keyword: value, page: 0 });
  };

  const handleActionChange = (value: { value: string; label: string } | null) => {
    setQuery({ action: value?.value || '', page: 0 });
  };

  const clearFilters = () => {
    setQuery({ keyword: '', action: '', page: 0 });
  };

  const hasActiveFilters = keyword !== '' || action !== '';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Template Email</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý và tùy chỉnh các mẫu email tự động của hệ thống
          </p>
        </div>
        <Button onClick={handleCreate} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Tạo Template Mới
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Bộ lọc
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tiêu đề hoặc nội dung..."
                  value={keyword}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Loại Email</label>
              <UISingleSelect
                options={actionOptions}
                selected={actionOptions.find(opt => opt.value === action) || null}
                onChange={handleActionChange}
                placeholder="Chọn loại email"
                size={ESize.M}
                renderSelected={(props) => <UISingleSelect.Selected {...props} />}
                renderOption={(props) => <UISingleSelect.Option {...props} />}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Mail className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có template email</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Bắt đầu bằng cách tạo template email mới để hệ thống có thể gửi email tự động
            </p>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Tạo Template Đầu Tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 mb-2">{template.subject}</CardTitle>
                      <Badge className={getActionColor(template.action)}>
                        {getActionLabel(template.action)}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(template)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(template)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(template)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p className="line-clamp-3">
                        {template.content?.replace(/<[^>]*>/g, '').substring(0, 120) || 'Không có nội dung'}
                        {template.content && template.content.length > 120 ? '...' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(template.updatedAt || template.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <UIPaginationResuft
                currentPage={page + 1}
                totalPage={totalPages}
                totalCount={totalElements}
              />
              <UIPagination
                currentPage={page + 1}
                totalPage={totalPages}
                onChange={(newPage: number) => setQuery({ page: newPage - 1 })}
              />
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa template email</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa template email &quot;{selectedTemplate?.subject}&quot;? 
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedTemplate(null);
              }}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

