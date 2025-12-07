import { Card, CardContent, CardHeader, CardTitle } from "@/core/shadcn/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/core/shadcn/components/ui/chart"
import type { CustomerStatisticsResponse } from "@/lib/services/modules/statisticsService"
import { Users } from "lucide-react"
import type React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

interface CustomerChartProps {
  data: CustomerStatisticsResponse[]
  title?: string
}

const CustomerChart: React.FC<CustomerChartProps> = ({ data, title = "Biểu đồ khách hàng" }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num)
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
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg border-b border-purple-100">
          <CardTitle className="flex items-center text-purple-800">
            <Users className="w-5 h-5 mr-2" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Users className="w-16 h-16 mb-4 opacity-30 text-purple-300" />
            <p className="text-lg font-medium text-gray-600">Không có dữ liệu khách hàng</p>
            <p className="text-sm text-gray-500">Vui lòng chọn khoảng thời gian khác</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.slice(0, 10).map((item, index) => {
    const prevItem = index > 0 ? data[index - 1] : null
    const tangTruong = prevItem
      ? ((item.totalCustomers - prevItem.totalCustomers) / prevItem.totalCustomers) * 100
      : 0

    return {
      date: formatDate(item.date),
      fullDate: item.date,
      khachMoi: item.newCustomers,
      tongKhach: item.totalCustomers,
      hoatDong: item.activeCustomers,
      khachLe: item.guestCustomers,
      tangTruong: tangTruong,
      tangTruongAbs: Math.abs(tangTruong),
      isPositive: tangTruong >= 0,
    }
  })

  const chartConfig = {
    tangTruong: {
      label: "Tăng trưởng (%)",
      color: "#10b981",
    },
    tongKhach: {
      label: "Tổng khách hàng",
      color: "#3b82f6",
    },
    khachMoi: {
      label: "Khách mới",
      color: "#8b5cf6",
    },
  }

  return (
    <Card className="border border-gray-200 shadow-sm bg-white">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg border-b border-purple-100">
        <CardTitle className="flex items-center text-purple-800">
          <Users className="w-5 h-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Biểu đồ tăng trưởng khách hàng</h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Tăng trưởng</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Tổng khách hàng</span>
                </div>
              </div>
            </div>

            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <AreaChart data={chartData} width={undefined} height={350}>
                <defs>
                  <linearGradient id="tangTruongGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="tongKhachGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
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
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value: any, name: any) => {
                        if (name === "tangTruong") {
                          return [
                            `${Number(value).toFixed(2)}%`,
                            "Tăng trưởng"
                          ]
                        }
                        return [
                          formatNumber(Number(value)),
                          name === "tongKhach" ? "Tổng khách hàng" : "Khách mới"
                        ]
                      }}
                      labelFormatter={(label: any, payload: any) => {
                        const item = payload?.[0]?.payload
                        return item ? new Date(item.fullDate).toLocaleDateString("vi-VN") : label
                      }}
                      className="bg-white border border-gray-200 shadow-lg rounded-lg"
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="tangTruong"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#tangTruongGradient)"
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "#fff" }}
                />
              </AreaChart>
            </ChartContainer>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Chi tiết khách hàng</h4>
                {data.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-xs text-gray-600">{formatDate(item.date)}</span>
                    <div className="flex space-x-4 text-xs">
                      <span className="text-purple-600 font-medium">Mới: {formatNumber(item.newCustomers)}</span>
                      <span className="text-green-600 font-medium">Hoạt động: {formatNumber(item.activeCustomers)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Tăng trưởng theo thời gian</h4>
                {chartData.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <span className="text-xs text-gray-600 font-medium">{item.date}</span>
                    <div className="flex items-center space-x-3 text-xs">
                      <span className="text-blue-600 font-medium">Khách lẻ: {formatNumber(item.khachLe)}</span>
                      <span className={`font-bold px-2 py-1 rounded-full text-xs ${item.tangTruong >= 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}>
                        {item.tangTruong >= 0 ? '↗' : '↘'} {item.tangTruong.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CustomerChart

