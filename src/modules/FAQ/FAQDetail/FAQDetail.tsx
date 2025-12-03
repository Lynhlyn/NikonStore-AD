'use client';

import { useRouter } from 'next/navigation';
import { useFetchFAQByIdQuery } from '@/lib/services/modules/faqService';
import { Button } from '@/core/shadcn/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shadcn/components/ui/card';
import { Badge } from '@/core/shadcn/components/ui/badge';
import { ArrowLeft, Edit, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useAppNavigation } from '@/common/hooks';
import { routerApp } from '@/router';

interface FAQDetailProps {
  faqId: number;
}

export default function FAQDetail({ faqId }: FAQDetailProps) {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const { data: faq, isLoading } = useFetchFAQByIdQuery(faqId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!faq) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy FAQ</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chi tiết FAQ</h1>
          <p className="text-muted-foreground mt-2">Xem thông tin chi tiết FAQ</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(getRouteWithRole(routerApp.faq.list))}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Button
            onClick={() => router.push(getRouteWithRole(routerApp.faq.edit({ id: faq.id.toString() })))}
          >
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{faq.question}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={faq.status ? 'default' : 'secondary'}>
                  {faq.status ? (
                    <><CheckCircle2 className="h-3 w-3 mr-1" /> Đang hiển thị</>
                  ) : (
                    <><XCircle className="h-3 w-3 mr-1" /> Đã ẩn</>
                  )}
                </Badge>
                {faq.category && (
                  <Badge variant="outline">{faq.category.name}</Badge>
                )}
                {faq.tag && (
                  <Badge variant="outline">{faq.tag.name}</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Câu trả lời:</h3>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
            {faq.createdAt && (
              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Ngày tạo: {new Date(faq.createdAt).toLocaleDateString('vi-VN')}</p>
                {faq.updatedAt && (
                  <p>Ngày cập nhật: {new Date(faq.updatedAt).toLocaleDateString('vi-VN')}</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

