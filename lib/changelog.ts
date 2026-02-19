export type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  items: Array<{
    type: 'feature' | 'fix' | 'improvement';
    text: string;
  }>;
};

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    version: 'v2.8.0',
    date: 'February 2026',
    title: 'Blog & Content Hub',
    items: [
      { type: 'feature', text: 'Launched blog with insights on operational AI.' },
      { type: 'feature', text: 'Added changelog page for platform transparency.' },
      { type: 'improvement', text: 'Enhanced SEO with structured data markup.' },
    ],
  },
  {
    version: 'v2.7.0',
    date: 'February 2026',
    title: 'Pricing Optimization',
    items: [
      { type: 'feature', text: 'FAQ section on the pricing page.' },
      { type: 'improvement', text: 'Mobile-optimized feature comparison table.' },
      { type: 'improvement', text: 'Added trust signals (encryption, audit trail, cancel anytime).' },
    ],
  },
  {
    version: 'v2.6.0',
    date: 'January 2026',
    title: 'Explorer & Tools Expansion',
    items: [
      { type: 'feature', text: 'Guided AI Explorer with deterministic capability mapping.' },
      { type: 'feature', text: '15 free business tools (ROI calculator, cash flow, pricing optimizer, and more).' },
      { type: 'feature', text: 'Solution gallery with 50+ workflow patterns.' },
      { type: 'improvement', text: 'Enhanced onboarding flow.' },
    ],
  },
  {
    version: 'v2.5.0',
    date: 'January 2026',
    title: 'Auth & Subscriptions',
    items: [
      { type: 'feature', text: 'Stripe subscription integration with the $99/month Pro plan.' },
      { type: 'feature', text: 'Customer portal for billing management.' },
      { type: 'feature', text: 'Dashboard with usage analytics.' },
      { type: 'fix', text: 'Stripe SDK lazy initialization for build stability.' },
    ],
  },
  {
    version: 'v2.4.0',
    date: 'December 2025',
    title: 'Platform Foundation',
    items: [
      { type: 'feature', text: 'API documentation portal.' },
      { type: 'feature', text: 'Security page with governance model.' },
      { type: 'feature', text: 'Playground for workflow experimentation.' },
      { type: 'feature', text: 'Error boundary and 404 handling.' },
      { type: 'improvement', text: 'PWA manifest and OG image generation.' },
    ],
  },
];
