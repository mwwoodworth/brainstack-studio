import { AIModel, UserPreferences } from '@/types';

export const AI_MODELS: AIModel[] = [
  {
    id: 'deterministic',
    name: 'Deterministic Core',
    provider: 'Capability Facade',
    color: 'bg-cyan-500',
    gradientColor: 'from-cyan-500 to-blue-500',
    description: 'Bounded operational workflows with deterministic outputs',
    capabilities: ['Workflow Mapping', 'Confidence Scoring', 'Decision Trails'],
    contextWindow: 'N/A',
    pricing: 'Included',
  },
  {
    id: 'forecast',
    name: 'Operational Forecast',
    provider: 'Capability Facade',
    color: 'bg-emerald-500',
    gradientColor: 'from-emerald-500 to-teal-500',
    description: 'Deterministic forecasting and variance detection',
    capabilities: ['Forecasting', 'Variance Alerts', 'Risk Banding'],
    contextWindow: 'N/A',
    pricing: 'Module-based',
  },
  {
    id: 'compliance',
    name: 'Compliance Guard',
    provider: 'Capability Facade',
    color: 'bg-amber-500',
    gradientColor: 'from-amber-500 to-orange-500',
    description: 'Audit-ready guardrails and checkpoint tracking',
    capabilities: ['Audit Trails', 'Checkpoint Enforcement', 'Exception Logs'],
    contextWindow: 'N/A',
    pricing: 'Module-based',
  },
  {
    id: 'automation',
    name: 'Automation Blueprint',
    provider: 'Capability Facade',
    color: 'bg-indigo-500',
    gradientColor: 'from-indigo-500 to-purple-500',
    description: 'Process automation templates with safe constraints',
    capabilities: ['Workflow Templates', 'Escalation Rules', 'Task Bundles'],
    contextWindow: 'N/A',
    pricing: 'Module-based',
  },
];

export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultModel: 'deterministic',
  theme: 'dark',
  streamingEnabled: true,
  systemPrompt: `You are BrainStack Studio, a deterministic operational AI preview.
Provide bounded workflow guidance, confidence scoring, and clear boundaries.
Do not expose proprietary systems or internal infrastructure.`,
  temperature: 0.7,
  maxTokens: 4096,
};

export const PLATFORM_FEATURES = [
  {
    title: 'Deterministic Outputs',
    description: 'Bounded workflows and repeatable results',
    icon: 'Target',
  },
  {
    title: 'Confidence Scoring',
    description: 'Explicit uncertainty signaling with thresholds',
    icon: 'Shield',
  },
  {
    title: 'Decision Trails',
    description: 'User-visible summaries for auditability',
    icon: 'ClipboardCheck',
  },
  {
    title: 'Capability Facades',
    description: 'Safe previews without exposing internal systems',
    icon: 'Lock',
  },
  {
    title: 'Enterprise Deployment',
    description: 'Scoped implementations with clear guardrails',
    icon: 'Users',
  },
  {
    title: 'Telemetry Control',
    description: 'Opt-in usage telemetry with privacy controls',
    icon: 'Eye',
  },
];

export const STORAGE_KEYS = {
  CONVERSATIONS: 'brainstack_conversations',
  PREFERENCES: 'brainstack_preferences',
  CURRENT_CONVERSATION: 'brainstack_current_conversation',
};
