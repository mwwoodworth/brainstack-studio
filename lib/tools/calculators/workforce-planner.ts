// Workforce Planner Implementation

import { ToolResult } from '../types';
import {
  parseNumericInput,
  getConfidenceLevel,
  formatCurrency,
  formatPercentage,
  formatNumber,
  calculateInputConfidence,
  calculateUtilization,
} from '../utils';

export function executeWorkforcePlanner(inputs: Record<string, string | number>): ToolResult {
  // Parse inputs
  const teamSize = parseNumericInput(inputs.teamSize, 1);
  const hoursPerWeek = parseNumericInput(inputs.hoursPerWeek, 40);
  const currentWorkload = parseNumericInput(inputs.currentWorkload, 0);
  const targetUtilization = parseNumericInput(inputs.targetUtilization, 80) / 100;
  const avgHourlyRate = parseNumericInput(inputs.avgHourlyRate, 0);
  const overtimeMultiplier = parseNumericInput(inputs.overtimeMultiplier, 1.5);

  // Calculate capacity
  const totalCapacity = teamSize * hoursPerWeek;
  const targetCapacity = totalCapacity * targetUtilization;
  const maxCapacityWithOT = totalCapacity * 1.25; // Assume max 25% overtime

  // Calculate utilization
  const currentUtilization = calculateUtilization(currentWorkload, totalCapacity);
  const utilizationGap = currentUtilization - (targetUtilization * 100);

  // Calculate staffing recommendations
  const optimalTeamSize = Math.ceil(currentWorkload / (hoursPerWeek * targetUtilization));
  const staffingGap = optimalTeamSize - teamSize;

  // Calculate overtime hours if over capacity
  let overtimeHours = 0;
  let regularHours = currentWorkload;
  if (currentWorkload > totalCapacity) {
    overtimeHours = Math.min(currentWorkload - totalCapacity, totalCapacity * 0.25);
    regularHours = totalCapacity;
  }

  // Calculate costs
  const regularCost = avgHourlyRate > 0 ? regularHours * avgHourlyRate : 0;
  const overtimeCost = avgHourlyRate > 0 ? overtimeHours * avgHourlyRate * overtimeMultiplier : 0;
  const totalLaborCost = regularCost + overtimeCost;
  const costPerDeliveredHour = totalLaborCost / currentWorkload || 0;

  // Calculate efficiency metrics
  const idleHours = Math.max(0, totalCapacity - currentWorkload);
  const idleCost = avgHourlyRate > 0 ? idleHours * avgHourlyRate : 0;
  const effectiveRate = currentWorkload > 0 ? totalLaborCost / currentWorkload : avgHourlyRate;

  // Capacity status
  let capacityStatus: 'Under-utilized' | 'Optimal' | 'Over-capacity' | 'Critical' = 'Optimal';
  if (currentUtilization < 60) {
    capacityStatus = 'Under-utilized';
  } else if (currentUtilization > 100) {
    capacityStatus = currentUtilization > 120 ? 'Critical' : 'Over-capacity';
  }

  // Calculate potential savings
  let potentialSavings = 0;
  let savingsSource = '';
  if (capacityStatus === 'Under-utilized' && staffingGap < 0) {
    potentialSavings = Math.abs(staffingGap) * hoursPerWeek * avgHourlyRate * 4; // Monthly savings from reducing team
    savingsSource = 'Right-sizing team';
  } else if (overtimeHours > 0 && staffingGap > 0) {
    const additionalStaffCost = staffingGap * hoursPerWeek * avgHourlyRate * 4;
    const currentOTCost = overtimeCost * 4;
    if (currentOTCost > additionalStaffCost) {
      potentialSavings = currentOTCost - additionalStaffCost;
      savingsSource = 'Converting OT to FTE';
    }
  }

  // Generate projections for next 12 weeks at different scenarios
  const weeks = 12;
  const projectionLabels = Array.from({ length: weeks }, (_, i) => `W${i + 1}`);

  // Current trajectory
  const currentTrajectory = Array(weeks).fill(currentUtilization);

  // If we add recommended staff
  const optimizedTrajectory = Array(weeks).fill(targetUtilization * 100);

  // Calculate confidence
  let confidence = calculateInputConfidence(inputs, ['avgHourlyRate', 'overtimeMultiplier']);
  if (currentWorkload === 0) confidence *= 0.6;
  confidence = Math.min(0.90, Math.max(0.55, confidence));

  const confidenceLevel = getConfidenceLevel(confidence);

  // Build decision trail
  const decisionTrail = [
    `Team of ${teamSize} with ${hoursPerWeek} hrs/week = ${formatNumber(totalCapacity)} total capacity`,
    `Current workload: ${formatNumber(currentWorkload)} hours = ${formatPercentage(currentUtilization)} utilization`,
    `Target utilization: ${formatPercentage(targetUtilization * 100)}`,
    `Optimal team size for current workload: ${optimalTeamSize} people`,
    `Staffing gap: ${staffingGap > 0 ? '+' : ''}${staffingGap} positions`,
  ];

  if (overtimeHours > 0) {
    decisionTrail.push(`Overtime required: ${formatNumber(overtimeHours)} hours at ${overtimeMultiplier}x rate`);
  }

  // Generate recommendations
  const recommendations: string[] = [];

  if (staffingGap > 0) {
    recommendations.push(`Consider adding ${staffingGap} team member(s) to meet demand without overtime`);
  } else if (staffingGap < 0) {
    recommendations.push(`Team may be ${Math.abs(staffingGap)} person(s) over-staffed for current workload`);
  } else {
    recommendations.push('Team size is optimally aligned with current workload');
  }

  if (capacityStatus === 'Critical') {
    recommendations.push('URGENT: Team is severely over-capacity - quality and burnout risks are high');
  } else if (capacityStatus === 'Over-capacity') {
    recommendations.push('Team is over-capacity - prioritize hiring or workload reduction');
  } else if (capacityStatus === 'Under-utilized') {
    recommendations.push('Team has excess capacity - consider taking on more work or consolidating');
  }

  if (potentialSavings > 0) {
    recommendations.push(`Potential monthly savings of ${formatCurrency(potentialSavings)} from ${savingsSource.toLowerCase()}`);
  }

  if (avgHourlyRate > 0 && overtimeHours > 0) {
    recommendations.push(`Current overtime costs ${formatCurrency(overtimeCost)}/week - ${formatCurrency(overtimeCost * 4)}/month`);
  }

  // Build summary
  const summary = `Team of ${teamSize} is at ${formatPercentage(currentUtilization)} utilization (${capacityStatus}). ${staffingGap === 0 ? 'Staffing is optimal.' : staffingGap > 0 ? `Recommend adding ${staffingGap} team member(s).` : `Team may be over-staffed by ${Math.abs(staffingGap)}.`}${potentialSavings > 0 ? ` Potential savings: ${formatCurrency(potentialSavings)}/month.` : ''}`;

  return {
    outputs: [
      {
        id: 'currentUtilization',
        label: 'Current Utilization',
        value: currentUtilization,
        format: 'percentage',
        trend: currentUtilization >= 70 && currentUtilization <= 90 ? 'positive' : currentUtilization < 60 || currentUtilization > 100 ? 'negative' : 'neutral',
        highlight: true,
        description: 'Workload vs. capacity',
      },
      {
        id: 'capacityStatus',
        label: 'Capacity Status',
        value: capacityStatus,
        format: 'text',
        trend: capacityStatus === 'Optimal' ? 'positive' : capacityStatus === 'Critical' ? 'negative' : 'neutral',
        highlight: true,
        description: 'Overall workforce health',
      },
      {
        id: 'staffingRecommendation',
        label: 'Staffing Recommendation',
        value: staffingGap === 0 ? 'No change' : staffingGap > 0 ? `Add ${staffingGap}` : `Reduce ${Math.abs(staffingGap)}`,
        format: 'text',
        trend: staffingGap === 0 ? 'positive' : 'neutral',
        highlight: true,
        description: 'To reach target utilization',
      },
      {
        id: 'optimalTeamSize',
        label: 'Optimal Team Size',
        value: optimalTeamSize,
        format: 'number',
        trend: 'neutral',
        description: `For ${formatPercentage(targetUtilization * 100)} utilization`,
      },
      {
        id: 'overtimeHours',
        label: 'Weekly Overtime',
        value: overtimeHours,
        format: 'number',
        trend: overtimeHours === 0 ? 'positive' : 'negative',
        description: 'Hours beyond regular capacity',
      },
      {
        id: 'totalLaborCost',
        label: 'Weekly Labor Cost',
        value: totalLaborCost || 'N/A',
        format: avgHourlyRate > 0 ? 'currency' : 'text',
        trend: 'neutral',
        description: 'Including overtime premium',
      },
    ],
    confidence,
    confidenceLevel,
    chart: {
      labels: projectionLabels,
      datasets: [
        {
          label: 'Current Utilization',
          data: currentTrajectory,
          color: currentUtilization > 100 ? '#ef4444' : '#22d3ee', // red if over, cyan otherwise
          type: 'line',
        },
        {
          label: 'Target Utilization',
          data: optimizedTrajectory,
          color: '#10b981', // emerald
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
