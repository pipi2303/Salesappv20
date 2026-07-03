// Design System Color Tokens
// Source: DESIGN_SYSTEM_RED_CREAM.md → Teal & Lemon palette

export const C = {
  // Brand
  brand:      '#013E37',
  brandMid:   '#025C52',
  brandLight: '#038E7D',
  brandXLight:'#5BB5AB',
  lemon:      '#FFEFB2',
  lemonDark:  '#F5D800',
  lemonMid:   '#FFE066',
  lemonSoft:  '#FFF9DC',

  // Layout & Surface
  bg:         '#EEF7F5',
  card:       '#FFFFFF',
  cardHover:  '#F5FBFA',
  sidebar:    '#013E37',

  // Border
  border:       '#C3DDD9',
  borderLight:  '#DFF0EC',

  // Semantic Status
  success:    '#16A34A',
  warning:    '#D97706',
  danger:     '#DC2626',
  primary:    '#E8F5F2',
  secondary:  '#025C52',
  accent:     '#038E7D',

  // Text
  text:       '#012D29',
  textMuted:  '#4D8078',
  white:      '#FFFFFF',

  // Sidebar-specific
  sidebarText:          '#FFFFFF',
  sidebarTextMuted:     'rgba(255,255,255,0.55)',
  sidebarActiveText:    '#013E37',
  sidebarActiveBg:      '#FFEFB2',
  sidebarHoverBg:       'rgba(255,239,178,0.10)',
  sidebarBorder:        'rgba(255,239,178,0.15)',
  sidebarSectionLabel:  'rgba(255,239,178,0.45)',

  // Chart helpers
  chartGrid:       '#C3DDD9',
  chartTooltipBg:  '#012D29',
} as const;

// Multi-series chart palette (keep index order consistent)
export const CHART_COLORS = [
  '#038E7D', // [0] Bright Teal
  '#FFBE00', // [1] Golden Lemon
  '#E87040', // [2] Warm Coral
  '#0891B2', // [3] Sky Blue
  '#6C63FF', // [4] Violet
  '#FF6B6B', // [5] Soft Red
  '#4ECDC4', // [6] Aqua
  '#16A34A', // [7] Emerald
] as const;

// Page accent colors
export const PAGE_ACCENTS = {
  executive:       { accent: '#013E37', lightBg: '#E0F7F4', lightBorder: '#5BB5AB' },
  keperawatan:     { accent: '#038E7D', lightBg: '#E0F7F4', lightBorder: '#5BB5AB' },
  pelayananMedik:  { accent: '#7C3AED', lightBg: '#F5F3FF', lightBorder: '#C4B5FD' },
  penunjangMedik:  { accent: '#D97706', lightBg: '#FFFBEB', lightBorder: '#FCD34D' },
  keuangan:        { accent: '#0891B2', lightBg: '#EFF6FF', lightBorder: '#93C5FD' },
  sdm:             { accent: '#16A34A', lightBg: '#F0FDF4', lightBorder: '#86EFAC' },
  sarana:          { accent: '#E87040', lightBg: '#FFF7F0', lightBorder: '#FDBA74' },
  igd:             { accent: '#DC2626', lightBg: '#FFF1F2', lightBorder: '#FCA5A5' },
} as const;

// Insight/alert box colors
export const INSIGHT_COLORS = {
  success: { bg: '#F0FDF4', border: '#86EFAC' },
  warning: { bg: '#FFFBEB', border: '#FCD34D' },
  danger:  { bg: '#FFF1F2', border: '#FCA5A5' },
  info:    { bg: '#EFF6FF', border: '#93C5FD' },
} as const;

// BSC perspective colors
export const BSC_COLORS = {
  keuangan:   '#D97706',
  pelanggan:  '#0891B2',
  proses:     '#16A34A',
  pembelajaran: '#7C3AED',
} as const;
