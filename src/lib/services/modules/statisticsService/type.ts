export interface StatisticsFilterRequest {
    fromDate?: string
    toDate?: string
    year?: number
    month?: number
    orderType?: string
    status?: number
    paymentMethod?: string
    categoryId?: number
    brandId?: number
    productId?: number
}

export interface OrderStatisticsResponse {
    totalOrders: number
    completedOrders: number
    cancelledOrders: number
    pendingOrders: number
    totalRevenue: number
    averageOrderValue: number
    onlineOrders: number
    posOrders: number
    onlineRevenue: number
    posRevenue: number
}

export interface ProductStatisticsResponse {
    productId: number
    productName: string
    brandName: string
    categoryName: string
    totalSold: number
    totalRevenue: number
    averagePrice: number
    orderCount: number
}

export interface RevenueStatisticsResponse {
    date: string
    dailyRevenue: number
    shippingFee: number
    netRevenue: number
    dailyOrders: number
    onlineRevenue: number
    posRevenue: number
    onlineOrders: number
    posOrders: number
}

export interface CustomerStatisticsResponse {
    date: string
    newCustomers: number
    totalCustomers: number
    activeCustomers: number
    guestCustomers: number
}

export interface SalesChannelStatisticsResponse {
    channel: string
    totalOrders: number
    totalRevenue: number
    averageOrderValue: number
    completedOrders: number
    cancelledOrders: number
    completionRate: number
    revenuePercentage: number
}

export interface VoucherStatisticsResponse {
    voucherId: number
    voucherCode: string
    description: string
    discountType: string
    discountValue: number
    totalQuantity: number
    usedCount: number
    remainingQuantity: number
    totalDiscountAmount: number
    orderCount: number
    startDate: string
    endDate: string
    status: string
}

export interface TopCustomerStatisticsResponse {
    customerId: number
    customerName: string
    email: string
    phoneNumber: string
    completedOrdersCount: number
    cancelledOrdersCount: number
    totalSpent: number
}

export interface GeneralStatisticsData {
    orderStatistics: OrderStatisticsResponse
    topSellingProducts: ProductStatisticsResponse[]
    revenueByDate: RevenueStatisticsResponse[]
    customerGrowth: CustomerStatisticsResponse[]
    salesChannelComparison: SalesChannelStatisticsResponse[]
    voucherUsage: VoucherStatisticsResponse[]
    topCustomersByCompletedOrders: TopCustomerStatisticsResponse[]
    topCustomersByCancelledOrders: TopCustomerStatisticsResponse[]
    totalRevenue: number
    totalShippingFee: number
    totalOrders: number
    totalCustomers: number
    totalProducts: number
    totalVouchers: number
    totalDiscountAmount: number
}

export interface GeneralStatisticsResponse {
    status: number
    message: string
    data: GeneralStatisticsData
}

