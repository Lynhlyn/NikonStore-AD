'use client';

import { IListQuery } from '@/common/types/query';
import { getSimpleError } from '@/common/utils/handleForm';
import { useFetchCustomersQuery } from '@/lib/services/modules/customerService';
import { useAssignVoucherToCustomersMutation, useGetCustomersByVoucherQuery } from '@/lib/services/modules/customerVoucherService';
import { AlertCircle, Check, Search, UserPlus, Users, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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

    const queryParams: IListQuery = {
        page: currentPage,
        size: pageSize,
        sort: 'id',
        direction: 'asc',
        keyword: searchTerm || undefined,
    };

    const { data: customersData, isLoading: isLoadingCustomers, refetch } = useFetchCustomersQuery(queryParams);

    const customers = customersData?.data || [];
    const assignedCustomers = assignedCustomersData?.data || [];
    const totalCustomers = customersData?.pagination?.totalElements || 0;
    const totalPages = customersData?.pagination?.totalPages || 0;
    const currentPageFromAPI = customersData?.pagination?.currentPage || 0;

    // Lọc ra các khách hàng chưa được gán voucher (chỉ khi có voucherId)
    const availableCustomers = useMemo(() => {
        if (voucherId) {
            const assignedCustomerIds = assignedCustomers.map(customer => customer.customerId);
            return customers.filter(customer => !assignedCustomerIds.includes(customer.id));
        }
        return customers;
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

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(0);
    };

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <UserPlus className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {voucherId ? 'Gán voucher cho khách hàng' : 'Chọn khách hàng cho voucher'}
                            </h2>
                            {voucherId && <p className="text-sm text-gray-600 mt-1">Voucher ID: {voucherId}</p>}
                            <p className="text-xs text-gray-500 mt-1">
                                {voucherId 
                                    ? `Hiển thị ${availableCustomers.length} khách hàng có thể gán (đã loại bỏ ${assignedCustomers.length} khách hàng đã được gán)`
                                    : `Hiển thị ${availableCustomers.length} khách hàng có thể chọn`
                                }
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Đóng"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-6 flex gap-4 items-center">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm khách hàng theo tên, email, số điện thoại..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSelectAll}
                            className="px-4 py-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            {selectedCustomers.length === availableCustomers.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                        </button>
                        <button
                            onClick={handleAssignVouchers}
                            disabled={isAssigning || selectedCustomers.length === 0}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm hover:shadow-md flex items-center gap-2"
                        >
                            {isAssigning ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Đang gán...
                                </>
                            ) : (
                                <>
                                    <Users className="w-4 h-4" />
                                    {voucherId ? `Gán voucher (${selectedCustomers.length})` : `Chọn (${selectedCustomers.length})`}
                                </>
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
                            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? 'Không tìm thấy khách hàng nào' : 'Không có khách hàng nào có thể gán'}
                            </h3>
                            <p className="text-gray-600">
                                {searchTerm
                                    ? 'Không có khách hàng nào phù hợp với từ khóa tìm kiếm'
                                    : assignedCustomers.length > 0
                                        ? 'Tất cả khách hàng đã được gán voucher này'
                                        : 'Danh sách khách hàng trống'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {availableCustomers.map((customer) => (
                                <div
                                    key={customer.id}
                                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selectedCustomers.includes(customer.id)
                                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    onClick={() => handleCustomerToggle(customer.id)}
                                >
                                    <div className="flex items-center justify-center w-5 h-5 mr-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedCustomers.includes(customer.id)}
                                            onChange={() => handleCustomerToggle(customer.id)}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="font-medium text-gray-900 text-lg">{customer.fullName}</div>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customer.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                    : 'bg-red-100 text-red-800 border border-red-200'
                                                    }`}
                                            >
                                                {customer.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <span className="w-20 text-gray-500">Email:</span>
                                                <span className="font-medium">{customer.email || 'Không có'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-20 text-gray-500">SĐT:</span>
                                                <span className="font-medium">{customer.phoneNumber}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        {selectedCustomers.includes(customer.id) ? (
                                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                                <Check className="w-5 h-5 text-white" />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 border-2 border-gray-300 rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-700">
                            Hiển thị {availableCustomers.length} trong tổng số {totalCustomers} khách hàng
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={pageSize}
                                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
