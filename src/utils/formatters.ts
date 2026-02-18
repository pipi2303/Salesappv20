/**
 * Utility functions for formatting numbers and currency
 * Standard formatting untuk seluruh aplikasi Sales Monitoring
 */

/**
 * Format currency dengan notasi K/M/B
 * @param value - Nilai yang akan diformat
 * @returns String dengan format Rp X,XK/M/B
 * 
 * Examples:
 * - 500 -> Rp 500
 * - 1500 -> Rp 1,5K
 * - 1500000 -> Rp 1,5M
 * - 1500000000 -> Rp 1,5B
 */
export const formatCurrency = (value: number): string => {
  if (value >= 1000000000) {
    // Billions (Miliar)
    return `Rp ${(value / 1000000000).toFixed(1).replace('.', ',')}B`;
  } else if (value >= 1000000) {
    // Millions (Juta)
    return `Rp ${(value / 1000000).toFixed(1).replace('.', ',')}M`;
  } else if (value >= 1000) {
    // Thousands (Ribu)
    return `Rp ${(value / 1000).toFixed(1).replace('.', ',')}K`;
  } else {
    // Less than thousand
    return `Rp ${value}`;
  }
};

/**
 * Format currency dengan pemisah titik (format lama untuk angka detail)
 * @param value - Nilai yang akan diformat
 * @returns String dengan format Rp XXX.XXX.XXX
 * 
 * Examples:
 * - 1500 -> Rp 1.500
 * - 1500000 -> Rp 1.500.000
 */
export const formatCurrencyFull = (value: number): string => {
  return `Rp ${value.toLocaleString('id-ID')}`;
};

/**
 * Format number dengan pemisah titik
 * @param value - Nilai yang akan diformat
 * @returns String dengan format XXX.XXX.XXX
 * 
 * Examples:
 * - 1500 -> 1.500
 * - 1500000 -> 1.500.000
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString('id-ID');
};

/**
 * Format percentage
 * @param value - Nilai yang akan diformat (0-100)
 * @param decimals - Jumlah desimal (default: 1)
 * @returns String dengan format XX,X%
 * 
 * Examples:
 * - 23.5 -> 23,5%
 * - 100 -> 100,0%
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals).replace('.', ',')}%`;
};

/**
 * Format compact number (for large numbers in limited space)
 * @param value - Nilai yang akan diformat
 * @returns String dengan format XXK/M/B (tanpa Rp)
 * 
 * Examples:
 * - 1500 -> 1,5K
 * - 1500000 -> 1,5M
 */
export const formatCompactNumber = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1).replace('.', ',')}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1).replace('.', ',')}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace('.', ',')}K`;
  } else {
    return `${value}`;
  }
};
