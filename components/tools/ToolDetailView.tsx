'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ToolExecutor } from '@/components/tools';
import { Tool } from '@/lib/tools';
import { trackEvent } from '@/lib/telemetry';
import {
  ArrowLeft,
  Clock,
  Target,
  Zap,
  Building2,
  TrendingUp,
  Wallet,
  DollarSign,
  Users,
  HeartPulse,
  UserCheck,
  AlertTriangle,
  ClipboardCheck,
  Activity,
  FileText,
  Mail,
  Calendar,
  Briefcase,
  FileQuestion,
  Calculator,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  TrendingUp,
  Wallet,
  DollarSign,
  Users,
  Target,
  HeartPulse,
  UserCheck,
  AlertTriangle,
  ClipboardCheck,
  Activity,
  FileText,
  Mail,
  Calendar,
  Briefcase,
  FileQuestion,
  Calculator,
};

export function ToolDetailView({ tool }: { tool: Tool }) {
  useEffect(() => {
    void trackEvent({
      name: 'tool_view',
      payload: { slug: tool.slug, category: tool.category },
    });
  }, [tool]);

  // Dynamic icon lookup via strict mapping
  const IconComponent = ICON_MAP[tool.icon] || Calculator;

  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <section className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Back Link */}
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" size="sm">
              <Link href="/tools">
                <ArrowLeft className="w-4 h-4" />
                Back to Tools
              </Link>
            </Button>
            <Badge variant="primary" className="capitalize">{tool.category.slice(0, -1)}</Badge>
          </div>

          {/* Tool Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-6"
          >
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${tool.color}20` }}
            >
              <IconComponent className="w-8 h-8" style={{ color: tool.color }} />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">{tool.name}</h1>
              <p className="text-lg text-slate-400 max-w-2xl">{tool.description}</p>
            </div>
          </motion.div>

          {/* Tool Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-6 text-sm text-slate-400"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Instant results
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              Confidence scoring
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              No signup required
            </div>
          </motion.div>

          {/* Industries & Pain Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-4"
          >
            {tool.industries.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Building2 className="w-4 h-4 text-slate-500" />
                {tool.industries.map((industry) => (
                  <Badge key={industry} variant="default" className="text-xs">
                    {industry}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>

          {/* Tool Executor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ToolExecutor tool={tool} />
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-8 border-t border-slate-800"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-white mb-1">Need this in your workflow?</h3>
                <p className="text-sm text-slate-400">
                  We can integrate this tool directly into your systems with real-time data.
                </p>
              </div>
              <div className="flex gap-3">
                <Button asChild>
                  <Link href="/contact">Request Integration</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/tools">Explore More Tools</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
