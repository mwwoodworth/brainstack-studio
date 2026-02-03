'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ToolCard } from '@/components/tools';
import { getAllTools, getToolsByCategory, getFeaturedTools, ToolCategory } from '@/lib/tools';
import { useState, useMemo } from 'react';
import { Sparkles, Calculator, BarChart3, Wand2, Eye, Search, Filter } from 'lucide-react';

const CATEGORY_INFO: Record<ToolCategory, { label: string; icon: React.ReactNode; description: string }> = {
  calculators: {
    label: 'Calculators',
    icon: <Calculator className="w-5 h-5" />,
    description: 'Financial and operational calculators',
  },
  analyzers: {
    label: 'Analyzers',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Data analysis and insight tools',
  },
  generators: {
    label: 'Generators',
    icon: <Wand2 className="w-5 h-5" />,
    description: 'Content and strategy generators',
  },
  visualizers: {
    label: 'Visualizers',
    icon: <Eye className="w-5 h-5" />,
    description: 'Data visualization tools',
  },
};

const CATEGORIES: ToolCategory[] = ['calculators', 'analyzers', 'generators', 'visualizers'];

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allTools = getAllTools();
  const featuredTools = getFeaturedTools();

  const filteredTools = useMemo(() => {
    let tools = selectedCategory === 'all' ? allTools : getToolsByCategory(selectedCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      tools = tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.shortDescription.toLowerCase().includes(query) ||
          tool.industries.some((i) => i.toLowerCase().includes(query)) ||
          tool.painPoints.some((p) => p.toLowerCase().includes(query))
      );
    }

    return tools;
  }, [selectedCategory, searchQuery, allTools]);

  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="primary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Interactive Tools
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Free Business Tools
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Powerful calculators, analyzers, and generators to solve real business problems.
              No signup required. Try them now.
            </p>
          </motion.div>

          {/* Featured Tools */}
          {featuredTools.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-16"
            >
              <h2 className="text-xl font-semibold mb-6 text-center">Featured Tools</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTools.map((tool, idx) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <ToolCard tool={tool} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <label htmlFor="tools-search" className="sr-only">Search tools</label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" aria-hidden="true" />
              <input
                id="tools-search"
                type="search"
                placeholder="Search tools by name, industry, or problem..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0" role="group" aria-label="Filter tools by category">
              <Filter className="w-5 h-5 text-slate-500 flex-shrink-0" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                aria-pressed={selectedCategory === 'all'}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black ${
                  selectedCategory === 'all'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
                }`}
              >
                All Tools
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span aria-hidden="true">{CATEGORY_INFO[cat].icon}</span>
                  {CATEGORY_INFO[cat].label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-slate-500 mb-6">
            {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'all' && ` in ${CATEGORY_INFO[selectedCategory].label}`}
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, idx) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTools.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-400 mb-2">No tools found</h3>
              <p className="text-slate-500">
                Try adjusting your search or filter to find what you&apos;re looking for.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Want These Tools Automated?</h3>
            <p className="text-slate-400 mb-6 max-w-xl mx-auto">
              BrainStack can run these analyses continuously on your real data, with alerts,
              integrations, and AI-powered recommendations.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/contact">Talk to Our Team</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
