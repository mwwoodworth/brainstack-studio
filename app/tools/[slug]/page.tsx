import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllTools, getToolBySlug } from '@/lib/tools';
import { ToolDetailView } from '@/components/tools/ToolDetailView';

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

  return <ToolDetailView tool={tool} />;
}
