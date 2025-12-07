'use client';

import { IListQuery } from '@/common/types/query';
import { getSimpleError } from '@/common/utils/handleForm';
import { useFetchCustomersQuery } from '@/lib/services/modules/customerService';
import { useAssignVoucherToCustomersMutation, useGetCustomersByVoucherQuery } from '@/lib/services/modules/customerVoucherService';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface CustomerSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    voucherId?: number;
    onSuccess?: () => void;
    onCustomersSelected?: (customerIds: number[]) => void;
    selectedCustomerIds?: number[];
}

interface Customer {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    status: string;
}

export const CustomerSelectionModal: React.FC<CustomerSelectionModalProps> = ({
    isOpen,
    onClose,
    voucherId,
    onSuccess,
    onCustomersSelected,
    selectedCustomerIds: initialSelectedCustomerIds = [],
}) => {
    const [selectedCustomers, setSelectedCustomers] = useState<number[]>(initialSelectedCustomerIds);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [assignVoucherToCustomers, { isLoading: isAssigning }] = useAssignVoucherToCustomersMutation();

    // Lấy danh sách khách hàng đã được gán voucher (chỉ khi có voucherId)
    const { data: assignedCustomersData, refetch: refetchAssignedCustomers } = useGetCustomersByVoucherQuery({
        voucherId: voucherId!,
        page: 0,
        size: 1000,
    }, {
        skip: !voucherId,
    });

    const queryParams: IListQuery = useMemo(() => ({
        page: currentPage,
        size: pageSize,
        sort: 'id',
        direction: 'asc',
        keyword: searchTerm.trim() || undefined,
    }), [currentPage, pageSize, searchTerm]);

    const { data: customersData, isLoading: isLoadingCustomers, refetch } = useFetchCustomersQuery(queryParams, {
        refetchOnMountOrArgChange: true,
    });

    const customers = customersData?.data || [];
    const assignedCustomers = assignedCustomersData?.data || [];
    const totalCustomers = customersData?.pagination?.totalElements || 0;
    const totalPages = customersData?.pagination?.totalPages || 0;
    const currentPageFromAPI = customersData?.pagination?.currentPage || 0;

    const availableCustomers = useMemo(() => {
        let filtered = customers.filter(customer => customer.id !== 1);
        
        if (voucherId) {
            const assignedCustomerIds = assignedCustomers.map(customer => customer.customerId);
            filtered = filtered.filter(customer => !assignedCustomerIds.includes(customer.id));
        }
        
        return filtered;
    }, [customers, assignedCustomers, voucherId]);

    const handleCustomerToggle = (customerId: number) => {
        setSelectedCustomers(prev =>
            prev.includes(customerId)
                ? prev.filter(id => id !== customerId)
                : [...prev, customerId]
        );
    };

    const handleSelectAll = () => {
        if (selectedCustomers.length === availableCustomers.length) {
            setSelectedCustomers([]);
        } else {
            setSelectedCustomers(availableCustomers.map(c => c.id));
        }
    };

    const handleAssignVouchers = async () => {
        if (selectedCustomers.length === 0) {
            toast.error('Vui lòng chọn ít nhất một khách hàng');
            return;
        }

        if (voucherId) {
            try {
                await assignVoucherToCustomers({
                    voucherId,
                    customerIds: selectedCustomers,
                }).unwrap();

                toast.success(`Đã gán voucher cho ${selectedCustomers.length} khách hàng thành công`);
                setSelectedCustomers([]);

                await refetchAssignedCustomers();
                onSuccess?.();

                setTimeout(() => {
                    onClose();
                }, 100);
            } catch (error: any) {
                const errorMessage = getSimpleError(error);
                toast.error(errorMessage);
            }
        } else {
            onCustomersSelected?.(selectedCustomers);
            toast.success(`Đã chọn ${selectedCustomers.length} khách hàng`);
            onClose();
        }
    };

    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value);
        setCurrentPage(0);
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(0);
    };

    useEffect(() => {
        if (isOpen) {
            setSelectedCustomers(initialSelectedCustomerIds);
            setSearchTerm('');
            setCurrentPage(0);
        }
    }, [isOpen, initialSelectedCustomerIds]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-lg">
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-1">
                            {voucherId ? 'Gán voucher cho khách hàng' : 'Chọn khách hàng'}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {voucherId 
                                ? `${availableCustomers.length} khách hàng có thể gán`
                                : `${availableCustomers.length} khách hàng có thể chọn`
                            }
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Đóng"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-6 flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSelectAll}
                            className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium whitespace-nowrap"
                        >
                            {selectedCustomers.length === availableCustomers.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                        </button>
                        <button
                            onClick={handleAssignVouchers}
                            disabled={isAssigning || selectedCustomers.length === 0}
                            className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm whitespace-nowrap"
                        >
                            {isAssigning ? (
                                <>
                                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                    Đang xử lý...
                                </>
                            ) : (
                                voucherId ? `Gán (${selectedCustomers.length})` : `Chọn (${selectedCustomers.length})`
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    {isLoadingCustomers ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="text-gray-500 flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                Đang tải danh sách khách hàng...
                            </div>
                        </div>
                    ) : availableCustomers.length === 0 ? (
                        <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="text-base font-medium text-gray-900 mb-2">
                                {searchTerm ? 'Không tìm thấy khách hàng' : 'Không có khách hàng có thể gán'}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {searchTerm
                                    ? 'Không có khách hàng nào phù hợp với từ khóa tìm kiếm'
                                    : assignedCustomers.length > 0
                                        ? 'Tất cả khách hàng đã được gán voucher này'
                                        : 'Danh sách khách hàng trống'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {availableCustomers.map((customer) => (
                                <div
                                    key={customer.id}
                                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                                        selectedCustomers.includes(customer.id)
                                            ? 'border-gray-400 bg-gray-50'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                    onClick={() => handleCustomerToggle(customer.id)}
                                >
                                    <div className="flex items-center justify-center w-5 h-5 mr-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedCustomers.includes(customer.id)}
                                            onChange={() => handleCustomerToggle(customer.id)}
                                            className="w-4 h-4 text-gray-900 focus:ring-gray-400 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className="font-medium text-gray-900 truncate">
                                                {customer.fullName}
                                            </div>
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                                                    customer.status === 'ACTIVE'
                                                        ? 'bg-gray-100 text-gray-700'
                                                        : 'bg-gray-200 text-gray-600'
                                                }`}
                                            >
                                                {customer.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:gap-4 text-xs text-gray-600">
                                            <span className="truncate">
                                                <span className="text-gray-500">Email: </span>
                                                {customer.email || 'Không có'}
                                            </span>
                                            <span className="truncate">
                                                <span className="text-gray-500">SĐT: </span>
                                                {customer.phoneNumber}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                            Hiển thị {availableCustomers.length} / {totalCustomers} khách hàng
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={pageSize}
                                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handlePageChange(currentPageFromAPI - 1)}
                                    disabled={currentPageFromAPI === 0}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50 transition-colors"
                                >
                                    Trước
                                </button>
                                <span className="px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg">
                                    {currentPageFromAPI + 1} / {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPageFromAPI + 1)}
                                    disabled={currentPageFromAPI >= totalPages - 1}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50 transition-colors"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
