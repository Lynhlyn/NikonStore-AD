"use client"

import { Button } from "@/core/shadcn/components/ui/button"
import { Card, CardContent } from "@/core/shadcn/components/ui/card"
import { type StatisticsFilterRequest, useGetGeneralStatisticsQuery } from "@/lib/services/modules/statisticsService"
import {
    BarChart3,
    DollarSign,
    Download,
    Package,
    RefreshCw,
    ShoppingCart,
    TrendingUp,
    Users,
    X
} from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import {
    CustomerChart,
    FilterPanel,
    OrderStatusTrendChart,
    RevenueTrendChart,
    ReviewRatingChart,
    SalesChannelChart
} from "./components"
import { exportStatisticsToExcel } from "./utils/exportExcel"

interface AnimatedNumberProps {
    value: number
    format?: (value: number) => string
    className?: string
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, format, className = "" }) => {
    const [displayValue, setDisplayValue] = useState(0)
    const motionValue = useMotionValue(0)
    const spring = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
    })

    useEffect(() => {
        motionValue.set(0)
        const timer = setTimeout(() => {
            motionValue.set(value)
        }, 100)
        return () => clearTimeout(timer)
    }, [motionValue, value])

    useEffect(() => {
        const unsubscribe = spring.on("change", (latest) => {
            setDisplayValue(Math.floor(latest))
        })
        return () => unsubscribe()
    }, [spring])

    const displayText = format ? format(displayValue) : displayValue.toLocaleString("vi-VN")

    return (
        <motion.span 
            className={className} 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.3 }}
        >
            {displayText}
        </motion.span>
    )
}

interface StatisticsCardProps {
    title: string
    value: string | number
    icon: React.ReactNode
    subtitle?: string
    color?: "primary" | "success" | "secondary" | "neutral"
    animatedValue?: number
    formatValue?: (value: number) => string
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ 
    title, 
    value, 
    icon, 
    subtitle, 
    color = "primary",
    animatedValue,
    formatValue
}) => {
    const colorClasses = {
        primary: "from-blue-500 to-blue-600 text-blue-600 bg-blue-50",
        success: "from-green-500 to-green-600 text-green-600 bg-green-50",
        secondary: "from-purple-500 to-purple-600 text-purple-600 bg-purple-50",
        neutral: "from-gray-500 to-gray-600 text-gray-600 bg-gray-50",
    }

    const iconBackgrounds = {
        primary: "bg-blue-100",
        success: "bg-green-100",
        secondary: "bg-purple-100",
        neutral: "bg-gray-100",
    }

    const iconColors = {
        primary: "text-blue-700",
        success: "text-green-700",
        secondary: "text-purple-700",
        neutral: "text-gray-700",
    }

    const gradientColors = {
        primary: "from-blue-400 via-blue-500 to-blue-600",
        success: "from-green-400 via-green-500 to-green-600",
        secondary: "from-purple-400 via-purple-500 to-purple-600",
        neutral: "from-gray-400 via-gray-500 to-gray-600",
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="h-full"
        >
            <Card className="relative overflow-hidden border border-gray-200 shadow-sm bg-white group h-full cursor-pointer">
                <motion.div 
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colorClasses[color]}`}
                    animate={{
                        background: [
                            `linear-gradient(to right, var(--tw-gradient-stops))`,
                        ]
                    }}
                />
                <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${gradientColors[color]} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-end mb-4">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                            whileHover={{ 
                                scale: 1.15, 
                                rotate: [0, -10, 10, -10, 0],
                                transition: { duration: 0.5 }
                            }}
                            className={`p-3 rounded-xl ${iconBackgrounds[color]} transition-all duration-300 relative`}
                        >
                            <motion.div
                                className={`absolute inset-0 rounded-xl bg-gradient-to-r ${gradientColors[color]} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0, 0.3, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            <motion.div
                                className={iconColors[color]}
                                animate={{
                                    y: [0, -5, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                {icon}
                            </motion.div>
                        </motion.div>
                    </div>
                    <motion.div 
                        className="text-3xl font-bold text-gray-900 mb-1"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        {animatedValue !== undefined && formatValue ? (
                            <AnimatedNumber value={animatedValue} format={formatValue} />
                        ) : (
                            value
                        )}
                    </motion.div>
                    <div className="text-sm font-medium text-gray-600 mb-1">{title}</div>
                    {subtitle && (
                        <motion.p 
                            className="text-xs text-gray-500 mt-2"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ delay: 0.4 }}
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </CardContent>
            </Card>
        </motion.div>
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
        if (amount >= 1000000000000) {
            const trillion = amount / 1000000000000
            return `${trillion.toFixed(1)} nghìn tỷ đ`
        }
        if (amount >= 1000000000) {
            const billion = amount / 1000000000
            return `${billion.toFixed(1)} tỷ đ`
        }
        return new Intl.NumberFormat("vi-VN").format(amount) + " đ"
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

    const handleExportExcel = () => {
        if (!statistics?.data) return
        exportStatisticsToExcel(
            statistics.data,
            searchParams.fromDate,
            searchParams.toDate
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-none mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thống kê tổng quan</h1>
                        <p className="text-gray-600">Theo dõi và phân tích hiệu suất kinh doanh của bạn</p>
                    </div>
                    {statistics?.data && (
                        <Button
                            onClick={handleExportExcel}
                            className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Xuất Excel
                        </Button>
                    )}
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
                                title="Tiền lãi thực tế"
                                value=""
                                animatedValue={statistics.data.totalRevenue || 0}
                                formatValue={formatCurrency}
                                icon={<DollarSign className="w-6 h-6" />}
                                subtitle={`${formatNumber(statistics.data.totalOrders || 0)} đơn hàng`}
                                color="success"
                            />
                            <StatisticsCard
                                title="Tổng phí ship"
                                value=""
                                animatedValue={statistics.data.totalShippingFee || 0}
                                formatValue={formatCurrency}
                                icon={<Package className="w-6 h-6" />}
                                subtitle="Phí vận chuyển"
                                color="neutral"
                            />
                            <StatisticsCard
                                title="Tổng đơn hàng"
                                value=""
                                animatedValue={statistics.data.totalOrders || 0}
                                formatValue={formatNumber}
                                icon={<ShoppingCart className="w-6 h-6" />}
                                subtitle={`${formatNumber(statistics.data.orderStatistics?.completedOrders || 0)} đơn hoàn thành`}
                                color="primary"
                            />
                            <StatisticsCard
                                title="Khách hàng"
                                value=""
                                animatedValue={statistics.data.totalCustomers || 0}
                                formatValue={formatNumber}
                                icon={<Users className="w-6 h-6" />}
                                subtitle={`${formatNumber(statistics.data.customerGrowth?.[statistics.data.customerGrowth?.length - 1]?.newCustomers || 0)} khách mới`}
                                color="secondary"
                            />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6 }}
                        >
                            <RevenueTrendChart
                                data={statistics.data.revenueByDate || []}
                                title="Xu hướng doanh thu theo thời gian"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <OrderStatusTrendChart
                                orderStats={statistics.data.orderStatistics}
                                revenueByDate={statistics.data.revenueByDate || []}
                                title="Phân tích trạng thái đơn hàng"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                        >
                            <CustomerChart
                                data={statistics.data.customerGrowth || []}
                                title="Tăng trưởng khách hàng"
                            />
                            <ReviewRatingChart
                                data={getReviewRatingData()}
                                title="Phân bố đánh giá sản phẩm"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <SalesChannelChart
                                data={statistics.data.salesChannelComparison || []}
                                title="So sánh kênh bán hàng"
                            />
                        </motion.div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-xl transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800">Sản phẩm bán chạy</h3>
                                            <motion.div
                                                animate={{ rotate: [0, 10, -10, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                <TrendingUp className="w-5 h-5 text-purple-600" />
                                            </motion.div>
                                        </div>
                                        <div className="space-y-3">
                                            {statistics.data.topSellingProducts?.slice(0, 5).map((product, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true, amount: 0.2 }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                    whileHover={{ 
                                                        scale: 1.02, 
                                                        x: 5,
                                                        transition: { duration: 0.2 }
                                                    }}
                                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group"
                                                >
                                                    <div className="flex items-center flex-1 min-w-0">
                                                        <motion.div 
                                                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold text-sm mr-4 flex-shrink-0"
                                                            whileHover={{ scale: 1.1, rotate: 360 }}
                                                            transition={{ duration: 0.5 }}
                                                        >
                                                            {index + 1}
                                                        </motion.div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-semibold text-gray-800 truncate group-hover:text-purple-600 transition-colors">{product.productName}</div>
                                                            <div className="text-xs text-gray-600 truncate">
                                                                {product.brandName} • {product.categoryName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right ml-4 flex-shrink-0">
                                                        <motion.div 
                                                            className="font-bold text-purple-700"
                                                            whileHover={{ scale: 1.1 }}
                                                        >
                                                            {formatNumber(product.totalSold)}
                                                        </motion.div>
                                                        <div className="text-xs text-gray-600">đã bán</div>
                                                        <div className="text-xs text-green-600 font-medium">
                                                            {formatCurrency(product.totalRevenue)}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-xl transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800">Voucher được sử dụng</h3>
                                            <motion.div
                                                animate={{ rotate: [0, -10, 10, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                <TrendingUp className="w-5 h-5 text-orange-600" />
                                            </motion.div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <motion.div 
                                                    className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200"
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    <div className="text-sm text-orange-700 font-medium mb-1">Tổng voucher</div>
                                                    <motion.div 
                                                        className="text-2xl font-bold text-orange-700"
                                                        animate={{ scale: [1, 1.05, 1] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                    >
                                                        {formatNumber(statistics.data.totalVouchers || 0)}
                                                    </motion.div>
                                                </motion.div>
                                                <motion.div 
                                                    className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200"
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    <div className="text-sm text-green-700 font-medium mb-1">Tổng giảm giá</div>
                                                    <motion.div 
                                                        className="text-lg font-bold text-green-700"
                                                        animate={{ scale: [1, 1.05, 1] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                                    >
                                                        {formatCurrency(statistics.data.totalDiscountAmount || 0)}
                                                    </motion.div>
                                                </motion.div>
                                            </div>
                                            <div className="space-y-2">
                                                {statistics.data.voucherUsage?.slice(0, 5).map((voucher, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true, amount: 0.2 }}
                                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                                        whileHover={{ 
                                                            scale: 1.02, 
                                                            x: 5,
                                                            transition: { duration: 0.2 }
                                                        }}
                                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer group hover:bg-gray-100 transition-colors"
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-gray-800 truncate group-hover:text-orange-600 transition-colors">{voucher.voucherCode}</div>
                                                            <div className="text-xs text-gray-600">
                                                                Đã dùng: {voucher.usedCount}/{voucher.totalQuantity}
                                                            </div>
                                                        </div>
                                                        <div className="text-right ml-2 flex-shrink-0">
                                                            <motion.div 
                                                                className="text-sm font-bold text-green-600"
                                                                whileHover={{ scale: 1.1 }}
                                                            >
                                                                {formatCurrency(voucher.totalDiscountAmount)}
                                                            </motion.div>
                                                            <div className="text-xs text-gray-600">{voucher.orderCount} đơn</div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-xl transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800">Khách hàng có đơn hoàn thành nhiều nhất</h3>
                                            <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                <Users className="w-5 h-5 text-green-600" />
                                            </motion.div>
                                        </div>
                                        <div className="space-y-3">
                                            {statistics.data.topCustomersByCompletedOrders && statistics.data.topCustomersByCompletedOrders.length > 0 ? (
                                                statistics.data.topCustomersByCompletedOrders.map((customer, index) => (
                                                    <motion.div
                                                        key={customer.customerId}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        viewport={{ once: true, amount: 0.2 }}
                                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                                        whileHover={{ 
                                                            scale: 1.02, 
                                                            x: 5,
                                                            transition: { duration: 0.2 }
                                                        }}
                                                        className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md transition-all duration-300 cursor-pointer group"
                                                    >
                                                    <div className="flex items-center flex-1 min-w-0">
                                                        <motion.div 
                                                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-sm mr-4 flex-shrink-0"
                                                            whileHover={{ scale: 1.1, rotate: 360 }}
                                                            transition={{ duration: 0.5 }}
                                                        >
                                                            {index + 1}
                                                        </motion.div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-semibold text-gray-800 truncate group-hover:text-green-600 transition-colors">{customer.customerName}</div>
                                                            <div className="text-xs text-gray-600 truncate">
                                                                {customer.email} • {customer.phoneNumber}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right ml-4 flex-shrink-0">
                                                        <motion.div 
                                                            className="font-bold text-green-700"
                                                            whileHover={{ scale: 1.1 }}
                                                        >
                                                            {formatNumber(customer.completedOrdersCount)}
                                                        </motion.div>
                                                        <div className="text-xs text-gray-600">đơn hoàn thành</div>
                                                        <div className="text-xs text-blue-600 font-medium">
                                                            {formatCurrency(customer.totalSpent)}
                                                        </div>
                                                    </div>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    Không có dữ liệu
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-xl transition-all duration-300">
                                    <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Khách hàng có đơn hủy nhiều nhất</h3>
                                        <motion.div
                                            animate={{ rotate: [0, 15, -15, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <X className="w-5 h-5 text-red-600" />
                                        </motion.div>
                                    </div>
                                    <div className="space-y-3">
                                        {statistics.data.topCustomersByCancelledOrders && statistics.data.topCustomersByCancelledOrders.length > 0 ? (
                                                statistics.data.topCustomersByCancelledOrders.map((customer, index) => (
                                                    <motion.div
                                                        key={customer.customerId}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        viewport={{ once: true, amount: 0.2 }}
                                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                                        whileHover={{ 
                                                            scale: 1.02, 
                                                            x: -5,
                                                            transition: { duration: 0.2 }
                                                        }}
                                                        className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200 hover:shadow-md transition-all duration-300 cursor-pointer group"
                                                    >
                                                    <div className="flex items-center flex-1 min-w-0">
                                                        <motion.div 
                                                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm mr-4 flex-shrink-0"
                                                            whileHover={{ scale: 1.1, rotate: -360 }}
                                                            transition={{ duration: 0.5 }}
                                                        >
                                                            {index + 1}
                                                        </motion.div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-semibold text-gray-800 truncate group-hover:text-red-600 transition-colors">{customer.customerName}</div>
                                                            <div className="text-xs text-gray-600 truncate">
                                                                {customer.email} • {customer.phoneNumber}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right ml-4 flex-shrink-0">
                                                        <motion.div 
                                                            className="font-bold text-red-700"
                                                            whileHover={{ scale: 1.1 }}
                                                        >
                                                            {formatNumber(customer.cancelledOrdersCount)}
                                                        </motion.div>
                                                        <div className="text-xs text-gray-600">đơn đã hủy</div>
                                                        <div className="text-xs text-blue-600 font-medium">
                                                            {formatCurrency(customer.totalSpent)}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                Không có dữ liệu
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                            </motion.div>
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
