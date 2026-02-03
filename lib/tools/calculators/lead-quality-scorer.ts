// Lead Quality Scorer - Score and qualify sales leads
import { ToolResult } from '../types';
import { calculateInputConfidence, getConfidenceLevel, formatCurrency } from '../utils';

export function executeLeadQualityScorer(
  inputs: Record<string, string | number>
): ToolResult {
  const companySize = String(inputs.companySize) || 'small';
  const annualRevenue = Number(inputs.annualRevenue) || 0;
  const industryFit = Number(inputs.industryFit) || 5;
  const budgetConfirmed = String(inputs.budgetConfirmed) === 'yes';
  const decisionMakerAccess = String(inputs.decisionMakerAccess) === 'yes';
  const timelineMonths = Number(inputs.timelineMonths) || 6;
  const engagementLevel = Number(inputs.engagementLevel) || 5;
  const competitorUsing = String(inputs.competitorUsing) || 'unknown';

  const decisionTrail: string[] = [];
  decisionTrail.push('Starting lead qualification scoring...');

  // Company size score (0-20)
  const sizeScores: Record<string, number> = {
    'startup': 10,
    'small': 12,
    'medium': 18,
    'large': 20,
    'enterprise': 20,
  };
  const sizeScore = sizeScores[companySize] || 10;
  decisionTrail.push(`Company size (${companySize}): ${sizeScore}/20`);

  // Revenue score (0-20)
  let revenueScore = 0;
  if (annualRevenue >= 10000000) revenueScore = 20;
  else if (annualRevenue >= 5000000) revenueScore = 18;
  else if (annualRevenue >= 1000000) revenueScore = 15;
  else if (annualRevenue >= 500000) revenueScore = 12;
  else if (annualRevenue >= 100000) revenueScore = 8;
  else revenueScore = 5;
  decisionTrail.push(`Revenue (${formatCurrency(annualRevenue)}): ${revenueScore}/20`);

  // Industry fit score (0-15)
  const industryScore = Math.min(15, industryFit * 1.5);
  decisionTrail.push(`Industry fit: ${industryScore.toFixed(0)}/15`);

  // BANT scoring
  // Budget (0-15)
  const budgetScore = budgetConfirmed ? 15 : 5;
  decisionTrail.push(`Budget confirmed: ${budgetScore}/15`);

  // Authority (0-10)
  const authorityScore = decisionMakerAccess ? 10 : 3;
  decisionTrail.push(`Decision maker access: ${authorityScore}/10`);

  // Timeline (0-10)
  let timelineScore = 0;
  if (timelineMonths <= 1) timelineScore = 10;
  else if (timelineMonths <= 3) timelineScore = 8;
  else if (timelineMonths <= 6) timelineScore = 6;
  else if (timelineMonths <= 12) timelineScore = 4;
  else timelineScore = 2;
  decisionTrail.push(`Timeline (${timelineMonths} months): ${timelineScore}/10`);

  // Engagement level (0-10)
  const engagementScore = Math.min(10, engagementLevel);
  decisionTrail.push(`Engagement level: ${engagementScore}/10`);

  // Competitor analysis bonus/penalty
  let competitorModifier = 0;
  if (competitorUsing === 'competitor') {
    competitorModifier = -5; // Already using competitor
    decisionTrail.push('Using competitor: -5 penalty');
  } else if (competitorUsing === 'none') {
    competitorModifier = 5; // Green field opportunity
    decisionTrail.push('No current solution: +5 bonus');
  }

  // Calculate total score
  const rawScore = sizeScore + revenueScore + industryScore + budgetScore +
                   authorityScore + timelineScore + engagementScore + competitorModifier;
  const leadScore = Math.max(0, Math.min(100, rawScore));
  decisionTrail.push(`Total lead score: ${leadScore}/100`);

  // Determine lead grade
  let grade: string;
  let gradeDescription: string;
  let priority: string;
  if (leadScore >= 85) {
    grade = 'A';
    gradeDescription = 'Hot Lead';
    priority = 'Immediate';
  } else if (leadScore >= 70) {
    grade = 'B';
    gradeDescription = 'Qualified Lead';
    priority = 'High';
  } else if (leadScore >= 55) {
    grade = 'C';
    gradeDescription = 'Nurture Lead';
    priority = 'Medium';
  } else if (leadScore >= 40) {
    grade = 'D';
    gradeDescription = 'Developing Lead';
    priority = 'Low';
  } else {
    grade = 'F';
    gradeDescription = 'Unqualified';
    priority = 'Disqualify';
  }
  decisionTrail.push(`Grade: ${grade} (${gradeDescription})`);

  // Estimate deal value
  const dealMultiplier = {
    'startup': 10000,
    'small': 25000,
    'medium': 75000,
    'large': 150000,
    'enterprise': 300000,
  };
  const estimatedDealValue = dealMultiplier[companySize as keyof typeof dealMultiplier] || 25000;

  // Win probability based on score
  const winProbability = Math.min(0.9, leadScore / 100 * 0.8 + 0.1);
  const expectedValue = estimatedDealValue * winProbability;
  decisionTrail.push(`Expected value: ${formatCurrency(expectedValue)}`);

  // Generate recommendations
  const recommendations: string[] = [];

  if (!budgetConfirmed) {
    recommendations.push('Qualify budget in next conversation - critical for progression');
  }
  if (!decisionMakerAccess) {
    recommendations.push('Request introduction to economic buyer or decision maker');
  }
  if (timelineMonths > 6) {
    recommendations.push('Add to nurture campaign - long timeline indicates early stage');
  }
  if (engagementLevel < 5) {
    recommendations.push('Increase engagement through relevant case studies or demos');
  }
  if (competitorUsing === 'competitor') {
    recommendations.push('Prepare competitive displacement strategy and ROI comparison');
  }
  if (industryFit < 7) {
    recommendations.push('Validate use case fit - may need custom solution scoping');
  }
  if (leadScore >= 70) {
    recommendations.push('Schedule discovery call within 48 hours');
  }
  if (leadScore >= 85) {
    recommendations.push('Assign senior AE - high probability deal');
  }

  // Confidence calculation
  const confidence = calculateInputConfidence(inputs, ['annualRevenue', 'timelineMonths', 'engagementLevel', 'competitorUsing']);

  // Score breakdown for chart
  const scoreBreakdown = [
    { label: 'Company', score: sizeScore, max: 20 },
    { label: 'Revenue', score: revenueScore, max: 20 },
    { label: 'Industry', score: industryScore, max: 15 },
    { label: 'Budget', score: budgetScore, max: 15 },
    { label: 'Authority', score: authorityScore, max: 10 },
    { label: 'Timeline', score: timelineScore, max: 10 },
  ];

  return {
    summary: `Lead scored ${leadScore}/100 (Grade ${grade}: ${gradeDescription}). Priority: ${priority}. Expected deal value: ${formatCurrency(expectedValue)}.`,
    confidence,
    confidenceLevel: getConfidenceLevel(confidence),
    outputs: [
      {
        id: 'leadScore',
        label: 'Lead Score',
        value: leadScore,
        format: 'number',
        highlight: true,
        description: 'Overall lead quality score out of 100',
      },
      {
        id: 'grade',
        label: 'Grade',
        value: `${grade} - ${gradeDescription}`,
        format: 'text',
        trend: leadScore >= 70 ? 'positive' : leadScore >= 50 ? 'neutral' : 'negative',
      },
      {
        id: 'priority',
        label: 'Priority',
        value: priority,
        format: 'text',
      },
      {
        id: 'winProbability',
        label: 'Win Probability',
        value: winProbability * 100,
        format: 'percentage',
        trend: winProbability >= 0.5 ? 'positive' : 'neutral',
      },
      {
        id: 'estimatedDealValue',
        label: 'Estimated Deal Value',
        value: estimatedDealValue,
        format: 'currency',
      },
      {
        id: 'expectedValue',
        label: 'Expected Value',
        value: expectedValue,
        format: 'currency',
        highlight: true,
      },
    ],
    recommendations,
    decisionTrail,
    chart: {
      labels: scoreBreakdown.map(s => s.label),
      datasets: [
        {
          label: 'Score',
          data: scoreBreakdown.map(s => s.score),
          type: 'bar',
          color: '#22d3ee',
        },
        {
          label: 'Max',
          data: scoreBreakdown.map(s => s.max),
          type: 'line',
          color: '#64748b',
        },
      ],
    },
    timestamp: new Date().toISOString(),
  };
}
