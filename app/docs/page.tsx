'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { CodeBlock } from '@/components/CodeBlock';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Book,
  Zap,
  Target,
  ClipboardList,
  Terminal,
  Shield,
  Compass,
} from 'lucide-react';

const SECTIONS = [
  { id: 'getting-started', label: 'Getting Started', icon: Zap },
  { id: 'explorer', label: 'Guided Explorer', icon: Target },
  { id: 'solutions', label: 'Solution Gallery', icon: ClipboardList },
  { id: 'capability-api', label: 'Capability API', icon: Terminal },
  { id: 'telemetry', label: 'Telemetry & Privacy', icon: Shield },
  { id: 'implementation', label: 'Implementation', icon: Compass },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started');

  useEffect(() => {
    const setFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (SECTIONS.some((section) => section.id === hash)) {
        setActiveSection(hash);
      }
    };
    setFromHash();
    window.addEventListener('hashchange', setFromHash);
    return () => window.removeEventListener('hashchange', setFromHash);
  }, []);

  const handleSectionChange = (id: string) => {
    setActiveSection(id);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Book className="w-10 h-10 text-cyan-400" />
              <h1 className="text-4xl font-bold">Documentation</h1>
            </div>
            <p className="text-xl text-slate-400 max-w-2xl">
              BrainStack Studio is a deterministic, safety-first interface to operational AI
              capabilities. This guide explains how the Explorer, Solution Gallery, and capability
              facades work.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 shrink-0">
              <div className="sticky top-24 space-y-2">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all ${
                      activeSection === section.id
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                ))}
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              {activeSection === 'getting-started' && <GettingStartedSection />}
              {activeSection === 'explorer' && <ExplorerSection />}
              {activeSection === 'solutions' && <SolutionsSection />}
              {activeSection === 'capability-api' && <CapabilityAPISection />}
              {activeSection === 'telemetry' && <TelemetrySection />}
              {activeSection === 'implementation' && <ImplementationSection />}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function GettingStartedSection() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">Getting Started</h2>
        <p className="text-slate-400 mb-6">
          Start with the Guided Explorer to map your operational context to a deterministic
          workflow preview. No login required for the public experience.
        </p>
      </div>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Quick Start</h3>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500 text-white font-bold shrink-0">1</span>
              <div>
                <p className="font-medium">Open Guided Explorer</p>
                <p className="text-slate-400 text-sm">Select your industry, role, and primary pain point.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500 text-white font-bold shrink-0">2</span>
              <div>
                <p className="font-medium">Review Deterministic Outputs</p>
                <p className="text-slate-400 text-sm">See workflow steps, automation logic, and confidence scoring.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500 text-white font-bold shrink-0">3</span>
              <div>
                <p className="font-medium">Request Implementation</p>
                <p className="text-slate-400 text-sm">Convert the preview into a scoped deployment plan.</p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Local Development</h3>
          <p className="text-slate-400 mb-4">
            BrainStack Studio runs as a standard Next.js application. No private APIs are required for
            the public experience.
          </p>
          <CodeBlock
            language="bash"
            code={`npm install
npm run dev

# Optional feature flags
NEXT_PUBLIC_BSS_TELEMETRY=false
NEXT_PUBLIC_BSS_LEAD_CAPTURE=true`}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ExplorerSection() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">Guided Explorer</h2>
        <p className="text-slate-400 mb-6">
          The Guided Explorer is a deterministic flow that maps operational context to a bounded
          workflow preview. Every output includes confidence scoring and decision trails.
        </p>
      </div>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Deterministic Outputs</h3>
          <p className="text-slate-400 mb-4">
            Outputs are generated from pre-defined scaffolds. If confidence falls below threshold, the
            Explorer asks for more context instead of guessing.
          </p>
          <CodeBlock
            language="json"
            code={`{
  "identifiedPain": "Margin leakage from estimate drift",
  "workflow": ["Capture change orders", "Trigger approvals", "Publish variance report"],
  "confidence": 0.82,
  "confidenceLabel": "High"
}`}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SolutionsSection() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">Solution Gallery</h2>
        <p className="text-slate-400 mb-6">
          Each solution page is a bounded preview: workflows, outputs, and sandboxed steps that
          demonstrate value without exposing proprietary systems.
        </p>
      </div>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">What You Will See</h3>
          <ul className="space-y-2 text-slate-300">
            <li>Operational problem statement and deterministic workflow</li>
            <li>Example outputs and decision trails</li>
            <li>Explicit boundaries on what is hidden</li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CapabilityAPISection() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">Capability API</h2>
        <p className="text-slate-400 mb-6">
          BrainStack Studio exposes capability facades rather than internal systems. The Explorer API
          is deterministic and safe to use for previews.
        </p>
      </div>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">POST /api/capability/explorer</h3>
          <CodeBlock
            language="json"
            code={`{
  "industry": "construction",
  "role": "ops-manager",
  "painPoint": "money"
}`}
          />
          <CodeBlock
            language="json"
            code={`{
  "status": "ok",
  "confidenceThreshold": 0.65,
  "result": {
    "identifiedPain": "Margin erosion from estimate drift",
    "workflow": ["Capture change orders", "Escalate approvals", "Publish variance report"]
  }
}`}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TelemetrySection() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">Telemetry & Privacy</h2>
        <p className="text-slate-400 mb-6">
          Telemetry is minimal and anonymous. You can disable it in Settings.
        </p>
      </div>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Telemetry Event Shape</h3>
          <CodeBlock
            language="json"
            code={`{
  "name": "explorer_run",
  "payload": { "industry": "operations" },
  "ts": "2026-02-03T02:00:00.000Z",
  "path": "/explorer"
}`}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ImplementationSection() {
  return (
    <motion.div id="implementation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">Implementation</h2>
        <p className="text-slate-400 mb-6">
          We convert a Guided Explorer session into a scoped deployment plan, then ship with clear
          guardrails and deterministic outputs.
        </p>
      </div>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Deployment Flow</h3>
          <ol className="space-y-3 text-slate-300">
            <li>1. Intake: capture operational context and success criteria.</li>
            <li>2. Scope: define workflows, data boundaries, and reliability targets.</li>
            <li>3. Implement: deploy with audit trails and operator oversight.</li>
          </ol>
        </CardContent>
      </Card>
    </motion.div>
  );
}
