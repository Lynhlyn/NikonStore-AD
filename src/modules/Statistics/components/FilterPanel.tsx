"use client"

import { Button } from "@/core/shadcn/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/shadcn/components/ui/card"
import type { StatisticsFilterRequest } from "@/lib/services/modules/statisticsService"
import { Calendar, Filter, RefreshCw, Search, X } from "lucide-react"
import type React from "react"
import { useState } from "react"

interface FilterPanelProps {
    onFilterChange: (filters: StatisticsFilterRequest) => void
    onReset: () => void
}

type PresetType = "today" | "yesterday" | "week" | "month" | "quarter" | "year" | "custom" | null

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange, onReset }) => {
    const getTodayRange = () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return [today, new Date()] as [Date, Date]
    }

    const getYesterdayRange = () => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        yesterday.setHours(0, 0, 0, 0)
        const end = new Date(yesterday)
        end.setHours(23, 59, 59, 999)
        return [yesterday, end] as [Date, Date]
    }

    const getWeekRange = () => {
        const today = new Date()
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        startOfWeek.setHours(0, 0, 0, 0)
        return [startOfWeek, today] as [Date, Date]
    }

    const getMonthRange = () => {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        return [startOfMonth, now] as [Date, Date]
    }

    const getQuarterRange = () => {
        const now = new Date()
        const quarter = Math.floor(now.getMonth() / 3)
        const startOfQuarter = new Date(now.getFullYear(), quarter * 3, 1)
        return [startOfQuarter, now] as [Date, Date]
    }

    const getYearRange = () => {
        const now = new Date()
        const startOfYear = new Date(now.getFullYear(), 0, 1)
        return [startOfYear, now] as [Date, Date]
    }

    const getCurrentMonthRange = () => {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        return [startOfMonth, endOfMonth] as [Date, Date]
    }

    const [startDate, setStartDate] = useState<Date>(getCurrentMonthRange()[0])
    const [endDate, setEndDate] = useState<Date>(getCurrentMonthRange()[1])
    const [selectedPreset, setSelectedPreset] = useState<PresetType>("month")

    const handlePresetClick = (preset: PresetType) => {
        if (preset === "custom") {
            setSelectedPreset("custom")
            return
        }

        setSelectedPreset(preset)
        let range: [Date, Date]

        switch (preset) {
            case "today":
                range = getTodayRange()
                break
            case "yesterday":
                range = getYesterdayRange()
                break
            case "week":
                range = getWeekRange()
                break
            case "month":
                range = getMonthRange()
                break
            case "quarter":
                range = getQuarterRange()
                break
            case "year":
                range = getYearRange()
                break
            default:
                range = getCurrentMonthRange()
        }

        setStartDate(range[0])
        setEndDate(range[1])

        const filters: StatisticsFilterRequest = {
            fromDate: range[0].toISOString().split("T")[0],
            toDate: range[1].toISOString().split("T")[0],
        }
        onFilterChange(filters)
    }

    const handleSearch = () => {
        const filters: StatisticsFilterRequest = {
            fromDate: startDate ? startDate.toISOString().split("T")[0] : undefined,
            toDate: endDate ? endDate.toISOString().split("T")[0] : undefined,
        }
        onFilterChange(filters)
    }

    const handleReset = () => {
        const [start, end] = getCurrentMonthRange()
        setStartDate(start)
        setEndDate(end)
        setSelectedPreset("month")
        onReset()
    }

    const presets = [
        { key: "today", label: "Hôm nay" },
        { key: "yesterday", label: "Hôm qua" },
        { key: "week", label: "Tuần này" },
        { key: "month", label: "Tháng này" },
        { key: "quarter", label: "Quý này" },
        { key: "year", label: "Năm nay" },
        { key: "custom", label: "Tùy chỉnh" },
    ]

    return (
        <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg border-b border-gray-100">
                <CardTitle className="flex items-center text-gray-800">
                    <Filter className="w-5 h-5 mr-2 text-slate-600" />
                    Bộ lọc thống kê
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Khoảng thời gian nhanh</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
                        {presets.map((preset) => (
                            <Button
                                key={preset.key}
                                variant={selectedPreset === preset.key ? "default" : "outline"}
                                onClick={() => handlePresetClick(preset.key as PresetType)}
                                className={`h-10 text-xs sm:text-sm ${
                                    selectedPreset === preset.key
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                {preset.label}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Khoảng thời gian tùy chỉnh</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                        <div className="flex-1 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Từ ngày</label>
                            <input
                                type="date"
                                value={startDate.toISOString().split("T")[0]}
                                onChange={(e) => {
                                    setStartDate(new Date(e.target.value))
                                    setSelectedPreset("custom")
                                }}
                                className="w-full h-[44px] px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Đến ngày</label>
                            <input
                                type="date"
                                value={endDate.toISOString().split("T")[0]}
                                onChange={(e) => {
                                    setEndDate(new Date(e.target.value))
                                    setSelectedPreset("custom")
                                }}
                                className="w-full h-[44px] px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                onClick={handleSearch}
                                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px] h-[44px] flex-1 sm:flex-initial"
                            >
                                <Search className="w-4 h-4 mr-2" />
                                Áp dụng
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50 min-w-[120px] h-[44px] flex-1 sm:flex-initial"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Đặt lại
                            </Button>
                        </div>
                    </div>
                </div>

                {selectedPreset !== null && (
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                                Đang hiển thị: <span className="font-medium text-gray-800">
                                    {presets.find(p => p.key === selectedPreset)?.label || "Tùy chỉnh"}
                                </span>
                            </span>
                            <span className="text-gray-500">
                                {startDate.toLocaleDateString("vi-VN")} - {endDate.toLocaleDateString("vi-VN")}
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default FilterPanel

