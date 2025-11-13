import type { EStatusEnumString } from "@/common/enums/status"

export type TPromotionFormField = {
  name: string
  title: string
  code?: string
  discountType: "percentage" | "fixed_amount"
  discountValue: number
  startDate: Date
  endDate: Date
  description?: string
  status: EStatusEnumString
  productDetailIds: number[]
}

