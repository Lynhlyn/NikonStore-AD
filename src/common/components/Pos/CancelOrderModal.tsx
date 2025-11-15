"use client"

import { Badge } from "@/core/shadcn/components/ui/badge"
import { Button } from "@/core/shadcn/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/shadcn/components/ui/dialog"
import { Label } from "@/core/shadcn/components/ui/label"
import { Textarea } from "@/core/shadcn/components/ui/textarea"
import { AlertTriangle, X } from "lucide-react"
import { useState } from "react"

interface CancelOrderModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (reason: string) => void
    isLoading?: boolean
    orderCode?: string
}

export function CancelOrderModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    orderCode
}: CancelOrderModalProps) {
    const [cancelReason, setCancelReason] = useState("")

    const quickReasons = [
        "Khách hàng thay đổi ý định",
        "Khách hàng không hài lòng",
        "Lý do khác",
        "Đơn hàng trùng lặp",
        "Khách hàng yêu cầu hủy"
    ]

    const handleConfirm = () => {
        if (cancelReason.trim()) {
            onConfirm(cancelReason.trim())
            setCancelReason("")
        }
    }

    const handleClose = () => {
        setCancelReason("")
        onClose()
    }

    const handleQuickReasonSelect = (reason: string) => {
        setCancelReason(reason)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            if (cancelReason.trim()) {
                handleConfirm()
            }
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        Hủy đơn hàng
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {orderCode && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                Bạn đang hủy đơn hàng: <span className="font-semibold">{orderCode}</span>
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="cancelReason" className="text-sm font-medium">
                            Lý do hủy đơn hàng <span className="text-red-500">*</span>
                        </Label>

                        <div className="space-y-2">
                            <Label className="text-xs text-gray-600">Lý do mẫu (chọn nhanh):</Label>
                            <div className="flex flex-wrap gap-2">
                                {quickReasons.map((reason, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className={`cursor-pointer hover:bg-gray-100 transition-colors ${cancelReason === reason ? 'bg-blue-50 border-blue-200 text-blue-700' : ''
                                            }`}
                                        onClick={() => handleQuickReasonSelect(reason)}
                                    >
                                        {reason}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <Textarea
                            id="cancelReason"
                            placeholder="Nhập lý do hủy đơn hàng hoặc chọn từ lý do mẫu bên trên..."
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="min-h-[100px] resize-none"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirm}
                            disabled={!cancelReason.trim() || isLoading}
                            className="flex-1"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    Đang hủy...
                                </>
                            ) : (
                                <>
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Xác nhận hủy
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-xs text-yellow-800">
                            <strong>Lưu ý:</strong> Hành động này không thể hoàn tác. Đơn hàng sẽ bị hủy và stock sẽ được hoàn trả.
                        </p>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

