import type { MetadataRoute } from 'next';
import { getAllTools } from '@/lib/tools/registry';
import { SOLUTIONS } from '@/lib/solutions';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://brainstackstudio.com').replace(/\/$/, '');

const STATIC_ROUTES = [
  '',
  '/explorer',
  '/tools',
  '/solutions',
  '/pricing',
  '/docs',
  '/api-docs',
  '/technology',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/security',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));

  const toolEntries: MetadataRoute.Sitemap = getAllTools()
    .filter((tool) => !tool.comingSoon)
    .map((tool) => ({
      url: `${siteUrl}/tools/${tool.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    }));

  const solutionEntries: MetadataRoute.Sitemap = SOLUTIONS.map((solution) => ({
    url: `${siteUrl}/solutions/${solution.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.72,
  }));

  return [...staticEntries, ...toolEntries, ...solutionEntries];
}
