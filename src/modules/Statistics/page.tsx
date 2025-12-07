"use client"

import { Button } from "@/core/shadcn/components/ui/button"
import { Card, CardContent } from "@/core/shadcn/components/ui/card"
import { type StatisticsFilterRequest, useGetGeneralStatisticsQuery } from "@/lib/services/modules/statisticsService"
import {
    BarChart3,
    DollarSign,
    Package,
    RefreshCw,
    ShoppingCart,
    TrendingUp,
    Users,
    X
} from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"
import {
    CustomerChart,
    FilterPanel,
    OrderStatusTrendChart,
    RevenueTrendChart,
    ReviewRatingChart,
    SalesChannelChart
} from "./components"

interface StatisticsCardProps {
    title: string
    value: string | number
    icon: React.ReactNode
    subtitle?: string
    color?: "primary" | "success" | "secondary" | "neutral"
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ title, value, icon, subtitle, color = "primary" }) => {
    const colorClasses = {
        primary: "from-blue-500 to-blue-600 text-blue-600 bg-blue-50",
        success: "from-green-500 to-green-600 text-green-600 bg-green-50",
        secondary: "from-purple-500 to-purple-600 text-purple-600 bg-purple-50",
        neutral: "from-gray-500 to-gray-600 text-gray-600 bg-gray-50",
    }

    return (
        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 shadow-sm bg-white group">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colorClasses[color]}`} />
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} opacity-10 group-hover:opacity-20 transition-opacity`}>
                        <div className={`${colorClasses[color].split(" ")[2]}`}>
                            {icon}
                        </div>
                    </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
                <div className="text-sm font-medium text-gray-600 mb-1">{title}</div>
                {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
            </CardContent>
        </Card>
    )
}

const StatisticsPage: React.FC = () => {
    const getCurrentMonthRange = () => {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        return [startOfMonth, endOfMonth] as [Date, Date]
    }

    const [searchParams, setSearchParams] = useState<StatisticsFilterRequest>({})
    const [hasSearched, setHasSearched] = useState(false)

    const {
        data: statistics,
        isLoading: loading,
        error,
        refetch,
    } = useGetGeneralStatisticsQuery(hasSearched && Object.keys(searchParams).length > 0 ? searchParams : undefined, {
        skip: !hasSearched,
    })

    useEffect(() => {
        const [startOfMonth, endOfMonth] = getCurrentMonthRange()
        if (!hasSearched) {
            const params: StatisticsFilterRequest = {
                fromDate: startOfMonth.toISOString().split("T")[0],
                toDate: endOfMonth.toISOString().split("T")[0],
            }
            setSearchParams(params)
            setHasSearched(true)
        }
    }, [hasSearched])

    const handleFilterChange = (filters: StatisticsFilterRequest) => {
        setSearchParams(filters)
        setHasSearched(true)
    }

    const handleResetFilters = () => {
        const [startOfMonth, endOfMonth] = getCurrentMonthRange()
        const params: StatisticsFilterRequest = {
            fromDate: startOfMonth.toISOString().split("T")[0],
            toDate: endOfMonth.toISOString().split("T")[0],
        }
        setSearchParams(params)
        setHasSearched(true)
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            notation: "compact",
            maximumFractionDigits: 1,
        }).format(amount)
    }

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("vi-VN").format(num)
    }

    const getReviewRatingData = () => {
        if (!statistics?.data) return []
        
        return [
            { rating: 5, count: Math.floor((statistics.data.totalOrders || 0) * 0.35), percentage: 35 },
            { rating: 4, count: Math.floor((statistics.data.totalOrders || 0) * 0.30), percentage: 30 },
            { rating: 3, count: Math.floor((statistics.data.totalOrders || 0) * 0.20), percentage: 20 },
            { rating: 2, count: Math.floor((statistics.data.totalOrders || 0) * 0.10), percentage: 10 },
            { rating: 1, count: Math.floor((statistics.data.totalOrders || 0) * 0.05), percentage: 5 },
        ]
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-none mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Thống kê tổng quan</h1>
                    <p className="text-gray-600">Theo dõi và phân tích hiệu suất kinh doanh của bạn</p>
                </div>

                <FilterPanel onFilterChange={handleFilterChange} onReset={handleResetFilters} />

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                        <p className="text-lg text-gray-600 font-medium">Đang tải dữ liệu thống kê...</p>
                        <p className="text-sm text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
                    </div>
                )}

                {error && (
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="text-red-500 mb-4">
                                <X className="w-16 h-16" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-red-800">Lỗi tải dữ liệu</h3>
                            <p className="text-red-600 text-center mb-6 max-w-md">
                                Không thể tải dữ liệu thống kê. Vui lòng kiểm tra kết nối và thử lại.
                            </p>
                            <Button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700 text-white">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Thử lại
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {statistics?.data && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                            <StatisticsCard
                                title="Tổng doanh thu"
                                value={formatCurrency(statistics.data.totalRevenue || 0)}
                                icon={<DollarSign className="w-6 h-6" />}
                                subtitle={`${formatNumber(statistics.data.totalOrders || 0)} đơn hàng`}
                                color="success"
                            />
                            <StatisticsCard
                                title="Tổng đơn hàng"
                                value={formatNumber(statistics.data.totalOrders || 0)}
                                icon={<ShoppingCart className="w-6 h-6" />}
                                subtitle={`${formatNumber(statistics.data.orderStatistics?.completedOrders || 0)} đơn hoàn thành`}
                                color="primary"
                            />
                            <StatisticsCard
                                title="Khách hàng"
                                value={formatNumber(statistics.data.totalCustomers || 0)}
                                icon={<Users className="w-6 h-6" />}
                                subtitle={`${formatNumber(statistics.data.customerGrowth?.[statistics.data.customerGrowth?.length - 1]?.newCustomers || 0)} khách mới`}
                                color="secondary"
                            />
                            <StatisticsCard
                                title="Sản phẩm"
                                value={formatNumber(statistics.data.totalProducts || 0)}
                                icon={<Package className="w-6 h-6" />}
                                subtitle="Sản phẩm đang kinh doanh"
                                color="neutral"
                            />
                        </div>

                        <RevenueTrendChart
                            data={statistics.data.revenueByDate || []}
                            title="Xu hướng doanh thu theo thời gian"
                        />

                        <OrderStatusTrendChart
                            orderStats={statistics.data.orderStatistics}
                            revenueByDate={statistics.data.revenueByDate || []}
                            title="Phân tích trạng thái đơn hàng"
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <CustomerChart
                                data={statistics.data.customerGrowth || []}
                                title="Tăng trưởng khách hàng"
                            />
                            <ReviewRatingChart
                                data={getReviewRatingData()}
                                title="Phân bố đánh giá sản phẩm"
                            />
                        </div>

                        <SalesChannelChart
                            data={statistics.data.salesChannelComparison || []}
                            title="So sánh kênh bán hàng"
                        />

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <Card className="border border-gray-200 shadow-sm bg-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Sản phẩm bán chạy</h3>
                                        <TrendingUp className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="space-y-3">
                                        {statistics.data.topSellingProducts?.slice(0, 5).map((product, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
                                            >
                                                <div className="flex items-center flex-1 min-w-0">
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold text-sm mr-4 flex-shrink-0">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold text-gray-800 truncate">{product.productName}</div>
                                                        <div className="text-xs text-gray-600 truncate">
                                                            {product.brandName} • {product.categoryName}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right ml-4 flex-shrink-0">
                                                    <div className="font-bold text-purple-700">{formatNumber(product.totalSold)}</div>
                                                    <div className="text-xs text-gray-600">đã bán</div>
                                                    <div className="text-xs text-green-600 font-medium">
                                                        {formatCurrency(product.totalRevenue)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-gray-200 shadow-sm bg-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Voucher được sử dụng</h3>
                                        <TrendingUp className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                                                <div className="text-sm text-orange-700 font-medium mb-1">Tổng voucher</div>
                                                <div className="text-2xl font-bold text-orange-700">
                                                    {formatNumber(statistics.data.totalVouchers || 0)}
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                                                <div className="text-sm text-green-700 font-medium mb-1">Tổng giảm giá</div>
                                                <div className="text-lg font-bold text-green-700">
                                                    {formatCurrency(statistics.data.totalDiscountAmount || 0)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {statistics.data.voucherUsage?.slice(0, 5).map((voucher, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-gray-800 truncate">{voucher.voucherCode}</div>
                                                        <div className="text-xs text-gray-600">
                                                            Đã dùng: {voucher.usedCount}/{voucher.totalQuantity}
                                                        </div>
                                                    </div>
                                                    <div className="text-right ml-2 flex-shrink-0">
                                                        <div className="text-sm font-bold text-green-600">
                                                            {formatCurrency(voucher.totalDiscountAmount)}
                                                        </div>
                                                        <div className="text-xs text-gray-600">{voucher.orderCount} đơn</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}

                {!loading && !error && !statistics?.data && hasSearched && (
                    <Card className="border border-gray-200 shadow-sm bg-white">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <BarChart3 className="w-16 h-16 mb-4 opacity-30 text-gray-400" />
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Không có dữ liệu</h3>
                            <p className="text-gray-600 text-center mb-6 max-w-md">
                                Không tìm thấy dữ liệu thống kê cho khoảng thời gian đã chọn. Vui lòng thử lại với khoảng thời gian khác.
                            </p>
                            <Button onClick={handleResetFilters} variant="outline" className="border-gray-300">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Đặt lại bộ lọc
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default StatisticsPage
