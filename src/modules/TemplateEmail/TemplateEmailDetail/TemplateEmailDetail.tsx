'use client';

import { useRouter } from 'next/navigation';
import { useFetchTemplateEmailByIdQuery } from '@/lib/services/modules/templateEmailService';
import { Button } from '@/core/shadcn/components/ui/button';
import { Badge } from '@/core/shadcn/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shadcn/components/ui/card';
import { Separator } from '@/core/shadcn/components/ui/separator';
import { ArrowLeft, Edit, Mail, Code, Calendar, FileText } from 'lucide-react';
import { useAppNavigation } from '@/common/hooks';
import { routerApp } from '@/router';
import { Loader2 } from 'lucide-react';
import { getEmailActionLabel } from '@/modules/TemplateEmail/emailActions';

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

interface TemplateEmailDetailProps {
  templateId: number;
}

export default function TemplateEmailDetail({ templateId }: TemplateEmailDetailProps) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();

  const { data: template, isLoading, error } = useFetchTemplateEmailByIdQuery(templateId);

  const handleBack = () => {
    router.push(getRouteWithRole(routerApp.templateEmail.list));
  };

  const handleEdit = () => {
    router.push(getRouteWithRole(routerApp.templateEmail.edit({ id: templateId.toString() })));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-red-500 mb-4">Không tìm thấy template email</p>
            <Button onClick={handleBack}>Quay lại danh sách</Button>
          </CardContent>
        </Card>
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
            <h1 className="text-3xl font-bold tracking-tight">Chi tiết Template Email</h1>
            <p className="text-muted-foreground mt-2">
              Xem thông tin và nội dung của template email
            </p>
          </div>
        </div>
        <Button onClick={handleEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          Chỉnh sửa
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Thông tin Template
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">ID</label>
                <p className="text-lg font-semibold mt-1">#{template.id}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Loại Email</label>
                <div className="mt-2">
                  <Badge className={getActionColor(template.action)}>
                    {getEmailActionLabel(template.action)}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tiêu đề</label>
                <p className="text-base mt-1 font-medium">{template.subject}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Ngày tạo
                </label>
                <p className="text-sm mt-1">{formatDate(template.createdAt)}</p>
              </div>
              {template.updatedAt && template.updatedAt !== template.createdAt && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Cập nhật lần cuối
                    </label>
                    <p className="text-sm mt-1">{formatDate(template.updatedAt)}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Content Preview */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Nội dung Email
              </CardTitle>
              <CardDescription>
                Xem trước cách email sẽ hiển thị khi được gửi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg bg-white shadow-sm p-6 min-h-[400px]">
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <h2 className="text-xl font-semibold">{template.subject}</h2>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: template.content }}
                    className="prose max-w-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Mã HTML
              </CardTitle>
              <CardDescription>
                Xem mã HTML gốc của template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                <code>{template.content}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

