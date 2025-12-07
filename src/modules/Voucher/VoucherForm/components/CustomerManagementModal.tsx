'use client';

import { EStatusEnumString } from '@/common/enums/status';
import { useFetchVoucherByIdQuery } from '@/lib/services/modules/voucherService';
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-lg">
                <div className="flex justify-between items-start p-6 border-b border-gray-200">
                    <div className="flex-1">
                        <h2 className="text-lg font-medium text-gray-900 mb-2">
                            Quản lý khách hàng
                        </h2>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <span>Mã: {voucherCode || `#${voucherId}`}</span>
                            <span className="text-gray-300">•</span>
                            <span>ID: {voucherId}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsAddCustomerModalOpen(true)}
                            disabled={isVoucherInactive}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isVoucherInactive
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-900 text-white hover:bg-gray-800'
                            }`}
                            title={
                                isVoucherInactive
                                    ? 'Không thể gán khách hàng cho voucher không hoạt động'
                                    : 'Chọn khách hàng'
                            }
                        >
                            Thêm khách hàng
                        </button>
                        <button
                            onClick={handleCustomerListRefresh}
                            className="px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                            title="Làm mới"
                        >
                            Làm mới
                        </button>
                        <button
                            onClick={handleClose}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Đóng"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6 bg-gray-50">
                    <div className="space-y-4">
                        {isVoucherInactive && (
                            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                                <p className="text-sm font-medium text-gray-900 mb-1">
                                    Voucher không hoạt động
                                </p>
                                <p className="text-xs text-gray-600">
                                    Không thể gán hoặc gỡ khách hàng cho voucher đã hết hạn hoặc bị vô hiệu hóa.
                                </p>
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

