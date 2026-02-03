// Customer Health Scorer - Analyze customer engagement and predict churn risk
import { ToolResult } from '../types';
import { calculateInputConfidence, getConfidenceLevel } from '../utils';

export function executeCustomerHealthScorer(
  inputs: Record<string, string | number>
): ToolResult {
  const monthlyActiveUsers = Number(inputs.monthlyActiveUsers) || 0;
  const supportTickets = Number(inputs.supportTickets) || 0;
  const featureAdoption = Number(inputs.featureAdoption) || 5;
  const daysToRenewal = Number(inputs.daysToRenewal) || 90;
  const npsScore = inputs.npsScore !== undefined && inputs.npsScore !== '' ? Number(inputs.npsScore) : null;
  const contractValue = Number(inputs.contractValue) || 0;

  const decisionTrail: string[] = [];
  decisionTrail.push(`Starting health analysis with ${monthlyActiveUsers}% MAU`);

  // Calculate component scores (each 0-100)
  // Engagement score (based on MAU)
  const engagementScore = Math.min(100, monthlyActiveUsers * 1.25);
  decisionTrail.push(`Engagement score: ${engagementScore.toFixed(0)} (MAU × 1.25)`);

  // Support score (inverse - fewer tickets = better)
  const supportScore = Math.max(0, 100 - (supportTickets * 10));
  decisionTrail.push(`Support score: ${supportScore.toFixed(0)} (100 - tickets×10)`);

  // Adoption score
  const adoptionScore = featureAdoption * 10;
  decisionTrail.push(`Adoption score: ${adoptionScore.toFixed(0)} (feature adoption × 10)`);

  // Renewal urgency factor
  let renewalFactor = 1.0;
  if (daysToRenewal < 30) {
    renewalFactor = 1.2; // More critical
    decisionTrail.push('Renewal within 30 days - increased urgency factor');
  } else if (daysToRenewal < 60) {
    renewalFactor = 1.1;
    decisionTrail.push('Renewal within 60 days - moderate urgency');
  }

  // NPS contribution
  let npsContribution = 50; // Neutral if not provided
  if (npsScore !== null) {
    npsContribution = (npsScore + 100) / 2; // Convert -100 to 100 → 0 to 100
    decisionTrail.push(`NPS contribution: ${npsContribution.toFixed(0)} (normalized from ${npsScore})`);
  }

  // Calculate weighted health score
  const weights = {
    engagement: 0.30,
    support: 0.20,
    adoption: 0.25,
    nps: 0.25,
  };

  const rawScore = (
    engagementScore * weights.engagement +
    supportScore * weights.support +
    adoptionScore * weights.adoption +
    npsContribution * weights.nps
  ) * renewalFactor;

  const healthScore = Math.min(100, Math.round(rawScore));
  decisionTrail.push(`Weighted health score: ${healthScore}`);

  // Determine risk level
  let riskLevel: string;
  let riskColor: string;
  if (healthScore >= 80) {
    riskLevel = 'Low';
    riskColor = 'text-emerald-400';
  } else if (healthScore >= 60) {
    riskLevel = 'Medium';
    riskColor = 'text-amber-400';
  } else if (healthScore >= 40) {
    riskLevel = 'High';
    riskColor = 'text-orange-400';
  } else {
    riskLevel = 'Critical';
    riskColor = 'text-red-400';
  }
  decisionTrail.push(`Risk classification: ${riskLevel}`);

  // Identify top contributing factors
  const factors = [
    { name: 'User Engagement', score: engagementScore, weight: weights.engagement },
    { name: 'Support Health', score: supportScore, weight: weights.support },
    { name: 'Feature Adoption', score: adoptionScore, weight: weights.adoption },
    { name: 'Customer Sentiment', score: npsContribution, weight: weights.nps },
  ].sort((a, b) => (a.score * a.weight) - (b.score * b.weight));

  const weakestFactors = factors.slice(0, 2).map(f => f.name);
  decisionTrail.push(`Weakest areas: ${weakestFactors.join(', ')}`);

  // Generate recommendations
  const recommendations: string[] = [];

  if (engagementScore < 60) {
    recommendations.push('Schedule a check-in call to understand usage barriers');
  }
  if (supportScore < 60) {
    recommendations.push('Review support tickets for systemic issues - consider proactive outreach');
  }
  if (adoptionScore < 60) {
    recommendations.push('Offer training session on underutilized features');
  }
  if (npsScore !== null && npsScore < 30) {
    recommendations.push('Conduct customer feedback interview to address concerns');
  }
  if (daysToRenewal < 60 && healthScore < 70) {
    recommendations.push('Urgent: Executive sponsor engagement needed before renewal');
  }
  if (contractValue > 50000 && healthScore < 60) {
    recommendations.push('High-value account at risk - escalate to CS leadership');
  }
  if (recommendations.length === 0) {
    recommendations.push('Account is healthy - maintain regular touchpoints');
    recommendations.push('Consider expansion opportunities based on strong engagement');
  }

  // Calculate revenue at risk
  const churnProbability = Math.max(0, (100 - healthScore) / 100);
  const revenueAtRisk = contractValue * churnProbability;

  // Confidence calculation
  const confidence = calculateInputConfidence(inputs, ['npsScore', 'contractValue', 'daysToRenewal']);

  // Generate trend data for chart (simulated 6-month trend)
  const months = ['6mo ago', '5mo ago', '4mo ago', '3mo ago', '2mo ago', '1mo ago', 'Now'];
  // Ensure healthScore is valid (protect against NaN propagation)
  const safeHealthScore = Number.isFinite(healthScore) ? healthScore : 50;
  const trendVariance = safeHealthScore > 70 ? 5 : safeHealthScore > 50 ? 10 : 15;
  const healthTrend = months.map((_, i) => {
    const baseScore = safeHealthScore - (6 - i) * 2;
    return Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * trendVariance));
  });

  return {
    summary: `Customer health score is ${healthScore}/100 with ${riskLevel} risk. ${weakestFactors[0]} is the primary area for improvement.`,
    confidence,
    confidenceLevel: getConfidenceLevel(confidence),
    outputs: [
      {
        id: 'healthScore',
        label: 'Health Score',
        value: healthScore,
        format: 'number',
        highlight: true,
        description: 'Overall customer health score out of 100',
      },
      {
        id: 'riskLevel',
        label: 'Risk Level',
        value: riskLevel,
        format: 'text',
        trend: healthScore >= 70 ? 'positive' : healthScore >= 50 ? 'neutral' : 'negative',
      },
      {
        id: 'churnProbability',
        label: 'Churn Probability',
        value: churnProbability * 100,
        format: 'percentage',
        trend: churnProbability < 0.2 ? 'positive' : churnProbability < 0.4 ? 'neutral' : 'negative',
      },
      {
        id: 'revenueAtRisk',
        label: 'Revenue at Risk',
        value: revenueAtRisk,
        format: 'currency',
        trend: 'negative',
      },
      {
        id: 'daysToRenewal',
        label: 'Days to Renewal',
        value: daysToRenewal,
        format: 'number',
        description: 'Days until contract renewal',
      },
      {
        id: 'primaryWeakness',
        label: 'Primary Weakness',
        value: weakestFactors[0],
        format: 'text',
      },
    ],
    recommendations,
    decisionTrail,
    chart: {
      labels: months,
      datasets: [
        {
          label: 'Health Score Trend',
          data: healthTrend,
          type: 'area',
          color: healthScore >= 70 ? '#10b981' : healthScore >= 50 ? '#f59e0b' : '#ef4444',
        },
      ],
    },
    timestamp: new Date().toISOString(),
  };
}
