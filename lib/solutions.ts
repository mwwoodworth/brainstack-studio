export type SolutionPreviewStep = {
  title: string;
  input: string;
  output: string[];
};

export type Solution = {
  slug: string;
  name: string;
  industry: string;
  problem: string;
  workflow: string[];
  outputs: string[];
  preview: SolutionPreviewStep[];
  boundaries: string[];
};

export const SOLUTIONS: Solution[] = [
  {
    slug: 'operations-control-room',
    name: 'Operations Control Room',
    industry: 'Operations / Business Management',
    problem: 'Leadership lacks reliable visibility into operational bottlenecks and exception handling.',
    workflow: [
      'Aggregate daily operational signals',
      'Detect exceptions against agreed thresholds',
      'Route ownership with time-boxed escalation',
      'Publish a daily control-room brief',
    ],
    outputs: [
      'Daily operations brief',
      'Exception queue with owners',
      'Decision latency dashboard',
    ],
    preview: [
      {
        title: 'Signal Intake',
        input: 'Inbound: 124 tasks, 9 delayed beyond SLA, 2 approvals pending > 48h',
        output: ['Detected 9 SLA breaches', 'Escalated 2 approvals', 'Flagged 1 repeated blocker'],
      },
      {
        title: 'Action Routing',
        input: 'Assign ownership for delay cluster',
        output: ['Assigned to Ops Manager', 'Set 6h response SLA', 'Prepared escalation memo'],
      },
    ],
    boundaries: [
      'Shows only the facade and outputs, not orchestration logic.',
      'No internal data sources or schemas exposed.',
    ],
  },
  {
    slug: 'construction-crew-optimizer',
    name: 'Construction Crew Optimizer',
    industry: 'Construction / Trades',
    problem: 'Crew scheduling drifts from job readiness, causing idle time and overtime.',
    workflow: [
      'Capture job readiness signals',
      'Forecast crew allocation by day',
      'Recommend reassignments with constraints',
    ],
    outputs: [
      'Crew allocation board',
      'Readiness alerts',
      'Schedule risk summary',
    ],
    preview: [
      {
        title: 'Readiness Scan',
        input: 'Job 18 lacks permits; Job 22 ready; Job 25 delayed by materials',
        output: ['Hold crew on Job 18', 'Reassign crew to Job 22', 'Notify procurement on Job 25'],
      },
      {
        title: 'Schedule Draft',
        input: 'Generate next-day crew plan',
        output: ['Crew A → Job 22', 'Crew B → Job 31', 'Crew C → standby'],
      },
    ],
    boundaries: [
      'No field device data or internal GIS layers exposed.',
      'Automation logic shown as summary only.',
    ],
  },
  {
    slug: 'saas-retention-guard',
    name: 'SaaS Retention Guard',
    industry: 'SaaS Operations',
    problem: 'Churn signals arrive late and are hard to triage consistently.',
    workflow: [
      'Combine usage + support + billing signals',
      'Score account health deterministically',
      'Trigger retention playbooks',
    ],
    outputs: [
      'Churn risk list',
      'Retention task queue',
      'ARR impact summary',
    ],
    preview: [
      {
        title: 'Health Scoring',
        input: 'Account ACME: usage down 45%, 2 urgent tickets, downgrade request',
        output: ['Health score: 41/100', 'Action: escalation', 'Owner: CSM Lead'],
      },
      {
        title: 'Retention Playbook',
        input: 'Apply playbook v2',
        output: ['Schedule executive call', 'Offer usage audit', 'Set 3-day follow-up'],
      },
    ],
    boundaries: [
      'No internal customer data exposed.',
      'Only summary health signals shown.',
    ],
  },
  {
    slug: 'finance-forecast-core',
    name: 'Finance Forecast Core',
    industry: 'Finance / Forecasting',
    problem: 'Cash flow forecasting is slow and sensitive to missing inputs.',
    workflow: [
      'Aggregate inflow/outflow signals',
      'Generate 13-week deterministic forecast',
      'Flag risk thresholds with drivers',
    ],
    outputs: [
      '13-week cash flow forecast',
      'Runway risk alerts',
      'Variance driver report',
    ],
    preview: [
      {
        title: 'Forecast Build',
        input: 'Inflow: $1.2M, Outflow: $1.35M, AR aging elevated',
        output: ['Projected runway: 9.6 weeks', 'Risk band: Moderate', 'Driver: AR delays'],
      },
      {
        title: 'Decision Support',
        input: 'Generate mitigation options',
        output: ['Prioritize collections', 'Delay non-critical spend', 'Review credit line'],
      },
    ],
    boundaries: [
      'Forecast model is deterministic and bounded.',
      'No internal finance systems exposed.',
    ],
  },
  {
    slug: 'supply-chain-visibility',
    name: 'Supply Chain Visibility',
    industry: 'Supply Chain / Logistics',
    problem: 'Shipment delays and inventory drift reduce fulfillment reliability.',
    workflow: [
      'Aggregate shipment signals',
      'Detect delay risk and inventory imbalance',
      'Route exceptions to logistics owners',
    ],
    outputs: [
      'Shipment status brief',
      'Delay risk alerts',
      'Inventory imbalance report',
    ],
    preview: [
      {
        title: 'Shipment Scan',
        input: 'Route 12 delayed 18h, Warehouse B below safety stock',
        output: ['Delay risk flagged', 'Reorder triggered', 'Customer ETA adjusted'],
      },
      {
        title: 'Exception Routing',
        input: 'Assign logistics owner',
        output: ['Owner: Logistics Ops', 'ETA review task created'],
      },
    ],
    boundaries: [
      'No carrier contracts or internal routing logic exposed.',
      'Only summary signals shown.',
    ],
  },
  {
    slug: 'hr-onboarding-orchestrator',
    name: 'HR Onboarding Orchestrator',
    industry: 'Human Resources',
    problem: 'New hire onboarding is fragmented across HR, IT, and managers, causing delays, missed steps, and poor first-day experiences.',
    workflow: [
      'Trigger onboarding workflow from signed offer',
      'Orchestrate parallel tasks across HR, IT, and hiring manager',
      'Track completion against SLA targets',
      'Escalate overdue items with context',
      'Generate onboarding compliance report',
    ],
    outputs: [
      'Onboarding task tracker',
      'SLA compliance dashboard',
      'Escalation alerts',
      'Day-one readiness report',
    ],
    preview: [
      {
        title: 'Task Orchestration',
        input: 'New hire: Software Engineer, Start date: March 15, Department: Engineering',
        output: ['IT: Provision laptop + accounts (due Mar 12)', 'HR: Benefits enrollment packet (due Mar 10)', 'Manager: Buddy assignment + 30-day plan (due Mar 13)'],
      },
      {
        title: 'SLA Monitoring',
        input: 'Check completion status 3 days before start',
        output: ['IT provisioning: Complete', 'Benefits enrollment: Pending (escalated to HR lead)', 'Manager prep: Complete'],
      },
    ],
    boundaries: [
      'No employee PII or compensation data exposed.',
      'Shows orchestration pattern only, not internal HR systems.',
    ],
  },
  {
    slug: 'it-incident-resolution',
    name: 'IT Incident Resolution',
    industry: 'IT Service Management',
    problem: 'IT incidents are triaged manually, causing slow response times, inconsistent severity classification, and missed SLA targets.',
    workflow: [
      'Classify incoming incidents by severity and category',
      'Route to appropriate resolver group with context',
      'Enforce SLA timers and escalation paths',
      'Track resolution and generate post-incident summary',
    ],
    outputs: [
      'Incident severity classification',
      'Resolver assignment with context',
      'SLA tracking dashboard',
      'Post-incident report',
    ],
    preview: [
      {
        title: 'Incident Triage',
        input: 'Report: Payment processing timeout affecting checkout. 15 customers impacted in last 30 minutes.',
        output: ['Severity: P1 (Revenue impact)', 'Category: Infrastructure > Payment Gateway', 'Assigned: Platform Engineering on-call'],
      },
      {
        title: 'Escalation Management',
        input: 'P1 incident unresolved after 30 minutes',
        output: ['Escalated to Engineering Director', 'Customer communication drafted', 'Status page update queued'],
      },
    ],
    boundaries: [
      'No internal infrastructure topology or credentials exposed.',
      'Shows triage and routing logic only.',
    ],
  },
  {
    slug: 'marketing-campaign-optimizer',
    name: 'Marketing Campaign Optimizer',
    industry: 'Marketing / Growth',
    problem: 'Campaign performance data is scattered across platforms, making it difficult to identify underperforming spend and optimize budget allocation.',
    workflow: [
      'Aggregate campaign metrics across channels',
      'Identify underperforming segments against ROAS targets',
      'Generate reallocation recommendations with confidence scoring',
      'Produce weekly performance brief for leadership',
    ],
    outputs: [
      'Cross-channel performance summary',
      'Budget reallocation recommendations',
      'Underperformance alerts',
      'Weekly campaign brief',
    ],
    preview: [
      {
        title: 'Performance Scan',
        input: 'Q1 campaigns: Google Ads ($12K spend, 2.1x ROAS), LinkedIn ($8K spend, 0.7x ROAS), Email ($2K spend, 4.8x ROAS)',
        output: ['LinkedIn ROAS below 1.0x target — flagged for review', 'Email channel outperforming — recommend 40% budget increase', 'Google Ads on target — maintain allocation'],
      },
      {
        title: 'Reallocation Brief',
        input: 'Generate leadership summary with recommendations',
        output: ['Shift $3K from LinkedIn to Email sequences', 'Projected blended ROAS improvement: 2.1x → 2.6x', 'Confidence: High (based on 8 weeks of data)'],
      },
    ],
    boundaries: [
      'No ad platform credentials or internal analytics systems exposed.',
      'Recommendations are bounded by defined ROAS thresholds.',
    ],
  },
];

export const getAllSolutions = () => SOLUTIONS;

export const getSolutionBySlug = (slug: string) =>
  SOLUTIONS.find((solution) => solution.slug === slug);
