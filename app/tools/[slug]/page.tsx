import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllTools, getToolBySlug } from '@/lib/tools';
import { ToolDetailView } from '@/components/tools/ToolDetailView';
import { JsonLd } from '@/components/JsonLd';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found | BrainStack Studio',
    };
  }

  return {
    title: `${tool.name} | BrainStack Studio`,
    description: tool.description,
    openGraph: {
      title: tool.name,
      description: tool.description,
      type: 'website',
    },
  };
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://brainstackstudio.com').replace(/\/$/, '');

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${siteUrl}/tools` },
      { '@type': 'ListItem', position: 3, name: tool.name, item: `${siteUrl}/tools/${tool.slug}` },
    ],
  };

  return (
    <>
      <JsonLd id={`breadcrumb-tool-${tool.slug}`} data={breadcrumbData} />
      <ToolDetailView tool={tool} />
    </>
  );
}
