'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ToolOutput as ToolOutputType, formatOutputValue } from '@/lib/tools';

interface ToolOutputProps {
  output: ToolOutputType;
  index?: number;
}

export function ToolOutput({ output, index = 0 }: ToolOutputProps) {
  const trendIcons = {
    positive: <TrendingUp className="w-4 h-4 text-emerald-400" />,
    negative: <TrendingDown className="w-4 h-4 text-red-400" />,
    neutral: <Minus className="w-4 h-4 text-slate-400" />,
  };

  const trendColors = {
    positive: 'text-emerald-400',
    negative: 'text-red-400',
    neutral: 'text-slate-300',
  };

  const formattedValue = formatOutputValue(output.value, output.format);

  return (
    <motion.div
      className={`
        p-4 rounded-lg border
        ${output.highlight
          ? 'bg-slate-800/80 border-cyan-500/30'
          : 'bg-slate-800/50 border-slate-700/50'
        }
      `}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex items-start justify-between mb-1">
        <span className="text-sm text-slate-400">{output.label}</span>
        {output.trend && trendIcons[output.trend]}
      </div>
      <div className={`text-2xl font-bold ${output.trend ? trendColors[output.trend] : 'text-white'}`}>
        {formattedValue}
      </div>
      {output.description && (
        <p className="text-xs text-slate-500 mt-1">{output.description}</p>
      )}
    </motion.div>
  );
}

interface ToolOutputGridProps {
  outputs: ToolOutputType[];
}

export function ToolOutputGrid({ outputs }: ToolOutputGridProps) {
  const highlighted = outputs.filter(o => o.highlight);
  const regular = outputs.filter(o => !o.highlight);

  return (
    <div className="space-y-4">
      {/* Highlighted outputs - larger */}
      {highlighted.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {highlighted.map((output, i) => (
            <ToolOutput key={output.id} output={output} index={i} />
          ))}
        </div>
      )}

      {/* Regular outputs - smaller grid */}
      {regular.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {regular.map((output, i) => (
            <ToolOutput key={output.id} output={output} index={highlighted.length + i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ToolOutput;
