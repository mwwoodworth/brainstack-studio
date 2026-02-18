'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BLOG_CATEGORIES, type BlogPost } from '@/lib/blog';
import { cn } from '@/lib/utils';

const FILTER_TABS = ['All', ...BLOG_CATEGORIES] as const;

type CategoryFilter = (typeof FILTER_TABS)[number];

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

interface BlogListingClientProps {
  posts: BlogPost[];
}

export function BlogListingClient({ posts }: BlogListingClientProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') {
      return posts;
    }

    return posts.filter((post) => post.category === activeCategory);
  }, [activeCategory, posts]);

  const featuredPost = filteredPosts.find((post) => post.featured) ?? filteredPosts[0];
  const standardPosts = filteredPosts.filter((post) => post.slug !== featuredPost?.slug);

  return (
    <section className="pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="primary" className="mb-4">
            Blog
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Insights on Operational AI</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Practical playbooks for deterministic AI, workflow automation, governance, and enterprise execution.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist" aria-label="Filter posts by category">
          {FILTER_TABS.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'px-4 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black',
                activeCategory === category
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link href={`/blog/${featuredPost.slug}`} className="block group">
              <Card
                variant="interactive"
                className="h-full bg-gradient-to-br from-cyan-500/10 via-slate-900/40 to-blue-500/10 border-cyan-500/20"
              >
                <div className="grid lg:grid-cols-5 gap-6 items-start">
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="primary">Featured</Badge>
                      <Badge variant="default">{featuredPost.category}</Badge>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-cyan-300 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-slate-300 mb-5 leading-relaxed">{featuredPost.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        {formatDate(featuredPost.publishedAt)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-black/30 border border-white/10 rounded-xl p-5">
                    <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Why read this</p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Get a tactical framework you can apply immediately to production workflows with governance,
                      traceability, and measurable operational impact.
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 text-sm font-medium text-white">
                      Read featured post
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        )}

        {standardPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {standardPosts.map((post, idx) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <Card
                    variant="interactive"
                    className="h-full hover:-translate-y-1 transition-transform duration-200"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="default">{post.category}</Badge>
                      </div>
                      <CardTitle className="text-xl leading-tight">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-300 text-sm leading-relaxed">{post.description}</p>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          {formatDate(post.publishedAt)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          {post.readTime}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="text-center">
            <CardContent className="py-12">
              <p className="text-lg text-slate-300 mb-2">No posts in this category yet.</p>
              <p className="text-slate-400">Select another category to explore operational AI insights.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
