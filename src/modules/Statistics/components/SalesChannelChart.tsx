import { Card, CardContent, CardHeader, CardTitle } from "@/core/shadcn/components/ui/card"
import type { SalesChannelStatisticsResponse } from "@/lib/services/modules/statisticsService"
import { Globe, PieChart, Store, TrendingUp } from "lucide-react"
import type React from "react"

interface SalesChannelChartProps {
  data: SalesChannelStatisticsResponse[]
  title?: string
}

const SalesChannelChart: React.FC<SalesChannelChartProps> = ({ data, title = "Phân bố doanh thu theo kênh bán hàng" }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num)
  }

  const PieChartComponent = ({ data }: { data: SalesChannelStatisticsResponse[] }) => {
    const totalRevenue = data.reduce((sum, channel) => sum + channel.totalRevenue, 0)

    if (totalRevenue === 0) {
      return (
        <div className="flex items-center justify-center w-64 h-64 mx-auto">
          <div className="text-center text-gray-500">
            <PieChart className="w-16 h-16 mx-auto mb-2 opacity-30" />
            <p>Không có doanh thu</p>
          </div>
        </div>
      )
    }

    let cumulativePercentage = 0

    return (
      <div className="relative w-64 h-64 mx-auto">
        <svg width="256" height="256" className="transform -rotate-90">
          {data.map((channel, index) => {
            const percentage = (channel as any).revenuePercentage || 0
            const radius = 100
            const circumference = 2 * Math.PI * radius
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
            const strokeDashoffset = -((cumulativePercentage / 100) * circumference)

            cumulativePercentage += percentage

            return (
              <circle
                key={index}
                cx="128"
                cy="128"
                r={radius}
                fill="none"
                stroke={getChannelColorHex(channel.channel)}
                strokeWidth="40"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
                style={{
                  strokeLinecap: 'round'
                }}
              />
            )
          })}
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{formatCurrency(totalRevenue)}</div>
            <div className="text-sm text-gray-600">Tổng doanh thu</div>
          </div>
        </div>
      </div>
    )
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-lg border-b border-gray-100">
          <CardTitle className="flex items-center text-slate-800">
            <TrendingUp className="w-5 h-5 mr-2" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Store className="w-16 h-16 mb-4 opacity-30 text-slate-300" />
            <p className="text-lg font-medium text-gray-600">Không có dữ liệu kênh bán hàng</p>
            <p className="text-sm text-gray-500">Vui lòng chọn khoảng thời gian khác</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalRevenue = data.reduce((sum, channel) => sum + channel.totalRevenue, 0)
  const totalOrders = data.reduce((sum, channel) => sum + channel.totalOrders, 0)

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "IN_STORE":
        return <Store className="w-5 h-5" />
      case "ONLINE":
        return <Globe className="w-5 h-5" />
      default:
        return <TrendingUp className="w-5 h-5" />
    }
  }

  const getChannelName = (channel: string) => {
    switch (channel) {
      case "IN_STORE":
        return "Tại quầy"
      case "ONLINE":
        return "Online"
      default:
        return channel
    }
  }

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case "IN_STORE":
        return "from-blue-500 to-blue-600"
      case "ONLINE":
        return "from-green-500 to-green-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getChannelColorHex = (channel: string) => {
    switch (channel) {
      case "IN_STORE":
        return "#3B82F6"
      case "ONLINE":
        return "#10B981"
      default:
        return "#6B7280"
    }
  }

  return (
    <Card className="border border-gray-200 shadow-sm bg-white">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-lg border-b border-gray-100">
        <CardTitle className="flex items-center text-slate-800">
          <TrendingUp className="w-5 h-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          <div className="grid grid-cols-3 gap-6 p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-gray-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-600 mb-1">{formatNumber(totalOrders)}</div>
              <div className="text-sm font-medium text-slate-700">Tổng đơn hàng</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{formatCurrency(totalRevenue)}</div>
              <div className="text-sm font-medium text-green-700">Tổng doanh thu</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{data.length}</div>
              <div className="text-sm font-medium text-blue-700">Kênh bán hàng</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Phân bố doanh thu</h3>
              <PieChartComponent data={data} />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Chi tiết từng kênh</h3>
              {data.map((channel, index) => {
                const revenuePercentage = (channel as any).revenuePercentage || 0
                const orderPercentage = totalOrders > 0 ? (channel.totalOrders / totalOrders) * 100 : 0

                return (
                  <div
                    key={index}
                    className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-300 bg-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-r ${getChannelColor(channel.channel)} text-white mr-3 shadow-sm`}
                        >
                          {getChannelIcon(channel.channel)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{getChannelName(channel.channel)}</h4>
                          <p className="text-xs text-gray-600">
                            Hoàn thành: <span className="font-semibold text-green-600">{channel.completionRate.toFixed(1)}%</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-gray-800">{formatCurrency(channel.totalRevenue)}</div>
                        <div className="text-sm text-gray-600">
                          {formatNumber(channel.totalOrders)} đơn
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-700">Doanh thu</span>
                        <span className="text-blue-600 font-bold">{revenuePercentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${getChannelColor(channel.channel)} h-2 rounded-full transition-all duration-700 ease-out`}
                          style={{ width: `${revenuePercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <div className="font-bold text-green-700 text-sm">{formatNumber(channel.completedOrders)}</div>
                        <div className="text-xs text-green-600">Hoàn thành</div>
                      </div>
                      <div className="text-center p-2 bg-red-50 rounded-lg">
                        <div className="font-bold text-red-700 text-sm">{formatNumber(channel.cancelledOrders)}</div>
                        <div className="text-xs text-red-600">Đã hủy</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <div className="font-bold text-blue-700 text-sm">{formatCurrency(channel.averageOrderValue)}</div>
                        <div className="text-xs text-blue-600">Giá trị Trung Bình</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded-lg">
                        <div
                          className={`font-bold text-sm ${channel.completionRate > 50 ? "text-green-700" : "text-orange-700"}`}
                        >
                          {channel.completionRate > 50 ? "Tốt" : "Cần cải thiện"}
                        </div>
                        <div className={`text-xs ${channel.completionRate > 50 ? "text-green-600" : "text-orange-600"}`}>
                          Hiệu suất
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex justify-center space-x-8 p-4 bg-gray-50 rounded-xl">
            {data.map((channel, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: getChannelColorHex(channel.channel) }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {getChannelName(channel.channel)}: {((channel as any).revenuePercentage || 0).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SalesChannelChart

