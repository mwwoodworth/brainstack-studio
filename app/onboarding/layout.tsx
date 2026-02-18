import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onboarding',
  description: 'Complete your BrainStack Studio workspace setup and configuration.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
