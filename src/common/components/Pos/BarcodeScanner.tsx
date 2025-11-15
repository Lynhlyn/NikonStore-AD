"use client"

import { Button } from "@/core/shadcn/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/shadcn/components/ui/dialog"
import { Input } from "@/core/shadcn/components/ui/input"
import { useSearchProductDetailBySlugQuery } from "@/lib/services/modules/posService"
import type { ProductDetailPosResponse } from "@/lib/services/modules/posService/type"
import {
  Scanner,
  useDevices,
  centerText,
} from "@yudiel/react-qr-scanner"
import { Camera, Loader2, QrCode, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

interface BarcodeScannerProps {
  onScanSuccess: (productDetail: ProductDetailPosResponse) => void
  onScanError?: (error: string) => void
  disabled?: boolean
}

export function BarcodeScanner({ onScanSuccess, onScanError, disabled }: BarcodeScannerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [manualInput, setManualInput] = useState("")
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined)
  const [pause, setPause] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const devices = useDevices()

  const {
    data: searchResult,
    isLoading: isSearching,
    refetch: searchProduct,
  } = useSearchProductDetailBySlugQuery(
    { sku: manualInput.trim() },
    {
      skip: !manualInput.trim() || !isOpen,
      refetchOnMountOrArgChange: false,
    },
  )

  useEffect(() => {
    if (searchResult?.data && manualInput.trim() && pause) {
      onScanSuccess(searchResult.data)
      setManualInput("")
      setIsOpen(false)
      toast.success(`Đã tìm thấy sản phẩm: ${searchResult.data.productName} (${searchResult.data.sku})`)
      setPause(false)
    }
  }, [searchResult, manualInput, pause, onScanSuccess])

  const handleScan = useCallback(
    async (scannedData: string) => {
      if (!scannedData || !scannedData.trim() || pause) {
        return
      }

      const scannedValue = scannedData.trim()
      setPause(true)
      setManualInput(scannedValue)

      // Trigger the search query
      try {
        const result = await searchProduct()
        if (result.data?.data) {
          onScanSuccess(result.data.data)
          setManualInput("")
          setIsOpen(false)
          toast.success(`Đã tìm thấy sản phẩm: ${result.data.data.productName} (${result.data.data.sku})`)
          setPause(false)
        } else {
          toast.error("Không tìm thấy sản phẩm với SKU này")
          if (onScanError) {
            onScanError("Không tìm thấy sản phẩm")
          }
          setPause(false)
        }
      } catch (error: any) {
        console.error("Error searching product:", error)
        toast.error(error?.data?.message || "Không thể tìm kiếm sản phẩm")
        if (onScanError) {
          onScanError(error?.data?.message || "Không thể tìm kiếm sản phẩm")
        }
        setPause(false)
      }
    },
    [searchProduct, onScanSuccess, onScanError, pause],
  )

  const handleManualSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!manualInput.trim()) {
        toast.error("Vui lòng nhập SKU hoặc quét mã")
        return
      }

      setPause(true)
      try {
        const result = await searchProduct()
        if (result.data?.data) {
          onScanSuccess(result.data.data)
          setManualInput("")
          setIsOpen(false)
          toast.success("Đã tìm thấy sản phẩm!")
          setPause(false)
        } else {
          toast.error("Không tìm thấy sản phẩm với SKU này")
          if (onScanError) {
            onScanError("Không tìm thấy sản phẩm")
          }
          setPause(false)
        }
      } catch (error: any) {
        toast.error(error?.data?.message || "Không thể tìm kiếm sản phẩm")
        if (onScanError) {
          onScanError(error?.data?.message || "Không thể tìm kiếm sản phẩm")
        }
        setPause(false)
      }
    },
    [manualInput, searchProduct, onScanSuccess, onScanError],
  )

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && manualInput.trim()) {
        handleManualSubmit(e)
      }
    },
    [manualInput, handleManualSubmit],
  )

  const handleScannerError = useCallback(
    (error: Error) => {
      console.error("Scanner error:", error)
      setErrorMessage(error.message || "Lỗi khởi tạo scanner")
      
      if (error.message?.includes("NotAllowedError") || error.message?.includes("Permission")) {
        setErrorMessage("Không có quyền truy cập camera. Vui lòng cho phép truy cập camera trong trình duyệt.")
      } else if (error.message?.includes("NotFoundError")) {
        setErrorMessage("Không tìm thấy camera trên thiết bị này.")
      } else if (error.message?.includes("NotReadableError")) {
        setErrorMessage("Camera đang được sử dụng bởi ứng dụng khác.")
      }
    },
    [],
  )

  const handleClose = useCallback(() => {
    setPause(true)
    setIsOpen(false)
    setManualInput("")
    setErrorMessage(null)
  }, [])

  // Auto-select back camera if available
  useEffect(() => {
    if (devices.length > 0 && !deviceId && isOpen) {
      const backCamera = devices.find(
        (device) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("rear") ||
          device.label.toLowerCase().includes("environment")
      )
      if (backCamera) {
        setDeviceId(backCamera.deviceId)
      } else {
        setDeviceId(devices[0].deviceId)
      }
    }
  }, [devices, deviceId, isOpen])

  return (
    <>
      <Button
        onClick={() => {
        setIsOpen(true)
        setPause(false)
        setErrorMessage(null)
      }}
        disabled={disabled}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        aria-label="Quét barcode/QR code"
      >
        <QrCode className="w-4 h-4" aria-hidden="true" />
        Quét mã
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleClose()
          } else {
            setIsOpen(true)
            setPause(false)
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" aria-hidden="true" />
              Quét barcode/QR code
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {devices.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-1 block">Chọn camera:</label>
                <select
                  value={deviceId || ""}
                  onChange={(e) => setDeviceId(e.target.value || undefined)}
                  className="w-full p-2 border rounded-md text-sm"
                  disabled={pause}
                >
                  {devices.map((device, index) => (
                    <option key={index} value={device.deviceId}>
                      {device.label || `Camera ${index + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="relative">
              <div className="w-full bg-black rounded-lg overflow-hidden flex items-center justify-center min-h-[400px]">
                {isOpen && !pause && (
                  <Scanner
                    formats={[
                      "qr_code",
                      "micro_qr_code",
                      "data_matrix",
                      "code_128",
                      "code_39",
                      "code_93",
                      "ean_8",
                      "ean_13",
                      "upc_a",
                      "upc_e",
                      "itf",
                      "codabar",
                      "pdf417",
                      "aztec",
                    ]}
                    constraints={{
                      deviceId: deviceId ? { exact: deviceId } : undefined,
                    }}
                    onScan={(detectedCodes) => {
                      if (detectedCodes && detectedCodes.length > 0 && !pause) {
                        const scannedValue = detectedCodes[0].rawValue
                        if (scannedValue && scannedValue.trim()) {
                          handleScan(scannedValue.trim())
                        }
                      }
                    }}
                    onError={handleScannerError}
                    styles={{
                      container: {
                        width: "100%",
                        height: "400px",
                      },
                    }}
                    components={{
                      audio: false,
                      onOff: true,
                      torch: false,
                      zoom: false,
                      finder: true,
                      tracker: centerText,
                    }}
                    allowMultiple={false}
                    scanDelay={500}
                    paused={pause}
                  />
                )}
                
                {pause && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-10 text-white text-center p-4">
                    <div>
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm">Đang xử lý...</p>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-10 text-white text-center p-4">
                    <div className="max-w-xs">
                      <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm mb-2 text-red-300 font-medium">Không thể khởi tạo camera</p>
                      <p className="text-xs text-red-200 mt-2 mb-3">{errorMessage}</p>
                      <div className="text-xs text-gray-300 mb-2 space-y-1">
                        <p className="font-medium">Hướng dẫn:</p>
                        <p>1. Kiểm tra biểu tượng camera trên thanh địa chỉ</p>
                        <p>2. Mở Cài đặt → Quyền riêng tư → Camera</p>
                        <p>3. Cho phép truy cập camera cho trang web này</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-3">Hoặc nhập SKU thủ công bên dưới</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-600 text-center">
              Hoặc nhập SKU thủ công
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-2">
              <Input
                type="text"
                placeholder="Nhập SKU hoặc quét mã..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching || pause}
                className="w-full"
                aria-label="Nhập SKU hoặc quét mã"
                autoFocus
              />
              <Button
                type="submit"
                disabled={!manualInput.trim() || isSearching || pause}
                className="w-full"
                aria-label="Tìm kiếm sản phẩm"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang tìm kiếm...
                  </>
                ) : (
                  "Tìm kiếm"
                )}
              </Button>
            </form>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                aria-label="Đóng"
              >
                <X className="w-4 h-4 mr-2" />
                Đóng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}



