// Risk Assessment Matrix - Evaluate and prioritize business risks
import { ToolResult } from '../types';
import { calculateInputConfidence, getConfidenceLevel, formatCurrency } from '../utils';

interface RiskItem {
  name: string;
  likelihood: number;
  impact: number;
  score: number;
  level: string;
  color: string;
}

export function executeRiskAssessmentMatrix(
  inputs: Record<string, string | number>
): ToolResult {
  // Parse risk inputs (up to 5 risks)
  const risks: RiskItem[] = [];
  const decisionTrail: string[] = [];
  decisionTrail.push('Analyzing submitted risks...');

  for (let i = 1; i <= 5; i++) {
    const name = String(inputs[`risk${i}Name`] || '').trim();
    const likelihood = Number(inputs[`risk${i}Likelihood`]) || 0;
    const impact = Number(inputs[`risk${i}Impact`]) || 0;

    if (name && likelihood > 0 && impact > 0) {
      const score = likelihood * impact;
      let level: string;
      let color: string;

      if (score >= 20) {
        level = 'Critical';
        color = '#ef4444';
      } else if (score >= 12) {
        level = 'High';
        color = '#f97316';
      } else if (score >= 6) {
        level = 'Medium';
        color = '#eab308';
      } else {
        level = 'Low';
        color = '#22c55e';
      }

      risks.push({ name, likelihood, impact, score, level, color });
      decisionTrail.push(`${name}: L${likelihood} × I${impact} = ${score} (${level})`);
    }
  }

  if (risks.length === 0) {
    return {
      summary: 'No risks provided. Please enter at least one risk with likelihood and impact ratings.',
      confidence: 0,
      confidenceLevel: 'low',
      outputs: [],
      recommendations: ['Enter risk details to generate assessment'],
      decisionTrail: ['No valid risk data provided'],
      timestamp: new Date().toISOString(),
    };
  }

  // Sort risks by score (highest first)
  risks.sort((a, b) => b.score - a.score);
  decisionTrail.push(`Prioritized ${risks.length} risks by score`);

  // Calculate aggregate metrics
  const totalRiskScore = risks.reduce((sum, r) => sum + r.score, 0);
  const avgRiskScore = totalRiskScore / risks.length;
  const criticalCount = risks.filter(r => r.level === 'Critical').length;
  const highCount = risks.filter(r => r.level === 'High').length;

  // Determine overall risk posture
  let riskPosture: string;
  let postureColor: string;
  if (criticalCount >= 2 || totalRiskScore > 60) {
    riskPosture = 'Critical';
    postureColor = '#ef4444';
  } else if (criticalCount >= 1 || highCount >= 2 || totalRiskScore > 40) {
    riskPosture = 'Elevated';
    postureColor = '#f97316';
  } else if (highCount >= 1 || totalRiskScore > 20) {
    riskPosture = 'Moderate';
    postureColor = '#eab308';
  } else {
    riskPosture = 'Acceptable';
    postureColor = '#22c55e';
  }
  decisionTrail.push(`Overall risk posture: ${riskPosture}`);

  // Estimate potential financial exposure
  const baseExposure = Number(inputs.potentialExposure) || 100000;
  const adjustedExposure = baseExposure * (totalRiskScore / 25);
  decisionTrail.push(`Estimated exposure: ${formatCurrency(adjustedExposure)}`);

  // Generate recommendations
  const recommendations: string[] = [];

  const topRisk = risks[0];
  recommendations.push(`Priority: Address "${topRisk.name}" first (highest risk score: ${topRisk.score})`);

  if (criticalCount > 0) {
    recommendations.push('Immediate action required: Critical risks identified - escalate to leadership');
  }

  const highLikelihood = risks.filter(r => r.likelihood >= 4);
  if (highLikelihood.length > 0) {
    recommendations.push(`Implement preventive controls for: ${highLikelihood.map(r => r.name).join(', ')}`);
  }

  const highImpact = risks.filter(r => r.impact >= 4);
  if (highImpact.length > 0) {
    recommendations.push(`Develop contingency plans for: ${highImpact.map(r => r.name).join(', ')}`);
  }

  if (riskPosture === 'Critical' || riskPosture === 'Elevated') {
    recommendations.push('Schedule risk review meeting within 1 week');
    recommendations.push('Consider risk transfer options (insurance, contracts)');
  }

  if (risks.length < 5) {
    recommendations.push('Consider conducting comprehensive risk identification workshop');
  }

  // Confidence based on number of risks evaluated
  const confidence = calculateInputConfidence(inputs, ['risk2Name', 'risk2Likelihood', 'risk2Impact', 'risk3Name', 'risk3Likelihood', 'risk3Impact', 'potentialExposure']);

  // Prepare chart data (risk matrix visualization)
  const matrixLabels = risks.map(r => r.name.substring(0, 15));

  return {
    summary: `Analyzed ${risks.length} risks. Overall posture: ${riskPosture}. Top risk: "${topRisk.name}" (score: ${topRisk.score}/25). Total exposure estimate: ${formatCurrency(adjustedExposure)}.`,
    confidence,
    confidenceLevel: getConfidenceLevel(confidence),
    outputs: [
      {
        id: 'riskPosture',
        label: 'Risk Posture',
        value: riskPosture,
        format: 'text',
        highlight: true,
        trend: riskPosture === 'Acceptable' ? 'positive' : riskPosture === 'Moderate' ? 'neutral' : 'negative',
      },
      {
        id: 'totalRiskScore',
        label: 'Total Risk Score',
        value: totalRiskScore,
        format: 'number',
        description: `Out of ${risks.length * 25} possible`,
      },
      {
        id: 'avgRiskScore',
        label: 'Average Risk Score',
        value: avgRiskScore,
        format: 'number',
        description: 'Out of 25 possible per risk',
      },
      {
        id: 'criticalRisks',
        label: 'Critical Risks',
        value: criticalCount,
        format: 'number',
        trend: criticalCount === 0 ? 'positive' : 'negative',
      },
      {
        id: 'highRisks',
        label: 'High Risks',
        value: highCount,
        format: 'number',
        trend: highCount === 0 ? 'positive' : highCount <= 1 ? 'neutral' : 'negative',
      },
      {
        id: 'estimatedExposure',
        label: 'Estimated Exposure',
        value: adjustedExposure,
        format: 'currency',
        highlight: true,
      },
    ],
    recommendations,
    decisionTrail,
    chart: {
      labels: matrixLabels,
      datasets: [
        {
          label: 'Likelihood',
          data: risks.map(r => r.likelihood),
          type: 'bar',
          color: '#3b82f6',
        },
        {
          label: 'Impact',
          data: risks.map(r => r.impact),
          type: 'bar',
          color: '#8b5cf6',
        },
        {
          label: 'Risk Score',
          data: risks.map(r => r.score),
          type: 'line',
          color: '#ef4444',
        },
      ],
    },
    timestamp: new Date().toISOString(),
  };
}
