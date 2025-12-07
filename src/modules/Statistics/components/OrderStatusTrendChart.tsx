"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/core/shadcn/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/core/shadcn/components/ui/chart"
import type { OrderStatisticsResponse, RevenueStatisticsResponse } from "@/lib/services/modules/statisticsService"
import { AlertTriangle, CheckCircle2, Clock, TrendingDown, TrendingUp, XCircle } from "lucide-react"
import type React from "react"
import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"

interface OrderStatusTrendChartProps {
    orderStats: OrderStatisticsResponse
    revenueByDate: RevenueStatisticsResponse[]
    title?: string
}

const OrderStatusTrendChart: React.FC<OrderStatusTrendChartProps> = ({
    orderStats,
    revenueByDate,
    title = "Xu hướng trạng thái đơn hàng"
}) => {
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit"
        })
    }

    const totalOrders = orderStats.totalOrders || 1
    const cancellationRate = totalOrders > 0 ? ((orderStats.cancelledOrders || 0) / totalOrders) * 100 : 0
    const pendingPaymentRate = totalOrders > 0 ? ((orderStats.pendingOrders || 0) / totalOrders) * 100 : 0
    const completionRate = totalOrders > 0 ? ((orderStats.completedOrders || 0) / totalOrders) * 100 : 0

    const chartData = revenueByDate.map((item, index) => {
        const prevItem = index > 0 ? revenueByDate[index - 1] : null
        const dailyTotal = item.dailyOrders || 0
        const onlineOrders = item.onlineOrders || 0
        const posOrders = item.posOrders || 0

        return {
            date: formatDate(item.date),
            fullDate: item.date,
            totalOrders: dailyTotal,
            onlineOrders,
            posOrders,
            revenue: item.dailyRevenue || 0,
            change: prevItem ? dailyTotal - (prevItem.dailyOrders || 0) : 0,
            changePercent: prevItem && prevItem.dailyOrders > 0
                ? ((dailyTotal - prevItem.dailyOrders) / prevItem.dailyOrders) * 100
                : 0,
        }
    })

    const chartConfig = {
        totalOrders: {
            label: "Tổng đơn",
            color: "#3b82f6",
        },
        onlineOrders: {
            label: "Đơn online",
            color: "#10b981",
        },
        posOrders: {
            label: "Đơn tại quầy",
            color: "#8b5cf6",
        },
        revenue: {
            label: "Doanh thu",
            color: "#f59e0b",
        },
    }

    return (
        <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b border-blue-100">
                <CardTitle className="flex items-center text-blue-800">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <span className="text-xs font-medium text-green-700">Hoàn thành</span>
                            </div>
                            <div className="text-2xl font-bold text-green-700 mb-1">
                                {formatNumber(orderStats.completedOrders || 0)}
                            </div>
                            <div className="flex items-center text-xs">
                                <div className="w-full bg-green-200 rounded-full h-1.5 mr-2">
                                    <div
                                        className="bg-green-600 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${completionRate}%` }}
                                    />
                                </div>
                                <span className="text-green-700 font-semibold">{completionRate.toFixed(1)}%</span>
                            </div>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                            <div className="flex items-center justify-between mb-2">
                                <Clock className="w-5 h-5 text-yellow-600" />
                                <span className="text-xs font-medium text-yellow-700">Chờ thanh toán</span>
                            </div>
                            <div className="text-2xl font-bold text-yellow-700 mb-1">
                                {formatNumber(orderStats.pendingOrders || 0)}
                            </div>
                            <div className="flex items-center text-xs">
                                <div className="w-full bg-yellow-200 rounded-full h-1.5 mr-2">
                                    <div
                                        className="bg-yellow-600 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${pendingPaymentRate}%` }}
                                    />
                                </div>
                                <span className="text-yellow-700 font-semibold">{pendingPaymentRate.toFixed(1)}%</span>
                            </div>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                            <div className="flex items-center justify-between mb-2">
                                <XCircle className="w-5 h-5 text-red-600" />
                                <span className="text-xs font-medium text-red-700">Đã hủy</span>
                            </div>
                            <div className="text-2xl font-bold text-red-700 mb-1">
                                {formatNumber(orderStats.cancelledOrders || 0)}
                            </div>
                            <div className="flex items-center text-xs">
                                <div className="w-full bg-red-200 rounded-full h-1.5 mr-2">
                                    <div
                                        className="bg-red-600 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${cancellationRate}%` }}
                                    />
                                </div>
                                <span className="text-red-700 font-semibold">{cancellationRate.toFixed(1)}%</span>
                            </div>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                                <AlertTriangle className="w-5 h-5 text-blue-600" />
                                <span className="text-xs font-medium text-blue-700">Tổng đơn</span>
                            </div>
                            <div className="text-2xl font-bold text-blue-700 mb-1">
                                {formatNumber(totalOrders)}
                            </div>
                            <div className="text-xs text-blue-600">
                                Trung bình: {formatCurrency(orderStats.averageOrderValue || 0)}
                            </div>
                        </div>
                    </div>

                    {chartData.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Xu hướng đơn hàng theo thời gian</h3>
                                <div className="flex items-center space-x-4 text-xs">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                        <span className="text-gray-600">Tổng đơn</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                        <span className="text-gray-600">Online</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                                        <span className="text-gray-600">Tại quầy</span>
                                    </div>
                                </div>
                            </div>

                            <ChartContainer config={chartConfig} className="h-[350px] w-full">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="totalOrdersGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                                            </linearGradient>
                                            <linearGradient id="onlineOrdersGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                                            </linearGradient>
                                            <linearGradient id="posOrdersGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12, fill: "#64748b" }}
                                            tickLine={{ stroke: "#e2e8f0" }}
                                            axisLine={{ stroke: "#e2e8f0" }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fill: "#64748b" }}
                                            tickLine={{ stroke: "#e2e8f0" }}
                                            axisLine={{ stroke: "#e2e8f0" }}
                                        />
                                        <ChartTooltip
                                            content={
                                                <ChartTooltipContent
                                                    formatter={(value: number | string, name: string) => {
                                                        if (name === "totalOrders" || name === "onlineOrders" || name === "posOrders") {
                                                            return [formatNumber(Number(value)), name === "totalOrders" ? "Tổng đơn" : name === "onlineOrders" ? "Online" : "Tại quầy"]
                                                        }
                                                        return [formatCurrency(Number(value)), "Doanh thu"]
                                                    }}
                                                    labelFormatter={(label: string, payload: any[]) => {
                                                        const item = payload?.[0]?.payload
                                                        return item ? new Date(item.fullDate).toLocaleDateString("vi-VN") : label
                                                    }}
                                                    className="bg-white border border-gray-200 shadow-lg rounded-lg"
                                                />
                                            }
                                        />
                                        <Legend
                                            wrapperStyle={{ paddingTop: "20px" }}
                                            iconType="circle"
                                            formatter={(value) => {
                                                if (value === "totalOrders") return "Tổng đơn"
                                                if (value === "onlineOrders") return "Online"
                                                if (value === "posOrders") return "Tại quầy"
                                                return value
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="totalOrders"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            fill="url(#totalOrdersGradient)"
                                            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                                            activeDot={{ r: 5 }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="onlineOrders"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            fill="url(#onlineOrdersGradient)"
                                            dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                                            activeDot={{ r: 5 }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="posOrders"
                                            stroke="#8b5cf6"
                                            strokeWidth={2}
                                            fill="url(#posOrdersGradient)"
                                            dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 3 }}
                                            activeDot={{ r: 5 }}
                                        />
                                    </AreaChart>
                            </ChartContainer>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Tăng trưởng đơn hàng</h4>
                                    {chartData.slice(-5).map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className="text-xs text-gray-600 font-medium">{item.date}</span>
                                                {item.changePercent !== 0 && (
                                                    item.changePercent > 0 ? (
                                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <TrendingDown className="w-4 h-4 text-red-500" />
                                                    )
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-4 text-xs">
                                                <span className="text-gray-700 font-medium">{formatNumber(item.totalOrders)} đơn</span>
                                                {item.changePercent !== 0 && (
                                                    <span
                                                        className={`font-bold px-2 py-1 rounded-full ${
                                                            item.changePercent > 0
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                    >
                                                        {item.changePercent > 0 ? "+" : ""}
                                                        {item.changePercent.toFixed(1)}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">So sánh kênh bán hàng</h4>
                                    {chartData.slice(-5).map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <span className="text-xs text-gray-600">{item.date}</span>
                                            <div className="flex space-x-4 text-xs">
                                                <span className="text-green-600 font-medium">
                                                    Online: {formatNumber(item.onlineOrders)}
                                                </span>
                                                <span className="text-purple-600 font-medium">
                                                    Quầy: {formatNumber(item.posOrders)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default OrderStatusTrendChart

