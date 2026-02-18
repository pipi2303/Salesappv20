import React from 'react';
import { DollarSign, Target, TrendingUp, BarChart2, Percent } from 'lucide-react';
import { TeamMember } from '@/app/components/dialogs/sales-dialog-types';

interface TeamKPICardsProps {
  member: TeamMember;
  size?: 'sm' | 'md';
}

function formatVal(value: number): string {
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1).replace('.0', '')}B`;
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(0)}M`;
  return `Rp ${value.toLocaleString('id-ID')}`;
}

interface KPICardProps {
  label: string;
  value: string;
  subLabel?: string;
  subPositive?: boolean;
  borderColor: string;
  iconBg: string;
  valueColor: string;
  icon: React.ReactNode;
  size: 'sm' | 'md';
}

function KPICard({ label, value, subLabel, subPositive, borderColor, iconBg, valueColor, icon, size }: KPICardProps) {
  const isSmall = size === 'sm';
  return (
    <div className={`rounded-xl border-2 bg-white flex items-center justify-between ${isSmall ? 'p-2.5' : 'p-3'} ${borderColor}`}>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className={`text-gray-500 truncate ${isSmall ? 'text-[10px]' : 'text-xs'}`}>{label}</span>
        <span className={`font-bold truncate ${valueColor} ${isSmall ? 'text-sm' : 'text-base'}`}>{value}</span>
        {subLabel && (
          <span className={`font-semibold ${isSmall ? 'text-[9px]' : 'text-[10px]'} ${subPositive ? 'text-green-600' : 'text-red-500'}`}>
            {subLabel}
          </span>
        )}
      </div>
      <div className={`rounded-full flex items-center justify-center flex-shrink-0 ml-2 ${iconBg} ${isSmall ? 'h-8 w-8' : 'h-9 w-9'}`}>
        {icon}
      </div>
    </div>
  );
}

export function TeamKPICards({ member, size = 'md' }: TeamKPICardsProps) {
  const gap = member.achievement - member.target;
  const gapLabel = gap >= 0
    ? `Surplus: ${formatVal(Math.abs(gap))}`
    : `Short: ${formatVal(Math.abs(gap))}`;
  const gapPositive = gap >= 0;

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-4 w-4';

  const cards = [
    {
      label: 'Achievement',
      value: formatVal(member.achievement),
      borderColor: 'border-violet-400',
      iconBg: 'bg-violet-500',
      valueColor: 'text-violet-600',
      icon: <DollarSign className={`${iconSize} text-white`} />,
    },
    {
      label: 'Target',
      value: formatVal(member.target),
      subLabel: gapLabel,
      subPositive: gapPositive,
      borderColor: 'border-blue-400',
      iconBg: 'bg-blue-500',
      valueColor: 'text-blue-600',
      icon: <Target className={`${iconSize} text-white`} />,
    },
    {
      label: 'Performance',
      value: `${member.performance.toFixed(1)}%`,
      borderColor: 'border-green-400',
      iconBg: 'bg-green-500',
      valueColor: member.performance >= 90 ? 'text-green-600' : member.performance >= 85 ? 'text-yellow-600' : 'text-red-500',
      icon: <TrendingUp className={`${iconSize} text-white`} />,
    },
    {
      label: 'Total Deals',
      value: `${member.totalDeals}`,
      borderColor: 'border-orange-400',
      iconBg: 'bg-orange-500',
      valueColor: 'text-orange-600',
      icon: <BarChart2 className={`${iconSize} text-white`} />,
    },
    {
      label: 'Pipeline Value',
      value: member.pipelineValue ? formatVal(member.pipelineValue) : '-',
      borderColor: 'border-violet-400',
      iconBg: 'bg-violet-500',
      valueColor: 'text-violet-600',
      icon: <DollarSign className={`${iconSize} text-white`} />,
    },
    {
      label: 'Upside',
      value: member.upside ? formatVal(member.upside) : '-',
      borderColor: 'border-cyan-400',
      iconBg: 'bg-cyan-500',
      valueColor: 'text-cyan-600',
      icon: <TrendingUp className={`${iconSize} text-white`} />,
    },
    {
      label: 'Strong Upside',
      value: member.strongUpside ? formatVal(member.strongUpside) : '-',
      borderColor: 'border-cyan-400',
      iconBg: 'bg-cyan-500',
      valueColor: 'text-cyan-600',
      icon: <TrendingUp className={`${iconSize} text-white`} />,
    },
    {
      label: 'Forecast',
      value: member.forecast ? formatVal(member.forecast) : '-',
      borderColor: 'border-emerald-400',
      iconBg: 'bg-emerald-500',
      valueColor: 'text-emerald-600',
      icon: <TrendingUp className={`${iconSize} text-white`} />,
    },
  ];

  return (
    <div className={`grid ${size === 'sm' ? 'grid-cols-3' : 'grid-cols-3 lg:grid-cols-3'} gap-2 mt-2`}>
      {cards.map((card) => (
        <KPICard
          key={card.label}
          label={card.label}
          value={card.value}
          subLabel={card.subLabel}
          subPositive={card.subPositive}
          borderColor={card.borderColor}
          iconBg={card.iconBg}
          valueColor={card.valueColor}
          icon={card.icon}
          size={size}
        />
      ))}
    </div>
  );
}
