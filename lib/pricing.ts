export type PlanId = 'free' | 'pro' | 'enterprise';

export type PlanPrice = {
  amount: number | null;
  currency: string;
  interval: 'month' | 'year' | 'once' | 'custom';
  display: string;
};

export type PricingPlan = {
  id: PlanId;
  name: string;
  description: string;
  cta: string;
  href: string | null;
  stripePlan: string | null;
  popular?: boolean;
  price: PlanPrice;
  features: string[];
};

export type FeatureComparisonRow = {
  id: string;
  label: string;
  values: Record<PlanId, string>;
};

export const DEFAULT_PRO_FEATURES = [
  'Advanced workflow templates',
  'Cloud-synced explorer sessions',
  'API key access for integrations',
  'Priority support',
  'Billing portal and subscription controls',
];

export const FEATURE_COMPARISON_ROWS: FeatureComparisonRow[] = [
  {
    id: 'explorer',
    label: 'Explorer sessions',
    values: {
      free: 'Local browser sessions',
      pro: 'Cloud-synced sessions',
      enterprise: 'Shared + governed',
    },
  },
  {
    id: 'tools',
    label: 'Interactive tools',
    values: {
      free: 'All public tools',
      pro: 'All + API access',
      enterprise: 'All + custom packs',
    },
  },
  {
    id: 'support',
    label: 'Support SLA',
    values: {
      free: 'Community',
      pro: '24-hour response',
      enterprise: 'Dedicated support',
    },
  },
  {
    id: 'security',
    label: 'Security model',
    values: {
      free: 'Standard controls',
      pro: 'Role-based controls',
      enterprise: 'Custom governance',
    },
  },
  {
    id: 'deploy',
    label: 'Deployment options',
    values: {
      free: 'Self-serve',
      pro: 'Managed cloud',
      enterprise: 'Cloud / VPC / on-prem',
    },
  },
];

export function parseProductFeatures(raw: string | null | undefined) {
  if (!raw) return [];
  return raw
    .split(/[\n,]/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatPriceDisplay(amount: number | null, currency: string, interval: PlanPrice['interval']) {
  if (amount === null) return 'Custom';
  const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amount);

  if (interval === 'month') return `${value}/mo`;
  if (interval === 'year') return `${value}/yr`;
  return value;
}
