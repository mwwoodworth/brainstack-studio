'use client';

import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Shield,
  Target,
  Users,
  Compass,
  ClipboardCheck,
  HeartHandshake,
} from 'lucide-react';
import Link from 'next/link';

const VALUES = [
  {
    icon: Shield,
    title: 'Trust by Design',
    description: 'We default to safety, boundaries, and explicit uncertainty.',
  },
  {
    icon: Target,
    title: 'Operational Clarity',
    description: 'We map real workflows, not generic promises.',
  },
  {
    icon: ClipboardCheck,
    title: 'Deterministic First',
    description: 'Outputs are bounded, repeatable, and audit-friendly.',
  },
  {
    icon: Users,
    title: 'Human-Centered',
    description: 'We augment operators instead of replacing judgment.',
  },
];

const MILESTONES = [
  { year: '2024', event: 'BrainOps operational AI framework initiated' },
  { year: '2025', event: 'Industry pilots validated deterministic workflows' },
  { year: '2026', event: 'BrainStack Studio launched as the public interface' },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-6">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-slate-300">About BrainStack Studio</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Operational AI,
              <br />
              built for trust.
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              BrainStack Studio is the public face of BrainOps — a calm, credible showcase of
              operational AI capabilities without exposing proprietary systems. We focus on
              specific problems, measurable value, and deterministic outcomes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/explorer">
                <Button size="xl">Run Guided Explorer</Button>
              </Link>
              <Link href="/solutions">
                <Button variant="secondary" size="xl">View Solutions</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-slate-400 mb-6">
                We believe operational AI should be dependable, explainable, and safe to deploy.
                BrainStack Studio shows what is possible without revealing internal infrastructure.
              </p>
              <p className="text-lg text-slate-400">
                Every workflow preview is deterministic, bounded, and built to reflect real
                operational constraints.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">5</div>
                  <div className="text-slate-400">Industries Live</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">100%</div>
                  <div className="text-slate-400">Deterministic Mode</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">0</div>
                  <div className="text-slate-400">IP Leakage</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">1</div>
                  <div className="text-slate-400">Unified Studio</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              The principles that guide every decision we make.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent>
                    <value.icon className="w-10 h-10 text-cyan-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-slate-400 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-slate-400">Key milestones that shaped BrainStack Studio.</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
            {MILESTONES.map((milestone, i) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-8 mb-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <div className="text-cyan-400 font-bold text-xl mb-1">{milestone.year}</div>
                  <div className="text-slate-300">{milestone.event}</div>
                </div>
                <div className="w-4 h-4 rounded-full bg-cyan-500 border-4 border-black z-10" />
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold mb-6">The BrainOps Relationship</h2>
            <p className="text-lg text-slate-400 mb-8">
              BrainStack Studio is the interface to BrainOps capabilities. We expose safe, bounded
              facades while keeping internal orchestration private.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <Card>
                <CardContent className="text-center">
                  <Shield className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <h3 className="font-semibold">Public Facade</h3>
                  <p className="text-sm text-slate-400">Deterministic workflows and safe previews.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center">
                  <HeartHandshake className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                  <h3 className="font-semibold">Private Engine</h3>
                  <p className="text-sm text-slate-400">Proprietary systems stay protected.</p>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">Request Implementation</Button>
              </Link>
              <Link href="/technology">
                <Button variant="secondary" size="lg">Platform Trust</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
