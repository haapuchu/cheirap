import { useMemo } from 'react';

interface ForensicRadarChartProps {
  tender: {
    vigilance_tier: 'RED' | 'AMBER' | 'GREEN';
    if_anomaly_score: number;
    cvc_statutory_penalty: number;
    feat_window_compression_hours: number;
    feat_single_bidder_risk: number;
    feat_corr_velocity: number;
    feat_emd_ratio: number;
    corrigendum_count: number;
  };
  className?: string;
}

export function ForensicRadarChart({ tender, className = '' }: ForensicRadarChartProps) {
  const cx = 130;
  const cy = 115;
  const r = 70;

  const axes = useMemo(() => {
    const mlAnomaly = Math.min(100, Math.max(5, tender.if_anomaly_score));
    const cvcPenalty = Math.min(100, Math.max(5, tender.cvc_statutory_penalty));
    let windowSqueeze = 10;
    if (tender.feat_window_compression_hours < 48) {
      windowSqueeze = Math.min(100, Math.max(50, 100 - (tender.feat_window_compression_hours / 48) * 50));
    } else {
      windowSqueeze = Math.max(5, Math.min(40, 45 - (tender.feat_window_compression_hours / 168) * 35));
    }
    const walkover = Math.min(100, Math.max(5, tender.feat_single_bidder_risk * 100));
    const corrigenda = Math.min(100, Math.max(5, tender.corrigendum_count * 20 + tender.feat_corr_velocity * 10));
    const emdSkew = Math.min(100, Math.max(5, (tender.feat_emd_ratio / 0.05) * 50));

    return [
      { label: 'ML Anomaly', value: mlAnomaly, display: `${mlAnomaly.toFixed(0)}%` },
      { label: 'CVC Penalty', value: cvcPenalty, display: `${cvcPenalty.toFixed(0)}%` },
      { label: 'Window Squeeze', value: windowSqueeze, display: `${tender.feat_window_compression_hours}h` },
      { label: 'Walkover Risk', value: walkover, display: `${walkover.toFixed(0)}%` },
      { label: 'Corrigenda Churn', value: corrigenda, display: `${tender.corrigendum_count} corr` },
      { label: 'EMD Skew', value: emdSkew, display: `${(tender.feat_emd_ratio * 100).toFixed(1)}%` },
    ];
  }, [tender]);

  const numAxes = axes.length;

  const getCoordinates = (axisIndex: number, val: number) => {
    const angle = (axisIndex * 2 * Math.PI) / numAxes - Math.PI / 2;
    const distance = (val / 100) * r;
    return {
      x: cx + distance * Math.cos(angle),
      y: cy + distance * Math.sin(angle),
    };
  };

  const getLabelCoordinates = (axisIndex: number) => {
    const angle = (axisIndex * 2 * Math.PI) / numAxes - Math.PI / 2;
    const distance = r + 24;
    return {
      x: cx + distance * Math.cos(angle),
      y: cy + distance * Math.sin(angle),
    };
  };

  const makePolygonPath = (pct: number) => {
    return Array.from({ length: numAxes })
      .map((_, i) => {
        const { x, y } = getCoordinates(i, pct);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ') + ' Z';
  };

  const valuePolygonPath = useMemo(() => {
    return axes
      .map((axis, i) => {
        const { x, y } = getCoordinates(i, axis.value);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ') + ' Z';
  }, [axes]);

  // Government-appropriate muted colors
  const themeColors = {
    RED: {
      fill: 'rgba(220, 38, 38, 0.15)',
      stroke: '#DC2626',
      point: '#DC2626',
    },
    AMBER: {
      fill: 'rgba(217, 119, 6, 0.15)',
      stroke: '#D97706',
      point: '#D97706',
    },
    GREEN: {
      fill: 'rgba(5, 150, 105, 0.15)',
      stroke: '#059669',
      point: '#059669',
    },
  }[tender.vigilance_tier];

  return (
    <div className={`relative bg-white border border-gray-200 rounded p-3 flex flex-col items-center select-none ${className}`}>
      <div className="w-full flex items-center justify-between text-[10px] mb-1 px-1">
        <span className="uppercase tracking-wider font-medium text-gray-600 text-[10px]">
          6-Axis Behavioral Radar
        </span>
        <span className="text-[9px] text-gray-400 font-data">
          — GFR Safety Line (60%)
        </span>
      </div>

      <svg viewBox="0 0 260 230" className="w-full max-w-[260px] h-auto overflow-visible">
        {/* Grid Rings */}
        <path d={makePolygonPath(33)} fill="none" stroke="#E5E7EB" strokeWidth="1" />
        <path d={makePolygonPath(66)} fill="none" stroke="#E5E7EB" strokeWidth="1" />
        <path d={makePolygonPath(100)} fill="none" stroke="#D1D5DB" strokeWidth="1.2" />

        {/* Statutory Safety Boundary (60%) */}
        <path
          d={makePolygonPath(60)}
          fill="none"
          stroke="#003366"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          opacity="0.5"
        />

        {/* Axis rays */}
        {Array.from({ length: numAxes }).map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#E5E7EB" strokeWidth="1" />
          );
        })}

        {/* Data Polygon */}
        <path
          d={valuePolygonPath}
          fill={themeColors.fill}
          stroke={themeColors.stroke}
          strokeWidth="2"
        />

        {/* Data points */}
        {axes.map((axis, i) => {
          const { x, y } = getCoordinates(i, axis.value);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={3.5}
              fill={themeColors.point}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Labels */}
        {axes.map((axis, i) => {
          const { x, y } = getLabelCoordinates(i);
          const isTop = y < cy - 10;
          const isBottom = y > cy + 10;
          const textAnchor = Math.abs(x - cx) < 15 ? 'middle' : x > cx ? 'start' : 'end';
          const dy = isTop ? '-0.3em' : isBottom ? '0.9em' : '0.3em';

          return (
            <g key={i}>
              <text
                x={x}
                y={y}
                textAnchor={textAnchor}
                dy={dy}
                className="text-[9px] font-medium"
                fill="#6B7280"
                style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '9px' }}
              >
                {axis.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
