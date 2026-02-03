'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChartData } from '@/lib/tools';

interface ToolChartProps {
  data: ChartData;
  height?: number;
}

export function ToolChart({ data, height = 200 }: ToolChartProps) {
  const { labels, datasets } = data;

  // Calculate chart dimensions
  const padding = { top: 20, right: 20, bottom: 30, left: 60 };
  const chartWidth = 100; // percentage
  const chartHeight = height - padding.top - padding.bottom;

  // Find min and max values across all datasets
  const allValues = datasets.flatMap(ds => ds.data);
  const minValue = Math.min(0, ...allValues);
  const maxValue = Math.max(...allValues);
  const valueRange = maxValue - minValue || 1;

  // Scale value to chart coordinates
  const scaleY = (value: number) => {
    const normalized = (value - minValue) / valueRange;
    return chartHeight - (normalized * chartHeight);
  };

  // Generate path for line charts
  const generateLinePath = (values: number[]) => {
    const points = values.map((value, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = scaleY(value);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  // Generate area path (line + filled area below)
  const generateAreaPath = (values: number[]) => {
    const linePath = generateLinePath(values);
    const zeroY = scaleY(0);
    return `${linePath} L 100,${zeroY} L 0,${zeroY} Z`;
  };

  // Y-axis labels
  const yAxisLabels = useMemo(() => {
    const count = 5;
    const labels: { value: number; y: number }[] = [];
    for (let i = 0; i <= count; i++) {
      const value = minValue + (valueRange * i / count);
      const normalized = (value - minValue) / valueRange;
      const y = chartHeight - (normalized * chartHeight);
      labels.push({ value, y });
    }
    return labels;
  }, [minValue, valueRange, chartHeight]);

  // Format value for display
  const formatValue = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return value.toFixed(0);
  };

  // Zero line position
  const zeroLineY = scaleY(0);

  return (
    <div className="w-full" style={{ height }}>
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      >
        {/* Background grid */}
        <g className="text-slate-700">
          {yAxisLabels.map((label, i) => (
            <line
              key={i}
              x1="0"
              y1={label.y + padding.top}
              x2="100"
              y2={label.y + padding.top}
              stroke="currentColor"
              strokeWidth="0.2"
              strokeDasharray="2,2"
            />
          ))}
        </g>

        {/* Zero line */}
        {minValue < 0 && maxValue > 0 && (
          <line
            x1="0"
            y1={zeroLineY + padding.top}
            x2="100"
            y2={zeroLineY + padding.top}
            stroke="#94a3b8"
            strokeWidth="0.3"
          />
        )}

        {/* Chart area */}
        <g transform={`translate(0, ${padding.top})`}>
          {datasets.map((dataset, dsIndex) => {
            const color = dataset.color || '#22d3ee';

            if (dataset.type === 'bar') {
              const barWidth = 80 / (labels.length * datasets.filter(d => d.type === 'bar').length);
              const barOffset = dsIndex * barWidth;

              return (
                <g key={dsIndex}>
                  {dataset.data.map((value, i) => {
                    const x = (i / labels.length) * 100 + 10 / labels.length + barOffset;
                    const barHeight = Math.abs(scaleY(0) - scaleY(value));
                    const y = value >= 0 ? scaleY(value) : scaleY(0);

                    return (
                      <motion.rect
                        key={i}
                        x={`${x}%`}
                        y={y}
                        width={`${barWidth}%`}
                        height={barHeight}
                        fill={value >= 0 ? color : '#ef4444'}
                        opacity={0.7}
                        rx="1"
                        initial={{ height: 0, y: scaleY(0) }}
                        animate={{ height: barHeight, y }}
                        transition={{ delay: i * 0.02, duration: 0.3 }}
                      />
                    );
                  })}
                </g>
              );
            }

            if (dataset.type === 'area') {
              return (
                <g key={dsIndex}>
                  <motion.path
                    d={generateAreaPath(dataset.data)}
                    fill={color}
                    opacity={0.15}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.15 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.path
                    d={generateLinePath(dataset.data)}
                    fill="none"
                    stroke={color}
                    strokeWidth="0.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                </g>
              );
            }

            // Default: line
            return (
              <motion.path
                key={dsIndex}
                d={generateLinePath(dataset.data)}
                fill="none"
                stroke={color}
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8 }}
              />
            );
          })}
        </g>

        {/* Y-axis labels */}
        <g className="text-slate-500 text-[3px]">
          {yAxisLabels.map((label, i) => (
            <text
              key={i}
              x="-2"
              y={label.y + padding.top + 1}
              textAnchor="end"
              fill="currentColor"
            >
              {formatValue(label.value)}
            </text>
          ))}
        </g>

        {/* X-axis labels */}
        <g className="text-slate-500 text-[3px]">
          {labels.filter((_, i) => i % Math.ceil(labels.length / 8) === 0).map((label, i, arr) => (
            <text
              key={i}
              x={`${(i / (arr.length - 1 || 1)) * 100}%`}
              y={height - 5}
              textAnchor="middle"
              fill="currentColor"
            >
              {label}
            </text>
          ))}
        </g>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3 justify-center">
        {datasets.map((dataset, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: dataset.color || '#22d3ee' }}
            />
            <span className="text-xs text-slate-400">{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ToolChart;
