'use client';

import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Brain,
  Rocket,
  Users,
  Globe,
  Sparkles,
  Target,
  Heart,
  Zap,
  Shield,
  Code,
} from 'lucide-react';
import Link from 'next/link';

const TEAM_VALUES = [
  {
    icon: Sparkles,
    title: 'Innovation First',
    description: 'We push the boundaries of what\'s possible with AI, constantly exploring new frontiers.',
  },
  {
    icon: Users,
    title: 'User-Centric',
    description: 'Every feature we build starts with understanding what our users truly need.',
  },
  {
    icon: Shield,
    title: 'Trust & Safety',
    description: 'We prioritize responsible AI development and user data protection.',
  },
  {
    icon: Globe,
    title: 'Global Impact',
    description: 'We\'re building technology that empowers people worldwide.',
  },
];

const MILESTONES = [
  { year: '2024', event: 'BrainOps AI Operating System concept initiated' },
  { year: '2025', event: 'BrainStack Studio v1.0 launched with Claude integration' },
  { year: '2025', event: 'Multi-AI support added (GPT, Gemini)' },
  { year: '2026', event: 'v3.0 release with Perplexity and advanced features' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-6">
              <Brain className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-slate-300">About BrainStack Studio</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Building the Future</span>
              <br />
              <span className="text-white">of AI Interaction</span>
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              BrainStack Studio is the flagship product of the BrainOps AI Operating System ecosystem,
              designed to make the world's most powerful AI models accessible to everyone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/playground">
                <Button size="xl">
                  <Rocket className="w-5 h-5" />
                  Try the Playground
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="secondary" size="xl">
                  Read the Docs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-slate-400 mb-6">
                We believe that access to advanced AI should not be limited by technical complexity
                or vendor lock-in. BrainStack Studio brings together the best AI models from
                Anthropic, OpenAI, Google, and Perplexity into a single, unified platform.
              </p>
              <p className="text-lg text-slate-400">
                Our goal is to democratize AI by providing a seamless interface that lets anyone
                harness the power of multiple AI systems without needing to understand the
                underlying infrastructure.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">4</div>
                  <div className="text-slate-400">AI Providers</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">∞</div>
                  <div className="text-slate-400">Possibilities</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">1</div>
                  <div className="text-slate-400">Unified Platform</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">0</div>
                  <div className="text-slate-400">Vendor Lock-in</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              The principles that guide everything we build at BrainStack Studio.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_VALUES.map((value, i) => (
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

      {/* Timeline Section */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-slate-400">Key milestones in the BrainStack story.</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
            {MILESTONES.map((milestone, i) => (
              <motion.div
                key={i}
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

      {/* BrainOps Ecosystem */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold mb-6">Part of BrainOps</h2>
            <p className="text-lg text-slate-400 mb-8">
              BrainStack Studio is a core component of the BrainOps AI Operating System,
              a comprehensive suite of tools designed to augment human intelligence with AI.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <Card variant="interactive">
                <CardContent className="text-center">
                  <Code className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <h3 className="font-semibold">BrainStack Studio</h3>
                  <p className="text-sm text-slate-400">Multi-AI Platform</p>
                </CardContent>
              </Card>
              <Card variant="interactive">
                <CardContent className="text-center">
                  <Target className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h3 className="font-semibold">Command Center</h3>
                  <p className="text-sm text-slate-400">AI Operations Hub</p>
                </CardContent>
              </Card>
              <Card variant="interactive">
                <CardContent className="text-center">
                  <Zap className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                  <h3 className="font-semibold">AutoPilot</h3>
                  <p className="text-sm text-slate-400">AI Automation</p>
                </CardContent>
              </Card>
            </div>

            <a
              href="https://brainops-command-center.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="lg">
                <Globe className="w-5 h-5" />
                Explore BrainOps Ecosystem
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card variant="gradient">
            <CardContent className="text-center py-12">
              <Heart className="w-12 h-12 text-pink-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Join the AI Revolution</h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                Start using BrainStack Studio today and experience the future of AI interaction.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/playground">
                  <Button size="lg">Get Started Free</Button>
                </Link>
                <Link href="/docs">
                  <Button variant="secondary" size="lg">View Documentation</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
