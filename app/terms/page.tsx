'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const EFFECTIVE_DATE = 'February 18, 2026';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: [
      'These Terms of Use govern your access to and use of BrainStack Studio, including our website, dashboard, APIs, and related services.',
      'By creating an account, purchasing a subscription, or using the service, you agree to be bound by these Terms.',
    ],
  },
  {
    title: '2. Accounts and Access',
    body: [
      'You are responsible for maintaining the confidentiality of your login credentials and for activity under your account.',
      'You must provide accurate registration information and promptly update it when it changes.',
      'We may suspend or terminate access if we detect fraudulent, abusive, or unauthorized use.',
    ],
  },
  {
    title: '3. Subscription, Billing, and Cancellation',
    body: [
      'Paid subscriptions are billed through Stripe on a recurring monthly basis unless otherwise stated in your order.',
      'You can manage or cancel your subscription at any time through the customer billing portal in Settings.',
      'Unless required by law, fees are non-refundable for partial billing periods.',
    ],
  },
  {
    title: '4. Acceptable Use',
    body: [
      'You agree not to: (a) interfere with platform security or availability, (b) reverse engineer non-public systems, (c) misuse API keys, or (d) violate applicable laws.',
      'You may not use BrainStack Studio to process unlawful, infringing, or malicious content.',
    ],
  },
  {
    title: '5. Intellectual Property',
    body: [
      'BrainStack Studio and its software, design, trademarks, and documentation are owned by BrainStack Studio or its licensors.',
      'Subject to these Terms, we grant you a limited, non-exclusive, non-transferable right to use the service for internal business purposes.',
    ],
  },
  {
    title: '6. AI Outputs and Disclaimers',
    body: [
      'Platform outputs are provided for operational planning and productivity support, not as legal, financial, tax, or compliance advice.',
      'You are responsible for reviewing outputs and decisions before taking business action.',
    ],
  },
  {
    title: '7. Limitation of Liability',
    body: [
      'To the maximum extent permitted by law, BrainStack Studio is not liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, data, or goodwill.',
      'Our aggregate liability for claims related to the service will not exceed the amounts paid by you to BrainStack Studio in the 12 months before the event giving rise to the claim.',
    ],
  },
  {
    title: '8. Termination',
    body: [
      'You may stop using the service at any time. We may terminate or suspend access for material breach of these Terms.',
      'Sections that by nature should survive termination (including payment obligations, intellectual property, disclaimers, and liability limitations) will survive.',
    ],
  },
  {
    title: '9. Changes to Terms',
    body: [
      'We may update these Terms from time to time. If we make material changes, we will update the effective date and post the revised Terms on this page.',
    ],
  },
  {
    title: '10. Contact',
    body: [
      'Questions about these Terms can be sent to matthew@brainstackstudio.com.',
    ],
  },
];

export default function TermsPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-3">Terms of Use</h1>
            <p className="text-sm text-slate-500 mb-4">Effective date: {EFFECTIVE_DATE}</p>
            <p className="text-slate-400">
              These terms define how BrainStack Studio is provided and how subscribers can use the platform.
            </p>
          </div>

          {SECTIONS.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-sm text-slate-300">
                    {paragraph}
                  </p>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
