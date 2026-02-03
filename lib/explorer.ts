export type ExplorerIndustry =
  | 'operations'
  | 'construction'
  | 'saas'
  | 'finance'
  | 'supply-chain'
  | 'healthcare'
  | 'manufacturing'
  | 'retail'
  | 'professional-services'
  | 'non-profit'
  | 'government'
  | 'education';

export type ExplorerRole =
  | 'owner'
  | 'ops-manager'
  | 'engineer'
  | 'analyst';

export type ExplorerPainPoint =
  | 'money'
  | 'labor'
  | 'process'
  | 'compliance'
  | 'scale'
  | 'visibility';

export type ExplorerInput = {
  industry?: ExplorerIndustry;
  role?: ExplorerRole;
  painPoint?: ExplorerPainPoint;
};

export type ExplorerValue = {
  timeSaved: string;
  laborReduced: string;
  errorsPrevented: string;
  decisionLatency: string;
};

export type ExplorerResult = {
  confidence: number;
  confidenceLabel: 'High' | 'Moderate' | 'Low';
  identifiedPain: string;
  workflow: string[];
  automationLogic: string[];
  outputs: string[];
  value: ExplorerValue;
  boundaries: string[];
  decisionTrail: string[];
  uncertaintyNote?: string;
};

export const CONFIDENCE_THRESHOLD = 0.65;

export const INDUSTRIES: Array<{ id: ExplorerIndustry; label: string; description: string }> = [
  { id: 'operations', label: 'Operations / Business Management', description: 'Cross-functional ops, reporting, and process reliability.' },
  { id: 'construction', label: 'Construction / Trades', description: 'Field coordination, estimating, and schedule accuracy.' },
  { id: 'saas', label: 'SaaS Operations', description: 'Customer health, incidents, and retention risk.' },
  { id: 'finance', label: 'Finance / Forecasting', description: 'Cash flow, revenue risk, and compliance visibility.' },
  { id: 'supply-chain', label: 'Supply Chain / Logistics', description: 'Inventory accuracy and delivery predictability.' },
  { id: 'healthcare', label: 'Healthcare', description: 'Patient flow, compliance, and scheduling optimization.' },
  { id: 'manufacturing', label: 'Manufacturing', description: 'Quality control, inventory, and maintenance scheduling.' },
  { id: 'retail', label: 'Retail', description: 'Inventory management, staffing, and customer experience.' },
  { id: 'professional-services', label: 'Professional Services', description: 'Utilization tracking, project management, and billing.' },
  { id: 'non-profit', label: 'Non-Profit', description: 'Donor management, program tracking, and impact reporting.' },
  { id: 'government', label: 'Government', description: 'Compliance, resource allocation, and service delivery.' },
  { id: 'education', label: 'Education', description: 'Student tracking, resource allocation, and enrollment.' },
];

export const ROLES: Array<{ id: ExplorerRole; label: string }> = [
  { id: 'owner', label: 'Owner / Exec' },
  { id: 'ops-manager', label: 'Ops Manager' },
  { id: 'engineer', label: 'Engineer' },
  { id: 'analyst', label: 'Analyst' },
];

export const PAIN_POINTS: Array<{ id: ExplorerPainPoint; label: string }> = [
  { id: 'money', label: 'Money / Margin' },
  { id: 'labor', label: 'Labor / Staffing' },
  { id: 'process', label: 'Process Chaos' },
  { id: 'compliance', label: 'Compliance Risk' },
  { id: 'scale', label: 'Scale / Throughput' },
  { id: 'visibility', label: 'Visibility / Reporting' },
];

type Mapping = {
  identifiedPain: string;
  workflow: string[];
  automationLogic: string[];
  outputs: string[];
  value: ExplorerValue;
  confidence: number;
};

const BASE_BOUNDARIES = [
  'No internal systems or proprietary logic exposed.',
  'Outputs are deterministic and bounded to the selected context.',
  'If confidence is low, the system will ask for more detail.',
];

const INDUSTRY_MAP: Record<ExplorerIndustry, Record<ExplorerPainPoint, Mapping>> = {
  operations: {
    money: {
      identifiedPain: 'Margin leakage from inconsistent workflow execution and delayed approvals.',
      workflow: [
        'Collect weekly revenue + cost signals from core systems',
        'Flag variance beyond tolerance thresholds',
        'Route approvals with time-boxed escalation',
      ],
      automationLogic: [
        'If variance > 8% then open escalation task',
        'Auto-attach supporting context and owner',
        'Send summary to finance + ops leadership',
      ],
      outputs: [
        'Variance report (weekly)',
        'Approval queue summary',
        'Margin-at-risk alert',
      ],
      value: {
        timeSaved: '6-10 hrs/week',
        laborReduced: '1.0 FTE reporting load',
        errorsPrevented: '7-12% fewer approval misses',
        decisionLatency: '48h → 6h',
      },
      confidence: 0.82,
    },
    labor: {
      identifiedPain: 'Overstaffing in slow periods and understaffing during spikes.',
      workflow: [
        'Track demand signals by week',
        'Forecast labor requirements by role',
        'Generate staffing adjustments with buffer logic',
      ],
      automationLogic: [
        'If utilization < 70% for 2 weeks → adjust staffing plan',
        'If backlog > 2x normal → recommend surge coverage',
      ],
      outputs: [
        'Labor forecast',
        'Staffing adjustment memo',
        'Capacity risk alert',
      ],
      value: {
        timeSaved: '4-6 hrs/week',
        laborReduced: '5-12% overtime reduction',
        errorsPrevented: 'Fewer missed SLAs',
        decisionLatency: 'Weekly → Daily',
      },
      confidence: 0.78,
    },
    process: {
      identifiedPain: 'Process chaos across teams with inconsistent handoffs.',
      workflow: [
        'Define a deterministic intake checklist',
        'Translate intake into task bundles',
        'Enforce SLA-based escalation',
      ],
      automationLogic: [
        'If intake incomplete → hold and request missing fields',
        'Auto-assign tasks by role availability',
      ],
      outputs: [
        'Standardized intake summary',
        'Task bundle with owners',
        'SLA breach alerts',
      ],
      value: {
        timeSaved: '8-12 hrs/week',
        laborReduced: '20% fewer rework cycles',
        errorsPrevented: '30% fewer missed handoffs',
        decisionLatency: 'Same-day resolution',
      },
      confidence: 0.86,
    },
    compliance: {
      identifiedPain: 'Audit risk from inconsistent recordkeeping.',
      workflow: [
        'Capture compliance checkpoints at each stage',
        'Attach evidence to records automatically',
        'Generate audit-ready summaries',
      ],
      automationLogic: [
        'If checkpoint missing → block completion',
        'Auto-log approvals with timestamp + owner',
      ],
      outputs: [
        'Compliance checklist status',
        'Audit summary packet',
        'Risk exceptions list',
      ],
      value: {
        timeSaved: '3-5 hrs/week',
        laborReduced: '50% less audit prep time',
        errorsPrevented: 'Near-zero missing evidence',
        decisionLatency: 'Immediate visibility',
      },
      confidence: 0.8,
    },
    scale: {
      identifiedPain: 'Scaling ops without consistent playbooks.',
      workflow: [
        'Codify playbooks per workflow',
        'Create automated QA gates',
        'Monitor throughput + bottlenecks',
      ],
      automationLogic: [
        'If throughput < target → surface bottleneck task group',
        'Auto-assign overflow to on-call backup',
      ],
      outputs: [
        'Throughput dashboard',
        'Bottleneck alerts',
        'Capacity forecast',
      ],
      value: {
        timeSaved: '5-8 hrs/week',
        laborReduced: '12% fewer manual escalations',
        errorsPrevented: 'Fewer bottleneck stalls',
        decisionLatency: 'Hours instead of days',
      },
      confidence: 0.77,
    },
    visibility: {
      identifiedPain: 'Leaders lack real-time operational visibility.',
      workflow: [
        'Aggregate operational signals daily',
        'Highlight exceptions and trend breaks',
        'Distribute concise leadership brief',
      ],
      automationLogic: [
        'If KPI shifts > tolerance → flag in brief',
        'Auto-attach root-cause notes',
      ],
      outputs: [
        'Daily ops brief',
        'KPI exception report',
        'Trendline dashboard',
      ],
      value: {
        timeSaved: '2-4 hrs/week',
        laborReduced: 'Reduced ad-hoc reporting',
        errorsPrevented: 'Earlier issue detection',
        decisionLatency: 'Daily → Real-time',
      },
      confidence: 0.84,
    },
  },
  construction: {
    money: {
      identifiedPain: 'Margin erosion from estimate drift and change-order delays.',
      workflow: [
        'Capture estimate + actual deltas',
        'Trigger change-order review within 24h',
        'Attach cost impact to project ledger',
      ],
      automationLogic: [
        'If delta > 5% → open change-order task',
        'Route approval to PM + owner',
      ],
      outputs: [
        'Estimate vs actual report',
        'Change-order queue',
        'Profitability alert',
      ],
      value: {
        timeSaved: '6-9 hrs/week',
        laborReduced: 'Fewer manual reconciliations',
        errorsPrevented: '10-15% fewer margin misses',
        decisionLatency: 'Days → 24h',
      },
      confidence: 0.83,
    },
    labor: {
      identifiedPain: 'Crew availability not aligned to job readiness.',
      workflow: [
        'Track job readiness signals',
        'Forecast crew allocation by day',
        'Recommend reassignments automatically',
      ],
      automationLogic: [
        'If job not ready → release crew slot',
        'If backlog spikes → reallocate crew',
      ],
      outputs: [
        'Crew allocation board',
        'Readiness alerts',
        'Daily schedule plan',
      ],
      value: {
        timeSaved: '5-7 hrs/week',
        laborReduced: 'Reduced idle crew time',
        errorsPrevented: 'Fewer no-show days',
        decisionLatency: 'Daily planning window',
      },
      confidence: 0.81,
    },
    process: {
      identifiedPain: 'Field-to-office handoff gaps and missing documentation.',
      workflow: [
        'Standardize field capture checklist',
        'Auto-generate job packet summary',
        'Lock completion until requirements met',
      ],
      automationLogic: [
        'If photo set incomplete → request missing',
        'Auto-attach evidence to job record',
      ],
      outputs: [
        'Job packet summary',
        'Missing evidence alerts',
        'Completion readiness score',
      ],
      value: {
        timeSaved: '4-6 hrs/week',
        laborReduced: 'Less rework',
        errorsPrevented: '30% fewer missing docs',
        decisionLatency: 'Same-day visibility',
      },
      confidence: 0.8,
    },
    compliance: {
      identifiedPain: 'Permit and safety compliance delays.',
      workflow: [
        'Track compliance checkpoints by job',
        'Auto-flag expired permits',
        'Generate compliance summaries',
      ],
      automationLogic: [
        'If permit expiring → alert PM + compliance',
        'Require sign-off before closeout',
      ],
      outputs: [
        'Compliance status board',
        'Permit expiry alerts',
        'Closeout checklist',
      ],
      value: {
        timeSaved: '3-5 hrs/week',
        laborReduced: 'Reduced compliance fire drills',
        errorsPrevented: 'Fewer permit lapses',
        decisionLatency: 'Immediate alerts',
      },
      confidence: 0.78,
    },
    scale: {
      identifiedPain: 'Scaling jobs without losing quality.',
      workflow: [
        'Standardize quality gates',
        'Measure variance across crews',
        'Auto-route quality reviews',
      ],
      automationLogic: [
        'If quality score < threshold → trigger audit',
        'Auto-assign supervisor review',
      ],
      outputs: [
        'Quality variance report',
        'Supervisor audit queue',
        'Crew performance trend',
      ],
      value: {
        timeSaved: '4-6 hrs/week',
        laborReduced: 'Fewer rework cycles',
        errorsPrevented: 'Lower defect rates',
        decisionLatency: 'Weekly → Daily',
      },
      confidence: 0.76,
    },
    visibility: {
      identifiedPain: 'Limited real-time view of job status.',
      workflow: [
        'Collect job stage updates',
        'Highlight jobs at risk',
        'Push daily project brief',
      ],
      automationLogic: [
        'If delay > 1 day → flag in brief',
        'Auto-attach blockers',
      ],
      outputs: [
        'Project status brief',
        'Delay risk alerts',
        'Job stage dashboard',
      ],
      value: {
        timeSaved: '2-3 hrs/week',
        laborReduced: 'Less manual reporting',
        errorsPrevented: 'Earlier intervention',
        decisionLatency: 'Daily updates',
      },
      confidence: 0.82,
    },
  },
  saas: {
    money: {
      identifiedPain: 'Revenue risk from churn and downgrade signals.',
      workflow: [
        'Monitor usage + billing signals',
        'Score churn risk',
        'Trigger retention playbook',
      ],
      automationLogic: [
        'If usage drops > 40% → create retention task',
        'If plan downgrade requested → escalate',
      ],
      outputs: [
        'Churn risk list',
        'Retention task queue',
        'ARR impact summary',
      ],
      value: {
        timeSaved: '3-5 hrs/week',
        laborReduced: 'Automated triage',
        errorsPrevented: 'Lower surprise churn',
        decisionLatency: 'Weekly → Daily',
      },
      confidence: 0.79,
    },
    labor: {
      identifiedPain: 'Support staffing misaligned with ticket volume.',
      workflow: [
        'Forecast ticket load',
        'Auto-assign by severity',
        'Recommend staffing adjustments',
      ],
      automationLogic: [
        'If backlog > threshold → alert ops',
        'Auto-escalate high-risk accounts',
      ],
      outputs: [
        'Support load forecast',
        'Escalation queue',
        'Staffing advisory',
      ],
      value: {
        timeSaved: '2-4 hrs/week',
        laborReduced: 'Reduced overtime',
        errorsPrevented: 'Fewer SLA breaches',
        decisionLatency: 'Hours',
      },
      confidence: 0.75,
    },
    process: {
      identifiedPain: 'Incident response is inconsistent.',
      workflow: [
        'Detect incidents and classify severity',
        'Auto-assemble response checklist',
        'Track resolution timeline',
      ],
      automationLogic: [
        'If severity high → page on-call',
        'If unresolved after 30 min → escalate',
      ],
      outputs: [
        'Incident response log',
        'Resolution timeline',
        'Post-incident summary',
      ],
      value: {
        timeSaved: '4-6 hrs/week',
        laborReduced: 'Fewer manual escalations',
        errorsPrevented: 'Reduced incident drift',
        decisionLatency: 'Minutes',
      },
      confidence: 0.84,
    },
    compliance: {
      identifiedPain: 'Compliance reporting lag and audit risk.',
      workflow: [
        'Track control compliance evidence',
        'Auto-generate audit summaries',
        'Flag missing evidence',
      ],
      automationLogic: [
        'If evidence missing → notify control owner',
        'Auto-log approvals',
      ],
      outputs: [
        'Control coverage report',
        'Audit packet',
        'Exception list',
      ],
      value: {
        timeSaved: '3-5 hrs/week',
        laborReduced: 'Less manual compliance work',
        errorsPrevented: 'Fewer audit gaps',
        decisionLatency: 'Daily updates',
      },
      confidence: 0.77,
    },
    scale: {
      identifiedPain: 'Scaling onboarding without losing consistency.',
      workflow: [
        'Standardize onboarding steps',
        'Auto-assign milestones',
        'Track time-to-value',
      ],
      automationLogic: [
        'If milestone overdue → alert CSM',
        'Auto-surface blockers',
      ],
      outputs: [
        'Onboarding timeline',
        'Time-to-value report',
        'Milestone risk alerts',
      ],
      value: {
        timeSaved: '3-4 hrs/week',
        laborReduced: 'Fewer manual follow-ups',
        errorsPrevented: 'More consistent onboarding',
        decisionLatency: 'Daily',
      },
      confidence: 0.8,
    },
    visibility: {
      identifiedPain: 'Executives lack unified view of customer health.',
      workflow: [
        'Aggregate usage + support signals',
        'Score account health',
        'Generate weekly executive brief',
      ],
      automationLogic: [
        'If health score drops → escalate',
        'Auto-attach churn signals',
      ],
      outputs: [
        'Account health dashboard',
        'Churn risk brief',
        'Executive summary',
      ],
      value: {
        timeSaved: '2-3 hrs/week',
        laborReduced: 'Automated reporting',
        errorsPrevented: 'Earlier risk detection',
        decisionLatency: 'Weekly → Daily',
      },
      confidence: 0.82,
    },
  },
  finance: {
    money: {
      identifiedPain: 'Cash flow volatility and forecasting blind spots.',
      workflow: [
        'Aggregate inflow/outflow signals',
        'Forecast 13-week cash flow',
        'Trigger early-warning alerts',
      ],
      automationLogic: [
        'If runway < threshold → notify finance',
        'Auto-attach variance drivers',
      ],
      outputs: [
        '13-week cash flow forecast',
        'Runway risk alert',
        'Variance breakdown',
      ],
      value: {
        timeSaved: '6-10 hrs/week',
        laborReduced: 'Automated forecast prep',
        errorsPrevented: 'Fewer surprise shortages',
        decisionLatency: 'Weekly → Daily',
      },
      confidence: 0.85,
    },
    labor: {
      identifiedPain: 'Finance ops understaffed during close.',
      workflow: [
        'Forecast close workload',
        'Auto-assign close tasks',
        'Track task completion',
      ],
      automationLogic: [
        'If task overdue → alert owner',
        'Auto-assign backup',
      ],
      outputs: [
        'Close task board',
        'Bottleneck alerts',
        'Close status summary',
      ],
      value: {
        timeSaved: '3-4 hrs/week',
        laborReduced: 'Lower overtime',
        errorsPrevented: 'Fewer missed close items',
        decisionLatency: 'Daily visibility',
      },
      confidence: 0.72,
    },
    process: {
      identifiedPain: 'Manual reconciliations and exception handling.',
      workflow: [
        'Automate transaction matching',
        'Flag exceptions',
        'Route exceptions for review',
      ],
      automationLogic: [
        'If match confidence < threshold → exception',
        'Auto-attach supporting evidence',
      ],
      outputs: [
        'Reconciliation report',
        'Exception queue',
        'Resolution log',
      ],
      value: {
        timeSaved: '5-7 hrs/week',
        laborReduced: 'Lower manual matching',
        errorsPrevented: 'Reduced reconciliation errors',
        decisionLatency: 'Daily',
      },
      confidence: 0.81,
    },
    compliance: {
      identifiedPain: 'Regulatory reporting inconsistencies.',
      workflow: [
        'Track compliance obligations',
        'Auto-generate report drafts',
        'Flag missing data',
      ],
      automationLogic: [
        'If data missing → notify owner',
        'Auto-log report status',
      ],
      outputs: [
        'Compliance calendar',
        'Report draft checklist',
        'Exception log',
      ],
      value: {
        timeSaved: '2-4 hrs/week',
        laborReduced: 'Less manual compilation',
        errorsPrevented: 'Fewer late filings',
        decisionLatency: 'Immediate',
      },
      confidence: 0.76,
    },
    scale: {
      identifiedPain: 'Scaling finance ops without headcount.',
      workflow: [
        'Standardize finance workflows',
        'Automate routine approvals',
        'Track throughput',
      ],
      automationLogic: [
        'If approval latency > threshold → escalate',
        'Auto-attach approval evidence',
      ],
      outputs: [
        'Approval latency report',
        'Throughput dashboard',
        'Automation coverage list',
      ],
      value: {
        timeSaved: '4-6 hrs/week',
        laborReduced: 'Reduced manual approvals',
        errorsPrevented: 'Fewer missed approvals',
        decisionLatency: 'Hours',
      },
      confidence: 0.73,
    },
    visibility: {
      identifiedPain: 'Lack of real-time financial visibility.',
      workflow: [
        'Aggregate financial signals daily',
        'Highlight exceptions',
        'Deliver executive brief',
      ],
      automationLogic: [
        'If KPI drifts → alert finance lead',
        'Auto-attach drivers',
      ],
      outputs: [
        'Finance daily brief',
        'KPI exception list',
        'Forecast delta report',
      ],
      value: {
        timeSaved: '2-3 hrs/week',
        laborReduced: 'Less ad-hoc reporting',
        errorsPrevented: 'Earlier anomaly detection',
        decisionLatency: 'Daily',
      },
      confidence: 0.83,
    },
  },
  'supply-chain': {
    money: {
      identifiedPain: 'Cost overruns from inventory imbalance.',
      workflow: [
        'Track inventory levels vs demand',
        'Forecast reorder needs',
        'Flag cost impact',
      ],
      automationLogic: [
        'If stockout risk → trigger reorder',
        'If excess stock → flag cost risk',
      ],
      outputs: [
        'Inventory cost report',
        'Reorder alerts',
        'Excess stock list',
      ],
      value: {
        timeSaved: '3-5 hrs/week',
        laborReduced: 'Less manual checking',
        errorsPrevented: 'Reduced stockouts',
        decisionLatency: 'Daily',
      },
      confidence: 0.79,
    },
    labor: {
      identifiedPain: 'Warehouse staffing misaligned with throughput.',
      workflow: [
        'Forecast shipment volume',
        'Align staffing with load',
        'Track throughput vs plan',
      ],
      automationLogic: [
        'If throughput < target → adjust staffing',
        'Auto-assign surge resources',
      ],
      outputs: [
        'Throughput forecast',
        'Staffing plan',
        'Shift risk alerts',
      ],
      value: {
        timeSaved: '2-4 hrs/week',
        laborReduced: 'Lower overtime',
        errorsPrevented: 'Fewer missed SLAs',
        decisionLatency: 'Daily',
      },
      confidence: 0.74,
    },
    process: {
      identifiedPain: 'Process variability across hubs.',
      workflow: [
        'Standardize inbound/outbound checklists',
        'Auto-track exception flow',
        'Surface process drift',
      ],
      automationLogic: [
        'If exception rate > threshold → alert ops',
        'Auto-log corrective actions',
      ],
      outputs: [
        'Process drift report',
        'Exception queue',
        'Corrective action log',
      ],
      value: {
        timeSaved: '3-4 hrs/week',
        laborReduced: 'Less manual QA',
        errorsPrevented: 'Fewer process misses',
        decisionLatency: 'Daily',
      },
      confidence: 0.76,
    },
    compliance: {
      identifiedPain: 'Compliance gaps in chain-of-custody.',
      workflow: [
        'Track custody events',
        'Auto-attach evidence',
        'Generate compliance summaries',
      ],
      automationLogic: [
        'If custody break detected → escalate',
        'Auto-log handoff confirmations',
      ],
      outputs: [
        'Custody log',
        'Compliance summary',
        'Exception alerts',
      ],
      value: {
        timeSaved: '2-3 hrs/week',
        laborReduced: 'Less manual logging',
        errorsPrevented: 'Fewer compliance gaps',
        decisionLatency: 'Immediate',
      },
      confidence: 0.7,
    },
    scale: {
      identifiedPain: 'Scaling deliveries without losing reliability.',
      workflow: [
        'Forecast delivery demand',
        'Auto-assign capacity buffers',
        'Monitor delivery SLA risk',
      ],
      automationLogic: [
        'If SLA risk > threshold → adjust routing',
        'Auto-assign overflow carriers',
      ],
      outputs: [
        'Delivery SLA dashboard',
        'Capacity buffer plan',
        'Routing exception list',
      ],
      value: {
        timeSaved: '3-5 hrs/week',
        laborReduced: 'Reduced manual routing',
        errorsPrevented: 'Fewer late deliveries',
        decisionLatency: 'Hourly updates',
      },
      confidence: 0.78,
    },
    visibility: {
      identifiedPain: 'Lack of visibility into shipment status.',
      workflow: [
        'Aggregate shipment signals',
        'Highlight delayed routes',
        'Publish daily logistics brief',
      ],
      automationLogic: [
        'If delay > threshold → alert logistics',
        'Auto-attach delay cause',
      ],
      outputs: [
        'Shipment status brief',
        'Delay risk alerts',
        'Route performance trend',
      ],
      value: {
        timeSaved: '2-3 hrs/week',
        laborReduced: 'Less manual updates',
        errorsPrevented: 'Earlier intervention',
        decisionLatency: 'Daily',
      },
      confidence: 0.82,
    },
  },
  healthcare: {
    money: {
      identifiedPain: 'Revenue cycle delays and claim denials impacting cash flow.',
      workflow: [
        'Track claim submissions and denials',
        'Flag revenue cycle bottlenecks',
        'Prioritize high-value claim follow-ups',
      ],
      automationLogic: [
        'If denial rate > 5% → alert billing team',
        'Auto-prioritize claims by value and age',
      ],
      outputs: [
        'Denial rate dashboard',
        'Revenue cycle report',
        'Follow-up priority queue',
      ],
      value: {
        timeSaved: '8-12 hrs/week',
        laborReduced: 'Automated claim triage',
        errorsPrevented: '15-20% fewer write-offs',
        decisionLatency: 'Daily → Real-time',
      },
      confidence: 0.81,
    },
    labor: {
      identifiedPain: 'Staffing misalignment with patient volume.',
      workflow: [
        'Forecast patient volume by shift',
        'Optimize staff scheduling',
        'Track utilization metrics',
      ],
      automationLogic: [
        'If patient load > capacity → alert scheduler',
        'Auto-suggest shift adjustments',
      ],
      outputs: ['Staffing forecast', 'Utilization dashboard', 'Overtime alerts'],
      value: {
        timeSaved: '5-7 hrs/week',
        laborReduced: '10-15% overtime reduction',
        errorsPrevented: 'Fewer understaffed shifts',
        decisionLatency: 'Weekly → Daily',
      },
      confidence: 0.78,
    },
    process: {
      identifiedPain: 'Inconsistent patient intake and discharge processes.',
      workflow: [
        'Standardize intake checklists',
        'Track discharge readiness',
        'Automate handoff notifications',
      ],
      automationLogic: [
        'If checklist incomplete → block discharge',
        'Auto-notify care team on status changes',
      ],
      outputs: ['Intake completion rate', 'Discharge readiness score', 'Handoff log'],
      value: {
        timeSaved: '4-6 hrs/week',
        laborReduced: 'Fewer manual handoffs',
        errorsPrevented: '25% fewer discharge delays',
        decisionLatency: 'Same-day visibility',
      },
      confidence: 0.83,
    },
    compliance: {
      identifiedPain: 'HIPAA compliance gaps and audit preparation burden.',
      workflow: [
        'Track access logs and compliance checkpoints',
        'Auto-generate audit reports',
        'Flag compliance exceptions',
      ],
      automationLogic: [
        'If access anomaly detected → alert compliance',
        'Auto-log all PHI access',
      ],
      outputs: ['Compliance dashboard', 'Audit-ready report', 'Exception alerts'],
      value: {
        timeSaved: '6-8 hrs/week',
        laborReduced: '50% less audit prep',
        errorsPrevented: 'Near-zero compliance gaps',
        decisionLatency: 'Immediate alerts',
      },
      confidence: 0.85,
    },
    scale: {
      identifiedPain: 'Scaling patient care without quality degradation.',
      workflow: [
        'Standardize care protocols',
        'Monitor quality metrics',
        'Surface capacity constraints',
      ],
      automationLogic: [
        'If quality score drops → trigger review',
        'Auto-route overflow to available providers',
      ],
      outputs: ['Quality scorecard', 'Capacity dashboard', 'Protocol compliance'],
      value: {
        timeSaved: '4-6 hrs/week',
        laborReduced: 'Automated quality tracking',
        errorsPrevented: 'Consistent care delivery',
        decisionLatency: 'Daily monitoring',
      },
      confidence: 0.76,
    },
    visibility: {
      identifiedPain: 'Lack of real-time visibility into patient flow.',
      workflow: [
        'Aggregate patient status signals',
        'Track bed availability',
        'Generate operational briefs',
      ],
      automationLogic: [
        'If wait time > threshold → alert staff',
        'Auto-update availability board',
      ],
      outputs: ['Patient flow dashboard', 'Bed availability', 'Wait time alerts'],
      value: {
        timeSaved: '3-4 hrs/week',
        laborReduced: 'Reduced status calls',
        errorsPrevented: 'Better flow management',
        decisionLatency: 'Real-time updates',
      },
      confidence: 0.84,
    },
  },
  manufacturing: {
    money: {
      identifiedPain: 'Production cost overruns and waste.',
      workflow: [
        'Track production costs vs targets',
        'Monitor waste and scrap rates',
        'Flag cost anomalies',
      ],
      automationLogic: [
        'If waste > 3% → alert production manager',
        'Auto-calculate cost impact',
      ],
      outputs: ['Cost variance report', 'Waste dashboard', 'Production efficiency'],
      value: {
        timeSaved: '5-8 hrs/week',
        laborReduced: 'Automated cost tracking',
        errorsPrevented: '10-15% waste reduction',
        decisionLatency: 'Shift-level visibility',
      },
      confidence: 0.82,
    },
    labor: {
      identifiedPain: 'Production line staffing gaps.',
      workflow: [
        'Forecast production demand',
        'Optimize shift assignments',
        'Track operator efficiency',
      ],
      automationLogic: [
        'If line understaffed → alert supervisor',
        'Auto-suggest cross-training needs',
      ],
      outputs: ['Shift schedule', 'Efficiency dashboard', 'Training needs'],
      value: {
        timeSaved: '4-6 hrs/week',
        laborReduced: 'Optimized staffing',
        errorsPrevented: 'Fewer line stoppages',
        decisionLatency: 'Daily planning',
      },
      confidence: 0.77,
    },
    process: {
      identifiedPain: 'Quality control inconsistencies.',
      workflow: [
        'Standardize QC checkpoints',
        'Track defect rates by line',
        'Auto-escalate quality issues',
      ],
      automationLogic: [
        'If defect rate > threshold → stop line alert',
        'Auto-log all QC checks',
      ],
      outputs: ['QC dashboard', 'Defect trend report', 'Line performance'],
      value: {
        timeSaved: '6-8 hrs/week',
        laborReduced: 'Automated QC logging',
        errorsPrevented: '20-30% fewer defects',
        decisionLatency: 'Real-time alerts',
      },
      confidence: 0.85,
    },
    compliance: {
      identifiedPain: 'Regulatory compliance documentation gaps.',
      workflow: [
        'Track compliance requirements',
        'Auto-generate compliance reports',
        'Schedule audit preparation',
      ],
      automationLogic: [
        'If documentation missing → block approval',
        'Auto-log all compliance activities',
      ],
      outputs: ['Compliance status', 'Audit-ready packet', 'Certification tracking'],
      value: {
        timeSaved: '4-6 hrs/week',
        laborReduced: 'Less manual documentation',
        errorsPrevented: 'Zero compliance gaps',
        decisionLatency: 'Continuous monitoring',
      },
      confidence: 0.79,
    },
    scale: {
      identifiedPain: 'Scaling production without quality loss.',
      workflow: [
        'Define scalable SOPs',
        'Monitor throughput vs quality',
        'Identify bottlenecks',
      ],
      automationLogic: [
        'If throughput < target → surface bottleneck',
        'Auto-balance line loads',
      ],
      outputs: ['Throughput dashboard', 'Bottleneck report', 'Capacity forecast'],
      value: {
        timeSaved: '5-7 hrs/week',
        laborReduced: 'Optimized production',
        errorsPrevented: 'Consistent quality at scale',
        decisionLatency: 'Hourly monitoring',
      },
      confidence: 0.8,
    },
    visibility: {
      identifiedPain: 'Lack of real-time production visibility.',
      workflow: [
        'Aggregate production signals',
        'Track OEE metrics',
        'Generate shift reports',
      ],
      automationLogic: [
        'If OEE drops → alert production lead',
        'Auto-surface root causes',
      ],
      outputs: ['Production dashboard', 'OEE scorecard', 'Shift summary'],
      value: {
        timeSaved: '3-4 hrs/week',
        laborReduced: 'Automated reporting',
        errorsPrevented: 'Earlier issue detection',
        decisionLatency: 'Real-time',
      },
      confidence: 0.84,
    },
  },
  retail: {
    money: {
      identifiedPain: 'Margin erosion from markdowns and shrinkage.',
      workflow: [
        'Track margin by category',
        'Monitor markdown effectiveness',
        'Flag shrinkage anomalies',
      ],
      automationLogic: [
        'If shrinkage > 2% → alert loss prevention',
        'Auto-recommend markdown timing',
      ],
      outputs: ['Margin dashboard', 'Markdown analysis', 'Shrinkage alerts'],
      value: {
        timeSaved: '4-6 hrs/week',
        laborReduced: 'Automated analysis',
        errorsPrevented: '5-10% margin improvement',
        decisionLatency: 'Daily visibility',
      },
      confidence: 0.78,
    },
    labor: {
      identifiedPain: 'Store staffing misaligned with traffic.',
      workflow: [
        'Forecast store traffic',
        'Optimize staff schedules',
        'Track labor efficiency',
      ],
      automationLogic: [
        'If traffic > capacity → add staff alert',
        'Auto-suggest schedule changes',
      ],
      outputs: ['Traffic forecast', 'Optimal schedule', 'Labor efficiency'],
      value: {
        timeSaved: '5-7 hrs/week',
        laborReduced: '10-15% labor optimization',
        errorsPrevented: 'Better customer service',
        decisionLatency: 'Daily planning',
      },
      confidence: 0.81,
    },
    process: {
      identifiedPain: 'Inconsistent store operations.',
      workflow: [
        'Standardize store procedures',
        'Track compliance by location',
        'Auto-assign tasks',
      ],
      automationLogic: [
        'If compliance < 90% → alert district manager',
        'Auto-generate task lists',
      ],
      outputs: ['Compliance scorecard', 'Task completion rate', 'Store comparison'],
      value: {
        timeSaved: '4-5 hrs/week',
        laborReduced: 'Consistent operations',
        errorsPrevented: 'Higher compliance',
        decisionLatency: 'Same-day visibility',
      },
      confidence: 0.79,
    },
    compliance: {
      identifiedPain: 'Health and safety compliance gaps.',
      workflow: [
        'Track safety checkpoints',
        'Schedule inspections',
        'Log compliance activities',
      ],
      automationLogic: [
        'If inspection overdue → alert manager',
        'Auto-log all safety checks',
      ],
      outputs: ['Safety dashboard', 'Inspection schedule', 'Compliance log'],
      value: {
        timeSaved: '2-3 hrs/week',
        laborReduced: 'Automated tracking',
        errorsPrevented: 'Zero compliance violations',
        decisionLatency: 'Immediate alerts',
      },
      confidence: 0.76,
    },
    scale: {
      identifiedPain: 'Scaling store count without losing consistency.',
      workflow: [
        'Define scalable playbooks',
        'Track performance by store',
        'Identify best practices',
      ],
      automationLogic: [
        'If new store underperforms → trigger support',
        'Auto-share best practices',
      ],
      outputs: ['Store performance', 'Playbook compliance', 'Best practice library'],
      value: {
        timeSaved: '4-6 hrs/week',
        laborReduced: 'Faster store ramp-up',
        errorsPrevented: 'Consistent brand experience',
        decisionLatency: 'Weekly review',
      },
      confidence: 0.75,
    },
    visibility: {
      identifiedPain: 'Limited visibility into store performance.',
      workflow: [
        'Aggregate store metrics',
        'Compare performance',
        'Generate regional reports',
      ],
      automationLogic: [
        'If store underperforms → flag for review',
        'Auto-generate performance brief',
      ],
      outputs: ['Performance dashboard', 'Regional comparison', 'Trend analysis'],
      value: {
        timeSaved: '3-4 hrs/week',
        laborReduced: 'Automated reporting',
        errorsPrevented: 'Earlier intervention',
        decisionLatency: 'Daily updates',
      },
      confidence: 0.82,
    },
  },
  'professional-services': {
    money: {
      identifiedPain: 'Revenue leakage from unbilled time.',
      workflow: [
        'Track time capture rates',
        'Flag unbilled work',
        'Monitor realization rates',
      ],
      automationLogic: [
        'If utilization < 70% → alert manager',
        'Auto-remind for time entry',
      ],
      outputs: ['Utilization report', 'Unbilled work queue', 'Realization dashboard'],
      value: {
        timeSaved: '6-8 hrs/week',
        laborReduced: 'Better time capture',
        errorsPrevented: '10-15% revenue recovery',
        decisionLatency: 'Daily visibility',
      },
      confidence: 0.83,
    },
    labor: {
      identifiedPain: 'Resource allocation inefficiencies.',
      workflow: [
        'Forecast resource demand',
        'Match skills to projects',
        'Track availability',
      ],
      automationLogic: [
        'If resource conflict → alert resourcing',
        'Auto-suggest alternatives',
      ],
      outputs: ['Resource forecast', 'Skill matching', 'Availability calendar'],
      value: {
        timeSaved: '5-7 hrs/week',
        laborReduced: 'Optimal allocation',
        errorsPrevented: 'Fewer conflicts',
        decisionLatency: 'Weekly → Daily',
      },
      confidence: 0.79,
    },
    process: {
      identifiedPain: 'Inconsistent project delivery.',
      workflow: [
        'Standardize project phases',
        'Track milestone completion',
        'Auto-escalate delays',
      ],
      automationLogic: [
        'If milestone late → alert PM',
        'Auto-update project status',
      ],
      outputs: ['Project dashboard', 'Milestone tracker', 'Risk report'],
      value: {
        timeSaved: '4-6 hrs/week',
        laborReduced: 'Automated tracking',
        errorsPrevented: '20% fewer delays',
        decisionLatency: 'Daily updates',
      },
      confidence: 0.81,
    },
    compliance: {
      identifiedPain: 'Engagement letter and contract compliance gaps.',
      workflow: [
        'Track contract terms',
        'Monitor scope boundaries',
        'Flag compliance issues',
      ],
      automationLogic: [
        'If scope exceeded → alert partner',
        'Auto-log all scope changes',
      ],
      outputs: ['Contract tracker', 'Scope monitor', 'Compliance alerts'],
      value: {
        timeSaved: '3-4 hrs/week',
        laborReduced: 'Better scope control',
        errorsPrevented: 'Reduced scope creep',
        decisionLatency: 'Immediate alerts',
      },
      confidence: 0.77,
    },
    scale: {
      identifiedPain: 'Scaling practice without losing quality.',
      workflow: [
        'Define delivery standards',
        'Track quality metrics',
        'Share best practices',
      ],
      automationLogic: [
        'If quality drops → trigger review',
        'Auto-assign mentorship',
      ],
      outputs: ['Quality scorecard', 'Practice metrics', 'Best practice library'],
      value: {
        timeSaved: '4-6 hrs/week',
        laborReduced: 'Consistent delivery',
        errorsPrevented: 'Maintained quality',
        decisionLatency: 'Weekly review',
      },
      confidence: 0.76,
    },
    visibility: {
      identifiedPain: 'Limited visibility into project profitability.',
      workflow: [
        'Track project financials',
        'Monitor profitability',
        'Generate partner reports',
      ],
      automationLogic: [
        'If margin < target → alert partner',
        'Auto-calculate profitability',
      ],
      outputs: ['Profitability dashboard', 'Project financials', 'Partner brief'],
      value: {
        timeSaved: '3-4 hrs/week',
        laborReduced: 'Automated analysis',
        errorsPrevented: 'Better profit management',
        decisionLatency: 'Weekly → Daily',
      },
      confidence: 0.82,
    },
  },
  'non-profit': {
    money: {
      identifiedPain: 'Donor revenue volatility and tracking gaps.',
      workflow: [
        'Track donation patterns',
        'Forecast revenue',
        'Flag at-risk donors',
      ],
      automationLogic: [
        'If donation drops → trigger outreach',
        'Auto-generate thank-you sequences',
      ],
      outputs: ['Donor dashboard', 'Revenue forecast', 'At-risk donor list'],
      value: {
        timeSaved: '4-6 hrs/week',
        laborReduced: 'Automated donor tracking',
        errorsPrevented: 'Higher retention',
        decisionLatency: 'Weekly → Daily',
      },
      confidence: 0.78,
    },
    labor: {
      identifiedPain: 'Volunteer coordination challenges.',
      workflow: [
        'Track volunteer availability',
        'Match skills to needs',
        'Schedule assignments',
      ],
      automationLogic: [
        'If shift unfilled → send alerts',
        'Auto-confirm assignments',
      ],
      outputs: ['Volunteer calendar', 'Skill matching', 'Assignment tracker'],
      value: {
        timeSaved: '5-7 hrs/week',
        laborReduced: 'Better coordination',
        errorsPrevented: 'Fewer no-shows',
        decisionLatency: 'Daily updates',
      },
      confidence: 0.76,
    },
    process: {
      identifiedPain: 'Inconsistent program delivery.',
      workflow: [
        'Standardize program workflows',
        'Track beneficiary outcomes',
        'Report on impact',
      ],
      automationLogic: [
        'If milestone missed → alert program lead',
        'Auto-generate impact reports',
      ],
      outputs: ['Program dashboard', 'Outcome tracker', 'Impact report'],
      value: {
        timeSaved: '4-5 hrs/week',
        laborReduced: 'Automated reporting',
        errorsPrevented: 'Better outcomes',
        decisionLatency: 'Monthly → Weekly',
      },
      confidence: 0.79,
    },
    compliance: {
      identifiedPain: 'Grant compliance and reporting burden.',
      workflow: [
        'Track grant requirements',
        'Monitor spending',
        'Generate compliance reports',
      ],
      automationLogic: [
        'If deadline approaching → alert staff',
        'Auto-compile report data',
      ],
      outputs: ['Grant tracker', 'Spending dashboard', 'Compliance report'],
      value: {
        timeSaved: '6-8 hrs/week',
        laborReduced: '50% less report prep',
        errorsPrevented: 'On-time submissions',
        decisionLatency: 'Continuous monitoring',
      },
      confidence: 0.82,
    },
    scale: {
      identifiedPain: 'Scaling impact without proportional cost increase.',
      workflow: [
        'Define scalable programs',
        'Track cost per outcome',
        'Identify efficiency gains',
      ],
      automationLogic: [
        'If cost per outcome increases → flag for review',
        'Auto-suggest optimizations',
      ],
      outputs: ['Efficiency dashboard', 'Cost per outcome', 'Scale readiness'],
      value: {
        timeSaved: '3-5 hrs/week',
        laborReduced: 'Better resource use',
        errorsPrevented: 'Sustainable growth',
        decisionLatency: 'Monthly review',
      },
      confidence: 0.74,
    },
    visibility: {
      identifiedPain: 'Limited visibility into mission impact.',
      workflow: [
        'Aggregate impact metrics',
        'Track against goals',
        'Generate board reports',
      ],
      automationLogic: [
        'If metric below target → alert leadership',
        'Auto-generate dashboards',
      ],
      outputs: ['Impact dashboard', 'Goal progress', 'Board report'],
      value: {
        timeSaved: '3-4 hrs/week',
        laborReduced: 'Automated reporting',
        errorsPrevented: 'Better decision-making',
        decisionLatency: 'Monthly → Weekly',
      },
      confidence: 0.8,
    },
  },
  government: {
    money: {
      identifiedPain: 'Budget tracking and allocation inefficiencies.',
      workflow: [
        'Track budget utilization',
        'Monitor spending patterns',
        'Flag over/under-spend',
      ],
      automationLogic: [
        'If variance > 10% → alert finance',
        'Auto-generate budget reports',
      ],
      outputs: ['Budget dashboard', 'Variance report', 'Allocation tracker'],
      value: {
        timeSaved: '5-7 hrs/week',
        laborReduced: 'Automated tracking',
        errorsPrevented: 'Better budget control',
        decisionLatency: 'Monthly → Weekly',
      },
      confidence: 0.79,
    },
    labor: {
      identifiedPain: 'Workforce planning gaps.',
      workflow: [
        'Forecast service demand',
        'Optimize staffing levels',
        'Track productivity',
      ],
      automationLogic: [
        'If backlog grows → recommend staffing',
        'Auto-balance workloads',
      ],
      outputs: ['Staffing forecast', 'Productivity dashboard', 'Workload balance'],
      value: {
        timeSaved: '4-6 hrs/week',
        laborReduced: 'Better allocation',
        errorsPrevented: 'Reduced backlogs',
        decisionLatency: 'Weekly planning',
      },
      confidence: 0.75,
    },
    process: {
      identifiedPain: 'Inconsistent service delivery processes.',
      workflow: [
        'Standardize service workflows',
        'Track processing times',
        'Auto-escalate delays',
      ],
      automationLogic: [
        'If SLA at risk → alert supervisor',
        'Auto-route to available staff',
      ],
      outputs: ['Process dashboard', 'SLA tracker', 'Escalation queue'],
      value: {
        timeSaved: '6-8 hrs/week',
        laborReduced: 'Faster processing',
        errorsPrevented: '25% fewer delays',
        decisionLatency: 'Same-day visibility',
      },
      confidence: 0.81,
    },
    compliance: {
      identifiedPain: 'Regulatory and audit compliance burden.',
      workflow: [
        'Track compliance requirements',
        'Auto-generate audit evidence',
        'Monitor policy adherence',
      ],
      automationLogic: [
        'If compliance gap → alert compliance officer',
        'Auto-log all activities',
      ],
      outputs: ['Compliance dashboard', 'Audit packet', 'Policy tracker'],
      value: {
        timeSaved: '8-10 hrs/week',
        laborReduced: '60% less audit prep',
        errorsPrevented: 'Zero compliance gaps',
        decisionLatency: 'Continuous monitoring',
      },
      confidence: 0.84,
    },
    scale: {
      identifiedPain: 'Scaling services to meet citizen demand.',
      workflow: [
        'Analyze demand patterns',
        'Optimize service channels',
        'Track citizen satisfaction',
      ],
      automationLogic: [
        'If demand spikes → recommend capacity',
        'Auto-route to digital channels',
      ],
      outputs: ['Demand forecast', 'Channel performance', 'Satisfaction score'],
      value: {
        timeSaved: '4-6 hrs/week',
        laborReduced: 'Channel optimization',
        errorsPrevented: 'Better service delivery',
        decisionLatency: 'Weekly review',
      },
      confidence: 0.77,
    },
    visibility: {
      identifiedPain: 'Limited visibility into program performance.',
      workflow: [
        'Aggregate program metrics',
        'Track KPIs',
        'Generate leadership reports',
      ],
      automationLogic: [
        'If KPI misses target → alert program lead',
        'Auto-generate dashboards',
      ],
      outputs: ['Program dashboard', 'KPI scorecard', 'Leadership brief'],
      value: {
        timeSaved: '3-5 hrs/week',
        laborReduced: 'Automated reporting',
        errorsPrevented: 'Better oversight',
        decisionLatency: 'Monthly → Weekly',
      },
      confidence: 0.82,
    },
  },
  education: {
    money: {
      identifiedPain: 'Budget constraints and resource allocation.',
      workflow: [
        'Track budget by program',
        'Monitor spending patterns',
        'Optimize resource allocation',
      ],
      automationLogic: [
        'If over-budget → alert administrator',
        'Auto-recommend reallocations',
      ],
      outputs: ['Budget dashboard', 'Spending tracker', 'Allocation report'],
      value: {
        timeSaved: '4-6 hrs/week',
        laborReduced: 'Better budget control',
        errorsPrevented: 'Optimal resource use',
        decisionLatency: 'Monthly → Weekly',
      },
      confidence: 0.77,
    },
    labor: {
      identifiedPain: 'Teacher and staff scheduling challenges.',
      workflow: [
        'Forecast staffing needs',
        'Optimize schedules',
        'Track substitute needs',
      ],
      automationLogic: [
        'If coverage gap → alert HR',
        'Auto-find substitutes',
      ],
      outputs: ['Schedule optimizer', 'Coverage tracker', 'Substitute queue'],
      value: {
        timeSaved: '5-7 hrs/week',
        laborReduced: 'Better coverage',
        errorsPrevented: 'Fewer gaps',
        decisionLatency: 'Daily updates',
      },
      confidence: 0.78,
    },
    process: {
      identifiedPain: 'Inconsistent administrative processes.',
      workflow: [
        'Standardize admin workflows',
        'Track process completion',
        'Auto-assign tasks',
      ],
      automationLogic: [
        'If task overdue → escalate',
        'Auto-route to appropriate staff',
      ],
      outputs: ['Process dashboard', 'Task tracker', 'Completion rate'],
      value: {
        timeSaved: '4-5 hrs/week',
        laborReduced: 'Streamlined admin',
        errorsPrevented: 'Fewer missed tasks',
        decisionLatency: 'Same-day visibility',
      },
      confidence: 0.79,
    },
    compliance: {
      identifiedPain: 'Accreditation and regulatory compliance.',
      workflow: [
        'Track compliance requirements',
        'Monitor documentation',
        'Prepare audit materials',
      ],
      automationLogic: [
        'If documentation missing → alert compliance',
        'Auto-compile audit packets',
      ],
      outputs: ['Compliance tracker', 'Documentation status', 'Audit packet'],
      value: {
        timeSaved: '6-8 hrs/week',
        laborReduced: '50% less prep time',
        errorsPrevented: 'Smooth accreditation',
        decisionLatency: 'Continuous monitoring',
      },
      confidence: 0.81,
    },
    scale: {
      identifiedPain: 'Scaling programs while maintaining quality.',
      workflow: [
        'Track enrollment trends',
        'Forecast capacity needs',
        'Monitor quality metrics',
      ],
      automationLogic: [
        'If enrollment > capacity → alert admin',
        'Auto-suggest expansions',
      ],
      outputs: ['Enrollment forecast', 'Capacity dashboard', 'Quality tracker'],
      value: {
        timeSaved: '3-5 hrs/week',
        laborReduced: 'Better planning',
        errorsPrevented: 'Quality maintained',
        decisionLatency: 'Semester → Monthly',
      },
      confidence: 0.76,
    },
    visibility: {
      identifiedPain: 'Limited visibility into student outcomes.',
      workflow: [
        'Track student progress',
        'Monitor at-risk indicators',
        'Generate outcome reports',
      ],
      automationLogic: [
        'If at-risk detected → alert advisor',
        'Auto-generate intervention list',
      ],
      outputs: ['Student dashboard', 'At-risk alerts', 'Outcome report'],
      value: {
        timeSaved: '4-6 hrs/week',
        laborReduced: 'Proactive intervention',
        errorsPrevented: 'Better outcomes',
        decisionLatency: 'Weekly → Daily',
      },
      confidence: 0.83,
    },
  },
};

const resolveConfidenceLabel = (score: number): ExplorerResult['confidenceLabel'] => {
  if (score >= 0.8) return 'High';
  if (score >= CONFIDENCE_THRESHOLD) return 'Moderate';
  return 'Low';
};

export const buildExplorerResult = (input: ExplorerInput): ExplorerResult | null => {
  if (!input.industry || !input.painPoint) return null;
  const mapping = INDUSTRY_MAP[input.industry][input.painPoint];
  const confidence = mapping.confidence;
  const confidenceLabel = resolveConfidenceLabel(confidence);
  const uncertaintyNote =
    confidence < CONFIDENCE_THRESHOLD
      ? 'Confidence is below threshold. Provide more specific constraints (volume, timelines, or system of record) to refine the output.'
      : undefined;

  const decisionTrail = [
    `Industry: ${input.industry}`,
    `Role context: ${input.role ?? 'not provided'}`,
    `Primary pain: ${input.painPoint}`,
    'Mapped to deterministic workflow template',
    'Generated bounded outputs and value signals',
  ];

  return {
    confidence,
    confidenceLabel,
    identifiedPain: mapping.identifiedPain,
    workflow: mapping.workflow,
    automationLogic: mapping.automationLogic,
    outputs: mapping.outputs,
    value: mapping.value,
    boundaries: BASE_BOUNDARIES,
    decisionTrail,
    uncertaintyNote,
  };
};
