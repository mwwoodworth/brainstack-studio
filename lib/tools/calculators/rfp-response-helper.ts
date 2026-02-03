// RFP Response Helper - Structure responses to RFP questions
import { ToolResult } from '../types';
import { calculateInputConfidence, getConfidenceLevel, formatCurrency } from '../utils';

interface ResponseSection {
  question: string;
  framework: string[];
  keyPoints: string[];
  pitfalls: string[];
}

export function executeRFPResponseHelper(
  inputs: Record<string, string | number>
): ToolResult {
  const rfpTitle = String(inputs.rfpTitle || 'RFP Response');
  const clientName = String(inputs.clientName || 'Client');
  const projectType = String(inputs.projectType || 'general');
  const proposedValue = Number(inputs.proposedValue) || 0;
  const deadline = String(inputs.deadline || '');
  const companyStrengths = String(inputs.companyStrengths || '');

  const decisionTrail: string[] = [];
  decisionTrail.push(`Building RFP response framework for: ${rfpTitle}`);
  decisionTrail.push(`Project type: ${projectType}`);

  // Parse RFP questions (up to 10)
  const questions: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const q = String(inputs[`question${i}`] || '').trim();
    if (q) questions.push(q);
  }

  decisionTrail.push(`Processing ${questions.length} RFP questions`);

  if (questions.length === 0) {
    return {
      summary: 'No RFP questions provided. Please enter at least one question to generate response frameworks.',
      confidence: 0,
      confidenceLevel: 'low',
      outputs: [],
      recommendations: ['Paste RFP questions to get structured response frameworks'],
      decisionTrail: ['No questions provided'],
      timestamp: new Date().toISOString(),
    };
  }

  // Question categorization and response frameworks
  const categorizeQuestion = (question: string): ResponseSection => {
    const lowerQ = question.toLowerCase();

    // Company background / About us
    if (lowerQ.includes('about') || lowerQ.includes('company') || lowerQ.includes('background') || lowerQ.includes('who are')) {
      return {
        question,
        framework: [
          '1. Company Overview (founding, mission, size)',
          '2. Core Competencies & Specializations',
          '3. Relevant Industry Experience',
          '4. Key Differentiators',
          '5. Awards/Certifications/Recognition',
        ],
        keyPoints: ['Lead with most relevant experience', 'Quantify achievements', 'Connect to client\'s industry'],
        pitfalls: ['Generic boilerplate', 'Too much history, not enough relevance'],
      };
    }

    // Experience / Case studies
    if (lowerQ.includes('experience') || lowerQ.includes('case stud') || lowerQ.includes('similar project') || lowerQ.includes('past work')) {
      return {
        question,
        framework: [
          '1. Project Overview (scope, client, timeline)',
          '2. Challenge/Problem Addressed',
          '3. Solution Implemented',
          '4. Measurable Results (with metrics)',
          '5. Client Testimonial (if available)',
        ],
        keyPoints: ['Choose most relevant examples', 'Include specific metrics/ROI', 'Show scalability'],
        pitfalls: ['Vague descriptions', 'Missing quantifiable outcomes'],
      };
    }

    // Approach / Methodology
    if (lowerQ.includes('approach') || lowerQ.includes('methodology') || lowerQ.includes('how will you') || lowerQ.includes('process')) {
      return {
        question,
        framework: [
          '1. Understanding of Requirements',
          '2. Proposed Methodology/Framework',
          '3. Phase Breakdown with Milestones',
          '4. Tools & Technologies Used',
          '5. Quality Assurance Process',
        ],
        keyPoints: ['Demonstrate understanding of their needs', 'Be specific about phases', 'Include risk mitigation'],
        pitfalls: ['Too generic', 'Not tailored to their specific requirements'],
      };
    }

    // Team / Resources
    if (lowerQ.includes('team') || lowerQ.includes('staff') || lowerQ.includes('resource') || lowerQ.includes('personnel')) {
      return {
        question,
        framework: [
          '1. Proposed Team Structure',
          '2. Key Personnel & Qualifications',
          '3. Relevant Experience per Team Member',
          '4. Backup/Contingency Resources',
          '5. Communication & Reporting Structure',
        ],
        keyPoints: ['Highlight relevant certifications', 'Show dedicated vs shared resources', 'Include org chart'],
        pitfalls: ['Unnamed placeholders', 'Lack of relevant experience'],
      };
    }

    // Pricing / Cost
    if (lowerQ.includes('price') || lowerQ.includes('cost') || lowerQ.includes('budget') || lowerQ.includes('fee') || lowerQ.includes('rate')) {
      return {
        question,
        framework: [
          '1. Pricing Summary/Executive View',
          '2. Detailed Cost Breakdown by Phase',
          '3. Assumptions & Dependencies',
          '4. Payment Terms & Schedule',
          '5. Optional/Value-Add Items',
        ],
        keyPoints: ['Be transparent about inclusions/exclusions', 'Offer options if possible', 'Justify value'],
        pitfalls: ['Hidden costs', 'Unclear scope boundaries', 'No flexibility'],
      };
    }

    // Timeline / Schedule
    if (lowerQ.includes('timeline') || lowerQ.includes('schedule') || lowerQ.includes('when') || lowerQ.includes('deadline') || lowerQ.includes('duration')) {
      return {
        question,
        framework: [
          '1. Overall Timeline Summary',
          '2. Phase-by-Phase Schedule',
          '3. Key Milestones & Deliverables',
          '4. Dependencies & Assumptions',
          '5. Contingency/Buffer Time',
        ],
        keyPoints: ['Be realistic', 'Show critical path', 'Include client dependencies'],
        pitfalls: ['Unrealistic promises', 'No buffer for unknowns'],
      };
    }

    // References
    if (lowerQ.includes('reference') || lowerQ.includes('testimonial') || lowerQ.includes('client')) {
      return {
        question,
        framework: [
          '1. Reference Contact Information',
          '2. Project Summary for Reference',
          '3. Relationship Duration',
          '4. Key Achievements Together',
          '5. Why This Reference is Relevant',
        ],
        keyPoints: ['Pre-notify your references', 'Choose relevant industries', 'Include decision-makers'],
        pitfalls: ['Stale references', 'References unfamiliar with RFP scope'],
      };
    }

    // Technical / Requirements
    if (lowerQ.includes('technical') || lowerQ.includes('requirement') || lowerQ.includes('specification') || lowerQ.includes('comply')) {
      return {
        question,
        framework: [
          '1. Requirement Understanding/Restatement',
          '2. Compliance Statement (Yes/No/Partial)',
          '3. How You Meet/Exceed Requirements',
          '4. Any Exceptions or Clarifications',
          '5. Value-Added Capabilities',
        ],
        keyPoints: ['Use their terminology', 'Be explicit about compliance', 'Highlight differentiators'],
        pitfalls: ['Vague compliance claims', 'Missing exception notes'],
      };
    }

    // Default / General
    return {
      question,
      framework: [
        '1. Restate/Clarify the Question',
        '2. Direct Answer',
        '3. Supporting Evidence/Examples',
        '4. Differentiator/Value-Add',
        '5. Summary/Call to Action',
      ],
      keyPoints: ['Answer the actual question asked', 'Be concise but complete', 'Differentiate from competitors'],
      pitfalls: ['Not answering the question directly', 'Generic responses'],
    };
  };

  // Process each question
  const responseSections = questions.map(q => categorizeQuestion(q));
  decisionTrail.push(`Categorized questions and generated ${responseSections.length} response frameworks`);

  // Build response document
  const responseDoc: string[] = [];
  responseDoc.push(`# RFP Response Framework: ${rfpTitle}`);
  responseDoc.push(``);
  responseDoc.push(`**Client:** ${clientName}`);
  responseDoc.push(`**Project Type:** ${projectType}`);
  if (proposedValue > 0) {
    responseDoc.push(`**Proposed Value:** ${formatCurrency(proposedValue)}`);
  }
  if (deadline) {
    responseDoc.push(`**Submission Deadline:** ${deadline}`);
  }
  responseDoc.push(``);
  responseDoc.push(`---`);
  responseDoc.push(``);

  responseSections.forEach((section, index) => {
    responseDoc.push(`## Question ${index + 1}`);
    responseDoc.push(`> ${section.question}`);
    responseDoc.push(``);
    responseDoc.push(`### Recommended Response Framework`);
    section.framework.forEach(f => responseDoc.push(`${f}`));
    responseDoc.push(``);
    responseDoc.push(`### Key Points to Include`);
    section.keyPoints.forEach(k => responseDoc.push(`✓ ${k}`));
    responseDoc.push(``);
    responseDoc.push(`### Pitfalls to Avoid`);
    section.pitfalls.forEach(p => responseDoc.push(`✗ ${p}`));
    responseDoc.push(``);
    responseDoc.push(`---`);
    responseDoc.push(``);
  });

  // Add executive summary template
  responseDoc.push(`## Executive Summary Template`);
  responseDoc.push(``);
  responseDoc.push(`*Use this structure for your cover letter/executive summary:*`);
  responseDoc.push(``);
  responseDoc.push(`1. **Opening Hook** - Reference client's key challenge`);
  responseDoc.push(`2. **Understanding** - Show you understand their needs`);
  responseDoc.push(`3. **Solution Summary** - Your approach in 2-3 sentences`);
  responseDoc.push(`4. **Why Us** - 3 key differentiators`);
  responseDoc.push(`5. **Call to Action** - Express enthusiasm, invite questions`);

  const responseDocument = responseDoc.join('\n');

  // Calculate readiness score
  let readiness = 0;
  readiness += Math.min(30, questions.length * 6); // Up to 30 for questions
  if (proposedValue > 0) readiness += 15;
  if (deadline) readiness += 10;
  if (clientName !== 'Client') readiness += 10;
  if (companyStrengths) readiness += 15;
  readiness += 20; // Base for using the tool

  // Estimate response effort
  const estimatedHours = questions.length * 2 + 4; // 2 hrs per question + 4 hrs overhead

  // Generate recommendations
  const recommendations: string[] = [];

  if (questions.length < 5) {
    recommendations.push('Most RFPs have 8-15 questions - ensure you\'ve captured all requirements');
  }
  if (!deadline) {
    recommendations.push('Add the deadline to track your timeline');
  }
  if (!companyStrengths) {
    recommendations.push('Document your key differentiators to weave throughout responses');
  }
  recommendations.push('Create a compliance matrix to track all requirements');
  recommendations.push('Have responses reviewed by both technical and business stakeholders');
  recommendations.push('Run responses through a readability checker (aim for grade 10-12 level)');
  if (proposedValue > 100000) {
    recommendations.push('For high-value RFPs, consider a professional design/layout');
  }

  // Confidence calculation
  const confidence = calculateInputConfidence(inputs, [
    'clientName', 'proposedValue', 'deadline', 'companyStrengths', 'question3', 'question4',
  ]);

  return {
    summary: `Generated response frameworks for ${questions.length} RFP questions. Estimated effort: ${estimatedHours} hours. Readiness score: ${readiness}%.`,
    confidence,
    confidenceLevel: getConfidenceLevel(confidence),
    outputs: [
      {
        id: 'rfpTitle',
        label: 'RFP Title',
        value: rfpTitle,
        format: 'text',
        highlight: true,
      },
      {
        id: 'questionCount',
        label: 'Questions Processed',
        value: questions.length,
        format: 'number',
      },
      {
        id: 'estimatedHours',
        label: 'Est. Response Effort',
        value: estimatedHours,
        format: 'number',
        description: 'hours',
      },
      {
        id: 'readiness',
        label: 'Readiness Score',
        value: readiness,
        format: 'percentage',
        trend: readiness >= 70 ? 'positive' : readiness >= 50 ? 'neutral' : 'negative',
        highlight: true,
      },
      {
        id: 'proposedValue',
        label: 'Proposed Value',
        value: proposedValue > 0 ? proposedValue : 'Not specified',
        format: proposedValue > 0 ? 'currency' : 'text',
      },
      {
        id: 'responseDocument',
        label: 'Response Framework',
        value: responseDocument,
        format: 'text',
        description: 'Full response framework document',
      },
    ],
    recommendations,
    decisionTrail,
    chart: {
      labels: questions.map((_, i) => `Q${i + 1}`),
      datasets: [
        {
          label: 'Framework Sections',
          data: responseSections.map(s => s.framework.length),
          type: 'bar',
          color: '#3b82f6',
        },
        {
          label: 'Key Points',
          data: responseSections.map(s => s.keyPoints.length),
          type: 'bar',
          color: '#10b981',
        },
      ],
    },
    timestamp: new Date().toISOString(),
  };
}
