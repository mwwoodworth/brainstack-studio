'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const EFFECTIVE_DATE = 'February 18, 2026';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: [
      'Account information: email address, authentication identifiers, and account metadata required to provide access.',
      'Billing information: subscription and payment status data received from Stripe. Full card details are handled by Stripe and are not stored by BrainStack Studio.',
      'Usage and product data: session records, API key metadata, and feature usage events needed to operate dashboard analytics and service reliability.',
      'Support and contact submissions: information you provide when requesting support or implementation services.',
    ],
  },
  {
    title: '2. How We Use Information',
    body: [
      'We use data to provide the service, manage subscriptions, secure accounts, improve product quality, and respond to support requests.',
      'We also process limited telemetry to measure feature adoption and platform performance when telemetry is enabled.',
    ],
  },
  {
    title: '3. Data Sharing',
    body: [
      'We do not sell personal data.',
      'We share data only with service providers needed to run BrainStack Studio, including hosting, authentication, and payment processors (such as Supabase, Vercel, and Stripe).',
      'We may disclose information when required by law or to protect platform security and legal rights.',
    ],
  },
  {
    title: '4. Data Retention',
    body: [
      'We retain account and subscription records for as long as your account is active and for a reasonable period afterward to meet legal, security, and accounting obligations.',
      'You can clear stored explorer sessions from Settings. Additional deletion requests can be sent to us using the contact listed below.',
    ],
  },
  {
    title: '5. Security',
    body: [
      'We use access controls, encrypted transport (HTTPS), and least-privilege practices to protect data.',
      'No system is perfectly secure, but we continuously improve controls to reduce risk.',
    ],
  },
  {
    title: '6. Your Choices',
    body: [
      'You can manage telemetry preferences and session retention settings from the Settings page.',
      'You may request account deletion or data access by contacting us at matthew@brainstackstudio.com.',
    ],
  },
  {
    title: '7. Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time. Material changes will be reflected by updating the effective date on this page.',
    ],
  },
  {
    title: '8. Contact',
    body: [
      'Questions or requests about privacy can be sent to matthew@brainstackstudio.com.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
            <p className="text-sm text-slate-500 mb-4">Effective date: {EFFECTIVE_DATE}</p>
            <p className="text-slate-400">
              This policy describes what data BrainStack Studio collects, how it is used, and your controls.
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
