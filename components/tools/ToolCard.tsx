'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Wrench } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Tool, INDUSTRY_LABELS, PAIN_POINT_LABELS } from '@/lib/tools';

// Type for dynamic icon lookup
type IconComponent = React.ComponentType<{ className?: string }>;

interface ToolCardProps {
  tool: Tool;
  featured?: boolean;
}

export const ToolCard = memo(function ToolCard({ tool, featured = false }: ToolCardProps) {
  // Dynamic icon lookup - use type assertion via unknown for dynamic access
  const IconComponent = (LucideIcons as unknown as Record<string, IconComponent>)[tool.icon] || Wrench;

  const colorClasses: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30 hover:border-cyan-400/50',
      text: 'text-cyan-400',
      glow: 'hover:shadow-cyan-500/20',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30 hover:border-emerald-400/50',
      text: 'text-emerald-400',
      glow: 'hover:shadow-emerald-500/20',
    },
    violet: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/30 hover:border-violet-400/50',
      text: 'text-violet-400',
      glow: 'hover:shadow-violet-500/20',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30 hover:border-amber-400/50',
      text: 'text-amber-400',
      glow: 'hover:shadow-amber-500/20',
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30 hover:border-rose-400/50',
      text: 'text-rose-400',
      glow: 'hover:shadow-rose-500/20',
    },
  };

  const colors = colorClasses[tool.color] || colorClasses.cyan;

  return (
    <Link href={`/tools/${tool.slug}`}>
      <motion.div
        className={`
          relative p-6 rounded-xl border ${colors.border} ${colors.glow}
          bg-slate-900/50 backdrop-blur-sm
          transition-all duration-300 hover:shadow-lg
          cursor-pointer group h-full
          ${featured ? 'ring-1 ring-yellow-500/30' : ''}
        `}
        whileHover={{ y: -4 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Featured badge */}
        {featured && (
          <div className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
            Featured
          </div>
        )}

        {/* Icon */}
        <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center mb-4`} aria-hidden="true">
          <IconComponent className={`w-6 h-6 ${colors.text}`} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 mb-4 line-clamp-2">
          {tool.shortDescription}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {tool.industries.slice(0, 2).map((industry) => (
            <span
              key={industry}
              className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-400 border border-slate-700"
            >
              {INDUSTRY_LABELS[industry]}
            </span>
          ))}
          {tool.painPoints.slice(0, 1).map((pain) => (
            <span
              key={pain}
              className={`px-2 py-0.5 text-xs rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}
            >
              {PAIN_POINT_LABELS[pain]}
            </span>
          ))}
        </div>

        {/* Arrow indicator */}
        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
          <ArrowRight className={`w-5 h-5 ${colors.text}`} />
        </div>
      </motion.div>
    </Link>
  );
});

export default ToolCard;
