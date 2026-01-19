'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Sparkles,
  Zap,
  Globe,
  MessageSquare,
  Send,
  Bot,
  Cpu,
  Code,
  Database,
  Shield,
  Terminal,
  ArrowRight,
  Check,
  Play,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AI_MODELS } from '@/lib/constants';

const FEATURES = [
  {
    icon: Brain,
    title: 'Multi-AI Orchestration',
    description: 'Access Claude, GPT, Gemini, and Perplexity through one unified interface. Switch between models instantly.',
  },
  {
    icon: Zap,
    title: 'Real-time Streaming',
    description: 'Watch AI responses stream in real-time. No waiting for complete responses.',
  },
  {
    icon: Code,
    title: 'Code Intelligence',
    description: 'Syntax highlighting, one-click copy, and intelligent code assistance for developers.',
  },
  {
    icon: Database,
    title: 'Conversation Memory',
    description: 'Your conversations are saved automatically. Pick up where you left off.',
  },
  {
    icon: Globe,
    title: 'Edge Deployed',
    description: 'Deployed on Vercel\'s edge network for ultra-low latency worldwide.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data stays local. Full control over your conversation history.',
  },
];

const USE_CASES = [
  {
    title: 'Software Development',
    description: 'Debug code, generate functions, explain complex algorithms, and get code reviews.',
    icon: Terminal,
  },
  {
    title: 'Research & Analysis',
    description: 'Analyze documents, synthesize information, and get real-time web insights with Perplexity.',
    icon: Database,
  },
  {
    title: 'Creative Writing',
    description: 'Generate content, brainstorm ideas, and refine your writing with AI assistance.',
    icon: Sparkles,
  },
  {
    title: 'Learning & Education',
    description: 'Get explanations on any topic, from quantum physics to ancient history.',
    icon: Brain,
  },
];

const STATS = [
  { value: '4', label: 'AI Providers' },
  { value: '<100ms', label: 'Latency' },
  { value: '99.9%', label: 'Uptime' },
  { value: '∞', label: 'Possibilities' },
];

export default function Home() {
  const [selectedModel, setSelectedModel] = useState('claude');
  const [demoText, setDemoText] = useState('');

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300">Now with 4 AI Providers</span>
              <Badge variant="primary" className="ml-1">New</Badge>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">Multi-AI Platform</span>
              <br />
              <span className="text-white">for the Future</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Harness the power of Claude Opus 4.5, GPT-5.2, Gemini 3 Pro, and Perplexity Sonar
              in one unified platform. Build, create, and innovate with the world's best AI models.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/playground">
                <Button size="xl">
                  <Play className="w-5 h-5" />
                  Try AI Playground
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="secondary" size="xl">
                  Read Documentation
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Models Section */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your AI Model</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Each model has unique strengths. Switch between them instantly to find the perfect fit for your task.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AI_MODELS.map((model, i) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  variant="interactive"
                  className={selectedModel === model.id ? 'border-cyan-500 ring-1 ring-cyan-500' : ''}
                  onClick={() => setSelectedModel(model.id)}
                >
                  <CardContent>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${model.gradientColor} flex items-center justify-center mb-4`}>
                      <Brain className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{model.name}</h3>
                    <p className="text-sm text-slate-400 mb-3">{model.provider}</p>
                    <p className="text-sm text-slate-300 mb-4">{model.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {model.capabilities.slice(0, 3).map((cap) => (
                        <Badge key={cap} variant="default" className="text-xs">{cap}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/playground">
              <Button size="lg">
                Try {AI_MODELS.find(m => m.id === selectedModel)?.name}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Capabilities</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Everything you need to interact with AI, designed for developers and power users.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent>
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Every Use Case</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From coding to creative writing, BrainStack Studio adapts to your workflow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {USE_CASES.map((useCase, i) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card variant="interactive">
                  <CardContent className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
                      <useCase.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{useCase.title}</h3>
                      <p className="text-slate-400">{useCase.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API Preview Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <Badge variant="primary" className="mb-4">Developer API</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple API Integration
              </h2>
              <p className="text-slate-400 mb-6">
                Integrate BrainStack into your own applications with our simple REST API.
                Stream responses, switch models, and customize behavior with ease.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Real-time streaming responses',
                  'All 4 AI models available',
                  'Custom system prompts',
                  'Temperature & token controls',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-cyan-400" />
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/api-docs">
                <Button>
                  View API Documentation
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <Card className="overflow-hidden">
                <div className="bg-slate-800/50 px-4 py-2 border-b border-white/10 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs text-slate-400">api-example.ts</span>
                </div>
                <CardContent className="!p-0">
                  <pre className="p-4 text-sm font-mono overflow-x-auto">
                    <code className="text-slate-300">
{`const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello!' }],
    model: 'claude',
    temperature: 0.7,
  }),
});

const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log(new TextDecoder().decode(value));
}`}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonial/Quote Section */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl font-medium mb-6 text-slate-200">
              "The ability to switch between AI models instantly has completely transformed how I work.
              BrainStack Studio is the multi-AI platform I didn't know I needed."
            </blockquote>
            <div className="text-slate-400">
              <span className="font-semibold text-white">— Future You</span>
              <span className="mx-2">•</span>
              <span>After trying BrainStack Studio</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card variant="gradient">
            <CardContent className="text-center py-12">
              <Brain className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build with AI?</h2>
              <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
                Join the future of AI interaction. Start using BrainStack Studio today—it's free to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/playground">
                  <Button size="xl" className="bg-white text-black hover:bg-slate-100">
                    <Send className="w-5 h-5" />
                    Launch AI Playground
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="secondary" size="xl">
                    View Pricing
                  </Button>
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
