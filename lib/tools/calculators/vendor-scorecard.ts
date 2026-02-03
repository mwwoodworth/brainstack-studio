// Vendor Scorecard - Evaluate and rank vendor performance
import { ToolResult } from '../types';
import { calculateInputConfidence, getConfidenceLevel, formatCurrency } from '../utils';

export function executeVendorScorecard(
  inputs: Record<string, string | number>
): ToolResult {
  const vendorName = String(inputs.vendorName) || 'Vendor';
  const qualityScore = Number(inputs.qualityScore) || 5;
  const deliveryOnTime = Number(inputs.deliveryOnTime) || 80;
  const priceCompetitiveness = Number(inputs.priceCompetitiveness) || 5;
  const responsiveness = Number(inputs.responsiveness) || 5;
  const complianceScore = Number(inputs.complianceScore) || 5;
  const annualSpend = Number(inputs.annualSpend) || 0;
  const contractLength = Number(inputs.contractLength) || 12;
  const issuesReported = Number(inputs.issuesReported) || 0;

  const decisionTrail: string[] = [];
  decisionTrail.push(`Evaluating vendor: ${vendorName}`);

  // Calculate weighted scores (each normalized to 0-100)
  const weights = {
    quality: 0.25,
    delivery: 0.20,
    price: 0.15,
    responsiveness: 0.15,
    compliance: 0.15,
    issues: 0.10,
  };

  // Quality (1-10 → 0-100)
  const qualityNorm = qualityScore * 10;
  decisionTrail.push(`Quality score: ${qualityNorm}/100 (weight: ${weights.quality * 100}%)`);

  // Delivery (already percentage)
  const deliveryNorm = Math.min(100, deliveryOnTime);
  decisionTrail.push(`On-time delivery: ${deliveryNorm}% (weight: ${weights.delivery * 100}%)`);

  // Price competitiveness (1-10 → 0-100)
  const priceNorm = priceCompetitiveness * 10;
  decisionTrail.push(`Price competitiveness: ${priceNorm}/100 (weight: ${weights.price * 100}%)`);

  // Responsiveness (1-10 → 0-100)
  const responseNorm = responsiveness * 10;
  decisionTrail.push(`Responsiveness: ${responseNorm}/100 (weight: ${weights.responsiveness * 100}%)`);

  // Compliance (1-10 → 0-100)
  const complianceNorm = complianceScore * 10;
  decisionTrail.push(`Compliance: ${complianceNorm}/100 (weight: ${weights.compliance * 100}%)`);

  // Issues (inverse - fewer is better)
  const issuesPenalty = Math.min(100, issuesReported * 10);
  const issuesNorm = Math.max(0, 100 - issuesPenalty);
  decisionTrail.push(`Issues impact: ${issuesNorm}/100 (${issuesReported} issues reported)`);

  // Calculate overall score
  const overallScore = Math.round(
    qualityNorm * weights.quality +
    deliveryNorm * weights.delivery +
    priceNorm * weights.price +
    responseNorm * weights.responsiveness +
    complianceNorm * weights.compliance +
    issuesNorm * weights.issues
  );
  decisionTrail.push(`Overall vendor score: ${overallScore}/100`);

  // Determine vendor tier
  let tier: string;
  let tierDescription: string;
  let recommendation: string;
  if (overallScore >= 90) {
    tier = 'Strategic Partner';
    tierDescription = 'Exceptional performance';
    recommendation = 'Expand relationship';
  } else if (overallScore >= 75) {
    tier = 'Preferred Vendor';
    tierDescription = 'Strong performer';
    recommendation = 'Maintain relationship';
  } else if (overallScore >= 60) {
    tier = 'Approved Vendor';
    tierDescription = 'Meets requirements';
    recommendation = 'Monitor performance';
  } else if (overallScore >= 45) {
    tier = 'Conditional';
    tierDescription = 'Improvement needed';
    recommendation = 'Performance improvement plan';
  } else {
    tier = 'At Risk';
    tierDescription = 'Below standards';
    recommendation = 'Consider replacement';
  }
  decisionTrail.push(`Tier classification: ${tier}`);

  // Calculate risk-adjusted value
  const riskFactor = overallScore / 100;
  const effectiveValue = annualSpend * riskFactor;
  const valueAtRisk = annualSpend - effectiveValue;

  // Identify strengths and weaknesses
  const scores = [
    { name: 'Quality', score: qualityNorm },
    { name: 'Delivery', score: deliveryNorm },
    { name: 'Price', score: priceNorm },
    { name: 'Responsiveness', score: responseNorm },
    { name: 'Compliance', score: complianceNorm },
    { name: 'Issue Management', score: issuesNorm },
  ].sort((a, b) => b.score - a.score);

  const strengths = scores.slice(0, 2).map(s => s.name);
  const weaknesses = scores.slice(-2).map(s => s.name);
  decisionTrail.push(`Strengths: ${strengths.join(', ')}`);
  decisionTrail.push(`Areas for improvement: ${weaknesses.join(', ')}`);

  // Generate recommendations
  const recommendations: string[] = [];
  recommendations.push(`${recommendation} - ${tierDescription}`);

  if (qualityNorm < 70) {
    recommendations.push('Implement quality audits and establish clearer quality standards');
  }
  if (deliveryNorm < 85) {
    recommendations.push('Review delivery processes and establish penalties for late delivery');
  }
  if (responseNorm < 70) {
    recommendations.push('Establish SLAs for response times and escalation procedures');
  }
  if (complianceNorm < 80) {
    recommendations.push('Conduct compliance audit and update vendor agreement requirements');
  }
  if (issuesReported >= 5) {
    recommendations.push('Schedule root cause analysis meeting to address recurring issues');
  }
  if (contractLength <= 3 && overallScore < 70) {
    recommendations.push('Begin vendor replacement evaluation before contract renewal');
  }
  if (annualSpend > 100000 && overallScore >= 80) {
    recommendations.push('Explore volume discount or strategic partnership agreement');
  }

  // Confidence calculation
  const confidence = calculateInputConfidence(inputs, ['priceCompetitiveness', 'annualSpend', 'contractLength', 'issuesReported']);

  return {
    summary: `${vendorName} scored ${overallScore}/100 (${tier}). ${tierDescription}. Strengths: ${strengths.join(', ')}. Annual spend: ${formatCurrency(annualSpend)}.`,
    confidence,
    confidenceLevel: getConfidenceLevel(confidence),
    outputs: [
      {
        id: 'overallScore',
        label: 'Overall Score',
        value: overallScore,
        format: 'number',
        highlight: true,
        description: 'Vendor score out of 100',
      },
      {
        id: 'vendorTier',
        label: 'Vendor Tier',
        value: tier,
        format: 'text',
        trend: overallScore >= 75 ? 'positive' : overallScore >= 60 ? 'neutral' : 'negative',
      },
      {
        id: 'annualSpend',
        label: 'Annual Spend',
        value: annualSpend,
        format: 'currency',
      },
      {
        id: 'valueAtRisk',
        label: 'Value at Risk',
        value: valueAtRisk,
        format: 'currency',
        trend: valueAtRisk < annualSpend * 0.2 ? 'positive' : 'negative',
      },
      {
        id: 'topStrength',
        label: 'Top Strength',
        value: strengths[0],
        format: 'text',
      },
      {
        id: 'keyWeakness',
        label: 'Key Weakness',
        value: weaknesses[0],
        format: 'text',
      },
    ],
    recommendations,
    decisionTrail,
    chart: {
      labels: ['Quality', 'Delivery', 'Price', 'Response', 'Compliance', 'Issues'],
      datasets: [
        {
          label: 'Vendor Score',
          data: [qualityNorm, deliveryNorm, priceNorm, responseNorm, complianceNorm, issuesNorm],
          type: 'bar',
          color: overallScore >= 75 ? '#10b981' : overallScore >= 60 ? '#f59e0b' : '#ef4444',
        },
        {
          label: 'Target (80)',
          data: [80, 80, 80, 80, 80, 80],
          type: 'line',
          color: '#64748b',
        },
      ],
    },
    timestamp: new Date().toISOString(),
  };
}
