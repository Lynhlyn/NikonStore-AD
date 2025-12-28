import * as XLSX from "xlsx"
import type { GeneralStatisticsData } from "@/lib/services/modules/statisticsService"

export const exportStatisticsToExcel = (data: GeneralStatisticsData, fromDate?: string, toDate?: string) => {
    const workbook = XLSX.utils.book_new()

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount)
    }

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("vi-VN").format(num)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    const dateRange = fromDate && toDate
        ? `${formatDate(fromDate)} - ${formatDate(toDate)}`
        : "Tất cả thời gian"

    const dateRangeRaw = fromDate && toDate
        ? `${fromDate} - ${toDate}`
        : "All time"

    const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4472C4" } },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
        },
    }

    const titleStyle = {
        font: { bold: true, size: 14, color: { rgb: "1F4E78" } },
        alignment: { horizontal: "center", vertical: "center" },
    }

    const summarySheetData: any[][] = [
        ["BÁO CÁO THỐNG KÊ TỔNG QUAN", "", "", ""],
        ["", "", "", ""],
        ["Khoảng thời gian:", dateRange, "", ""],
        ["", "", "", ""],
        ["CHỈ SỐ TỔNG QUAN", "", "", ""],
        ["", "", "", ""],
        ["Tiền lãi thực tế", formatCurrency(data.totalRevenue || 0), "", ""],
        ["Tổng phí ship", formatCurrency(data.totalShippingFee || 0), "", ""],
        ["Tổng đơn hàng", formatNumber(data.totalOrders || 0), "", ""],
        ["Khách hàng", formatNumber(data.totalCustomers || 0), "", ""],
        ["Sản phẩm", formatNumber(data.totalProducts || 0), "", ""],
        ["Tổng voucher", formatNumber(data.totalVouchers || 0), "", ""],
        ["Tổng giảm giá", formatCurrency(data.totalDiscountAmount || 0), "", ""],
        ["", "", "", ""],
        ["THỐNG KÊ ĐƠN HÀNG", "", "", ""],
        ["", "", "", ""],
        ["Tổng đơn hàng", formatNumber(data.orderStatistics?.totalOrders || 0), "", ""],
        ["Đơn hoàn thành", formatNumber(data.orderStatistics?.completedOrders || 0), "", ""],
        ["Đơn chờ thanh toán", formatNumber(data.orderStatistics?.pendingOrders || 0), "", ""],
        ["Đơn đã hủy", formatNumber(data.orderStatistics?.cancelledOrders || 0), "", ""],
        ["Tỉ lệ hủy", `${((data.orderStatistics?.cancelledOrders || 0) / (data.orderStatistics?.totalOrders || 1) * 100).toFixed(2)}%`, "", ""],
        ["Tỉ lệ chờ thanh toán", `${((data.orderStatistics?.pendingOrders || 0) / (data.orderStatistics?.totalOrders || 1) * 100).toFixed(2)}%`, "", ""],
        ["Tỉ lệ hoàn thành", `${((data.orderStatistics?.completedOrders || 0) / (data.orderStatistics?.totalOrders || 1) * 100).toFixed(2)}%`, "", ""],
        ["Giá trị trung bình đơn hàng", formatCurrency(data.orderStatistics?.averageOrderValue || 0), "", ""],
        ["Doanh thu tổng", formatCurrency(data.orderStatistics?.totalRevenue || 0), "", ""],
        ["Đơn online", formatNumber(data.orderStatistics?.onlineOrders || 0), "", ""],
        ["Đơn tại quầy", formatNumber(data.orderStatistics?.posOrders || 0), "", ""],
        ["Doanh thu online", formatCurrency(data.orderStatistics?.onlineRevenue || 0), "", ""],
        ["Doanh thu tại quầy", formatCurrency(data.orderStatistics?.posRevenue || 0), "", ""],
    ]

    const summarySheet = XLSX.utils.aoa_to_sheet(summarySheetData)
    summarySheet["!cols"] = [
        { wch: 30 },
        { wch: 25 },
        { wch: 15 },
        { wch: 15 },
    ]
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Tổng quan")

    if (data.revenueByDate && data.revenueByDate.length > 0) {
        const revenueData: any[][] = [
            ["Ngày", "Doanh thu (tổng)", "Phí ship", "Doanh thu (sau phí ship)", "Số đơn", "Doanh thu Online", "Doanh thu Tại quầy", "Đơn Online", "Đơn Tại quầy"],
        ]

        data.revenueByDate.forEach((item) => {
            revenueData.push([
                formatDate(item.date),
                item.dailyRevenue || 0,
                item.shippingFee || 0,
                item.netRevenue !== undefined ? item.netRevenue : ((item.dailyRevenue || 0) - (item.shippingFee || 0)),
                item.dailyOrders || 0,
                item.onlineRevenue || 0,
                item.posRevenue || 0,
                item.onlineOrders || 0,
                item.posOrders || 0,
            ])
        })

        const totalRow = [
            "TỔNG CỘNG",
            data.revenueByDate.reduce((sum, item) => sum + (item.dailyRevenue || 0), 0),
            data.revenueByDate.reduce((sum, item) => sum + (item.shippingFee || 0), 0),
            data.revenueByDate.reduce((sum, item) => sum + (item.netRevenue !== undefined ? item.netRevenue : ((item.dailyRevenue || 0) - (item.shippingFee || 0))), 0),
            data.revenueByDate.reduce((sum, item) => sum + (item.dailyOrders || 0), 0),
            data.revenueByDate.reduce((sum, item) => sum + (item.onlineRevenue || 0), 0),
            data.revenueByDate.reduce((sum, item) => sum + (item.posRevenue || 0), 0),
            data.revenueByDate.reduce((sum, item) => sum + (item.onlineOrders || 0), 0),
            data.revenueByDate.reduce((sum, item) => sum + (item.posOrders || 0), 0),
        ]
        revenueData.push(totalRow)

        const revenueSheet = XLSX.utils.aoa_to_sheet(revenueData)
        revenueSheet["!cols"] = [
            { wch: 15 },
            { wch: 20 },
            { wch: 15 },
            { wch: 25 },
            { wch: 12 },
            { wch: 20 },
            { wch: 20 },
            { wch: 12 },
            { wch: 12 },
        ]
        XLSX.utils.book_append_sheet(workbook, revenueSheet, "Doanh thu")
    }

    if (data.customerGrowth && data.customerGrowth.length > 0) {
        const customerData: any[][] = [
            ["Ngày", "Khách mới", "Tổng khách hàng", "Khách hoạt động", "Khách lẻ"],
        ]

        data.customerGrowth.forEach((item) => {
            customerData.push([
                formatDate(item.date),
                item.newCustomers || 0,
                item.totalCustomers || 0,
                item.activeCustomers || 0,
                item.guestCustomers || 0,
            ])
        })

        const totalRow = [
            "TỔNG CỘNG",
            data.customerGrowth.reduce((sum, item) => sum + (item.newCustomers || 0), 0),
            data.customerGrowth[data.customerGrowth.length - 1]?.totalCustomers || 0,
            data.customerGrowth.reduce((sum, item) => sum + (item.activeCustomers || 0), 0),
            data.customerGrowth.reduce((sum, item) => sum + (item.guestCustomers || 0), 0),
        ]
        customerData.push(totalRow)

        const customerSheet = XLSX.utils.aoa_to_sheet(customerData)
        customerSheet["!cols"] = [
            { wch: 15 },
            { wch: 15 },
            { wch: 18 },
            { wch: 18 },
            { wch: 15 },
        ]
        XLSX.utils.book_append_sheet(workbook, customerSheet, "Khách hàng")
    }

    if (data.topSellingProducts && data.topSellingProducts.length > 0) {
        const productData: any[][] = [
            ["STT", "Tên sản phẩm", "Thương hiệu", "Danh mục", "Đã bán", "Doanh thu", "Giá trung bình", "Số đơn"],
        ]

        data.topSellingProducts.forEach((product, index) => {
            productData.push([
                index + 1,
                product.productName || "",
                product.brandName || "",
                product.categoryName || "",
                product.totalSold || 0,
                product.totalRevenue || 0,
                product.averagePrice || 0,
                product.orderCount || 0,
            ])
        })

        const totalRow = [
            "",
            "TỔNG CỘNG",
            "",
            "",
            data.topSellingProducts.reduce((sum, p) => sum + (p.totalSold || 0), 0),
            data.topSellingProducts.reduce((sum, p) => sum + (p.totalRevenue || 0), 0),
            data.topSellingProducts.reduce((sum, p) => sum + (p.averagePrice || 0), 0) / data.topSellingProducts.length,
            data.topSellingProducts.reduce((sum, p) => sum + (p.orderCount || 0), 0),
        ]
        productData.push(totalRow)

        const productSheet = XLSX.utils.aoa_to_sheet(productData)
        productSheet["!cols"] = [
            { wch: 5 },
            { wch: 30 },
            { wch: 20 },
            { wch: 20 },
            { wch: 12 },
            { wch: 20 },
            { wch: 18 },
            { wch: 12 },
        ]
        XLSX.utils.book_append_sheet(workbook, productSheet, "Sản phẩm")
    }

    if (data.salesChannelComparison && data.salesChannelComparison.length > 0) {
        const channelData: any[][] = [
            ["Kênh bán hàng", "Tổng đơn", "Doanh thu", "Giá trị TB/đơn", "Đơn hoàn thành", "Đơn hủy", "Tỉ lệ hoàn thành (%)", "Tỉ lệ doanh thu (%)"],
        ]

        data.salesChannelComparison.forEach((channel) => {
            const channelName = channel.channel === "ONLINE" ? "Online" : channel.channel === "IN_STORE" ? "Tại quầy" : channel.channel
            channelData.push([
                channelName,
                channel.totalOrders || 0,
                channel.totalRevenue || 0,
                channel.averageOrderValue || 0,
                channel.completedOrders || 0,
                channel.cancelledOrders || 0,
                (channel.completionRate || 0).toFixed(2),
                (channel.revenuePercentage || 0).toFixed(2),
            ])
        })

        const totalRow = [
            "TỔNG CỘNG",
            data.salesChannelComparison.reduce((sum, c) => sum + (c.totalOrders || 0), 0),
            data.salesChannelComparison.reduce((sum, c) => sum + (c.totalRevenue || 0), 0),
            data.salesChannelComparison.reduce((sum, c) => sum + (c.averageOrderValue || 0), 0) / data.salesChannelComparison.length,
            data.salesChannelComparison.reduce((sum, c) => sum + (c.completedOrders || 0), 0),
            data.salesChannelComparison.reduce((sum, c) => sum + (c.cancelledOrders || 0), 0),
            "",
            "100.00",
        ]
        channelData.push(totalRow)

        const channelSheet = XLSX.utils.aoa_to_sheet(channelData)
        channelSheet["!cols"] = [
            { wch: 15 },
            { wch: 12 },
            { wch: 20 },
            { wch: 18 },
            { wch: 15 },
            { wch: 12 },
            { wch: 20 },
            { wch: 18 },
        ]
        XLSX.utils.book_append_sheet(workbook, channelSheet, "Kênh bán hàng")
    }

    if (data.voucherUsage && data.voucherUsage.length > 0) {
        const voucherData: any[][] = [
            ["Mã voucher", "Mô tả", "Loại giảm giá", "Giá trị", "Tổng số lượng", "Đã sử dụng", "Còn lại", "Tổng giảm giá", "Số đơn", "Ngày bắt đầu", "Ngày kết thúc", "Trạng thái"],
        ]

        data.voucherUsage.forEach((voucher) => {
            const discountValue = voucher.discountType === "PERCENTAGE"
                ? `${voucher.discountValue}%`
                : formatCurrency(voucher.discountValue || 0)
            
            voucherData.push([
                voucher.voucherCode || "",
                voucher.description || "",
                voucher.discountType || "",
                discountValue,
                voucher.totalQuantity || 0,
                voucher.usedCount || 0,
                voucher.remainingQuantity || 0,
                voucher.totalDiscountAmount || 0,
                voucher.orderCount || 0,
                formatDate(voucher.startDate || ""),
                formatDate(voucher.endDate || ""),
                voucher.status || "",
            ])
        })

        const totalRow = [
            "TỔNG CỘNG",
            "",
            "",
            "",
            data.voucherUsage.reduce((sum, v) => sum + (v.totalQuantity || 0), 0),
            data.voucherUsage.reduce((sum, v) => sum + (v.usedCount || 0), 0),
            data.voucherUsage.reduce((sum, v) => sum + (v.remainingQuantity || 0), 0),
            data.voucherUsage.reduce((sum, v) => sum + (v.totalDiscountAmount || 0), 0),
            data.voucherUsage.reduce((sum, v) => sum + (v.orderCount || 0), 0),
            "",
            "",
            "",
        ]
        voucherData.push(totalRow)

        const voucherSheet = XLSX.utils.aoa_to_sheet(voucherData)
        voucherSheet["!cols"] = [
            { wch: 18 },
            { wch: 30 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 20 },
            { wch: 12 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
        ]
        XLSX.utils.book_append_sheet(workbook, voucherSheet, "Voucher")
    }

    if (data.topCustomersByCompletedOrders && data.topCustomersByCompletedOrders.length > 0) {
        const customerCompletedData: any[][] = [
            ["STT", "Tên khách hàng", "Email", "Số điện thoại", "Số đơn hoàn thành", "Số đơn hủy", "Tổng chi tiêu"],
        ]

        data.topCustomersByCompletedOrders.forEach((customer, index) => {
            customerCompletedData.push([
                index + 1,
                customer.customerName || "",
                customer.email || "",
                customer.phoneNumber || "",
                customer.completedOrdersCount || 0,
                customer.cancelledOrdersCount || 0,
                customer.totalSpent || 0,
            ])
        })

        const customerCompletedSheet = XLSX.utils.aoa_to_sheet(customerCompletedData)
        customerCompletedSheet["!cols"] = [
            { wch: 5 },
            { wch: 30 },
            { wch: 30 },
            { wch: 15 },
            { wch: 18 },
            { wch: 15 },
            { wch: 20 },
        ]
        XLSX.utils.book_append_sheet(workbook, customerCompletedSheet, "KH đơn hoàn thành")
    }

    if (data.topCustomersByCancelledOrders && data.topCustomersByCancelledOrders.length > 0) {
        const customerCancelledData: any[][] = [
            ["STT", "Tên khách hàng", "Email", "Số điện thoại", "Số đơn hoàn thành", "Số đơn hủy", "Tổng chi tiêu"],
        ]

        data.topCustomersByCancelledOrders.forEach((customer, index) => {
            customerCancelledData.push([
                index + 1,
                customer.customerName || "",
                customer.email || "",
                customer.phoneNumber || "",
                customer.completedOrdersCount || 0,
                customer.cancelledOrdersCount || 0,
                customer.totalSpent || 0,
            ])
        })

        const customerCancelledSheet = XLSX.utils.aoa_to_sheet(customerCancelledData)
        customerCancelledSheet["!cols"] = [
            { wch: 5 },
            { wch: 30 },
            { wch: 30 },
            { wch: 15 },
            { wch: 18 },
            { wch: 15 },
            { wch: 20 },
        ]
        XLSX.utils.book_append_sheet(workbook, customerCancelledSheet, "KH đơn hủy")
    }

    const fileName = `Bao_Cao_Thong_Ke_${dateRangeRaw.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`
    XLSX.writeFile(workbook, fileName)
}

