'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { CodeBlock } from '@/components/CodeBlock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Terminal, Zap, Loader2, RefreshCw } from 'lucide-react';

type CapabilityOption = {
  id: string;
  label: string;
  description?: string;
};

type CapabilitySpec = {
  status: string;
  confidenceThreshold: number;
  industries: CapabilityOption[];
  roles: CapabilityOption[];
  painPoints: CapabilityOption[];
};

type EndpointState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  payload: unknown;
  error: string | null;
};

const DEFAULT_ENDPOINT_STATE: EndpointState = {
  status: 'idle',
  payload: null,
  error: null,
};

export default function APIDocsPage() {
  const [baseUrl, setBaseUrl] = useState('https://brainstackstudio.com');
  const [spec, setSpec] = useState<CapabilitySpec | null>(null);
  const [loadingSpec, setLoadingSpec] = useState(true);

  const [industry, setIndustry] = useState('');
  const [role, setRole] = useState('');
  const [painPoint, setPainPoint] = useState('');

  const [getState, setGetState] = useState<EndpointState>(DEFAULT_ENDPOINT_STATE);
  const [postState, setPostState] = useState<EndpointState>(DEFAULT_ENDPOINT_STATE);
  const [toolsState, setToolsState] = useState<EndpointState>(DEFAULT_ENDPOINT_STATE);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  async function loadCapabilitySpec() {
    setLoadingSpec(true);
    try {
      const response = await fetch('/api/capability', { cache: 'no-store' });
      const data = (await response.json()) as CapabilitySpec;
      if (!response.ok || data.status !== 'ok') {
        throw new Error('Failed to load capability schema');
      }
      setSpec(data);
      setIndustry(data.industries[0]?.id ?? '');
      setRole(data.roles[0]?.id ?? '');
      setPainPoint(data.painPoints[0]?.id ?? '');
    } catch {
      setSpec(null);
    } finally {
      setLoadingSpec(false);
    }
  }

  useEffect(() => {
    void loadCapabilitySpec();
  }, []);

  async function runCapabilityGet() {
    setGetState({ status: 'loading', payload: null, error: null });
    try {
      const response = await fetch('/api/capability');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'GET /api/capability failed');
      setGetState({ status: 'success', payload: data, error: null });
    } catch (error) {
      setGetState({
        status: 'error',
        payload: null,
        error: error instanceof Error ? error.message : 'Request failed',
      });
    }
  }

  async function runCapabilityPost() {
    setPostState({ status: 'loading', payload: null, error: null });
    try {
      const response = await fetch('/api/capability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, role, painPoint }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'POST /api/capability failed');
      setPostState({ status: 'success', payload: data, error: null });
    } catch (error) {
      setPostState({
        status: 'error',
        payload: null,
        error: error instanceof Error ? error.message : 'Request failed',
      });
    }
  }

  async function runToolsGet() {
    setToolsState({ status: 'loading', payload: null, error: null });
    try {
      const response = await fetch('/api/tools?featured=true');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'GET /api/tools failed');
      setToolsState({ status: 'success', payload: data, error: null });
    } catch (error) {
      setToolsState({
        status: 'error',
        payload: null,
        error: error instanceof Error ? error.message : 'Request failed',
      });
    }
  }

  const capabilityCurl = useMemo(() => {
    return `curl -X POST ${baseUrl}/api/capability \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({ industry, role, painPoint })}'`;
  }, [baseUrl, industry, role, painPoint]);

  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-10 h-10 text-cyan-400" />
              <h1 className="text-4xl font-bold">API Reference</h1>
            </div>
            <p className="text-xl text-slate-400 max-w-3xl">
              Interactive endpoint docs backed by live responses. Run requests below to inspect current
              capability schema and deterministic output behavior.
            </p>
          </motion.div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Base URL</CardTitle>
                <p className="text-sm text-slate-400 mt-1">{baseUrl}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={loadCapabilitySpec} disabled={loadingSpec}>
                {loadingSpec ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Reload schema
              </Button>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-3 gap-3">
            <Card>
              <CardContent className="pt-6">
                <Badge variant="success" className="mb-2">GET</Badge>
                <h3 className="font-semibold">/api/capability</h3>
                <p className="text-sm text-slate-400 mt-1">Capability schema and allowed options.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Badge variant="success" className="mb-2">POST</Badge>
                <h3 className="font-semibold">/api/capability</h3>
                <p className="text-sm text-slate-400 mt-1">Deterministic explorer output for context inputs.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Badge variant="success" className="mb-2">GET</Badge>
                <h3 className="font-semibold">/api/tools</h3>
                <p className="text-sm text-slate-400 mt-1">Tool catalog for calculators and generators.</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Interactive Capability Runner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Industry</label>
                  <select
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                    value={industry}
                    onChange={(event) => setIndustry(event.target.value)}
                    disabled={loadingSpec || !spec}
                  >
                    {spec?.industries.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Role</label>
                  <select
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    disabled={loadingSpec || !spec}
                  >
                    {spec?.roles.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Pain point</label>
                  <select
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                    value={painPoint}
                    onChange={(event) => setPainPoint(event.target.value)}
                    disabled={loadingSpec || !spec}
                  >
                    {spec?.painPoints.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={runCapabilityGet} disabled={getState.status === 'loading'}>
                  {getState.status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Run GET /api/capability
                </Button>
                <Button onClick={runCapabilityPost} variant="secondary" disabled={postState.status === 'loading'}>
                  {postState.status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Run POST /api/capability
                </Button>
                <Button onClick={runToolsGet} variant="secondary" disabled={toolsState.status === 'loading'}>
                  {toolsState.status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Run GET /api/tools
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">cURL Example</h3>
                <CodeBlock language="bash" showLineNumbers={false} code={capabilityCurl} />
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">GET /api/capability Response</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {getState.error && <p className="text-sm text-red-300">{getState.error}</p>}
                <CodeBlock
                  language="json"
                  showLineNumbers={false}
                  code={JSON.stringify(getState.payload ?? { info: 'Run GET request to view response' }, null, 2)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">POST /api/capability Response</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {postState.error && <p className="text-sm text-red-300">{postState.error}</p>}
                <CodeBlock
                  language="json"
                  showLineNumbers={false}
                  code={JSON.stringify(postState.payload ?? { info: 'Run POST request to view response' }, null, 2)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">GET /api/tools Response</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {toolsState.error && <p className="text-sm text-red-300">{toolsState.error}</p>}
                <CodeBlock
                  language="json"
                  showLineNumbers={false}
                  code={JSON.stringify(toolsState.payload ?? { info: 'Run tools request to view response' }, null, 2)}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-3">
                Pro users can generate API keys from the{' '}
                <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300 underline">Dashboard</Link>.
                Pass your key via the <code className="text-cyan-300">X-API-Key</code> header.
              </p>
              <Input readOnly value="X-API-Key: bss_xxxxxxxxxxxxxxxx" />
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  );
}
