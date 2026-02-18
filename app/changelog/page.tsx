import type { Metadata } from 'next';
import { CalendarDays, GitBranch } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CHANGELOG_ENTRIES } from '@/lib/changelog';

const ENTRY_DESCRIPTIONS: Record<string, string> = {
  'v2.8.0':
    'Expanded the content surface with publishing and transparency features that help teams evaluate product velocity.',
  'v2.7.0':
    'Improved the commercial experience with clearer packaging, trust reinforcement, and better mobile usability.',
  'v2.6.0':
    'Scaled discovery and experimentation with broader tooling, richer explorer guidance, and faster onboarding paths.',
  'v2.5.0':
    'Introduced account monetization fundamentals with subscription flows, billing controls, and usage visibility.',
  'v2.4.0':
    'Established core product infrastructure across docs, security, resilience, and deployment metadata.',
};

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'Track BrainStack Studio product releases, new features, platform fixes, and operational AI improvements.',
  alternates: {
    canonical: '/changelog',
  },
  openGraph: {
    title: 'Changelog | BrainStack Studio',
    description:
      'See the latest product updates for BrainStack Studio, including feature launches, improvements, and fixes.',
    url: '/changelog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Changelog | BrainStack Studio',
    description: 'Product updates and release notes for BrainStack Studio.',
  },
};

const TYPE_VARIANTS = {
  feature: 'primary',
  fix: 'warning',
  improvement: 'default',
} as const;

const TYPE_LABELS = {
  feature: 'Feature',
  fix: 'Fix',
  improvement: 'Improvement',
} as const;

export default function ChangelogPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <section className="pt-28 pb-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="primary" className="mb-4">Changelog</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">What&apos;s New</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Product updates for BrainStack Studio, from major feature launches to platform hardening and UX
            refinements.
          </p>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {CHANGELOG_ENTRIES.map((entry, index) => (
            <div key={entry.version} className="relative pl-8 md:pl-10">
              <span className="absolute left-0 top-8 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_0_6px_rgba(14,165,233,0.15)]" />
              {index < CHANGELOG_ENTRIES.length - 1 && (
                <span className="absolute left-[5px] top-12 bottom-[-2.5rem] w-px bg-white/10" />
              )}

              <Card className="bg-white/[0.04]">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <Badge variant="default" className="w-fit">
                      <GitBranch className="w-3 h-3" />
                      {entry.version}
                    </Badge>
                    <div className="inline-flex items-center gap-2 text-sm text-slate-400">
                      <CalendarDays className="w-4 h-4" />
                      {entry.date}
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{entry.title}</CardTitle>
                  <p className="text-sm text-slate-300 mt-2">{ENTRY_DESCRIPTIONS[entry.version]}</p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {entry.items.map((item) => (
                      <li key={`${entry.version}-${item.type}-${item.text}`} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <Badge variant={TYPE_VARIANTS[item.type]}>{TYPE_LABELS[item.type]}</Badge>
                          <span className="text-slate-200">{item.text}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
