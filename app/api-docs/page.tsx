'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { CodeBlock } from '@/components/CodeBlock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Terminal, Copy, Check, Lock, Shield } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/capability/explorer',
    description: 'Deterministic explorer mapping (safe preview)',
    badge: 'Core',
  },
  {
    method: 'GET',
    path: '/api/capability/explorer',
    description: 'Capability facade status and allowed inputs',
    badge: 'Utility',
  },
  {
    method: 'POST',
    path: '/api/lead',
    description: 'Enterprise intake form submission',
    badge: 'Lead',
  },
  {
    method: 'POST',
    path: '/api/telemetry',
    description: 'Anonymous usage telemetry',
    badge: 'Internal',
  },
];

export default function APIDocsPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    await copyToClipboard(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-10 h-10 text-cyan-400" />
              <h1 className="text-4xl font-bold">API Reference</h1>
            </div>
            <p className="text-xl text-slate-400 max-w-2xl">
              BrainStack Studio exposes safe capability facades. These endpoints are deterministic
              and intentionally limited to prevent IP exposure.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-2 gap-4 mb-12"
          >
            <Card>
              <CardContent className="pt-6 text-center">
                <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Deterministic</h3>
                <p className="text-sm text-slate-400">Bounded outputs, no hallucinated promises</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Lock className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Safe Facades</h3>
                <p className="text-sm text-slate-400">No internal orchestration exposed</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card>
              <CardContent className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Base URL</h3>
                  <code className="text-cyan-400">https://brainstackstudio.com</code>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy('https://brainstackstudio.com', 'base')}
                >
                  {copiedEndpoint === 'base' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Endpoints</h2>
            <div className="space-y-4">
              {ENDPOINTS.map((endpoint) => (
                <Card key={`${endpoint.method}-${endpoint.path}`}>
                  <CardContent className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge variant={endpoint.method === 'POST' ? 'success' : 'primary'}>
                        {endpoint.method}
                      </Badge>
                      <div>
                        <code className="text-cyan-400 font-mono">{endpoint.path}</code>
                        <p className="text-sm text-slate-400 mt-1">{endpoint.description}</p>
                      </div>
                    </div>
                    <Badge variant="default">{endpoint.badge}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6 mb-12"
          >
            <div className="flex items-center gap-3">
              <Badge variant="success" className="text-sm">POST</Badge>
              <h2 className="text-2xl font-bold">/api/capability/explorer</h2>
            </div>

            <p className="text-slate-400">
              Returns a deterministic workflow preview for a given industry, role, and pain point.
            </p>

            <Card>
              <CardHeader>
                <CardTitle>Request Body</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  language="json"
                  code={`{
  "industry": "construction",
  "role": "ops-manager",
  "painPoint": "money"
}`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  language="json"
                  code={`{
  "status": "ok",
  "confidenceThreshold": 0.65,
  "result": {
    "identifiedPain": "Margin erosion from estimate drift",
    "workflow": ["Capture change orders", "Escalate approvals", "Publish variance report"],
    "confidence": 0.82,
    "confidenceLabel": "High"
  }
}`}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6 mb-12"
          >
            <div className="flex items-center gap-3">
              <Badge variant="primary" className="text-sm">GET</Badge>
              <h2 className="text-2xl font-bold">/api/capability/explorer</h2>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Response</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  language="json"
                  code={`{
  "status": "ok",
  "industries": ["operations", "construction", "saas", "finance", "supply-chain"],
  "roles": ["owner", "ops-manager", "engineer", "analyst"],
  "painPoints": ["money", "labor", "process", "compliance", "scale", "visibility"]
}`}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold">Error Handling</h2>

            <Card>
              <CardContent>
                <h3 className="font-semibold mb-4">Error Response Format</h3>
                <CodeBlock
                  language="json"
                  code={`{
  "error": "Missing required fields."
}`}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
