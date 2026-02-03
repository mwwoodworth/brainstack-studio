// Email Sequence Builder - Generate automated email campaigns
import { ToolResult } from '../types';
import { calculateInputConfidence, getConfidenceLevel } from '../utils';

interface EmailTemplate {
  subject: string;
  purpose: string;
  timing: string;
  keyPoints: string[];
}

export function executeEmailSequenceBuilder(
  inputs: Record<string, string | number>
): ToolResult {
  const campaignGoal = String(inputs.campaignGoal || 'nurture');
  const audienceType = String(inputs.audienceType || 'prospects');
  const productService = String(inputs.productService || 'your product/service');
  const industryContext = String(inputs.industryContext || '');
  const sequenceLength = Math.min(7, Math.max(3, Number(inputs.sequenceLength) || 5));
  const tonality = String(inputs.tonality || 'professional');
  const callToAction = String(inputs.callToAction || 'Schedule a call');

  const decisionTrail: string[] = [];
  decisionTrail.push(`Building email sequence for: ${campaignGoal}`);
  decisionTrail.push(`Target audience: ${audienceType}`);
  decisionTrail.push(`Sequence length: ${sequenceLength} emails`);

  // Goal-specific sequence templates
  const goalTemplates: Record<string, EmailTemplate[]> = {
    nurture: [
      { subject: 'Quick intro: How we help [industry] teams', purpose: 'Introduction & awareness', timing: 'Day 0', keyPoints: ['Brief intro', 'Key benefit', 'No hard sell'] },
      { subject: 'The #1 challenge we hear from [audience]', purpose: 'Pain point validation', timing: 'Day 3', keyPoints: ['Acknowledge pain', 'Share insight', 'Position as resource'] },
      { subject: '[Case Study] How [company] achieved [result]', purpose: 'Social proof', timing: 'Day 7', keyPoints: ['Real example', 'Specific metrics', 'Relatable situation'] },
      { subject: '3 things you can do this week', purpose: 'Value delivery', timing: 'Day 10', keyPoints: ['Actionable tips', 'Quick wins', 'Build trust'] },
      { subject: 'Have you considered this approach?', purpose: 'New perspective', timing: 'Day 14', keyPoints: ['Fresh angle', 'Thought leadership', 'Encourage reply'] },
      { subject: 'Resource: [Relevant guide/tool]', purpose: 'Lead magnet delivery', timing: 'Day 17', keyPoints: ['Free resource', 'High value', 'Soft CTA'] },
      { subject: 'Quick question about your [goal]', purpose: 'Direct engagement', timing: 'Day 21', keyPoints: ['Personal touch', 'Open dialogue', 'Clear CTA'] },
    ],
    onboarding: [
      { subject: 'Welcome! Let\'s get you started', purpose: 'Welcome & setup', timing: 'Day 0', keyPoints: ['Warm welcome', 'First steps', 'Quick win'] },
      { subject: 'Your first week: What to focus on', purpose: 'Guidance', timing: 'Day 2', keyPoints: ['Key features', 'Priority actions', 'Support resources'] },
      { subject: 'Pro tip: Did you try this?', purpose: 'Feature discovery', timing: 'Day 5', keyPoints: ['Power feature', 'Use case', 'How-to'] },
      { subject: 'You\'re making progress! Here\'s what\'s next', purpose: 'Encouragement', timing: 'Day 7', keyPoints: ['Celebrate wins', 'Next milestone', 'Community'] },
      { subject: 'Quick check-in: How\'s it going?', purpose: 'Feedback request', timing: 'Day 10', keyPoints: ['Ask for feedback', 'Offer help', 'Show care'] },
      { subject: 'Unlock more value with these features', purpose: 'Expansion', timing: 'Day 14', keyPoints: ['Advanced features', 'Integration options', 'Use cases'] },
      { subject: 'Your 30-day review', purpose: 'Retention', timing: 'Day 30', keyPoints: ['Review progress', 'Renewal reminder', 'Success resources'] },
    ],
    conversion: [
      { subject: 'Re: Your interest in [product]', purpose: 'Follow-up', timing: 'Day 0', keyPoints: ['Reference action', 'Key benefit', 'Clear next step'] },
      { subject: 'Quick answer to a common question', purpose: 'Objection handling', timing: 'Day 2', keyPoints: ['Address concern', 'Provide proof', 'Reduce friction'] },
      { subject: '[Benefit] without [objection]', purpose: 'Value proposition', timing: 'Day 4', keyPoints: ['Outcome focus', 'Risk removal', 'Urgency hint'] },
      { subject: 'What [similar company] achieved', purpose: 'Social proof', timing: 'Day 6', keyPoints: ['Relevant case', 'Specific ROI', 'Comparison'] },
      { subject: 'Let\'s make this easy for you', purpose: 'Simplify decision', timing: 'Day 8', keyPoints: ['Remove barriers', 'Guarantee', 'Limited offer'] },
      { subject: 'Before you decide...', purpose: 'Final objection', timing: 'Day 10', keyPoints: ['Last concerns', 'Comparison guide', 'Direct ask'] },
      { subject: 'Last chance: [Offer ending]', purpose: 'Urgency close', timing: 'Day 12', keyPoints: ['Deadline', 'Final CTA', 'Easy action'] },
    ],
    reactivation: [
      { subject: 'We miss you! Here\'s what\'s new', purpose: 'Re-engagement', timing: 'Day 0', keyPoints: ['Personal touch', 'New features', 'Value reminder'] },
      { subject: 'Things have changed (for the better)', purpose: 'Updates', timing: 'Day 4', keyPoints: ['Improvements', 'Based on feedback', 'Fresh start'] },
      { subject: 'A special offer just for you', purpose: 'Incentive', timing: 'Day 7', keyPoints: ['Exclusive deal', 'Limited time', 'Easy return'] },
      { subject: 'Can we talk? 10 minutes', purpose: 'Personal outreach', timing: 'Day 10', keyPoints: ['Ask for feedback', 'Learn why they left', 'Show you care'] },
      { subject: 'One more thing before we go', purpose: 'Final attempt', timing: 'Day 14', keyPoints: ['Final offer', 'No pressure', 'Leave door open'] },
    ],
  };

  const templates = goalTemplates[campaignGoal] || goalTemplates.nurture;
  const selectedTemplates = templates.slice(0, sequenceLength);

  decisionTrail.push(`Selected ${selectedTemplates.length} email templates for ${campaignGoal} campaign`);

  // Generate customized email previews
  const emailPreviews = selectedTemplates.map((template, index) => {
    const customSubject = template.subject
      .replace('[industry]', industryContext || 'your industry')
      .replace('[audience]', audienceType)
      .replace('[company]', 'companies like yours')
      .replace('[product]', productService)
      .replace('[result]', 'significant results')
      .replace('[goal]', campaignGoal)
      .replace('[Relevant guide/tool]', 'Free Resource Guide')
      .replace('[Benefit]', 'Better results')
      .replace('[objection]', 'the usual hassle')
      .replace('[similar company]', 'industry leaders')
      .replace('[Offer ending]', 'Special offer');

    return {
      emailNumber: index + 1,
      subject: customSubject,
      purpose: template.purpose,
      timing: template.timing,
      keyPoints: template.keyPoints,
    };
  });

  // Calculate sequence metrics
  const estimatedOpenRate = campaignGoal === 'onboarding' ? 45 : campaignGoal === 'nurture' ? 25 : 20;
  const estimatedClickRate = campaignGoal === 'onboarding' ? 15 : campaignGoal === 'nurture' ? 5 : 8;
  const estimatedConversionRate = campaignGoal === 'conversion' ? 3 : campaignGoal === 'onboarding' ? 10 : 1;

  decisionTrail.push(`Estimated performance: ${estimatedOpenRate}% open, ${estimatedClickRate}% click`);

  // Generate email sequence preview text
  const sequencePreview = emailPreviews.map(email =>
    `**Email ${email.emailNumber} (${email.timing}):** ${email.purpose}\nSubject: "${email.subject}"\n• ${email.keyPoints.join('\n• ')}`
  ).join('\n\n---\n\n');

  // Generate recommendations
  const recommendations: string[] = [];

  recommendations.push(`Personalize subject lines with recipient's name or company`);
  recommendations.push(`A/B test subject lines to improve open rates`);

  if (campaignGoal === 'conversion') {
    recommendations.push('Include clear, single CTAs in each email');
    recommendations.push('Add testimonials or case studies for credibility');
  }
  if (campaignGoal === 'nurture') {
    recommendations.push('Focus on providing value before asking for anything');
    recommendations.push('Track engagement to identify hot leads');
  }
  if (campaignGoal === 'onboarding') {
    recommendations.push('Link to video tutorials for complex features');
    recommendations.push('Trigger emails based on user actions, not just time');
  }
  if (sequenceLength < 5) {
    recommendations.push('Consider extending to 5-7 emails for better results');
  }
  recommendations.push('Set up proper tracking pixels and UTM parameters');

  // Confidence calculation
  const confidence = calculateInputConfidence(inputs, [
    'productService', 'industryContext', 'callToAction',
  ]);

  // Best practices score
  let bestPracticesScore = 50;
  if (sequenceLength >= 5) bestPracticesScore += 15;
  if (productService && productService !== 'your product/service') bestPracticesScore += 15;
  if (industryContext) bestPracticesScore += 10;
  if (tonality) bestPracticesScore += 10;

  return {
    summary: `Generated ${sequenceLength}-email ${campaignGoal} sequence for ${audienceType}. Est. open rate: ${estimatedOpenRate}%, click rate: ${estimatedClickRate}%.`,
    confidence,
    confidenceLevel: getConfidenceLevel(confidence),
    outputs: [
      {
        id: 'campaignGoal',
        label: 'Campaign Goal',
        value: campaignGoal.charAt(0).toUpperCase() + campaignGoal.slice(1),
        format: 'text',
        highlight: true,
      },
      {
        id: 'emailCount',
        label: 'Emails in Sequence',
        value: sequenceLength,
        format: 'number',
      },
      {
        id: 'estimatedOpenRate',
        label: 'Est. Open Rate',
        value: estimatedOpenRate,
        format: 'percentage',
        trend: estimatedOpenRate >= 25 ? 'positive' : 'neutral',
      },
      {
        id: 'estimatedClickRate',
        label: 'Est. Click Rate',
        value: estimatedClickRate,
        format: 'percentage',
        trend: estimatedClickRate >= 5 ? 'positive' : 'neutral',
      },
      {
        id: 'bestPractices',
        label: 'Best Practices Score',
        value: bestPracticesScore,
        format: 'percentage',
        trend: bestPracticesScore >= 80 ? 'positive' : bestPracticesScore >= 60 ? 'neutral' : 'negative',
        highlight: true,
      },
      {
        id: 'sequencePreview',
        label: 'Sequence Preview',
        value: sequencePreview,
        format: 'text',
        description: 'Full email sequence outline',
      },
    ],
    recommendations,
    decisionTrail,
    chart: {
      labels: emailPreviews.map(e => `Email ${e.emailNumber}`),
      datasets: [
        {
          label: 'Expected Engagement (%)',
          data: emailPreviews.map((_, i) => Math.max(10, estimatedOpenRate - (i * 3))),
          type: 'line',
          color: '#22d3ee',
        },
        {
          label: 'Day Sent',
          data: emailPreviews.map(e => parseInt(e.timing.replace('Day ', '')) || 0),
          type: 'bar',
          color: '#8b5cf6',
        },
      ],
    },
    timestamp: new Date().toISOString(),
  };
}
