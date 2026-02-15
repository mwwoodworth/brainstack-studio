'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SOLUTIONS } from '@/lib/solutions';
import { ArrowRight } from 'lucide-react';

export default function SolutionsPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="primary" className="mb-4">Solution Gallery</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Operational AI, by industry.</h1>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Explore operational AI workflows tailored to real industries. Each solution shows what it does,
              what it needs, and how a production implementation comes together.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {SOLUTIONS.map((solution, idx) => (
              <motion.div
                key={solution.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-2xl">{solution.name}</CardTitle>
                    <p className="text-sm text-slate-300">{solution.industry}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-300">{solution.problem}</p>
                    <div className="flex flex-wrap gap-2">
                      {solution.outputs.slice(0, 3).map((output) => (
                        <Badge key={output} variant="default" className="text-xs">
                          {output}
                        </Badge>
                      ))}
                    </div>
                    <Button asChild size="sm" className="mt-2">
                      <Link href={`/solutions/${solution.slug}`}>
                        View Solution
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
