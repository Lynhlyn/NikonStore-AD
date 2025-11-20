/**
 * Utility functions for banner position
 */

export const POSITION_LABELS: Record<number, string> = {
  0: 'Trên',
  1: 'Phải',
  2: 'Dưới',
  3: 'Trái',
};

export const POSITION_OPTIONS = [
  { value: -1, label: 'Tất cả vị trí' },
  { value: 0, label: 'Trên' },
  { value: 1, label: 'Phải' },
  { value: 2, label: 'Dưới' },
  { value: 3, label: 'Trái' },
];

/**
 * Get position label from position number
 * @param position - Position number (0: top, 1: right, 2: bottom, 3: left)
 * @returns Position label string or the number as string if not found
 */
export function getPositionLabel(position: number | null | undefined): string {
  if (position === null || position === undefined) {
    return 'Không xác định';
  }
  return POSITION_LABELS[position] || position.toString();
}

/**
 * Get display order label with Vietnamese format
 * @param displayOrder - Display order number
 * @returns Formatted display order string (e.g., "Thứ 1", "Thứ 2", "Thứ 3")
 */
export function getDisplayOrderLabel(displayOrder: number | null | undefined): string {
  if (displayOrder === null || displayOrder === undefined || displayOrder === 0) {
    return 'Mặc định';
  }
  return `Thứ ${displayOrder}`;
}

