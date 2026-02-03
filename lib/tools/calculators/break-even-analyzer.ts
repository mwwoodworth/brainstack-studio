// Break-Even Analyzer Implementation

import { ToolResult } from '../types';
import {
  parseNumericInput,
  getConfidenceLevel,
  formatCurrency,
  formatNumber,
  formatPercentage,
  calculateInputConfidence,
  calculateBreakEvenUnits,
} from '../utils';

export function executeBreakEvenAnalyzer(inputs: Record<string, string | number>): ToolResult {
  // Parse inputs
  const fixedCosts = parseNumericInput(inputs.fixedCosts, 0);
  const variableCostPerUnit = parseNumericInput(inputs.variableCostPerUnit, 0);
  const pricePerUnit = parseNumericInput(inputs.pricePerUnit, 0);
  const currentMonthlyUnits = parseNumericInput(inputs.currentMonthlyUnits, 0);
  const growthRate = parseNumericInput(inputs.growthRate, 5) / 100;

  // Calculate contribution margin
  const contributionMargin = pricePerUnit - variableCostPerUnit;
  const contributionMarginRatio = pricePerUnit > 0 ? contributionMargin / pricePerUnit : 0;

  // Calculate break-even point
  const breakEvenUnits = calculateBreakEvenUnits(fixedCosts, pricePerUnit, variableCostPerUnit);
  const breakEvenRevenue = breakEvenUnits * pricePerUnit;

  // Calculate current position
  const currentRevenue = currentMonthlyUnits * pricePerUnit;
  const currentVariableCosts = currentMonthlyUnits * variableCostPerUnit;
  const currentProfit = currentRevenue - currentVariableCosts - fixedCosts;
  const profitMargin = currentRevenue > 0 ? (currentProfit / currentRevenue) * 100 : 0;

  // Units above/below break-even
  const unitsFromBreakEven = currentMonthlyUnits - breakEvenUnits;
  const revenueFromBreakEven = unitsFromBreakEven * pricePerUnit;

  // Calculate margin of safety
  const marginOfSafety = currentMonthlyUnits > 0
    ? ((currentMonthlyUnits - breakEvenUnits) / currentMonthlyUnits) * 100
    : 0;

  // Months to break-even if not there yet
  let monthsToBreakEven = 0;
  if (currentMonthlyUnits < breakEvenUnits && growthRate > 0) {
    // Handle edge case: if starting at 0 units, can't grow multiplicatively
    if (currentMonthlyUnits <= 0) {
      monthsToBreakEven = 36; // Max months - can't reach break-even from 0 with multiplicative growth
    } else {
      let units = currentMonthlyUnits;
      let months = 0;
      while (units < breakEvenUnits && months < 36) {
        units = units * (1 + growthRate);
        months++;
      }
      monthsToBreakEven = months;
    }
  }

  // Generate 12-month projection
  const months = 12;
  const projectionLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const revenueProjection: number[] = [];
  const totalCostProjection: number[] = [];
  const profitProjection: number[] = [];

  let projectedUnits = currentMonthlyUnits || breakEvenUnits * 0.5; // Start at 50% of BE if no current

  for (let i = 0; i < months; i++) {
    const monthRevenue = projectedUnits * pricePerUnit;
    const monthVariableCosts = projectedUnits * variableCostPerUnit;
    const monthTotalCosts = monthVariableCosts + fixedCosts;
    const monthProfit = monthRevenue - monthTotalCosts;

    revenueProjection.push(monthRevenue);
    totalCostProjection.push(monthTotalCosts);
    profitProjection.push(monthProfit);

    projectedUnits = projectedUnits * (1 + growthRate);
  }

  // Status assessment
  let status: 'Profitable' | 'At Break-Even' | 'Below Break-Even' | 'Negative Margin' = 'Profitable';
  if (contributionMargin <= 0) {
    status = 'Negative Margin';
  } else if (currentMonthlyUnits < breakEvenUnits * 0.95) {
    status = 'Below Break-Even';
  } else if (currentMonthlyUnits < breakEvenUnits * 1.05) {
    status = 'At Break-Even';
  }

  // Calculate what-if scenarios
  const priceForDoubleProfit = variableCostPerUnit + (fixedCosts * 2 + currentProfit) / currentMonthlyUnits;
  const unitsForDoubleProfit = (fixedCosts + currentProfit * 2) / contributionMargin;

  // Calculate confidence
  let confidence = calculateInputConfidence(inputs, ['currentMonthlyUnits', 'growthRate']);
  if (pricePerUnit <= variableCostPerUnit) confidence *= 0.5; // Negative margin is a problem
  confidence = Math.min(0.92, Math.max(0.50, confidence));

  const confidenceLevel = getConfidenceLevel(confidence);

  // Build decision trail
  const decisionTrail = [
    `Fixed costs: ${formatCurrency(fixedCosts)}/month`,
    `Contribution margin: ${formatCurrency(contributionMargin)}/unit (${formatPercentage(contributionMarginRatio * 100)})`,
    `Break-even point: ${formatNumber(Math.ceil(breakEvenUnits))} units (${formatCurrency(breakEvenRevenue)})`,
    `Current position: ${formatNumber(currentMonthlyUnits)} units (${status})`,
    currentMonthlyUnits > 0 ? `Margin of safety: ${formatPercentage(marginOfSafety)}` : 'No current volume provided',
  ];

  // Generate recommendations
  const recommendations: string[] = [];

  if (status === 'Negative Margin') {
    recommendations.push('CRITICAL: Price is below variable cost - every sale loses money. Increase price immediately.');
  } else if (status === 'Below Break-Even') {
    recommendations.push(`Need ${formatNumber(Math.ceil(breakEvenUnits - currentMonthlyUnits))} more units/month to break even`);
    if (monthsToBreakEven > 0 && monthsToBreakEven <= 12) {
      recommendations.push(`At ${formatPercentage(growthRate * 100)} monthly growth, break-even in ~${monthsToBreakEven} months`);
    }
  } else {
    recommendations.push(`${formatPercentage(marginOfSafety)} margin of safety - healthy buffer above break-even`);
  }

  if (contributionMarginRatio < 0.3 && contributionMargin > 0) {
    recommendations.push('Low contribution margin - focus on reducing variable costs or increasing price');
  }

  if (fixedCosts > currentRevenue * 0.5) {
    recommendations.push('High fixed cost ratio - consider ways to variabilize costs or increase volume');
  }

  // Build summary
  const summary = status === 'Negative Margin'
    ? `Warning: Contribution margin is negative (${formatCurrency(contributionMargin)}). Price must exceed variable cost.`
    : `Break-even at ${formatNumber(Math.ceil(breakEvenUnits))} units (${formatCurrency(breakEvenRevenue)}). ${currentMonthlyUnits > 0 ? `Currently ${status.toLowerCase()} with ${formatPercentage(marginOfSafety)} margin of safety.` : ''}`;

  return {
    outputs: [
      {
        id: 'breakEvenUnits',
        label: 'Break-Even Units',
        value: Math.ceil(breakEvenUnits),
        format: 'number',
        trend: 'neutral',
        highlight: true,
        description: 'Units needed to cover all costs',
      },
      {
        id: 'breakEvenRevenue',
        label: 'Break-Even Revenue',
        value: breakEvenRevenue,
        format: 'currency',
        trend: 'neutral',
        highlight: true,
        description: 'Revenue needed to break even',
      },
      {
        id: 'status',
        label: 'Current Status',
        value: status,
        format: 'text',
        trend: status === 'Profitable' ? 'positive' : status === 'Negative Margin' ? 'negative' : 'neutral',
        highlight: true,
        description: 'Position relative to break-even',
      },
      {
        id: 'contributionMargin',
        label: 'Contribution Margin',
        value: contributionMargin,
        format: 'currency',
        trend: contributionMargin > 0 ? 'positive' : 'negative',
        description: `${formatPercentage(contributionMarginRatio * 100)} of price`,
      },
      {
        id: 'marginOfSafety',
        label: 'Margin of Safety',
        value: marginOfSafety,
        format: 'percentage',
        trend: marginOfSafety > 20 ? 'positive' : marginOfSafety > 0 ? 'neutral' : 'negative',
        description: 'Buffer above break-even',
      },
      {
        id: 'currentProfit',
        label: 'Current Monthly Profit',
        value: currentProfit,
        format: 'currency',
        trend: currentProfit > 0 ? 'positive' : 'negative',
        description: `${formatPercentage(profitMargin)} profit margin`,
      },
    ],
    confidence,
    confidenceLevel,
    chart: {
      labels: projectionLabels,
      datasets: [
        {
          label: 'Revenue',
          data: revenueProjection,
          color: '#10b981', // emerald
          type: 'line',
        },
        {
          label: 'Total Costs',
          data: totalCostProjection,
          color: '#ef4444', // red
          type: 'line',
        },
        {
          label: 'Profit/Loss',
          data: profitProjection,
          color: '#22d3ee', // cyan
          type: 'bar',
        },
      ],
    },
    summary,
    recommendations,
    decisionTrail,
    timestamp: new Date().toISOString(),
  };
}
