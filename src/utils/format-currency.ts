/**
 * Formats a numeric value or string to IDR (Indonesian Rupiah) currency format.
 * @param value - The numeric value or numeric string to format.
 * @returns Formatted currency string, e.g., "Rp 15.000".
 */
export function formatCurrency(value: number | string): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numericValue)) {
    return 'Rp 0'
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericValue)
}
