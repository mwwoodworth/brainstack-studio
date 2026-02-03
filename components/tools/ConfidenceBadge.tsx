'use client';

import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { ConfidenceLevel, getConfidenceLabel, getConfidenceColor } from '@/lib/tools';

interface ConfidenceBadgeProps {
  confidence: number;
  level: ConfidenceLevel;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ConfidenceBadge({
  confidence,
  level,
  showPercentage = true,
  size = 'md',
}: ConfidenceBadgeProps) {
  const icons = {
    high: CheckCircle,
    moderate: Shield,
    low: AlertTriangle,
  };

  const Icon = icons[level];
  const colorClasses = getConfidenceColor(level);
  const label = getConfidenceLabel(level);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <motion.div
      className={`
        inline-flex items-center rounded-full border font-medium
        ${colorClasses}
        ${sizeClasses[size]}
      `}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Icon className={iconSizes[size]} />
      <span>{label}</span>
      {showPercentage && (
        <span className="opacity-75">({(confidence * 100).toFixed(0)}%)</span>
      )}
    </motion.div>
  );
}

export default ConfidenceBadge;
