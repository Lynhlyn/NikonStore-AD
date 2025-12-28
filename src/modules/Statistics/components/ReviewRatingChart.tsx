"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/core/shadcn/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/core/shadcn/components/ui/chart"
import { Star } from "lucide-react"
import * as React from "react"
import { motion } from "framer-motion"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"

interface ReviewRatingData {
    rating: number
    count: number
    percentage: number
}

interface ReviewRatingChartProps {
    data?: ReviewRatingData[]
    title?: string
}

const ReviewRatingChart: React.FC<ReviewRatingChartProps> = ({
    data = [],
    title = "Phân bố đánh giá sản phẩm"
}) => {
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("vi-VN").format(num)
    }

    const defaultData = [
        { rating: 5, count: 0, percentage: 0 },
        { rating: 4, count: 0, percentage: 0 },
        { rating: 3, count: 0, percentage: 0 },
        { rating: 2, count: 0, percentage: 0 },
        { rating: 1, count: 0, percentage: 0 },
    ]

    const chartData = data.length > 0 ? data : defaultData
    const totalReviews = chartData.reduce((sum, item) => sum + item.count, 0)
    const reviewsAbove4 = chartData.filter(item => item.rating >= 4).reduce((sum, item) => sum + item.count, 0)
    const reviewsBelow4 = chartData.filter(item => item.rating < 4).reduce((sum, item) => sum + item.count, 0)
    const above4Rate = totalReviews > 0 ? (reviewsAbove4 / totalReviews) * 100 : 0
    const below4Rate = totalReviews > 0 ? (reviewsBelow4 / totalReviews) * 100 : 0
    const averageRating = totalReviews > 0
        ? chartData.reduce((sum, item) => sum + (item.rating * item.count), 0) / totalReviews
        : 0

    const pieData = [
        { name: "≥ 4 sao", value: reviewsAbove4, color: "#10b981" },
        { name: "< 4 sao", value: reviewsBelow4, color: "#ef4444" },
    ]

    const COLORS = {
        5: "#10b981",
        4: "#22c55e",
        3: "#f59e0b",
        2: "#f97316",
        1: "#ef4444",
    }

    const chartConfig = {
        count: {
            label: "Số lượng",
            color: "#3b82f6",
        },
    }

    if (totalReviews === 0) {
        return (
            <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-t-lg border-b border-yellow-100">
                    <CardTitle className="flex items-center text-yellow-800">
                        <Star className="w-5 h-5 mr-2" />
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Star className="w-16 h-16 mb-4 opacity-30 text-yellow-300" />
                        <p className="text-lg font-medium text-gray-600">Không có dữ liệu đánh giá</p>
                        <p className="text-sm text-gray-500">Chưa có đánh giá nào trong khoảng thời gian này</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-t-lg border-b border-yellow-100">
                <CardTitle className="flex items-center text-yellow-800">
                    <Star className="w-5 h-5 mr-2" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <motion.div 
                            className="p-4 bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl border border-yellow-200"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <motion.div
                                    animate={{ rotate: [0, 15, -15, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Star className="w-5 h-5 text-yellow-600" />
                                </motion.div>
                                <span className="text-xs font-medium text-yellow-700">Điểm trung bình</span>
                            </div>
                            <motion.div 
                                className="text-3xl font-bold text-yellow-700 mb-2"
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: 0.3, type: "spring" }}
                            >
                                {averageRating.toFixed(1)}
                            </motion.div>
                            <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-4 h-4 ${
                                            star <= Math.round(averageRating)
                                                ? "fill-yellow-500 text-yellow-500"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                            <div className="text-xs text-yellow-600 mt-1">Từ {formatNumber(totalReviews)} đánh giá</div>
                        </motion.div>

                        <motion.div 
                            className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Star className="w-5 h-5 text-green-600 fill-green-600" />
                                </motion.div>
                                <span className="text-xs font-medium text-green-700">≥ 4 sao</span>
                            </div>
                            <motion.div 
                                className="text-2xl font-bold text-green-700 mb-1"
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: 0.4, type: "spring" }}
                            >
                                {formatNumber(reviewsAbove4)}
                            </motion.div>
                            <div className="flex items-center text-xs">
                                <div className="w-full bg-green-200 rounded-full h-1.5 mr-2 overflow-hidden">
                                    <motion.div
                                        className="bg-green-600 h-1.5 rounded-full"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${above4Rate}%` }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                                    />
                                </div>
                                <motion.span 
                                    className="text-green-700 font-semibold"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ delay: 1 }}
                                >
                                    {above4Rate.toFixed(1)}%
                                </motion.span>
                            </div>
                            <div className="text-xs text-green-600 mt-1">Đánh giá tích cực</div>
                        </motion.div>

                        <motion.div 
                            className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Star className="w-5 h-5 text-red-600" />
                                </motion.div>
                                <span className="text-xs font-medium text-red-700">&lt; 4 sao</span>
                            </div>
                            <motion.div 
                                className="text-2xl font-bold text-red-700 mb-1"
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: 0.5, type: "spring" }}
                            >
                                {formatNumber(reviewsBelow4)}
                            </motion.div>
                            <div className="flex items-center text-xs">
                                <div className="w-full bg-red-200 rounded-full h-1.5 mr-2 overflow-hidden">
                                    <motion.div
                                        className="bg-red-600 h-1.5 rounded-full"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${below4Rate}%` }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                                    />
                                </div>
                                <motion.span 
                                    className="text-red-700 font-semibold"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ delay: 1.1 }}
                                >
                                    {below4Rate.toFixed(1)}%
                                </motion.span>
                            </div>
                            <div className="text-xs text-red-600 mt-1">Cần cải thiện</div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Phân bố theo sao</h3>
                            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                <BarChart data={[...chartData].reverse()}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="rating"
                                        tick={{ fontSize: 12, fill: "#64748b" }}
                                        tickLine={{ stroke: "#e2e8f0" }}
                                        axisLine={{ stroke: "#e2e8f0" }}
                                        tickFormatter={(value) => `${value} sao`}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: "#64748b" }}
                                        tickLine={{ stroke: "#e2e8f0" }}
                                        axisLine={{ stroke: "#e2e8f0" }}
                                    />
                                    <ChartTooltip
                                        content={
                                            <ChartTooltipContent
                                                formatter={(value: any) => [
                                                    formatNumber(Number(value)),
                                                    "Số lượng"
                                                ]}
                                                labelFormatter={(label) => `${label} sao`}
                                                className="bg-white border border-gray-200 shadow-lg rounded-lg"
                                            />
                                        }
                                    />
                                    <Bar 
                                        dataKey="count" 
                                        radius={[8, 8, 0, 0]}
                                        isAnimationActive={true}
                                        animationBegin={0}
                                        animationDuration={1500}
                                        animationEasing="ease-out"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[entry.rating as keyof typeof COLORS]}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Tỉ lệ đánh giá</h3>
                            <div className="flex items-center justify-center h-[300px]">
                                <ChartContainer config={chartConfig} className="h-full w-full">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                            isAnimationActive={true}
                                            animationBegin={0}
                                            animationDuration={1500}
                                            animationEasing="ease-out"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip
                                            content={
                                                <ChartTooltipContent
                                                    formatter={(value: any) => [
                                                        formatNumber(Number(value)),
                                                        "Số lượng"
                                                    ]}
                                                    className="bg-white border border-gray-200 shadow-lg rounded-lg"
                                                />
                                            }
                                        />
                                    </PieChart>
                                </ChartContainer>
                            </div>
                        </div>
                    </motion.div>

                    <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Chi tiết từng mức đánh giá</h4>
                        <div className="space-y-2">
                            {[...chartData].reverse().map((item, index) => {
                                const percentage = totalReviews > 0 ? (item.count / totalReviews) * 100 : 0
                                return (
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
                                            <div className="flex items-center space-x-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${
                                                            star <= item.rating
                                                                ? "fill-yellow-500 text-yellow-500"
                                                                : "text-gray-300"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{item.rating} sao</span>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        backgroundColor: COLORS[item.rating as keyof typeof COLORS],
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 w-20 text-right">
                                                {formatNumber(item.count)}
                                            </span>
                                            <span className="text-sm text-gray-600 w-16 text-right">
                                                {percentage.toFixed(1)}%
                                            </span>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default ReviewRatingChart

