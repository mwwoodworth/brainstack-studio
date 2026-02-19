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
    version: 'v3.0.0',
    date: 'February 2026',
    title: 'SEO Perfection & Lead Capture',
    items: [
      { type: 'feature', text: 'Newsletter signup with email capture across blog, posts, and footer.' },
      { type: 'feature', text: '8 solution blueprints covering Operations, Construction, SaaS, Finance, Supply Chain, HR, IT, and Marketing.' },
      { type: 'feature', text: '8 blog posts with Article structured data and breadcrumb navigation.' },
      { type: 'improvement', text: 'Full SEO metadata on every page including privacy, terms, and security.' },
      { type: 'improvement', text: 'AI content enhancement upgraded to Claude Sonnet 4.5.' },
      { type: 'fix', text: 'Rate limiting and input validation on AI enhance endpoint.' },
      { type: 'fix', text: 'HTML injection protection in email notification bodies.' },
    ],
  },
  {
    version: 'v2.9.0',
    date: 'February 2026',
    title: 'Content & Structured Data',
    items: [
      { type: 'feature', text: 'Article JSON-LD and BreadcrumbList structured data on blog and solution pages.' },
      { type: 'feature', text: 'Organization JSON-LD with logo and social profiles.' },
      { type: 'improvement', text: 'Favicon redirect from .ico to SVG.' },
      { type: 'improvement', text: 'Per-page SEO metadata via layout.tsx pattern for client components.' },
    ],
  },
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
      { type: 'feature', text: 'Solution gallery with production-ready workflow blueprints.' },
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
