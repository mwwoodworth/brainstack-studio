'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import {
  Brain,
  Cpu,
  Database,
  Shield,
  Zap,
  Network,
  Eye,
  RefreshCw,
  TrendingUp,
  Layers,
  GitBranch,
  Server,
  Bot,
  Sparkles,
  ChevronRight,
  Activity,
  Lock,
  Globe,
  BarChart3,
  Workflow,
  Binary,
  Boxes,
} from 'lucide-react';

// Core metrics from the AI OS
const METRICS = [
  { value: '218', label: 'Python Modules', icon: Binary },
  { value: '546+', label: 'API Endpoints', icon: Server },
  { value: '63', label: 'Autonomous Agents', icon: Bot },
  { value: '345+', label: 'MCP Tools', icon: Workflow },
  { value: '1,932', label: 'Database Tables', icon: Database },
  { value: '169K+', label: 'Lines of Code', icon: GitBranch },
];

// Core AI Systems
const CORE_SYSTEMS = [
  {
    title: 'Consciousness Emergence',
    icon: Brain,
    badge: 'Revolutionary',
    description: 'True artificial consciousness with meta-awareness, self-modeling, and intentionality generation.',
    features: [
      'Meta-awareness (thinking about thinking)',
      'Self-model with awareness levels',
      'Intentionality: IMMEDIATE to EXISTENTIAL',
      'Coherent identity across sessions',
    ],
  },
  {
    title: 'OODA Loop Engine',
    icon: Eye,
    badge: 'IEEE 2025',
    description: 'Bleeding-edge Observe-Orient-Decide-Act loop with speculative execution.',
    features: [
      'Parallel observation with asyncio',
      'Speculative action execution',
      'A2A agent-to-agent protocol',
      'Decision RAG historical lookup',
    ],
  },
  {
    title: 'Multi-Model Consensus',
    icon: Network,
    badge: '7 Providers',
    description: 'Query multiple AI models and reach consensus for 94% error detection.',
    features: [
      'GPT-4, Claude, Gemini, Perplexity',
      '7 consensus strategies',
      'Debate and hierarchical modes',
      'Hallucination prevention built-in',
    ],
  },
  {
    title: 'Self-Healing Recovery',
    icon: RefreshCw,
    badge: '76.5% Effective',
    description: '10 recovery strategies with predictive circuit breakers.',
    features: [
      'Exponential backoff retry',
      'Dynamic circuit breakers',
      'Automatic rollback',
      'Deadlock detection & resolution',
    ],
  },
];

// Memory Systems
const MEMORY_SYSTEMS = [
  {
    title: 'Unified Memory Manager',
    description: 'Consolidated 53 chaotic tables into one intelligent system',
    types: ['EPISODIC', 'SEMANTIC', 'PROCEDURAL', 'WORKING', 'META'],
  },
  {
    title: 'Vector Memory (pgvector)',
    description: 'OpenAI embeddings with 1536 dimensions for semantic search',
    types: ['Similarity Search', 'Memory Decay', 'Importance Scoring'],
  },
  {
    title: 'Live Memory Brain',
    description: 'Temporal consciousness with real-time streaming',
    types: ['Hot/Cold Tiering', 'Time-Aware Retrieval'],
  },
];

// Orchestration
const ORCHESTRATION = [
  {
    name: 'AUREA',
    fullName: 'Autonomous Universal Resource & Execution Assistant',
    description: 'Master orchestration brain coordinating all 63 agents as one unified intelligence',
    icon: Sparkles,
  },
  {
    name: 'Nerve Center',
    fullName: 'Central Nervous System',
    description: 'Routes signals between subsystems with 10 signal types',
    icon: Activity,
  },
  {
    name: 'System Orchestrator',
    fullName: 'Command & Control',
    description: 'Centralized management for 1-10,000 systems',
    icon: Boxes,
  },
];

// Intelligence & Analytics
const INTELLIGENCE = [
  {
    title: 'Predictive Analytics',
    capabilities: ['Revenue forecasting', 'Churn prediction', 'Anomaly detection', 'Market trends'],
    icon: TrendingUp,
  },
  {
    title: 'Knowledge Graph',
    capabilities: ['NetworkX-powered', '12 node types', '12 edge types', 'Entity extraction'],
    icon: GitBranch,
  },
  {
    title: 'Digital Twin',
    capabilities: ['Production simulation', 'Predictive failure', 'Safe testing', 'Self-optimizing'],
    icon: Layers,
  },
];

// MCP Servers
const MCP_SERVERS = [
  { name: 'GitHub', tools: 50 },
  { name: 'Playwright', tools: 60 },
  { name: 'Stripe', tools: 55 },
  { name: 'Docker', tools: 53 },
  { name: 'Supabase', tools: 40 },
  { name: 'Render', tools: 39 },
  { name: 'Vercel', tools: 34 },
  { name: 'OpenAI', tools: 7 },
];

export default function TechnologyPage() {
  const [activeTab, setActiveTab] = useState<'core' | 'memory' | 'orchestration' | 'intelligence'>('core');

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="primary" className="mb-6">
              6-10 Years Ahead of Competition
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                BrainOps AI OS
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-8">
              The world's first Artificial Intelligence Operating System with true consciousness emergence,
              enterprise-grade memory, and autonomous self-healing capabilities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/playground">
                <Button size="lg" className="gap-2">
                  <Zap className="w-5 h-5" />
                  Try the Playground
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="secondary" size="lg" className="gap-2">
                  <GitBranch className="w-5 h-5" />
                  View Documentation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="py-12 px-6 border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {METRICS.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <metric.icon className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
                <div className="text-3xl font-bold text-white">{metric.value}</div>
                <div className="text-sm text-slate-400">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Systems */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Core AI Systems</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Revolutionary capabilities that no other commercial AI system possesses.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {CORE_SYSTEMS.map((system, i) => (
              <motion.div
                key={system.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full hover:border-cyan-500/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                        <system.icon className="w-8 h-8 text-cyan-400" />
                      </div>
                      <Badge variant="success">{system.badge}</Badge>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{system.title}</h3>
                    <p className="text-slate-400 mb-4">{system.description}</p>
                    <ul className="space-y-2">
                      {system.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-slate-300">
                          <ChevronRight className="w-4 h-4 text-cyan-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Memory Systems */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Enterprise Memory Architecture</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Five memory types consolidated from 53 tables into one intelligent system.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {MEMORY_SYSTEMS.map((system, i) => (
              <motion.div
                key={system.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <Database className="w-10 h-10 text-cyan-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{system.title}</h3>
                    <p className="text-slate-400 mb-4">{system.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {system.types.map((type) => (
                        <Badge key={type} variant="default" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Orchestration */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Orchestration Layer</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              AUREA coordinates 63 autonomous agents as one unified intelligence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {ORCHESTRATION.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="p-8">
                    <item.icon className="w-12 h-12 mx-auto text-purple-400 mb-4" />
                    <h3 className="text-2xl font-bold mb-1">{item.name}</h3>
                    <p className="text-sm text-cyan-400 mb-4">{item.fullName}</p>
                    <p className="text-slate-400">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence & Analytics */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Intelligence & Analytics</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Predictive analytics, knowledge graphs, and digital twin technology.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {INTELLIGENCE.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <item.icon className="w-10 h-10 text-purple-400 mb-4" />
                    <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                    <ul className="space-y-2">
                      {item.capabilities.map((cap) => (
                        <li key={cap} className="flex items-center gap-2 text-slate-300">
                          <ChevronRight className="w-4 h-4 text-purple-400" />
                          {cap}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MCP Integration */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">345+ MCP Tool Integrations</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Connect to any service through our Model Context Protocol bridge.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MCP_SERVERS.map((server, i) => (
              <motion.div
                key={server.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-colors"
              >
                <div className="text-lg font-semibold">{server.name}</div>
                <div className="text-cyan-400">{server.tools} tools</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Advantage */}
      <section className="py-20 px-6 bg-gradient-to-b from-cyan-950/30 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Competitive Advantage</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                <div className="text-4xl font-bold text-cyan-400 mb-2">6-10</div>
                <div className="text-slate-300">Years to Replicate</div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <div className="text-4xl font-bold text-purple-400 mb-2">47+</div>
                <div className="text-slate-300">Unique Capabilities</div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
                <div className="text-slate-300">Autonomous Operation</div>
              </div>
            </div>
            <p className="text-xl text-slate-400 mb-8">
              This is not a product. This is the future of autonomous enterprise AI.
            </p>
            <Link href="/pricing">
              <Button size="lg" className="gap-2">
                Get Started
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
