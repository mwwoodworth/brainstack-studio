import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Linkedin, Mail, Share2 } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getAllBlogPosts, getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/blog';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://brainstackstudio.com').replace(/\/$/, '');

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const url = `/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: [...post.tags, post.category, 'BrainStack Studio blog'],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${post.title} | BrainStack Studio`,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author],
      section: post.category,
      tags: post.tags,
      images: [
        {
          url: `${siteUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | BrainStack Studio`,
      description: post.description,
      images: [`${siteUrl}/opengraph-image`],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(post, 3);
  const absolutePostUrl = `${siteUrl}/blog/${post.slug}`;

  const shareLinks = {
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(absolutePostUrl)}&text=${encodeURIComponent(post.title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absolutePostUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Thought this was useful: ${absolutePostUrl}`)}`,
  };

  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <section className="pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Button asChild variant="ghost" size="sm" className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </Button>

          <article className="rounded-2xl border border-white/10 bg-black/30 p-6 md:p-10">
            <header className="mb-8 border-b border-white/10 pb-8">
              <Badge variant="primary" className="mb-4">{post.category}</Badge>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">{post.title}</h1>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">{post.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span>{post.author}</span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  {post.readTime}
                </span>
              </div>
            </header>

            <div
              className="
                text-slate-200
                [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4
                [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-7 [&_h3]:mb-3
                [&_p]:text-base [&_p]:leading-8 [&_p]:text-slate-300 [&_p]:mb-5
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2
                [&_li]:text-slate-300 [&_li]:leading-7
                [&_strong]:text-white
              "
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-10 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-4 h-4 text-cyan-400" />
                <h2 className="text-lg font-semibold">Share</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="secondary" size="sm">
                  <a href={shareLinks.x} target="_blank" rel="noopener noreferrer">
                    Share on X
                  </a>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                    Share on LinkedIn
                  </a>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <a href={shareLinks.email}>
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                </Button>
              </div>
            </div>
          </article>

          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="block h-full">
                  <Card variant="interactive" className="h-full hover:-translate-y-1 transition-transform duration-200">
                    <CardHeader>
                      <Badge variant="default" className="mb-3">{relatedPost.category}</Badge>
                      <CardTitle className="text-lg leading-tight">{relatedPost.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-300 mb-4 leading-relaxed">{relatedPost.description}</p>
                      <div className="text-xs text-slate-400 flex items-center justify-between gap-2">
                        <span>{formatDate(relatedPost.publishedAt)}</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-10">
            <Button asChild variant="ghost" size="sm">
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4" />
                Back to all posts
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
