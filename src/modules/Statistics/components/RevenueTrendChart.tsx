"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/core/shadcn/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/core/shadcn/components/ui/chart"
import type { RevenueStatisticsResponse } from "@/lib/services/modules/statisticsService"
import { TrendingDown, TrendingUp } from "lucide-react"
import type React from "react"
import { motion } from "framer-motion"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

interface RevenueTrendChartProps {
    data: RevenueStatisticsResponse[]
    title?: string
}

const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({ data, title = "Xu hướng doanh thu" }) => {
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit"
        })
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
        return (
            <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg border-b border-green-100">
                    <CardTitle className="flex items-center text-green-800">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <TrendingUp className="w-16 h-16 mb-4 opacity-30 text-green-300" />
                        <p className="text-lg font-medium text-gray-600">Không có dữ liệu doanh thu</p>
                        <p className="text-sm text-gray-500">Vui lòng chọn khoảng thời gian khác</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const chartData = data.map((item, index) => {
        const prevItem = index > 0 ? data[index - 1] : null
        const revenue = item.netRevenue !== undefined ? item.netRevenue : (item.dailyRevenue || 0)
        const prevRevenue = prevItem ? (prevItem.netRevenue !== undefined ? prevItem.netRevenue : (prevItem.dailyRevenue || 0)) : 0
        const change = prevItem ? revenue - prevRevenue : 0
        const changePercent = prevItem && prevRevenue > 0
            ? ((revenue - prevRevenue) / prevRevenue) * 100
            : 0

        return {
            date: formatDate(item.date),
            fullDate: item.date,
            revenue,
            shippingFee: item.shippingFee || 0,
            online: item.onlineRevenue || 0,
            pos: item.posRevenue || 0,
            orders: item.dailyOrders || 0,
            change,
            changePercent,
            high: revenue,
            low: Math.min(item.onlineRevenue || 0, item.posRevenue || 0),
        }
    })

    const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0)
    const avgRevenue = chartData.length > 0 ? totalRevenue / chartData.length : 0
    const maxRevenue = Math.max(...chartData.map(item => item.revenue))
    const minRevenue = Math.min(...chartData.map(item => item.revenue))
    const latestChange = chartData.length > 1 ? chartData[chartData.length - 1].changePercent : 0

    const chartConfig = {
        revenue: {
            label: "Doanh thu",
            color: "#10b981",
        },
        online: {
            label: "Online",
            color: "#3b82f6",
        },
        pos: {
            label: "Tại quầy",
            color: "#8b5cf6",
        },
    }

    return (
        <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg border-b border-green-100">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-green-800">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        {title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm">
                        <div className="text-right">
                            <div className="text-xs text-gray-600">Thay đổi</div>
                            <div className={`font-bold flex items-center ${latestChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {latestChange >= 0 ? (
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 mr-1" />
                                )}
                                {latestChange >= 0 ? "+" : ""}
                                {latestChange.toFixed(2)}%
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <motion.div 
                            className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                        >
                            <div className="text-xs text-green-700 font-medium mb-1">Tổng doanh thu</div>
                            <motion.div 
                                className="text-lg font-bold text-green-700"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                            >
                                {formatCurrency(totalRevenue)}
                            </motion.div>
                        </motion.div>
                        <motion.div 
                            className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                        >
                            <div className="text-xs text-blue-700 font-medium mb-1">Trung bình</div>
                            <motion.div 
                                className="text-lg font-bold text-blue-700"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
                            >
                                {formatCurrency(avgRevenue)}
                            </motion.div>
                        </motion.div>
                        <motion.div 
                            className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                        >
                            <div className="text-xs text-purple-700 font-medium mb-1">Cao nhất</div>
                            <motion.div 
                                className="text-lg font-bold text-purple-700"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
                            >
                                {formatCurrency(maxRevenue)}
                            </motion.div>
                        </motion.div>
                        <motion.div 
                            className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                        >
                            <div className="text-xs text-orange-700 font-medium mb-1">Thấp nhất</div>
                            <motion.div 
                                className="text-lg font-bold text-orange-700"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
                            >
                                {formatCurrency(minRevenue)}
                            </motion.div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <ChartContainer config={chartConfig} className="h-[400px] w-full">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}>
                                            <animate attributeName="stopOpacity" values="0.4;0.6;0.4" dur="3s" repeatCount="indefinite" />
                                        </stop>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}>
                                            <animate attributeName="stopOpacity" values="0.05;0.15;0.05" dur="3s" repeatCount="indefinite" />
                                        </stop>
                                    </linearGradient>
                                    <linearGradient id="onlineGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}>
                                            <animate attributeName="stopOpacity" values="0.3;0.5;0.3" dur="3s" repeatCount="indefinite" />
                                        </stop>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}>
                                            <animate attributeName="stopOpacity" values="0.05;0.15;0.05" dur="3s" repeatCount="indefinite" />
                                        </stop>
                                    </linearGradient>
                                    <linearGradient id="posGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}>
                                            <animate attributeName="stopOpacity" values="0.3;0.5;0.3" dur="3s" repeatCount="indefinite" />
                                        </stop>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}>
                                            <animate attributeName="stopOpacity" values="0.05;0.15;0.05" dur="3s" repeatCount="indefinite" />
                                        </stop>
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
                                    tickFormatter={(value) => formatCurrency(value)}
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            formatter={(value: number | string, name: string, payload: any) => {
                                                const item = payload?.payload
                                                if (name === "revenue" && item?.shippingFee) {
                                                    return [
                                                        `${formatCurrency(Number(value))} (Phí ship: ${formatCurrency(item.shippingFee)})`,
                                                        "Doanh thu (sau phí ship)"
                                                    ]
                                                }
                                                return [
                                                    formatCurrency(Number(value)),
                                                    name === "revenue" ? "Doanh thu" : name === "online" ? "Online" : "Tại quầy"
                                                ]
                                            }}
                                            labelFormatter={(label: string, payload: any[]) => {
                                                const item = payload?.[0]?.payload
                                                return item ? new Date(item.fullDate).toLocaleDateString("vi-VN") : label
                                            }}
                                            className="bg-white border border-gray-200 shadow-lg rounded-lg"
                                        />
                                    }
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fill="url(#revenueGradient)"
                                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "#fff" }}
                                    isAnimationActive={true}
                                    animationBegin={0}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="online"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fill="url(#onlineGradient)"
                                    dot={{ fill: "#3b82f6", strokeWidth: 1, r: 3 }}
                                    activeDot={{ r: 5 }}
                                    isAnimationActive={true}
                                    animationBegin={200}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="pos"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    fill="url(#posGradient)"
                                    dot={{ fill: "#8b5cf6", strokeWidth: 1, r: 3 }}
                                    activeDot={{ r: 5 }}
                                    isAnimationActive={true}
                                    animationBegin={400}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Biến động doanh thu</h4>
                            {chartData.slice(-7).map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 cursor-pointer group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xs text-gray-600 font-medium w-16">{item.date}</span>
                                        {item.changePercent !== 0 && (
                                            <motion.div
                                                animate={{ 
                                                    rotate: item.changePercent > 0 ? [0, -10, 10, 0] : [0, 10, -10, 0],
                                                    scale: [1, 1.2, 1]
                                                }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                {item.changePercent > 0 ? (
                                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                                )}
                                            </motion.div>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-4 text-xs">
                                        <motion.span 
                                            className="text-gray-700 font-medium"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            {formatCurrency(item.revenue)}
                                        </motion.span>
                                        {item.changePercent !== 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                                                className={`font-bold px-2 py-1 rounded-full ${
                                                    item.changePercent > 0
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {item.changePercent > 0 ? "+" : ""}
                                                {item.changePercent.toFixed(1)}%
                                            </motion.span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">So sánh kênh bán hàng</h4>
                            {chartData.slice(-7).map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02, x: -5 }}
                                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer group"
                                >
                                    <span className="text-xs text-gray-600">{item.date}</span>
                                    <div className="flex space-x-4 text-xs">
                                        <motion.span 
                                            className="text-blue-600 font-medium"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            Online: {formatCurrency(item.online)}
                                        </motion.span>
                                        <motion.span 
                                            className="text-purple-600 font-medium"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            Quầy: {formatCurrency(item.pos)}
                                        </motion.span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default RevenueTrendChart

