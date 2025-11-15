'use client';

import { Plus, Search, Filter, Calendar, Tag, DollarSign, Eye, SquarePen, Trash2, Power } from "lucide-react";
import { EStatusEnumString } from "@/common/enums/status";
import { useAppNavigation, useModal } from "@/common/hooks";
import { getSimpleError } from "@/common/utils/handleForm";
import { getStatusColor } from "@/common/utils/statusColor";
import { getStatusEnumStringWithAll } from "@/common/utils/statusOption";
import { Button } from "@/core/shadcn/components/ui/button";
import { ESize } from "@/core/ui/Helpers/UIsize.enum";
import { UIPagination, UIPaginationResuft } from "@/core/ui/UIPagination";
import { UISingleSelect } from "@/core/ui/UISingleSelect";
import { UITextField } from "@/core/ui/UITextField";
import { useDeletePromotionMutation, useFetchPromotionsQuery, useTogglePromotionStatusMutation } from "@/lib/services/modules/promotionService";
import { routerApp } from "@/router";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";

const PromotionTable = () => {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const { Modal, openModal } = useModal();
  const [searchTerm, setSearchTerm] = useState("");

  const [queryStates, setQueryStates] = useQueryStates({
    page: parseAsInteger.withDefault(0),
    status: parseAsString.withDefault(""),
    sortBy: parseAsString.withDefault("id"),
    sortDir: parseAsString.withDefault("desc"),
  });

  const { data, refetch } = useFetchPromotionsQuery({
    page: queryStates.page,
    size: 10,
    sortBy: queryStates.sortBy || "id",
    sortDir: (queryStates.sortDir === "asc" || queryStates.sortDir === "desc") ? queryStates.sortDir : undefined,
    status: queryStates.status || undefined,
  }, {
    refetchOnMountOrArgChange: true,
  });

  const [deletePromotion, { isLoading: isDeleting }] = useDeletePromotionMutation();
  const [togglePromotionStatus, { isLoading: isToggling }] = useTogglePromotionStatusMutation();

  const handlePageChange = (newPage: number) => {
    setQueryStates((prev) => ({
      ...prev,
      page: newPage - 1,
    }));
  };

  const handleStatusChange = (status: { value: string; label: string }) => {
    setQueryStates((prev) => ({
      ...prev,
      status: status.value as EStatusEnumString || "",
      page: 0,
    }));
  };

  const handleDeleteClick = (promotionId: number, promotionName: string) => {
    openModal({
      title: "Xác nhận xóa chương trình khuyến mãi",
      description: `Bạn có chắc chắn muốn xóa "${promotionName}"? Hành động này không thể hoàn tác.`,
      onSubmit: () => handleDelete(promotionId),
      submitClassName: "w-[100px] bg-red-600 hover:bg-red-700",
      dialogContentProps: {
        className: "max-w-md",
      }
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePromotion(id).unwrap();
      toast.success('Đã xóa thành công chương trình khuyến mãi');
      refetch();
    } catch (error: any) {
      const errorMessage = getSimpleError(error);
      toast.error(errorMessage);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await togglePromotionStatus(id).unwrap();
      toast.success('Đã cập nhật trạng thái chương trình khuyến mãi');
      refetch();
    } catch (error: any) {
      const errorMessage = getSimpleError(error);
      toast.error(errorMessage);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: EStatusEnumString) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      'ACTIVE': { label: 'Đang hoạt động', className: 'bg-green-100 text-green-800 border-green-200' },
      'PENDING_START': { label: 'Chờ bắt đầu', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'INACTIVE': { label: 'Tạm dừng', className: 'bg-gray-100 text-gray-800 border-gray-200' },
      'DELETED': { label: 'Đã xóa', className: 'bg-red-100 text-red-800 border-red-200' },
    };

    const config = statusConfig[status] || {
      label: status,
      className: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const filteredPromotions = data?.content?.filter((promotion) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      promotion.name.toLowerCase().includes(searchLower) ||
      promotion.title.toLowerCase().includes(searchLower) ||
      (promotion.code && promotion.code.toLowerCase().includes(searchLower))
    );
  }) || [];

  return (
    <div className="pt-[50px] px-[50px] pb-[50px]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý chương trình khuyến mãi</h1>
        <p className="text-gray-600">Tạo và quản lý các chương trình khuyến mãi cho sản phẩm</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <UITextField
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo tên, tiêu đề hoặc mã khuyến mãi..."
                className="pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="w-[200px]">
              <UISingleSelect
                options={[
                  { value: "", label: "Tất cả trạng thái" },
                  ...getStatusEnumStringWithAll()
                ]}
                selected={
                  queryStates.status
                    ? { value: queryStates.status, label: getStatusEnumStringWithAll().find(item => item.value === queryStates.status)?.label || "" }
                    : { value: "", label: "Tất cả trạng thái" }
                }
                onChange={handleStatusChange}
                className="rounded-lg"
                size={ESize.M}
                renderSelected={(props) => <UISingleSelect.Selected {...props} />}
                renderOption={(props) => <UISingleSelect.Option {...props} />}
              />
            </div>
            <Button
              className="h-[44px] bg-indigo-600 hover:bg-indigo-700"
              onClick={() => refetch()}
            >
              <Filter className="w-5 h-5 text-white mr-2" />
              Làm mới
            </Button>
            <Button
              className="h-[44px]"
              onClick={() => router.push(getRouteWithRole(routerApp.promotion.form))}
            >
              <Plus className="w-5 h-5 text-white mr-2" />
              Tạo mới
            </Button>
          </div>
        </div>

        {filteredPromotions.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Không tìm thấy chương trình khuyến mãi nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromotions.map((promotion) => {
              const isActive = promotion.status === EStatusEnumString.ACTIVE;
              const isPendingStart = promotion.status === EStatusEnumString.PENDING_START;
              const isExpired = new Date(promotion.endDate) < new Date();

              return (
                <div
                  key={promotion.id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {promotion.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{promotion.title}</p>
                      {promotion.code && (
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium">
                          <Tag className="w-3 h-3" />
                          {promotion.code}
                        </div>
                      )}
                    </div>
                    {getStatusBadge(promotion.status)}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600">Giảm giá:</span>
                      <span className="font-semibold text-green-700">
                        {promotion.discountType === "percentage"
                          ? `${promotion.discountValue}%`
                          : formatCurrency(promotion.discountValue)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">Bắt đầu:</span>
                      <span className="font-medium">{formatDateDisplay(promotion.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-red-600" />
                      <span className="text-gray-600">Kết thúc:</span>
                      <span className="font-medium">{formatDateDisplay(promotion.endDate)}</span>
                    </div>
                    {promotion.products && promotion.products.length > 0 && (
                      <div className="text-xs text-gray-500">
                        Áp dụng cho {promotion.products.length} sản phẩm
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <Button
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                      size="sm"
                      onClick={() => router.push(getRouteWithRole(routerApp.promotion.formView({ id: promotion.id })))}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Xem
                    </Button>
                    {!isExpired && (
                      <Button
                        className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                        size="sm"
                        onClick={() => router.push(getRouteWithRole(routerApp.promotion.formEdit({ id: promotion.id })))}
                      >
                        <SquarePen className="w-4 h-4 mr-1" />
                        Sửa
                      </Button>
                    )}
                    {!isPendingStart && (
                      <Button
                        className={`${isActive ? "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200" : "bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"}`}
                        size="sm"
                        disabled={isToggling}
                        onClick={() => handleToggleStatus(promotion.id)}
                        title={isActive ? "Tạm dừng" : "Kích hoạt"}
                      >
                        <Power className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                      size="sm"
                      disabled={isDeleting}
                      onClick={() => handleDeleteClick(promotion.id, promotion.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {data && data.totalPages > 1 && (
          <div className="mt-8">
            <UIPaginationResuft
              currentPage={queryStates.page + 1}
              totalCount={data.totalItems || 0}
              totalPage={data.totalPages || 1}
            />
            <UIPagination
              currentPage={queryStates.page + 1}
              totalPage={data.totalPages || 1}
              onChange={handlePageChange}
              displayPage={5}
            />
          </div>
        )}
      </div>

      <Modal />
    </div>
  );
};

export default PromotionTable;

