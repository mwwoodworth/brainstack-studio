'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getSolutionBySlug } from '@/lib/solutions';
import { trackEvent } from '@/lib/telemetry';
import { ArrowLeft, ArrowRight, Shield } from 'lucide-react';

type Props = {
  params: Promise<{ slug: string }>;
};

export default function SolutionDetailPage({ params }: Props) {
  const { slug } = use(params);
  const solution = getSolutionBySlug(slug);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (solution) {
      void trackEvent({
        name: 'solution_view',
        payload: { slug: solution.slug },
      });
    }
  }, [solution]);

  if (!solution) return notFound();

  const preview = solution.preview[activeStep];

  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <section className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" size="sm">
              <Link href="/solutions">
                <ArrowLeft className="w-4 h-4" />
                Back to Solutions
              </Link>
            </Button>
            <Badge variant="primary">{solution.industry}</Badge>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold">{solution.name}</h1>
            <p className="text-lg text-slate-300 max-w-3xl">{solution.problem}</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Example</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-slate-300">
                  {solution.workflow.map((step) => (
                    <li key={step} className="flex gap-2">
                      <ArrowRight className="w-4 h-4 text-cyan-400 mt-0.5" />
                      {step}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Outputs</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {solution.outputs.map((output) => (
                  <Badge key={output} variant="default" className="text-xs">
                    {output}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Example Preview</CardTitle>
              <p className="text-sm text-slate-300">
                Safe example preview using sanitized inputs and outputs. Production implementations are scoped to your requirements.
              </p>
            </CardHeader>
            <CardContent className="grid lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                {solution.preview.map((step, index) => (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    aria-pressed={activeStep === index}
                    aria-label={`Preview step ${index + 1}: ${step.title}`}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                      activeStep === index
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200'
                        : 'border-white/10 text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="text-sm font-semibold">{step.title}</div>
                    <div className="text-xs text-slate-500 mt-1">Preview step {index + 1}</div>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-slate-300 mb-2">Input</div>
                  <p className="text-sm text-slate-200">{preview.input}</p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-slate-300 mb-2">Example Output</div>
                  <ul className="space-y-2 text-sm text-slate-200">
                    {preview.output.map((line) => (
                      <li key={line} className="flex gap-2">
                        <ArrowRight className="w-4 h-4 text-emerald-400 mt-0.5" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Safety & Boundaries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              {solution.boundaries.map((boundary) => (
                <div key={boundary} className="flex gap-2">
                  <Shield className="w-4 h-4 text-emerald-400 mt-0.5" />
                  {boundary}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/pricing">View Pricing</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/contact">Request Implementation</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
