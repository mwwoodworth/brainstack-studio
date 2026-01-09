'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Zap, Globe, MessageSquare, Send, Bot, Cpu } from 'lucide-react';
import Link from 'next/link';

const AI_MODELS = [
  { id: 'claude', name: 'Claude Opus 4.5', provider: 'Anthropic', color: 'from-orange-500 to-amber-500' },
  { id: 'gpt', name: 'GPT-5.2', provider: 'OpenAI', color: 'from-emerald-500 to-teal-500' },
  { id: 'gemini', name: 'Gemini 3 Pro', provider: 'Google', color: 'from-blue-500 to-indigo-500' },
  { id: 'perplexity', name: 'Sonar Pro', provider: 'Perplexity', color: 'from-purple-500 to-pink-500' },
];

const FEATURES = [
  { icon: Brain, title: 'Multi-AI Orchestration', description: 'Seamlessly switch between AI models' },
  { icon: Zap, title: 'Real-time Streaming', description: 'Instant AI responses with streaming' },
  { icon: Globe, title: 'Global Scale', description: 'Enterprise-ready infrastructure' },
  { icon: Cpu, title: 'Generative UI', description: 'AI-generated dynamic interfaces' },
];

export default function Home() {
  const [selectedModel, setSelectedModel] = useState('claude');

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-cyan-400" />
            <span className="text-xl font-bold">BrainStack Studio</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/playground" className="text-slate-300 hover:text-white transition-colors">
              AI Playground
            </Link>
            <Link href="/docs" className="text-slate-300 hover:text-white transition-colors">
              Docs
            </Link>
            <Link
              href="/playground"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300">Powered by 4 AI Providers</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">Multi-AI Platform</span>
              <br />
              <span className="text-white">for the Future</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Harness the power of Claude Opus 4.5, GPT-5.2, Gemini 3, and Perplexity Sonar
              in one unified platform with generative AI capabilities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/playground"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Try AI Playground
              </Link>
              <a
                href="https://brainops-command-center.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <Bot className="w-5 h-5" />
                Command Center
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Models Section */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your AI Model</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AI_MODELS.map((model) => (
              <motion.button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-2xl border transition-all text-left ${
                  selectedModel === model.id
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${model.color} flex items-center justify-center mb-4`}>
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{model.name}</h3>
                <p className="text-sm text-slate-400">{model.provider}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <feature.icon className="w-10 h-10 text-cyan-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
            <h2 className="text-3xl font-bold mb-4">Ready to Build with AI?</h2>
            <p className="text-slate-300 mb-8">
              Start using the most advanced AI models in one unified platform.
            </p>
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-slate-100 transition-colors"
            >
              <Send className="w-5 h-5" />
              Launch AI Playground
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-cyan-400" />
            <span className="font-semibold">BrainStack Studio</span>
          </div>
          <p className="text-slate-400 text-sm">
            Part of the BrainOps AI Operating System
          </p>
        </div>
      </footer>
    </main>
  );
}
