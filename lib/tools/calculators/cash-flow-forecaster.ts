// Cash Flow Forecaster Implementation

import { ToolResult } from '../types';
import {
  parseNumericInput,
  getConfidenceLevel,
  formatCurrency,
  generateWeekLabels,
  calculateInputConfidence,
} from '../utils';

export function executeCashFlowForecaster(inputs: Record<string, string | number>): ToolResult {
  // Parse inputs
  const currentCash = parseNumericInput(inputs.currentCash, 0);
  const weeklyRevenue = parseNumericInput(inputs.weeklyRevenue, 0);
  const weeklyExpenses = parseNumericInput(inputs.weeklyExpenses, 0);
  const outstandingAR = parseNumericInput(inputs.outstandingAR, 0);
  const outstandingAP = parseNumericInput(inputs.outstandingAP, 0);
  const arCollectionRate = parseNumericInput(inputs.arCollectionRate, 85) / 100;

  const WEEKS = 13;

  // Calculate weekly net cash flow
  const weeklyNetFlow = weeklyRevenue - weeklyExpenses;

  // Assume AR is collected evenly over 8 weeks, AP is paid evenly over 6 weeks
  const weeklyARCollection = (outstandingAR * arCollectionRate) / 8;
  const weeklyAPPayment = outstandingAP / 6;

  // Generate weekly projections
  const weeklyData: number[] = [];
  const cumulativeData: number[] = [];
  let runningCash = currentCash;
  let minCash = currentCash;
  let minCashWeek = 0;
  let runwayWeeks = WEEKS;

  for (let week = 1; week <= WEEKS; week++) {
    // Base flow
    let weekFlow = weeklyNetFlow;

    // Add AR collections (weeks 1-8)
    if (week <= 8) {
      weekFlow += weeklyARCollection;
    }

    // Subtract AP payments (weeks 1-6)
    if (week <= 6) {
      weekFlow -= weeklyAPPayment;
    }

    weeklyData.push(weekFlow);
    runningCash += weekFlow;
    cumulativeData.push(runningCash);

    // Track minimum
    if (runningCash < minCash) {
      minCash = runningCash;
      minCashWeek = week;
    }

    // Track runway (when cash goes negative)
    if (runningCash <= 0 && runwayWeeks === WEEKS) {
      runwayWeeks = week - 1;
    }
  }

  // Calculate risk level
  const endingCash = cumulativeData[WEEKS - 1];
  const avgWeeklyCash = cumulativeData.reduce((a, b) => a + b, 0) / WEEKS;
  const burnRate = weeklyExpenses - weeklyRevenue;

  let riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
  if (minCash < 0 || runwayWeeks < WEEKS) {
    riskLevel = 'Critical';
  } else if (minCash < weeklyExpenses * 2) {
    riskLevel = 'High';
  } else if (minCash < weeklyExpenses * 4) {
    riskLevel = 'Moderate';
  }

  // Calculate actual runway if burning cash
  let actualRunway = WEEKS;
  if (burnRate > 0) {
    actualRunway = Math.floor(currentCash / burnRate);
    if (actualRunway < 0) actualRunway = 0;
    if (actualRunway > 52) actualRunway = 52; // Cap at 1 year
  }

  // Calculate confidence
  let confidence = calculateInputConfidence(inputs, ['outstandingAR', 'outstandingAP', 'arCollectionRate']);
  if (weeklyRevenue === 0 && weeklyExpenses === 0) confidence *= 0.6;
  confidence = Math.min(0.92, Math.max(0.55, confidence));

  const confidenceLevel = getConfidenceLevel(confidence);

  // Build decision trail
  const decisionTrail = [
    `Starting cash position: ${formatCurrency(currentCash)}`,
    `Weekly net flow: ${formatCurrency(weeklyNetFlow)} (${formatCurrency(weeklyRevenue)} in, ${formatCurrency(weeklyExpenses)} out)`,
    `Outstanding AR: ${formatCurrency(outstandingAR)} at ${(arCollectionRate * 100).toFixed(0)}% collection rate`,
    `Outstanding AP: ${formatCurrency(outstandingAP)} spread over 6 weeks`,
    `Projected 13-week ending cash: ${formatCurrency(endingCash)}`,
    `Minimum cash point: ${formatCurrency(minCash)} at week ${minCashWeek}`,
  ];

  // Generate recommendations
  const recommendations: string[] = [];

  if (riskLevel === 'Critical') {
    recommendations.push('URGENT: Cash flow shows negative position - immediate action required');
    recommendations.push('Accelerate AR collections and negotiate AP payment extensions');
  } else if (riskLevel === 'High') {
    recommendations.push('Cash buffer is thin - prioritize collections and control spending');
  }

  if (outstandingAR > weeklyRevenue * 4) {
    recommendations.push('AR aging appears elevated - consider tightening payment terms');
  }

  if (weeklyExpenses > weeklyRevenue) {
    recommendations.push(`Weekly burn rate of ${formatCurrency(burnRate)} requires attention`);
  } else {
    recommendations.push('Positive weekly cash flow supports sustainable operations');
  }

  if (minCash < currentCash * 0.5) {
    recommendations.push(`Cash dips to ${formatCurrency(minCash)} in week ${minCashWeek} - plan accordingly`);
  }

  // Build summary
  const summary = riskLevel === 'Critical' || riskLevel === 'High'
    ? `Cash flow forecast shows ${riskLevel.toLowerCase()} risk with minimum cash of ${formatCurrency(minCash)} at week ${minCashWeek}. ${burnRate > 0 ? `Current burn rate: ${formatCurrency(burnRate)}/week.` : ''}`
    : `13-week forecast shows healthy cash flow ending at ${formatCurrency(endingCash)}. Runway exceeds forecast period.`;

  return {
    outputs: [
      {
        id: 'runway',
        label: 'Cash Runway',
        value: actualRunway > WEEKS ? `${WEEKS}+ weeks` : `${actualRunway} weeks`,
        format: 'text',
        trend: actualRunway >= WEEKS ? 'positive' : actualRunway >= 8 ? 'neutral' : 'negative',
        highlight: true,
        description: 'Weeks of operation with current cash',
      },
      {
        id: 'riskLevel',
        label: 'Risk Level',
        value: riskLevel,
        format: 'text',
        trend: riskLevel === 'Low' ? 'positive' : riskLevel === 'Moderate' ? 'neutral' : 'negative',
        highlight: true,
        description: 'Overall cash flow risk assessment',
      },
      {
        id: 'endingCash',
        label: 'Week 13 Cash Balance',
        value: endingCash,
        format: 'currency',
        trend: endingCash > currentCash ? 'positive' : endingCash > 0 ? 'neutral' : 'negative',
        highlight: true,
        description: 'Projected cash at end of 13 weeks',
      },
      {
        id: 'minCash',
        label: 'Minimum Cash Point',
        value: minCash,
        format: 'currency',
        trend: minCash > weeklyExpenses * 2 ? 'positive' : minCash > 0 ? 'neutral' : 'negative',
        description: `Lowest cash balance (week ${minCashWeek})`,
      },
      {
        id: 'weeklyNetFlow',
        label: 'Weekly Net Flow',
        value: weeklyNetFlow,
        format: 'currency',
        trend: weeklyNetFlow > 0 ? 'positive' : 'negative',
        description: 'Average weekly cash change',
      },
      {
        id: 'expectedARCollection',
        label: 'Expected AR Collection',
        value: outstandingAR * arCollectionRate,
        format: 'currency',
        trend: 'positive',
        description: `${(arCollectionRate * 100).toFixed(0)}% of outstanding receivables`,
      },
    ],
    confidence,
    confidenceLevel,
    chart: {
      labels: generateWeekLabels(WEEKS),
      datasets: [
        {
          label: 'Projected Cash Balance',
          data: cumulativeData,
          color: '#10b981', // emerald-500
          type: 'area',
        },
        {
          label: 'Weekly Net Flow',
          data: weeklyData,
          color: '#22d3ee', // cyan-400
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
