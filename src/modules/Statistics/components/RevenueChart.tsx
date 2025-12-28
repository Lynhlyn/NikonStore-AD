import { Card, CardContent, CardHeader, CardTitle } from "@/core/shadcn/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/core/shadcn/components/ui/chart"
import type { RevenueStatisticsResponse } from "@/lib/services/modules/statisticsService"
import { TrendingUp } from "lucide-react"
import type React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

interface RevenueChartProps {
  data: RevenueStatisticsResponse[]
  title?: string
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, title = "Biểu đồ doanh thu" }) => {
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
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg border-b border-green-100">
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

  const chartData = data.slice(0, 10).map((item) => ({
    date: formatDate(item.date),
    fullDate: item.date,
    doanhThu: item.dailyRevenue,
    online: item.onlineRevenue,
    pos: item.posRevenue,
    tongDon: item.dailyOrders,
    onlineOrders: item.onlineOrders,
    posOrders: item.posOrders,
  }))

  const chartConfig = {
    doanhThu: {
      label: "Doanh thu",
      color: "hsl(var(--chart-1))",
    },
    online: {
      label: "Online",
      color: "hsl(var(--chart-2))",
    },
    pos: {
      label: "POS",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <Card className="border border-gray-200 shadow-sm bg-white">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg border-b border-green-100">
        <CardTitle className="flex items-center text-green-800">
          <TrendingUp className="w-5 h-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={chartData} width={undefined} height={300}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#e5e7eb" }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value: any, name: any) => [
                      name === "doanhThu" ? formatCurrency(Number(value)) : formatCurrency(Number(value)),
                      name === "doanhThu" ? "Doanh thu" : name === "online" ? "Online" : "POS"
                    ]}
                    labelFormatter={(label: any, payload: any) => {
                      const item = payload?.[0]?.payload
                      return item ? new Date(item.fullDate).toLocaleDateString("vi-VN") : label
                    }}
                  />
                }
              />
              <Bar
                dataKey="doanhThu"
                fill="var(--color-doanhThu)"
                radius={[4, 4, 0, 0]}
                name="Doanh thu"
              />
            </BarChart>
          </ChartContainer>

          <div className="border-t pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Chi tiết theo kênh</h4>
                {data.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-xs text-gray-600">{formatDate(item.date)}</span>
                    <div className="flex space-x-4 text-xs">
                      <span className="text-blue-600 font-medium">Online: {formatCurrency(item.onlineRevenue)}</span>
                      <span className="text-green-600 font-medium">Tại quầy: {formatCurrency(item.posRevenue)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Số lượng đơn hàng</h4>
                {data.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-xs text-gray-600">{formatDate(item.date)}</span>
                    <div className="flex space-x-4 text-xs">
                      <span className="text-blue-600 font-medium">Online: {item.onlineOrders}</span>
                      <span className="text-green-600 font-medium">Tại quầy: {item.posOrders}</span>
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

export default RevenueChart

