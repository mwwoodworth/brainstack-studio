// Tool System Types for BrainStack Studio

export type ToolCategory =
  | 'calculators'
  | 'analyzers'
  | 'generators'
  | 'visualizers';

export type ToolIndustry =
  | 'universal'
  | 'operations'
  | 'construction'
  | 'saas'
  | 'finance'
  | 'supply-chain'
  | 'healthcare'
  | 'legal'
  | 'real-estate'
  | 'education'
  | 'manufacturing'
  | 'retail'
  | 'hospitality'
  | 'marketing'
  | 'hr'
  | 'sales'
  | 'agriculture'
  | 'energy'
  | 'non-profit'
  | 'government'
  | 'professional-services';

export type ToolPainPoint =
  | 'money'
  | 'labor'
  | 'process'
  | 'compliance'
  | 'scale'
  | 'visibility';

export type ConfidenceLevel = 'high' | 'moderate' | 'low';

export interface ToolInput {
  id: string;
  label: string;
  type: 'number' | 'text' | 'textarea' | 'select' | 'range' | 'currency' | 'percentage';
  placeholder?: string;
  defaultValue?: string | number;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  required?: boolean;
  helpText?: string;
  prefix?: string;
  suffix?: string;
}

export interface ToolOutput {
  id: string;
  label: string;
  value: string | number;
  format?: 'currency' | 'percentage' | 'number' | 'text' | 'months' | 'weeks';
  trend?: 'positive' | 'negative' | 'neutral';
  highlight?: boolean;
  description?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
    type?: 'line' | 'bar' | 'area';
  }[];
}

export interface ToolResult {
  outputs: ToolOutput[];
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  chart?: ChartData;
  summary: string;
  recommendations: string[];
  decisionTrail: string[];
  timestamp: string;
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: ToolCategory;
  industries: ToolIndustry[];
  painPoints: ToolPainPoint[];
  inputs: ToolInput[];
  icon: string; // Lucide icon name
  color: string; // Tailwind color class
  featured?: boolean;
  comingSoon?: boolean;
}

export interface ToolSession {
  id: string;
  toolId: string;
  inputs: Record<string, string | number>;
  result: ToolResult;
  createdAt: string;
}

// Tool execution function type
export type ToolExecutor = (inputs: Record<string, string | number>) => ToolResult;

// Tool registry entry
export interface ToolRegistryEntry {
  tool: Tool;
  execute: ToolExecutor;
}

// Category metadata
export interface CategoryMeta {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'calculators',
    name: 'Calculators & Estimators',
    description: 'Quantify costs, savings, and projections with precision',
    icon: 'Calculator',
    color: 'cyan',
  },
  {
    id: 'analyzers',
    name: 'Analyzers & Scorers',
    description: 'Score, assess, and prioritize with confidence',
    icon: 'BarChart3',
    color: 'emerald',
  },
  {
    id: 'generators',
    name: 'Generators & Builders',
    description: 'Create documents, sequences, and frameworks instantly',
    icon: 'Wand2',
    color: 'violet',
  },
  {
    id: 'visualizers',
    name: 'Visualizers & Dashboards',
    description: 'Transform data into actionable visual insights',
    icon: 'PieChart',
    color: 'amber',
  },
];

export const INDUSTRY_LABELS: Record<ToolIndustry, string> = {
  universal: 'All Industries',
  operations: 'Operations',
  construction: 'Construction',
  saas: 'SaaS',
  finance: 'Finance',
  'supply-chain': 'Supply Chain',
  healthcare: 'Healthcare',
  legal: 'Legal',
  'real-estate': 'Real Estate',
  education: 'Education',
  manufacturing: 'Manufacturing',
  retail: 'Retail',
  hospitality: 'Hospitality',
  marketing: 'Marketing',
  hr: 'HR / Recruiting',
  sales: 'Sales',
  agriculture: 'Agriculture',
  energy: 'Energy & Utilities',
  'non-profit': 'Non-Profit',
  government: 'Government',
  'professional-services': 'Professional Services',
};

export const PAIN_POINT_LABELS: Record<ToolPainPoint, string> = {
  money: 'Money / Margin',
  labor: 'Labor / Staffing',
  process: 'Process Efficiency',
  compliance: 'Compliance Risk',
  scale: 'Scale / Growth',
  visibility: 'Visibility / Reporting',
};
