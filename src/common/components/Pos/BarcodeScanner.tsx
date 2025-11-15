"use client"

import { Button } from "@/core/shadcn/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/shadcn/components/ui/dialog"
import { Input } from "@/core/shadcn/components/ui/input"
import { useSearchProductDetailBySlugQuery } from "@/lib/services/modules/posService"
import type { ProductDetailPosResponse } from "@/lib/services/modules/posService/type"
import { Camera, Loader2, QrCode, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

interface BarcodeScannerProps {
  onScanSuccess: (productDetail: ProductDetailPosResponse) => void
  onScanError?: (error: string) => void
  disabled?: boolean
}

export function BarcodeScanner({ onScanSuccess, onScanError, disabled }: BarcodeScannerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [manualInput, setManualInput] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const scannerRef = useRef<HTMLDivElement>(null)
  const scannerInstanceRef = useRef<any>(null)

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
    if (searchResult?.data && manualInput.trim()) {
      onScanSuccess(searchResult.data)
      setManualInput("")
      setIsOpen(false)
      toast.success("Đã tìm thấy sản phẩm!")
    }
  }, [searchResult, manualInput, onScanSuccess])

  const handleManualSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!manualInput.trim()) {
        toast.error("Vui lòng nhập SKU hoặc quét mã")
        return
      }

      try {
        const result = await searchProduct()
        if (result.data?.data) {
          onScanSuccess(result.data.data)
          setManualInput("")
          setIsOpen(false)
          toast.success("Đã tìm thấy sản phẩm!")
        } else {
          toast.error("Không tìm thấy sản phẩm với SKU này")
          if (onScanError) {
            onScanError("Không tìm thấy sản phẩm")
          }
        }
      } catch (error: any) {
        toast.error(error?.data?.message || "Không thể tìm kiếm sản phẩm")
        if (onScanError) {
          onScanError(error?.data?.message || "Không thể tìm kiếm sản phẩm")
        }
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

  const initializeScanner = useCallback(async () => {
    if (!scannerRef.current || scannerInstanceRef.current) return

    try {
      const html5QrcodeModule = await import("html5-qrcode").catch(() => null)
      if (!html5QrcodeModule) {
        toast.error("Thư viện quét mã không khả dụng. Vui lòng nhập SKU thủ công.")
        return
      }

      const Html5Qrcode = html5QrcodeModule.Html5Qrcode
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      }

      const scanner = new Html5Qrcode(scannerRef.current.id)
      scannerInstanceRef.current = scanner

      await scanner.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          if (decodedText && decodedText.trim()) {
            setManualInput(decodedText.trim())
            setIsScanning(false)
            scanner.stop().catch(() => {})
          }
        },
        (errorMessage) => {},
      )

      setIsScanning(true)
    } catch (error: any) {
      console.error("Error initializing scanner:", error)
      if (error?.message?.includes("NotAllowedError") || error?.message?.includes("Permission")) {
        toast.error("Không có quyền truy cập camera. Vui lòng nhập SKU thủ công.")
      } else {
        toast.error("Không thể khởi tạo camera. Vui lòng nhập SKU thủ công.")
      }
    }
  }, [])

  const stopScanner = useCallback(async () => {
    if (scannerInstanceRef.current) {
      try {
        await scannerInstanceRef.current.stop()
        await scannerInstanceRef.current.clear()
      } catch (error) {
        console.error("Error stopping scanner:", error)
      }
      scannerInstanceRef.current = null
    }
    setIsScanning(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        initializeScanner()
      }, 100)
    } else {
      stopScanner()
      setManualInput("")
    }

    return () => {
      stopScanner()
    }
  }, [isOpen, initializeScanner, stopScanner])

  const handleClose = useCallback(() => {
    stopScanner()
    setIsOpen(false)
    setManualInput("")
  }, [stopScanner])

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        aria-label="Quét barcode/QR code"
      >
        <QrCode className="w-4 h-4" aria-hidden="true" />
        Quét mã
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" aria-hidden="true" />
              Quét barcode/QR code
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <div
                id="barcode-scanner"
                ref={scannerRef}
                className="w-full h-64 bg-black rounded-lg overflow-hidden flex items-center justify-center"
              >
                {!isScanning && (
                  <div className="text-white text-center p-4">
                    <p className="text-sm mb-2">Camera đang khởi tạo...</p>
                    <p className="text-xs text-gray-400">Hoặc nhập SKU thủ công bên dưới</p>
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
                disabled={isSearching}
                className="w-full"
                aria-label="Nhập SKU hoặc quét mã"
                autoFocus
              />
              <Button
                type="submit"
                disabled={!manualInput.trim() || isSearching}
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
              <Button variant="outline" onClick={handleClose} className="flex-1" aria-label="Đóng">
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

