// Job Description Generator - Create polished job descriptions
import { ToolResult } from '../types';
import { calculateInputConfidence, getConfidenceLevel, formatCurrency } from '../utils';

export function executeJobDescriptionGenerator(
  inputs: Record<string, string | number>
): ToolResult {
  const jobTitle = String(inputs.jobTitle || 'Job Title');
  const department = String(inputs.department || 'Department');
  const employmentType = String(inputs.employmentType || 'full-time');
  const experienceLevel = String(inputs.experienceLevel || 'mid');
  const location = String(inputs.location || 'Remote');
  const salaryMin = Number(inputs.salaryMin) || 0;
  const salaryMax = Number(inputs.salaryMax) || 0;
  const reportingTo = String(inputs.reportingTo || 'Hiring Manager');
  const companyName = String(inputs.companyName || 'Company');

  const decisionTrail: string[] = [];
  decisionTrail.push(`Generating JD for: ${jobTitle}`);
  decisionTrail.push(`Experience level: ${experienceLevel}`);

  // Parse responsibilities (up to 8)
  const responsibilities: string[] = [];
  for (let i = 1; i <= 8; i++) {
    const resp = String(inputs[`responsibility${i}`] || '').trim();
    if (resp) responsibilities.push(resp);
  }

  // Parse requirements (up to 8)
  const requirements: string[] = [];
  for (let i = 1; i <= 8; i++) {
    const req = String(inputs[`requirement${i}`] || '').trim();
    if (req) requirements.push(req);
  }

  // Parse nice-to-haves (up to 4)
  const niceToHaves: string[] = [];
  for (let i = 1; i <= 4; i++) {
    const nice = String(inputs[`niceToHave${i}`] || '').trim();
    if (nice) niceToHaves.push(nice);
  }

  decisionTrail.push(`Responsibilities: ${responsibilities.length}, Requirements: ${requirements.length}`);

  if (responsibilities.length === 0 && requirements.length === 0) {
    return {
      summary: 'Please add at least one responsibility or requirement to generate a job description.',
      confidence: 0,
      confidenceLevel: 'low',
      outputs: [],
      recommendations: ['Add key responsibilities and requirements for this role'],
      decisionTrail: ['No responsibilities or requirements provided'],
      timestamp: new Date().toISOString(),
    };
  }

  // Experience level mapping
  const levelDetails: Record<string, { years: string; seniority: string }> = {
    'entry': { years: '0-2 years', seniority: 'Entry Level' },
    'junior': { years: '1-3 years', seniority: 'Junior' },
    'mid': { years: '3-5 years', seniority: 'Mid-Level' },
    'senior': { years: '5-8 years', seniority: 'Senior' },
    'lead': { years: '7-10 years', seniority: 'Lead/Principal' },
    'director': { years: '10+ years', seniority: 'Director' },
    'executive': { years: '15+ years', seniority: 'Executive' },
  };
  const level = levelDetails[experienceLevel] || levelDetails.mid;

  // Employment type formatting
  const employmentLabels: Record<string, string> = {
    'full-time': 'Full-Time',
    'part-time': 'Part-Time',
    'contract': 'Contract',
    'freelance': 'Freelance',
    'internship': 'Internship',
  };
  const employmentLabel = employmentLabels[employmentType] || 'Full-Time';

  // Build job description
  const jdSections: string[] = [];

  jdSections.push(`# ${jobTitle}`);
  jdSections.push(``);
  jdSections.push(`**Department:** ${department}`);
  jdSections.push(`**Location:** ${location}`);
  jdSections.push(`**Employment Type:** ${employmentLabel}`);
  jdSections.push(`**Experience:** ${level.years} (${level.seniority})`);
  jdSections.push(`**Reports To:** ${reportingTo}`);
  if (salaryMin > 0 && salaryMax > 0) {
    jdSections.push(`**Salary Range:** ${formatCurrency(salaryMin)} - ${formatCurrency(salaryMax)}`);
  }
  jdSections.push(``);
  jdSections.push(`---`);
  jdSections.push(``);

  // About section
  jdSections.push(`## About the Role`);
  jdSections.push(``);
  jdSections.push(`We are looking for a talented ${jobTitle} to join our ${department} team. This is a ${employmentLabel.toLowerCase()} ${level.seniority.toLowerCase()} position ${location === 'Remote' ? 'that can be performed remotely' : `based in ${location}`}. The ideal candidate will bring ${level.years} of relevant experience and a passion for excellence.`);
  jdSections.push(``);

  // Responsibilities
  if (responsibilities.length > 0) {
    jdSections.push(`## Key Responsibilities`);
    jdSections.push(``);
    responsibilities.forEach(resp => {
      jdSections.push(`- ${resp}`);
    });
    jdSections.push(``);
  }

  // Requirements
  if (requirements.length > 0) {
    jdSections.push(`## Requirements`);
    jdSections.push(``);
    requirements.forEach(req => {
      jdSections.push(`- ${req}`);
    });
    jdSections.push(``);
  }

  // Nice to haves
  if (niceToHaves.length > 0) {
    jdSections.push(`## Nice to Have`);
    jdSections.push(``);
    niceToHaves.forEach(nice => {
      jdSections.push(`- ${nice}`);
    });
    jdSections.push(``);
  }

  // Benefits section (generic)
  jdSections.push(`## What We Offer`);
  jdSections.push(``);
  jdSections.push(`- Competitive compensation package`);
  jdSections.push(`- Professional development opportunities`);
  jdSections.push(`- Collaborative and innovative work environment`);
  jdSections.push(`- ${location === 'Remote' ? 'Flexible remote work arrangement' : 'Modern office environment'}`);
  jdSections.push(``);

  // Application section
  jdSections.push(`---`);
  jdSections.push(``);
  jdSections.push(`*${companyName} is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees.*`);

  const jobDescription = jdSections.join('\n');
  decisionTrail.push('Generated formatted job description');

  // Calculate completeness score
  let completeness = 0;
  if (jobTitle !== 'Job Title') completeness += 10;
  if (department !== 'Department') completeness += 10;
  if (responsibilities.length >= 3) completeness += 25;
  if (requirements.length >= 3) completeness += 25;
  if (salaryMin > 0 && salaryMax > 0) completeness += 15;
  if (niceToHaves.length > 0) completeness += 10;
  if (companyName !== 'Company') completeness += 5;

  // Word count
  const wordCount = jobDescription.split(/\s+/).length;

  // Generate recommendations
  const recommendations: string[] = [];

  if (responsibilities.length < 4) {
    recommendations.push('Add 4-6 key responsibilities for a complete picture of the role');
  }
  if (requirements.length < 4) {
    recommendations.push('List 4-6 clear requirements to attract qualified candidates');
  }
  if (salaryMin === 0 || salaryMax === 0) {
    recommendations.push('Including salary range increases application rates by 30%');
  }
  if (niceToHaves.length === 0) {
    recommendations.push('Add 2-3 "nice to have" items to encourage diverse applicants');
  }
  if (wordCount < 300) {
    recommendations.push('Consider adding more detail - JDs under 300 words get fewer applications');
  }
  if (wordCount > 800) {
    recommendations.push('Consider trimming - JDs over 800 words can deter applicants');
  }
  recommendations.push('Use inclusive language and avoid jargon');
  recommendations.push('Have someone from the team review before posting');

  // Confidence calculation
  const confidence = calculateInputConfidence(inputs, [
    'salaryMin', 'salaryMax', 'responsibility3', 'responsibility4', 'requirement3', 'requirement4', 'niceToHave1',
  ]);

  return {
    summary: `Generated ${level.seniority} ${jobTitle} JD with ${responsibilities.length} responsibilities, ${requirements.length} requirements. Completeness: ${completeness}%.`,
    confidence,
    confidenceLevel: getConfidenceLevel(confidence),
    outputs: [
      {
        id: 'jobTitle',
        label: 'Job Title',
        value: jobTitle,
        format: 'text',
        highlight: true,
      },
      {
        id: 'experienceLevel',
        label: 'Experience Level',
        value: level.seniority,
        format: 'text',
      },
      {
        id: 'responsibilityCount',
        label: 'Responsibilities',
        value: responsibilities.length,
        format: 'number',
        trend: responsibilities.length >= 4 ? 'positive' : 'neutral',
      },
      {
        id: 'requirementCount',
        label: 'Requirements',
        value: requirements.length,
        format: 'number',
        trend: requirements.length >= 4 ? 'positive' : 'neutral',
      },
      {
        id: 'wordCount',
        label: 'Word Count',
        value: wordCount,
        format: 'number',
        trend: wordCount >= 300 && wordCount <= 700 ? 'positive' : 'neutral',
      },
      {
        id: 'completeness',
        label: 'Completeness',
        value: completeness,
        format: 'percentage',
        trend: completeness >= 80 ? 'positive' : completeness >= 60 ? 'neutral' : 'negative',
        highlight: true,
      },
      {
        id: 'jobDescription',
        label: 'Job Description',
        value: jobDescription,
        format: 'text',
        description: 'Full formatted JD',
      },
    ],
    recommendations,
    decisionTrail,
    chart: {
      labels: ['Title', 'Dept', 'Responsibilities', 'Requirements', 'Salary', 'Nice-to-Have'],
      datasets: [
        {
          label: 'Section Completeness',
          data: [
            jobTitle !== 'Job Title' ? 100 : 0,
            department !== 'Department' ? 100 : 0,
            Math.min(100, responsibilities.length * 20),
            Math.min(100, requirements.length * 20),
            (salaryMin > 0 && salaryMax > 0) ? 100 : 0,
            Math.min(100, niceToHaves.length * 50),
          ],
          type: 'bar',
          color: '#f59e0b',
        },
      ],
    },
    timestamp: new Date().toISOString(),
  };
}
