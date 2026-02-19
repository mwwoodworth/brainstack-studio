import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllSolutions, getSolutionBySlug } from '@/lib/solutions';
import { SolutionDetailView } from '@/components/solutions/SolutionDetailView';
import { JsonLd } from '@/components/JsonLd';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const solutions = getAllSolutions();
  return solutions.map((solution) => ({
    slug: solution.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);

  if (!solution) {
    return {
      title: 'Solution Not Found | BrainStack Studio',
    };
  }

  return {
    title: `${solution.name} | BrainStack Studio`,
    description: solution.problem,
    openGraph: {
      title: `${solution.name} - Operational AI Solution`,
      description: solution.problem,
      type: 'website',
      url: `/solutions/${solution.slug}`,
    },
  };
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);

  if (!solution) {
    notFound();
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://brainstackstudio.com').replace(/\/$/, '');

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${siteUrl}/solutions` },
      { '@type': 'ListItem', position: 3, name: solution.name, item: `${siteUrl}/solutions/${solution.slug}` },
    ],
  };

  return (
    <>
      <JsonLd id={`breadcrumb-solution-${solution.slug}`} data={breadcrumbData} />
      <SolutionDetailView solution={solution} />
    </>
  );
}
