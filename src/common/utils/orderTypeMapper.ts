export const ORDER_TYPE_LABELS: { [key: string]: string } = {
  online: 'Trực tuyến',
  offline: 'Tại cửa hàng',
  pos: 'Tại cửa hàng',
};

export function getOrderTypeLabel(type: string | null | undefined): string {
  if (!type) return '-';
  return ORDER_TYPE_LABELS[type.toLowerCase()] || type;
}

