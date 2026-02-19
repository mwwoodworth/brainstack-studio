'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Copy, Check } from 'lucide-react';
import { ToolOutput as ToolOutputType, formatOutputValue } from '@/lib/tools';
import { Button } from '@/components/ui/Button';

interface ToolOutputProps {
  output: ToolOutputType;
  index?: number;
  fullWidth?: boolean;
}

export function ToolOutput({ output, index = 0, fullWidth = false }: ToolOutputProps) {
  const [copied, setCopied] = useState(false);

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

  const isLongText = output.format === 'text' && String(output.value).length > 100;
  const formattedValue = formatOutputValue(output.value, output.format);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(output.value));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLongText) {
    return (
      <motion.div
        className={`
          p-6 rounded-lg border bg-slate-800/50 border-slate-700/50 relative group
          ${fullWidth ? 'col-span-full' : ''}
        `}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">{output.label}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-slate-500 hover:text-white"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        <div className="prose prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-slate-300 text-sm leading-relaxed">
            {String(output.value)}
          </pre>
        </div>
        {output.description && (
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {output.description}
            </p>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`
        p-4 rounded-lg border flex flex-col justify-between
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
  const longTexts = outputs.filter(o => o.format === 'text' && String(o.value).length > 100);
  const metrics = outputs.filter(o => !(o.format === 'text' && String(o.value).length > 100));
  
  const highlighted = metrics.filter(o => o.highlight);
  const regular = metrics.filter(o => !o.highlight);

  return (
    <div className="space-y-4">
      {/* Metric Cards (Highlighted) */}
      {highlighted.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {highlighted.map((output, i) => (
            <ToolOutput key={output.id} output={output} index={i} />
          ))}
        </div>
      )}

      {/* Metric Cards (Regular) */}
      {regular.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {regular.map((output, i) => (
            <ToolOutput key={output.id} output={output} index={highlighted.length + i} />
          ))}
        </div>
      )}

      {/* Long Text Outputs (Full Width) */}
      {longTexts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mt-6">
          {longTexts.map((output, i) => (
            <ToolOutput 
              key={output.id} 
              output={output} 
              index={metrics.length + i} 
              fullWidth 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ToolOutput;
