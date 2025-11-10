'use client';

import { useFetchVoucherByIdQuery } from '@/lib/services/modules/voucherService';
import { Clock, Gift, Target, X, Zap } from 'lucide-react';

interface VoucherInfoProps {
    voucherId: number;
}

export const VoucherInfo: React.FC<VoucherInfoProps> = ({ voucherId }) => {
    const { data: voucherData, isLoading, error } = useFetchVoucherByIdQuery(voucherId);

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error || !voucherData) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-red-200">
                <div className="text-red-500 text-sm flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Không thể tải thông tin voucher
                </div>
            </div>
        );
    }

    const voucher = voucherData;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            return 'N/A';
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; className: string }> = {
            'ACTIVE': { label: 'Hoạt động', className: 'text-green-800' },
            'PENDING_START': { label: 'Chờ bắt đầu', className: 'text-yellow-800' },
            'INACTIVE': { label: 'Hết hạn', className: 'text-red-800' },
        };

        const config = statusConfig[status] || {
            label: status,
            className: 'bg-gray-100 text-gray-800 border-gray-200'
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}>
                {config.label}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Gift className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Thông tin voucher</h3>
                    <p className="text-sm text-gray-600">Chi tiết về voucher và điều kiện sử dụng</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Gift className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Thông tin cơ bản</span>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-gray-600">Mã:</span>
                                <span className="ml-2 font-medium text-blue-700">{voucher.code}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Trạng thái:</span>
                                <div>{getStatusBadge(voucher.status)}</div>
                            </div>
                            <div>
                                <span className="text-gray-600">Công khai:</span>
                                <span className="ml-2 font-medium">
                                    {voucher.isPublic ? 'Có' : 'Không'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">Giảm giá</span>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className='flex items-center gap-2'>
                                <span className="text-gray-600">Loại:</span>
                                <span className="ml-2 font-medium text-green-700">
                                    {voucher.discountType === 'percentage' ? 'Phần trăm' : 'Số tiền cố định'}
                                </span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <span className="text-gray-600">Giá trị:</span>
                                <span className="ml-2 font-medium text-green-700">
                                    {voucher.discountType === 'percentage'
                                        ? `${voucher.discountValue}%`
                                        : formatCurrency(voucher.discountValue)
                                    }
                                </span>
                            </div>
                            {voucher.maxDiscount && (
                                <div className='flex items-center gap-2'>
                                    <span className="text-gray-600">Tối đa:</span>
                                    <span className="ml-2 font-medium text-green-700">
                                        {formatCurrency(voucher.maxDiscount)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-900">Điều kiện</span>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className='flex items-center gap-2'>
                                <span className="text-gray-600">Giá trị tối thiểu:</span>
                                <span className="ml-2 font-medium text-orange-700">
                                    {formatCurrency(voucher.minOrderValue || 0)}
                                </span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <span className="text-gray-600">Số lượng:</span>
                                <span className="ml-2 font-medium text-orange-700">
                                    {voucher.quantity}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-900">Sử dụng & Thời gian</span>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className='flex items-center gap-2'>
                                <span className="text-gray-600">Đã sử dụng:</span>
                                <span className="ml-2 font-medium text-purple-700">
                                    {voucher.usedCount || 0}
                                </span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <span className="text-gray-600">Bắt đầu:</span>
                                <span className="ml-2 font-medium text-purple-700">
                                    {formatDate(voucher.startDate)}
                                </span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <span className="text-gray-600">Kết thúc:</span>
                                <span className="ml-2 font-medium text-purple-700">
                                    {formatDate(voucher.endDate)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {voucher.description && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-700">Mô tả:</span>
                    </div>
                    <p className="text-sm text-gray-600">{voucher.description}</p>
                </div>
            )}
        </div>
    );
};

