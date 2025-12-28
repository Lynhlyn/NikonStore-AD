import { Card, CardContent, CardHeader, CardTitle } from "@/core/shadcn/components/ui/card"
import type { SalesChannelStatisticsResponse } from "@/lib/services/modules/statisticsService"
import { Globe, PieChart, Store, TrendingUp } from "lucide-react"
import * as React from "react"
import { motion } from "framer-motion"

interface SalesChannelChartProps {
  data: SalesChannelStatisticsResponse[]
  title?: string
}

const SalesChannelChart: React.FC<SalesChannelChartProps> = ({ data, title = "Phân bố doanh thu theo kênh bán hàng" }) => {
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
      <motion.div 
        className="relative w-64 h-64 mx-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <svg width="256" height="256" className="transform -rotate-90">
          {data.map((channel, index) => {
            const percentage = (channel as any).revenuePercentage || 0
            const radius = 100
            const circumference = 2 * Math.PI * radius
            const fullDasharray = `${circumference} ${circumference}`
            const finalDasharray = `${(percentage / 100) * circumference} ${circumference}`
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
                strokeDasharray={fullDasharray}
                strokeDashoffset={strokeDashoffset}
                style={{
                  strokeLinecap: 'round',
                  strokeDasharray: finalDasharray,
                  transition: 'stroke-dasharray 1.5s ease-out',
                  transitionDelay: `${index * 0.2}s`
                }}
              >
                <animate
                  attributeName="stroke-dasharray"
                  from={fullDasharray}
                  to={finalDasharray}
                  dur="1.5s"
                  begin={`${index * 0.2}s`}
                  fill="freeze"
                />
              </circle>
            )
          })}
        </svg>

        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 1 }}
        >
          <div className="text-center">
            <motion.div 
              className="text-2xl font-bold text-gray-800"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
            >
              {formatCurrency(totalRevenue)}
            </motion.div>
            <div className="text-sm text-gray-600">Doanh thu thực tế</div>
          </div>
        </motion.div>
      </motion.div>
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
              <div className="text-sm font-medium text-green-700">Doanh thu thực tế</div>
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
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-300 bg-white cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <motion.div
                          className={`p-2 rounded-lg bg-gradient-to-r ${getChannelColor(channel.channel)} text-white mr-3 shadow-sm`}
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          {getChannelIcon(channel.channel)}
                        </motion.div>
                        <div>
                          <h4 className="font-bold text-gray-800">{getChannelName(channel.channel)}</h4>
                          <p className="text-xs text-gray-600">
                            Hoàn thành: <span className="font-semibold text-green-600">{channel.completionRate.toFixed(1)}%</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <motion.div 
                          className="font-bold text-lg text-gray-800"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                        >
                          {formatCurrency(channel.totalRevenue)}
                        </motion.div>
                        <div className="text-sm text-gray-600">
                          {formatNumber(channel.totalOrders)} đơn
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-700">Doanh thu</span>
                        <motion.span 
                          className="text-blue-600 font-bold"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                        >
                          {revenuePercentage.toFixed(1)}%
                        </motion.span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`bg-gradient-to-r ${getChannelColor(channel.channel)} h-2 rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${revenuePercentage}%` }}
                          transition={{ duration: 1.5, delay: index * 0.1 + 0.3, ease: "easeOut" }}
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
                  </motion.div>
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

