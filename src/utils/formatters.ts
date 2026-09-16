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

/**
 * Format date to Indonesian locale
 * @param date - Date string or Date object
 * @param includeTime - Whether to include time (default: false)
 * @returns String dengan format DD/MM/YYYY atau DD/MM/YYYY HH:mm
 * 
 * Examples:
 * - '2024-02-19' -> 19/02/2024
 * - '2024-02-19T10:30:00' -> 19/02/2024 10:30 (if includeTime: true)
 */
export const formatDate = (date: string | Date, includeTime: boolean = false): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  if (includeTime) {
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  
  return `${day}/${month}/${year}`;
};

/**
 * Format date to relative time (e.g., "2 hours ago", "3 days ago")
 * @param date - Date string or Date object
 * @returns String dengan format relative time
 * 
 * Examples:
 * - Recent date -> '2 hours ago'
 * - Yesterday -> '1 day ago'
 */
export const formatRelativeDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateObj);
  }
};

/**
 * Format date range
 * @param startDate - Start date
 * @param endDate - End date
 * @returns String dengan format date range
 * 
 * Examples:
 * - '2024-02-01' to '2024-02-28' -> '01/02/2024 - 28/02/2024'
 */
export const formatDateRange = (startDate: string | Date, endDate: string | Date): string => {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};
/**
 * Menentukan status kontrak yang sebenarnya (effective status) berdasarkan tanggal.
 * FIX: Kontrak dengan status 'active' di data tapi endDate sudah lewat akan
 * ditampilkan sebagai 'expired', tanpa mengubah data tersimpan (agar histori
 * & keputusan bisnis soal auto-expire tetap bisa direview/dikonfirmasi user).
 * @param status - status kontrak yang tersimpan
 * @param endDate - tanggal akhir kontrak
 */
export const getEffectiveContractStatus = (
  status: 'draft' | 'pending' | 'active' | 'expired' | 'terminated',
  endDate: Date | string
): 'draft' | 'pending' | 'active' | 'expired' | 'terminated' => {
  if (status !== 'active') return status;
  const end = endDate instanceof Date ? endDate : new Date(endDate);
  return end.getTime() < Date.now() ? 'expired' : 'active';
};
