// Tool Utilities for BrainStack Studio

import { ConfidenceLevel, ToolOutput, ChartData } from './types';

/**
 * Format a number as currency
 */
export function formatCurrency(value: number, decimals = 0): string {
  if (!Number.isFinite(value) || Number.isNaN(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a number as percentage
 */
export function formatPercentage(value: number, decimals = 1): string {
  if (!Number.isFinite(value) || Number.isNaN(value)) return 'N/A';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a number with commas
 */
export function formatNumber(value: number, decimals = 0): string {
  if (!Number.isFinite(value) || Number.isNaN(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Check if a number is safe for display (not Infinity, -Infinity, or NaN)
 */
export function isSafeNumber(value: number): boolean {
  return Number.isFinite(value) && !Number.isNaN(value);
}

/**
 * Format output value based on format type
 */
export function formatOutputValue(value: string | number, format?: ToolOutput['format']): string {
  if (typeof value === 'string') return value;

  // Handle edge cases for numbers
  if (!isSafeNumber(value)) {
    if (Number.isNaN(value)) return 'N/A';
    if (value === Infinity) return '∞';
    if (value === -Infinity) return '-∞';
    return 'N/A';
  }

  switch (format) {
    case 'currency':
      return formatCurrency(value);
    case 'percentage':
      return formatPercentage(value);
    case 'number':
      return formatNumber(value);
    case 'months':
      return `${value.toFixed(1)} months`;
    case 'weeks':
      return `${value.toFixed(1)} weeks`;
    default:
      return String(value);
  }
}

/**
 * Calculate confidence level from score
 */
export function getConfidenceLevel(confidence: number): ConfidenceLevel {
  if (confidence >= 0.8) return 'high';
  if (confidence >= 0.65) return 'moderate';
  return 'low';
}

/**
 * Get confidence label
 */
export function getConfidenceLabel(level: ConfidenceLevel): string {
  switch (level) {
    case 'high':
      return 'High Confidence';
    case 'moderate':
      return 'Moderate Confidence';
    case 'low':
      return 'Low Confidence';
  }
}

/**
 * Get confidence color class
 */
export function getConfidenceColor(level: ConfidenceLevel): string {
  switch (level) {
    case 'high':
      return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
    case 'moderate':
      return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
    case 'low':
      return 'text-red-400 bg-red-400/10 border-red-400/30';
  }
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `tool_${timestamp}_${random}`;
}

/**
 * Parse numeric input safely
 */
export function parseNumericInput(value: string | number | undefined, defaultValue = 0): number {
  if (value === undefined || value === '') return defaultValue;
  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Calculate simple ROI
 */
export function calculateROI(gain: number, cost: number): number {
  if (cost === 0) return 0;
  return ((gain - cost) / cost) * 100;
}

/**
 * Calculate Net Present Value
 */
export function calculateNPV(cashFlows: number[], discountRate: number): number {
  return cashFlows.reduce((npv, cashFlow, period) => {
    return npv + cashFlow / Math.pow(1 + discountRate, period);
  }, 0);
}

/**
 * Calculate payback period in months
 */
export function calculatePaybackPeriod(initialCost: number, monthlyBenefit: number): number {
  if (monthlyBenefit <= 0) return Infinity;
  return initialCost / monthlyBenefit;
}

/**
 * Calculate break-even units
 */
export function calculateBreakEvenUnits(fixedCosts: number, pricePerUnit: number, variableCostPerUnit: number): number {
  const contributionMargin = pricePerUnit - variableCostPerUnit;
  if (contributionMargin <= 0) return Infinity;
  return fixedCosts / contributionMargin;
}

/**
 * Generate cumulative data for chart
 */
export function generateCumulativeData(values: number[]): number[] {
  let cumulative = 0;
  return values.map(v => {
    cumulative += v;
    return cumulative;
  });
}

/**
 * Generate monthly labels
 */
export function generateMonthLabels(count: number, startMonth = new Date().getMonth()): string[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const labels: string[] = [];
  for (let i = 0; i < count; i++) {
    labels.push(months[(startMonth + i) % 12]);
  }
  return labels;
}

/**
 * Generate week labels
 */
export function generateWeekLabels(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `Week ${i + 1}`);
}

/**
 * Create a simple line chart data structure
 */
export function createLineChartData(
  labels: string[],
  datasets: { label: string; data: number[]; color?: string }[]
): ChartData {
  return {
    labels,
    datasets: datasets.map(ds => ({
      ...ds,
      type: 'line' as const,
    })),
  };
}

/**
 * Calculate compound growth
 */
export function calculateCompoundGrowth(principal: number, rate: number, periods: number): number {
  return principal * Math.pow(1 + rate, periods);
}

/**
 * Calculate utilization rate
 */
export function calculateUtilization(used: number, total: number): number {
  if (total === 0) return 0;
  return (used / total) * 100;
}

/**
 * Validate all required inputs are provided
 */
export function validateInputs(
  inputs: Record<string, string | number>,
  requiredFields: string[]
): { valid: boolean; missing: string[] } {
  const missing = requiredFields.filter(field => {
    const value = inputs[field];
    return value === undefined || value === '' || value === null;
  });
  return { valid: missing.length === 0, missing };
}

/**
 * Calculate confidence based on input completeness and value reasonableness
 */
export function calculateInputConfidence(
  inputs: Record<string, string | number>,
  optionalFields: string[] = []
): number {
  const totalFields = Object.keys(inputs).length;
  const providedFields = Object.entries(inputs).filter(([key, value]) => {
    if (optionalFields.includes(key)) return true; // Optional fields don't reduce confidence
    return value !== undefined && value !== '' && value !== null;
  }).length;

  // Base confidence from input completeness
  let confidence = providedFields / totalFields;

  // Check for reasonable values (not zero, not extreme)
  const numericValues = Object.values(inputs).filter(v => typeof v === 'number') as number[];
  const hasReasonableValues = numericValues.every(v => v >= 0 && v < 1e12);
  if (!hasReasonableValues) confidence *= 0.8;

  return Math.min(0.95, Math.max(0.5, confidence));
}
