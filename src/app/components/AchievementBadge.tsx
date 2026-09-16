import React from 'react';

// FR-08: reusable Target vs Actual vs Forecast visual indicator.
// Per FSD business rule, the color threshold must be configurable, not hardcoded — it's a prop
// here (defaults: red < 70%, yellow 70-99%, green >= 100%), not a hardcoded value inside the
// component. To change it app-wide without touching every call site, pass a shared constant
// (e.g. from a config file) as the `thresholds` prop instead of relying on the default.

export interface AchievementThresholds {
  /** Ratio (%) below which the badge shows red. */
  red: number;
  /** Ratio (%) at/above which the badge shows green (between red and green = yellow). */
  green: number;
}

export const DEFAULT_ACHIEVEMENT_THRESHOLDS: AchievementThresholds = { red: 70, green: 100 };

export interface AchievementBadgeProps {
  label: string;
  targetValue: number;
  actualValue: number;
  /** Optional: projected value by end of period (e.g. linear run-rate projection). */
  forecastValue?: number;
  formatValue?: (value: number) => string;
  thresholds?: AchievementThresholds;
  className?: string;
}

function getAchievementColors(ratio: number, thresholds: AchievementThresholds) {
  if (ratio < thresholds.red) {
    return { bg: 'bg-red-50', bar: 'bg-red-500', badge: 'bg-red-100 text-red-700', text: 'text-red-600' };
  }
  if (ratio < thresholds.green) {
    return { bg: 'bg-yellow-50', bar: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-700', text: 'text-yellow-600' };
  }
  return { bg: 'bg-green-50', bar: 'bg-green-500', badge: 'bg-green-100 text-green-700', text: 'text-green-600' };
}

export function AchievementBadge({
  label,
  targetValue,
  actualValue,
  forecastValue,
  formatValue = (v) => v.toLocaleString('id-ID'),
  thresholds = DEFAULT_ACHIEVEMENT_THRESHOLDS,
  className = '',
}: AchievementBadgeProps) {
  const achievementRatio = targetValue > 0 ? (actualValue / targetValue) * 100 : 0;
  const forecastRatio =
    forecastValue != null && targetValue > 0 ? (forecastValue / targetValue) * 100 : null;

  const colors = getAchievementColors(achievementRatio, thresholds);

  return (
    <div className={`rounded-lg p-3 border border-gray-100 ${colors.bg} ${className}`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${colors.badge}`}>
          {achievementRatio.toFixed(0)}%
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full ${colors.bar} transition-all`}
          style={{ width: `${Math.min(Math.max(achievementRatio, 0), 100)}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[11px] text-gray-500">
        <span>Target: {formatValue(targetValue)}</span>
        <span className="font-medium text-gray-700">Actual: {formatValue(actualValue)}</span>
      </div>
      {forecastRatio != null && (
        <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
          <span>Proyeksi akhir periode: {formatValue(forecastValue!)}</span>
          <span className={getAchievementColors(forecastRatio, thresholds).text}>
            {forecastRatio.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
}
