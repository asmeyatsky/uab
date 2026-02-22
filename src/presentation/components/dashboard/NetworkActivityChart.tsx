import { useMemo } from 'react';
import { GlassPanel } from '../ui/GlassPanel.tsx';
import type { NetworkActivityDTO } from '../../../application/dtos/dashboard.dto.ts';

interface NetworkActivityChartProps {
  activity: NetworkActivityDTO;
}

export function NetworkActivityChart({ activity }: NetworkActivityChartProps) {
  const { points, maxValue } = useMemo(() => {
    const pts = activity.requests;
    const max = Math.max(...pts.map(p => p.value), 1);
    return { points: pts, maxValue: max };
  }, [activity.requests]);

  const width = 600;
  const height = 150;
  const padding = { top: 10, right: 10, bottom: 20, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    const xScale = chartW / (points.length - 1);
    const yScale = chartH / maxValue;

    return points.map((p, i) => {
      const x = padding.left + i * xScale;
      const y = padding.top + chartH - p.value * yScale;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  }, [points, maxValue, chartW, chartH, padding.left, padding.top]);

  const areaD = useMemo(() => {
    if (points.length === 0) return '';
    const xScale = chartW / (points.length - 1);
    const yScale = chartH / maxValue;
    const bottom = padding.top + chartH;

    const linePoints = points.map((p, i) => {
      const x = padding.left + i * xScale;
      const y = padding.top + chartH - p.value * yScale;
      return `${x},${y}`;
    });

    const lastX = padding.left + (points.length - 1) * xScale;
    const firstX = padding.left;

    return `M${firstX},${bottom} L${linePoints.join(' L')} L${lastX},${bottom} Z`;
  }, [points, maxValue, chartW, chartH, padding.left, padding.top]);

  return (
    <GlassPanel>
      <h3 className="mb-4 text-sm font-semibold text-gray-200">Network Activity (24h)</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00f3ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(pct => {
          const y = padding.top + chartH * (1 - pct);
          return (
            <g key={pct}>
              <line x1={padding.left} y1={y} x2={padding.left + chartW} y2={y} stroke="rgba(255,255,255,0.05)" />
              <text x={padding.left - 5} y={y + 3} textAnchor="end" className="fill-gray-600 text-[8px] font-mono">
                {Math.round(maxValue * pct)}
              </text>
            </g>
          );
        })}
        {/* Area fill */}
        <path d={areaD} fill="url(#areaGradient)" />
        {/* Line */}
        <path d={pathD} fill="none" stroke="#00f3ff" strokeWidth="1.5" />
      </svg>
    </GlassPanel>
  );
}
