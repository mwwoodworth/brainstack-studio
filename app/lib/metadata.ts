import type { Metadata } from 'next';

export const siteConfig = {
  name: 'BrainStack Studio',
  url: 'https://brainstackstudio.com',
  defaultTitle: 'BrainStack Studio | Operational AI Platform',
  description:
    'Operational AI platform for enterprise automation. Secure, governed workflows for Finance, HR, IT, and Sales. Start free with our AI Explorer.',
  keywords: [
    'Operational AI Platform',
    'Enterprise Automation',
    'Workflow Automation',
    'Business Process Automation',
    'AI Governance',
    'AI Agents',
    'Audit Trails',
    'BrainStack Studio',
    'AI for Finance',
    'HR Automation',
    'ITSM AI',
    'Sales Operations AI',
    'Secure AI',
  ],
  ogImage: '/opengraph-image',
} as const;

type ConstructMetadataInput = {
  title?: Metadata['title'];
  description?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  path?: string;
};

export function resolveSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url).replace(/\/$/, '');
}

function resolveCanonicalUrl(path: string | undefined, siteUrl: string) {
  if (!path || path === '/') return siteUrl;
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

function titleToText(title: Metadata['title'] | undefined) {
  if (!title) return siteConfig.defaultTitle;
  if (typeof title === 'string') return title;
  if (typeof title === 'object' && 'default' in title && typeof title.default === 'string') {
    return title.default;
  }
  return siteConfig.defaultTitle;
}

export function constructMetadata({
  title = {
    default: siteConfig.defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description = siteConfig.description,
  keywords = [...siteConfig.keywords],
  image = siteConfig.ogImage,
  noIndex = false,
  path,
}: ConstructMetadataInput = {}): Metadata {
  const siteUrl = resolveSiteUrl();
  const canonical = resolveCanonicalUrl(path, siteUrl);
  const titleText = titleToText(title);

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    applicationName: siteConfig.name,
    keywords: keywords.join(', '),
    authors: [{ name: siteConfig.name }],
    category: 'Technology',
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
            'max-image-preview': 'none',
            'max-snippet': 0,
            'max-video-preview': 0,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    alternates: {
      canonical,
    },
    icons: {
      icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
      apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    openGraph: {
      title: titleText,
      description,
      type: 'website',
      url: canonical,
      siteName: siteConfig.name,
      locale: 'en_US',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: titleText,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titleText,
      description,
      images: [image],
    },
  };
}

export function constructOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: resolveSiteUrl(),
    description: 'Operational AI Platform for enterprise workflow automation',
    sameAs: [],
  };
}
