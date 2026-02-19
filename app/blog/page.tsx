import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { BlogListingClient } from '@/components/blog/BlogListingClient';
import { NewsletterCTA } from '@/components/NewsletterCTA';
import { getAllBlogPosts } from '@/lib/blog';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://brainstackstudio.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Insights on operational AI, deterministic automation, AI governance, and enterprise workflow strategy from BrainStack Studio.',
  keywords: [
    'operational AI blog',
    'deterministic AI',
    'workflow automation',
    'AI governance',
    'enterprise AI',
    'BrainStack Studio',
  ],
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Insights on Operational AI | BrainStack Studio Blog',
    description:
      'Actionable guidance on deterministic AI, automation ROI, governance controls, and enterprise operations.',
    url: '/blog',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'BrainStack Studio Blog - Insights on Operational AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insights on Operational AI | BrainStack Studio Blog',
    description:
      'Actionable guidance on deterministic AI, automation ROI, governance controls, and enterprise operations.',
    images: [`${siteUrl}/opengraph-image`],
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />
      <BlogListingClient posts={posts} />
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <NewsletterCTA />
        </div>
      </section>
      <Footer />
    </main>
  );
}
