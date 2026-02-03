// ROI Calculator Implementation

import { ToolResult } from '../types';
import {
  parseNumericInput,
  calculateROI,
  calculateNPV,
  calculatePaybackPeriod,
  getConfidenceLevel,
  formatCurrency,
  generateMonthLabels,
  calculateInputConfidence,
} from '../utils';

export function executeROICalculator(inputs: Record<string, string | number>): ToolResult {
  // Parse inputs
  const currentAnnualCost = parseNumericInput(inputs.currentAnnualCost, 0);
  const estimatedAnnualSavings = parseNumericInput(inputs.estimatedAnnualSavings, 0);
  const implementationCost = parseNumericInput(inputs.implementationCost, 0);
  const timeToImplement = parseNumericInput(inputs.timeToImplement, 3);
  const discountRate = parseNumericInput(inputs.discountRate, 10) / 100;

  // Calculate monthly savings
  const monthlySavings = estimatedAnnualSavings / 12;

  // Calculate ROI
  const threeYearSavings = estimatedAnnualSavings * 3;
  const netBenefit = threeYearSavings - implementationCost;
  const roi = calculateROI(threeYearSavings, implementationCost);

  // Calculate payback period (accounting for implementation time)
  const paybackMonths = calculatePaybackPeriod(implementationCost, monthlySavings) + timeToImplement;

  // Calculate 3-year NPV
  // Cash flows: implementation cost in month 0, then monthly savings starting after implementation
  const cashFlows: number[] = [-implementationCost];
  for (let month = 1; month <= 36; month++) {
    if (month <= timeToImplement) {
      cashFlows.push(0); // No savings during implementation
    } else {
      cashFlows.push(monthlySavings);
    }
  }
  const monthlyDiscountRate = discountRate / 12;
  const npv = calculateNPV(cashFlows, monthlyDiscountRate);

  // Calculate break-even month
  let cumulativeSavings = -implementationCost;
  let breakEvenMonth = 0;
  for (let month = 1; month <= 36; month++) {
    if (month > timeToImplement) {
      cumulativeSavings += monthlySavings;
    }
    if (cumulativeSavings >= 0 && breakEvenMonth === 0) {
      breakEvenMonth = month;
    }
  }

  // Generate chart data (cumulative savings over 36 months)
  const chartLabels = generateMonthLabels(36);
  const cumulativeData: number[] = [];
  let cumulative = -implementationCost;
  for (let month = 1; month <= 36; month++) {
    if (month > timeToImplement) {
      cumulative += monthlySavings;
    }
    cumulativeData.push(cumulative);
  }

  // Investment line (constant at implementation cost for reference)
  const investmentLine = Array(36).fill(implementationCost);

  // Calculate confidence
  const baseConfidence = calculateInputConfidence(inputs, ['discountRate']);
  // Adjust confidence based on reasonableness of inputs
  let confidence = baseConfidence;
  if (roi > 500) confidence *= 0.85; // Very high ROI might be optimistic
  if (paybackMonths < 1) confidence *= 0.8; // Unrealistically fast payback
  if (estimatedAnnualSavings > currentAnnualCost) confidence *= 0.9; // Savings exceed current cost
  confidence = Math.min(0.95, Math.max(0.5, confidence));

  const confidenceLevel = getConfidenceLevel(confidence);

  // Build decision trail
  const decisionTrail = [
    `Analyzed investment of ${formatCurrency(implementationCost)} with ${timeToImplement} month implementation`,
    `Calculated annual savings potential of ${formatCurrency(estimatedAnnualSavings)}`,
    `Applied ${(discountRate * 100).toFixed(1)}% discount rate for NPV calculation`,
    `Projected 36-month cumulative benefit of ${formatCurrency(threeYearSavings)}`,
    `Determined break-even at month ${breakEvenMonth || 'N/A'}`,
  ];

  // Generate recommendations
  const recommendations: string[] = [];

  if (roi > 100) {
    recommendations.push('Strong ROI indicates this investment is financially attractive');
  } else if (roi > 50) {
    recommendations.push('Moderate ROI - consider comparing with alternative investments');
  } else if (roi > 0) {
    recommendations.push('Low ROI - evaluate non-financial benefits before proceeding');
  } else {
    recommendations.push('Negative ROI - reconsider the investment or find ways to reduce costs');
  }

  if (paybackMonths <= 12) {
    recommendations.push('Quick payback period reduces risk exposure');
  } else if (paybackMonths <= 24) {
    recommendations.push('Reasonable payback period - ensure cash flow can support the investment');
  } else {
    recommendations.push('Long payback period - consider phased implementation to reduce risk');
  }

  if (npv > 0) {
    recommendations.push(`Positive NPV of ${formatCurrency(npv)} confirms value creation`);
  } else {
    recommendations.push('Negative NPV suggests the investment may not meet your return requirements');
  }

  // Build summary
  const summary = roi > 0
    ? `This investment shows a ${roi.toFixed(0)}% ROI with a payback period of ${paybackMonths.toFixed(1)} months. The 3-year NPV is ${formatCurrency(npv)}.`
    : `This investment shows a negative return. Consider revising your assumptions or exploring alternatives.`;

  return {
    outputs: [
      {
        id: 'roi',
        label: 'Return on Investment',
        value: roi,
        format: 'percentage',
        trend: roi > 0 ? 'positive' : 'negative',
        highlight: true,
        description: '3-year ROI based on implementation cost vs. total savings',
      },
      {
        id: 'paybackPeriod',
        label: 'Payback Period',
        value: paybackMonths,
        format: 'months',
        trend: paybackMonths <= 18 ? 'positive' : paybackMonths <= 30 ? 'neutral' : 'negative',
        highlight: true,
        description: 'Time to recover initial investment',
      },
      {
        id: 'npv',
        label: '3-Year NPV',
        value: npv,
        format: 'currency',
        trend: npv > 0 ? 'positive' : 'negative',
        highlight: true,
        description: `Net present value at ${(discountRate * 100).toFixed(0)}% discount rate`,
      },
      {
        id: 'breakEvenMonth',
        label: 'Break-Even Month',
        value: breakEvenMonth || 'N/A',
        format: 'text',
        trend: breakEvenMonth && breakEvenMonth <= 18 ? 'positive' : 'neutral',
        description: 'Month when cumulative savings exceed investment',
      },
      {
        id: 'threeYearSavings',
        label: '3-Year Total Savings',
        value: threeYearSavings,
        format: 'currency',
        trend: 'positive',
        description: 'Gross savings over 36 months',
      },
      {
        id: 'netBenefit',
        label: 'Net Benefit',
        value: netBenefit,
        format: 'currency',
        trend: netBenefit > 0 ? 'positive' : 'negative',
        description: 'Total savings minus implementation cost',
      },
    ],
    confidence,
    confidenceLevel,
    chart: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Cumulative Savings',
          data: cumulativeData,
          color: '#22d3ee', // cyan-400
          type: 'line',
        },
        {
          label: 'Break-Even Line',
          data: Array(36).fill(0),
          color: '#94a3b8', // slate-400
          type: 'line',
        },
      ],
    },
    summary,
    recommendations,
    decisionTrail,
    timestamp: new Date().toISOString(),
  };
}
