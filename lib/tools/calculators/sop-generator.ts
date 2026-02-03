// SOP Generator - Create formatted Standard Operating Procedures
import { ToolResult } from '../types';
import { calculateInputConfidence, getConfidenceLevel } from '../utils';

export function executeSOPGenerator(
  inputs: Record<string, string | number>
): ToolResult {
  const processName = String(inputs.processName || 'Untitled Process');
  const processPurpose = String(inputs.processPurpose || '');
  const owner = String(inputs.owner || 'Not Specified');
  const frequency = String(inputs.frequency || 'as-needed');
  const department = String(inputs.department || 'General');

  const decisionTrail: string[] = [];
  decisionTrail.push(`Generating SOP for: ${processName}`);

  // Parse steps (up to 10)
  const steps: { number: number; description: string; notes: string }[] = [];
  for (let i = 1; i <= 10; i++) {
    const stepText = String(inputs[`step${i}`] || '').trim();
    if (stepText) {
      steps.push({
        number: i,
        description: stepText,
        notes: String(inputs[`step${i}Notes`] || ''),
      });
    }
  }

  decisionTrail.push(`Parsed ${steps.length} process steps`);

  if (steps.length === 0) {
    return {
      summary: 'No steps provided. Please enter at least one process step to generate an SOP.',
      confidence: 0,
      confidenceLevel: 'low',
      outputs: [],
      recommendations: ['Enter at least 3-5 steps for a useful SOP'],
      decisionTrail: ['No valid steps provided'],
      timestamp: new Date().toISOString(),
    };
  }

  // Calculate process complexity
  let complexity: string;
  let estimatedTime: number;
  if (steps.length <= 3) {
    complexity = 'Simple';
    estimatedTime = steps.length * 5;
  } else if (steps.length <= 6) {
    complexity = 'Moderate';
    estimatedTime = steps.length * 7;
  } else {
    complexity = 'Complex';
    estimatedTime = steps.length * 10;
  }
  decisionTrail.push(`Process complexity: ${complexity} (${steps.length} steps)`);

  // Frequency mapping
  const frequencyLabels: Record<string, string> = {
    'daily': 'Daily',
    'weekly': 'Weekly',
    'monthly': 'Monthly',
    'quarterly': 'Quarterly',
    'as-needed': 'As Needed',
    'one-time': 'One-Time',
  };
  const frequencyLabel = frequencyLabels[frequency] || frequency;

  // Generate SOP document content
  const sopSections = [
    `**STANDARD OPERATING PROCEDURE**`,
    ``,
    `**Process Name:** ${processName}`,
    `**Department:** ${department}`,
    `**Owner:** ${owner}`,
    `**Frequency:** ${frequencyLabel}`,
    `**Version:** 1.0`,
    `**Effective Date:** ${new Date().toLocaleDateString()}`,
    ``,
    `---`,
    ``,
    `**1. PURPOSE**`,
    processPurpose || 'To establish a standardized procedure for completing this process consistently and efficiently.',
    ``,
    `**2. SCOPE**`,
    `This procedure applies to all team members responsible for executing the ${processName} process.`,
    ``,
    `**3. PROCEDURE**`,
    ``,
  ];

  // Add steps
  steps.forEach((step, index) => {
    sopSections.push(`**Step ${index + 1}:** ${step.description}`);
    if (step.notes) {
      sopSections.push(`   _Note: ${step.notes}_`);
    }
    sopSections.push(``);
  });

  sopSections.push(`---`);
  sopSections.push(``);
  sopSections.push(`**4. ESTIMATED TIME:** ${estimatedTime} minutes`);
  sopSections.push(``);
  sopSections.push(`**5. REVISION HISTORY**`);
  sopSections.push(`| Version | Date | Author | Changes |`);
  sopSections.push(`|---------|------|--------|---------|`);
  sopSections.push(`| 1.0 | ${new Date().toLocaleDateString()} | ${owner} | Initial version |`);

  const documentPreview = sopSections.join('\n');
  decisionTrail.push('Generated formatted SOP document');

  // Generate checklist version
  const checklistItems = steps.map((step, i) => `☐ Step ${i + 1}: ${step.description}`);
  const checklistPreview = checklistItems.join('\n');
  decisionTrail.push('Generated checklist version');

  // Calculate completeness score
  let completenessScore = 0;
  if (processName && processName !== 'Untitled Process') completenessScore += 15;
  if (processPurpose) completenessScore += 20;
  if (owner && owner !== 'Not Specified') completenessScore += 15;
  if (department && department !== 'General') completenessScore += 10;
  completenessScore += Math.min(40, steps.length * 8); // Up to 40 points for steps

  // Generate recommendations
  const recommendations: string[] = [];

  if (steps.length < 3) {
    recommendations.push('Consider adding more detail - most processes have at least 3-5 steps');
  }
  if (!processPurpose) {
    recommendations.push('Add a purpose statement to explain why this SOP exists');
  }
  if (steps.some(s => !s.notes)) {
    recommendations.push('Add notes to complex steps to provide additional context');
  }
  if (complexity === 'Complex') {
    recommendations.push('Consider breaking this into sub-procedures for easier training');
  }
  if (frequency === 'daily') {
    recommendations.push('For daily processes, consider automating repetitive steps');
  }
  recommendations.push('Review and update this SOP quarterly or after process changes');
  recommendations.push('Train all responsible team members on this procedure');

  // Confidence calculation
  const confidence = calculateInputConfidence(inputs, [
    'processPurpose', 'owner', 'department', 'step2', 'step3', 'step4', 'step5',
  ]);

  return {
    summary: `Generated ${complexity.toLowerCase()} SOP "${processName}" with ${steps.length} steps. Estimated completion time: ${estimatedTime} minutes. Completeness: ${completenessScore}%.`,
    confidence,
    confidenceLevel: getConfidenceLevel(confidence),
    outputs: [
      {
        id: 'processName',
        label: 'Process Name',
        value: processName,
        format: 'text',
        highlight: true,
      },
      {
        id: 'complexity',
        label: 'Complexity',
        value: complexity,
        format: 'text',
        trend: complexity === 'Simple' ? 'positive' : complexity === 'Moderate' ? 'neutral' : 'negative',
      },
      {
        id: 'stepCount',
        label: 'Total Steps',
        value: steps.length,
        format: 'number',
      },
      {
        id: 'estimatedTime',
        label: 'Est. Time',
        value: estimatedTime,
        format: 'number',
        description: 'Minutes to complete',
      },
      {
        id: 'completeness',
        label: 'Completeness',
        value: completenessScore,
        format: 'percentage',
        trend: completenessScore >= 80 ? 'positive' : completenessScore >= 50 ? 'neutral' : 'negative',
        highlight: true,
      },
      {
        id: 'documentPreview',
        label: 'SOP Document',
        value: documentPreview,
        format: 'text',
        description: 'Full formatted SOP',
      },
    ],
    recommendations,
    decisionTrail,
    chart: {
      labels: steps.map((_, i) => `Step ${i + 1}`),
      datasets: [
        {
          label: 'Step Complexity (est.)',
          data: steps.map((step) => Math.min(10, Math.ceil(step.description.split(' ').length / 5))),
          type: 'bar',
          color: '#8b5cf6',
        },
      ],
    },
    timestamp: new Date().toISOString(),
  };
}
