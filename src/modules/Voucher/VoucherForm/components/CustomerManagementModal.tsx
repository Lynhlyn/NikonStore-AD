'use client';

import { EStatusEnumString } from '@/common/enums/status';
import { useFetchVoucherByIdQuery } from '@/lib/services/modules/voucherService';
import { Gift, Plus, Users, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { AssignedCustomersList } from './AssignedCustomersList';
import { CustomerSelectionModal } from './CustomerSelectionModal';
import { VoucherInfo } from './VoucherInfo';

interface CustomerManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    voucherId: number;
    voucherCode?: string;
}

export const CustomerManagementModal: React.FC<CustomerManagementModalProps> = ({
    isOpen,
    onClose,
    voucherId,
    voucherCode,
}) => {
    const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());

    const { data: voucherData } = useFetchVoucherByIdQuery(voucherId);
    const isVoucherInactive = voucherData?.status === EStatusEnumString.INACTIVE;

    const handleAddCustomerSuccess = useCallback(() => {
        setRefreshKey(prev => prev + 1);
        setLastRefreshTime(new Date());
    }, []);

    const handleCustomerListRefresh = useCallback(() => {
        setRefreshKey(prev => prev + 1);
        setLastRefreshTime(new Date());
    }, []);

    const handleClose = () => {
        setIsAddCustomerModalOpen(false);
        setRefreshKey(0);
        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            setRefreshKey(prev => prev + 1);
            setLastRefreshTime(new Date());
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Quản lý khách hàng cho voucher
                            </h2>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                    <Gift className="w-4 h-4" />
                                    {voucherCode}
                                </span>
                                <span className="text-gray-400">|</span>
                                <span>ID: {voucherId}</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-xs text-gray-500">
                                    Cập nhật lần cuối: {lastRefreshTime.toLocaleTimeString('vi-VN')}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsAddCustomerModalOpen(true)}
                            disabled={isVoucherInactive}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm hover:shadow-md ${isVoucherInactive
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            title={isVoucherInactive ? 'Không thể gán khách hàng cho voucher không hoạt động' : 'Chọn khách hàng dùng voucher'}
                        >
                            <Plus className="w-4 h-4" />
                            Chọn khách hàng dùng voucher
                        </button>
                        <button
                            onClick={handleCustomerListRefresh}
                            className="px-3 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                            title="Làm mới dữ liệu"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Làm mới
                        </button>
                        <button
                            onClick={handleClose}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Đóng"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6 bg-gray-50">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {isVoucherInactive && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                                    <X className="w-3 h-3 text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-red-800 font-medium">Voucher không hoạt động</p>
                                    <p className="text-red-600 text-sm mt-1">
                                        Không thể gán hoặc gỡ khách hàng cho voucher đã hết hạn hoặc bị vô hiệu hóa.
                                    </p>
                                </div>
                            </div>
                        )}

                        <VoucherInfo voucherId={voucherId} key={`voucher-info-${refreshKey}`} />

                        <AssignedCustomersList
                            voucherId={voucherId}
                            onRefresh={handleCustomerListRefresh}
                            key={`customer-list-${refreshKey}`}
                            isVoucherInactive={isVoucherInactive}
                        />
                    </div>
                </div>

                {isAddCustomerModalOpen && (
                    <CustomerSelectionModal
                        isOpen={isAddCustomerModalOpen}
                        onClose={() => setIsAddCustomerModalOpen(false)}
                        voucherId={voucherId}
                        onSuccess={handleAddCustomerSuccess}
                    />
                )}
            </div>
        </div>
    );
};

