import type { Metadata } from 'next';
import {
  constructMetadata,
  constructOrganizationStructuredData,
  resolveSiteUrl,
  siteConfig,
} from '@/app/lib/metadata';

describe('metadata helpers', () => {
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    if (originalSiteUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
    }
  });

  it('builds expected defaults with canonical root URL', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const metadata = constructMetadata();

    expect(metadata.metadataBase?.toString()).toBe('https://brainstackstudio.com/');
    expect(metadata.title).toEqual({
      default: siteConfig.defaultTitle,
      template: `%s | ${siteConfig.name}`,
    });
    expect(metadata.description).toBe(siteConfig.description);
    expect(metadata.keywords).toBe(siteConfig.keywords.join(', '));
    expect(metadata.alternates?.canonical).toBe('https://brainstackstudio.com');
    expect(metadata.openGraph?.url).toBe('https://brainstackstudio.com');
    expect(metadata.twitter?.images).toEqual([siteConfig.ogImage]);
    expect(metadata.robots).toEqual({
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    });
  });

  it('applies custom path and noindex directives', () => {
    const metadata = constructMetadata({
      title: 'Pricing',
      description: 'Pricing details',
      keywords: ['pricing', 'enterprise'],
      image: 'https://cdn.example.com/bss.png',
      path: '/pricing',
      noIndex: true,
    });

    expect(metadata.title).toBe('Pricing');
    expect(metadata.description).toBe('Pricing details');
    expect(metadata.keywords).toBe('pricing, enterprise');
    expect(metadata.alternates?.canonical).toBe('https://brainstackstudio.com/pricing');
    expect(metadata.openGraph?.url).toBe('https://brainstackstudio.com/pricing');
    expect(metadata.openGraph?.images).toEqual([
      expect.objectContaining({
        url: 'https://cdn.example.com/bss.png',
        alt: 'Pricing',
      }),
    ]);
    expect(metadata.twitter?.images).toEqual(['https://cdn.example.com/bss.png']);
    expect(metadata.robots).toEqual({
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        'max-image-preview': 'none',
        'max-snippet': 0,
        'max-video-preview': 0,
      },
    });
  });

  it('keeps absolute canonical paths untouched', () => {
    const metadata = constructMetadata({ path: 'https://alt.example.com/custom' });
    expect(metadata.alternates?.canonical).toBe('https://alt.example.com/custom');
    expect(metadata.openGraph?.url).toBe('https://alt.example.com/custom');
  });

  it('normalizes relative paths that do not include a leading slash', () => {
    const metadata = constructMetadata({ path: 'pricing' });
    expect(metadata.alternates?.canonical).toBe('https://brainstackstudio.com/pricing');
    expect(metadata.openGraph?.url).toBe('https://brainstackstudio.com/pricing');
  });

  it('falls back OpenGraph/Twitter title text when metadata title has no string default', () => {
    const metadata = constructMetadata({
      title: { absolute: 'Absolute title only' } as unknown as Metadata['title'],
    });

    expect(metadata.title).toEqual({ absolute: 'Absolute title only' });
    expect(metadata.openGraph?.title).toBe(siteConfig.defaultTitle);
    expect(metadata.twitter?.title).toBe(siteConfig.defaultTitle);
  });

  it('falls back OpenGraph/Twitter title text when title is null at runtime', () => {
    const metadata = constructMetadata({
      title: null as unknown as Metadata['title'],
    });

    expect(metadata.title).toBeNull();
    expect(metadata.openGraph?.title).toBe(siteConfig.defaultTitle);
    expect(metadata.twitter?.title).toBe(siteConfig.defaultTitle);
  });

  it('resolves environment site URL for both metadata and organization schema', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://preview.brainstackstudio.com/';

    expect(resolveSiteUrl()).toBe('https://preview.brainstackstudio.com');

    const metadata = constructMetadata({ path: '/test' });
    const org = constructOrganizationStructuredData();

    expect(metadata.metadataBase?.toString()).toBe('https://preview.brainstackstudio.com/');
    expect(metadata.alternates?.canonical).toBe('https://preview.brainstackstudio.com/test');
    expect(org.url).toBe('https://preview.brainstackstudio.com');
  });
});
