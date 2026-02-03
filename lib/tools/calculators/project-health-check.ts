// Project Health Check - Assess project status and identify risks
import { ToolResult } from '../types';
import { calculateInputConfidence, getConfidenceLevel, formatCurrency } from '../utils';

export function executeProjectHealthCheck(
  inputs: Record<string, string | number>
): ToolResult {
  const projectName = String(inputs.projectName) || 'Project';
  const percentComplete = Number(inputs.percentComplete) || 0;
  const daysElapsed = Number(inputs.daysElapsed) || 0;
  const totalDays = Number(inputs.totalDays) || 90;
  const budgetSpent = Number(inputs.budgetSpent) || 0;
  const totalBudget = Number(inputs.totalBudget) || 100000;
  const openIssues = Number(inputs.openIssues) || 0;
  const criticalIssues = Number(inputs.criticalIssues) || 0;
  const scopeChanges = Number(inputs.scopeChanges) || 0;
  const teamMorale = Number(inputs.teamMorale) || 7;

  const decisionTrail: string[] = [];
  decisionTrail.push(`Analyzing project: ${projectName}`);

  // Calculate schedule health
  const expectedProgress = (daysElapsed / totalDays) * 100;
  const scheduleVariance = percentComplete - expectedProgress;
  const scheduleHealth = Math.min(100, Math.max(0, 50 + scheduleVariance * 2));

  let scheduleStatus: string;
  if (scheduleVariance >= 5) {
    scheduleStatus = 'Ahead';
  } else if (scheduleVariance >= -5) {
    scheduleStatus = 'On Track';
  } else if (scheduleVariance >= -15) {
    scheduleStatus = 'Behind';
  } else {
    scheduleStatus = 'Critical';
  }
  decisionTrail.push(`Schedule: ${scheduleStatus} (${scheduleVariance > 0 ? '+' : ''}${scheduleVariance.toFixed(1)}%)`);

  // Calculate budget health
  const expectedBudgetUsed = (percentComplete / 100) * totalBudget;
  const budgetVariance = expectedBudgetUsed - budgetSpent;
  const budgetHealth = Math.min(100, Math.max(0, 50 + (budgetVariance / totalBudget) * 100));

  let budgetStatus: string;
  if (budgetVariance >= totalBudget * 0.1) {
    budgetStatus = 'Under Budget';
  } else if (budgetVariance >= 0) {
    budgetStatus = 'On Budget';
  } else if (budgetVariance >= -totalBudget * 0.15) {
    budgetStatus = 'Over Budget';
  } else {
    budgetStatus = 'Critical';
  }
  decisionTrail.push(`Budget: ${budgetStatus} (${formatCurrency(budgetVariance)})`);

  // Calculate issue health
  const issueImpact = (openIssues * 2) + (criticalIssues * 10);
  const issueHealth = Math.max(0, 100 - issueImpact);
  decisionTrail.push(`Issues: ${openIssues} open, ${criticalIssues} critical (health: ${issueHealth})`);

  // Scope stability
  const scopeHealth = Math.max(0, 100 - (scopeChanges * 15));
  decisionTrail.push(`Scope changes: ${scopeChanges} (stability: ${scopeHealth})`);

  // Team health
  const teamHealth = teamMorale * 10;
  decisionTrail.push(`Team morale: ${teamMorale}/10`);

  // Calculate overall project health
  const weights = {
    schedule: 0.30,
    budget: 0.25,
    issues: 0.20,
    scope: 0.15,
    team: 0.10,
  };

  const overallHealth = Math.round(
    scheduleHealth * weights.schedule +
    budgetHealth * weights.budget +
    issueHealth * weights.issues +
    scopeHealth * weights.scope +
    teamHealth * weights.team
  );
  decisionTrail.push(`Overall health score: ${overallHealth}/100`);

  // Determine project status
  let projectStatus: string;
  let statusColor: string;
  if (overallHealth >= 80) {
    projectStatus = 'Healthy';
    statusColor = '#10b981';
  } else if (overallHealth >= 65) {
    projectStatus = 'At Risk';
    statusColor = '#f59e0b';
  } else if (overallHealth >= 50) {
    projectStatus = 'Troubled';
    statusColor = '#f97316';
  } else {
    projectStatus = 'Critical';
    statusColor = '#ef4444';
  }
  decisionTrail.push(`Project status: ${projectStatus}`);

  // Calculate projected completion
  // Handle edge case: if no progress yet, use linear projection based on time elapsed
  // Floor velocity at 0.01 to prevent extreme projections (max 100x overrun)
  const velocityRatio = percentComplete > 0 && expectedProgress > 0
    ? Math.max(0.01, percentComplete / expectedProgress)
    : 1; // Default to 1:1 velocity when no data
  const projectedDays = totalDays / velocityRatio;
  const daysRemaining = totalDays - daysElapsed;
  const projectedOverrun = projectedDays - totalDays;

  // Calculate projected budget at completion
  // Handle edge case: if no progress yet, project based on budget vs time ratio
  const costPerPercent = percentComplete > 0
    ? budgetSpent / percentComplete
    : (daysElapsed > 0 ? (budgetSpent / (daysElapsed / totalDays)) / 100 : totalBudget / 100);
  const projectedTotalCost = costPerPercent * 100;
  const projectedBudgetOverrun = projectedTotalCost - totalBudget;

  // Generate recommendations
  const recommendations: string[] = [];

  if (scheduleStatus === 'Critical' || scheduleStatus === 'Behind') {
    recommendations.push('Evaluate scope reduction or resource augmentation to recover schedule');
  }
  if (budgetStatus === 'Critical' || budgetStatus === 'Over Budget') {
    recommendations.push('Conduct budget review and identify cost reduction opportunities');
  }
  if (criticalIssues > 0) {
    recommendations.push(`Immediate: Resolve ${criticalIssues} critical issue(s) - blocking project success`);
  }
  if (openIssues > 5) {
    recommendations.push('Schedule issue triage meeting to prioritize and assign blockers');
  }
  if (scopeChanges >= 3) {
    recommendations.push('Implement change control board to manage scope creep');
  }
  if (teamMorale < 6) {
    recommendations.push('Address team concerns - low morale impacts productivity and quality');
  }
  if (projectedOverrun > 7) {
    recommendations.push(`Warning: Projected ${Math.round(projectedOverrun)} day schedule overrun`);
  }
  if (projectedBudgetOverrun > totalBudget * 0.1) {
    recommendations.push(`Warning: Projected ${formatCurrency(projectedBudgetOverrun)} budget overrun`);
  }
  if (overallHealth >= 80) {
    recommendations.push('Project is healthy - maintain current practices');
  }

  // Confidence calculation
  const confidence = calculateInputConfidence(inputs, ['openIssues', 'criticalIssues', 'scopeChanges', 'teamMorale']);

  // Generate trend data
  const progressPoints = 5;
  const progressLabels = Array.from({ length: progressPoints + 1 }, (_, i) =>
    `${Math.round((i / progressPoints) * 100)}%`
  );

  return {
    summary: `${projectName} is ${projectStatus} with ${overallHealth}/100 health score. ${percentComplete}% complete, ${daysRemaining} days remaining. ${scheduleStatus} on schedule, ${budgetStatus}.`,
    confidence,
    confidenceLevel: getConfidenceLevel(confidence),
    outputs: [
      {
        id: 'healthScore',
        label: 'Health Score',
        value: overallHealth,
        format: 'number',
        highlight: true,
        description: 'Project health out of 100',
      },
      {
        id: 'status',
        label: 'Status',
        value: projectStatus,
        format: 'text',
        trend: overallHealth >= 65 ? 'positive' : 'negative',
      },
      {
        id: 'progress',
        label: 'Progress',
        value: percentComplete,
        format: 'percentage',
      },
      {
        id: 'schedule',
        label: 'Schedule',
        value: scheduleStatus,
        format: 'text',
        trend: scheduleVariance >= -5 ? 'positive' : 'negative',
      },
      {
        id: 'budgetUsed',
        label: 'Budget Used',
        value: budgetSpent,
        format: 'currency',
      },
      {
        id: 'projectedCost',
        label: 'Projected Cost',
        value: projectedTotalCost,
        format: 'currency',
        trend: projectedTotalCost <= totalBudget ? 'positive' : 'negative',
        highlight: true,
      },
    ],
    recommendations,
    decisionTrail,
    chart: {
      labels: ['Schedule', 'Budget', 'Issues', 'Scope', 'Team'],
      datasets: [
        {
          label: 'Health Score',
          data: [scheduleHealth, budgetHealth, issueHealth, scopeHealth, teamHealth],
          type: 'bar',
          color: statusColor,
        },
        {
          label: 'Target (70)',
          data: [70, 70, 70, 70, 70],
          type: 'line',
          color: '#64748b',
        },
      ],
    },
    timestamp: new Date().toISOString(),
  };
}
