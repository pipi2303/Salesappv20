import type { CSSProperties } from 'react';

// Shared chart color/style tokens for every recharts chart in the app.
// Colors are CSS custom properties (defined in src/styles/theme.css, both
// :root and .dark) rather than hardcoded hex, so every chart automatically
// follows the same validated palette and picks up dark-mode values with no
// per-chart logic. The 8-slot order below is not arbitrary - it's the one
// ordering (out of many candidates) that clears every adjacent-pair CVD and
// normal-vision separation check in the dataviz skill's validate_palette.js,
// in both light and dark mode. Reordering these WILL break that guarantee -
// re-run the validator before changing the order or the values.
//
// Rule of thumb for using this file:
// - Single-series chart -> CHART_COLORS[0] (the brand teal) via chartColor(0).
// - Multi-series categorical (regions, products, lead sources, etc.) -> take
//   CHART_COLORS in order, starting at index 0. Never skip/cycle - a filtered
//   list should still start from index 0, not repaint survivors with the
//   colors of series that disappeared.
// - Win/loss/approve/pending/reject/status-flavored charts -> CHART_STATUS,
//   never a categorical slot (status colors are reserved and never doubled
//   as "series 4").

/** Validated 8-slot categorical palette, in the exact order it validates. */
export const CHART_COLORS = [
  'var(--chart-1)', // blue
  'var(--chart-2)', // orange
  'var(--chart-3)', // teal (brand) - default single-series color
  'var(--chart-4)', // yellow
  'var(--chart-5)', // magenta
  'var(--chart-6)', // green
  'var(--chart-7)', // violet
  'var(--chart-8)', // red
] as const;

/** Get a categorical color by index, wrapping safely past 8 series. */
export function chartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

/** The app's single default series color (brand teal) - use for any chart
 *  with exactly one data series (revenue trend, a single KPI over time, etc). */
export const CHART_PRIMARY = CHART_COLORS[2];

/** Reserved status colors - never reuse these for a plain categorical series,
 *  and never rely on color alone (pair with an icon/label). */
export const CHART_STATUS = {
  good: 'var(--chart-status-good)',
  warning: 'var(--chart-status-warning)',
  serious: 'var(--chart-status-serious)',
  critical: 'var(--chart-status-critical)',
} as const;

/** Recessive chart chrome - gridlines/axes should never compete with data. */
export const CHART_GRID = 'var(--chart-grid)';
export const CHART_AXIS = 'var(--chart-axis)';
export const CHART_MUTED_TEXT = 'var(--chart-muted)';

/** Standard <CartesianGrid> props - spread onto every chart's grid for a
 *  consistent, recessive look instead of each file inventing its own gray. */
export const CHART_GRID_PROPS = {
  strokeDasharray: '3 3',
  stroke: CHART_GRID,
  vertical: false,
} as const;

/** Standard axis tick styling - small, muted, never competing with data ink. */
export const CHART_AXIS_TICK = { fontSize: 12, fill: CHART_MUTED_TEXT };

/** Shared tooltip container style, for charts using the default <Tooltip/>
 *  (content-render-prop tooltips keep their own markup but should reuse
 *  this same look-and-feel: rounded, no harsh border, soft shadow). */
export const CHART_TOOLTIP_STYLE: CSSProperties = {
  borderRadius: '12px',
  border: '1px solid var(--border)',
  boxShadow: '0 8px 24px -4px rgba(1, 62, 55, 0.18)',
  backgroundColor: 'var(--popover)',
  fontSize: '13px',
  padding: '10px 12px',
};
export const CHART_TOOLTIP_LABEL_STYLE: CSSProperties = {
  color: 'var(--foreground)',
  fontWeight: 600,
  marginBottom: 4,
};
export const CHART_TOOLTIP_CURSOR = { fill: 'var(--muted)', opacity: 0.4 };

/** Standard rounded-end radius for vertical/horizontal bars - a subtle
 *  "cooler" upgrade over sharp rectangular bars, applied to the end that
 *  faces away from the baseline. */
export const BAR_RADIUS_UP: [number, number, number, number] = [6, 6, 0, 0]; // vertical bar, value grows up
export const BAR_RADIUS_RIGHT: [number, number, number, number] = [0, 6, 6, 0]; // horizontal bar, grows right

/** Standard gradient stop opacities for area fills - a smooth fade rather
 *  than a flat or overly opaque wash. Use with a <linearGradient> whose
 *  stopColor is one of the CHART_COLORS / CHART_PRIMARY above. */
export const AREA_GRADIENT_STOPS = { from: 0.35, to: 0.02 } as const;
