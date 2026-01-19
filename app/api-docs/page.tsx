'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { CodeBlock } from '@/components/CodeBlock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Terminal,
  Copy,
  Check,
  Code,
  Zap,
  Lock,
  Globe,
  ChevronRight,
} from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/chat',
    description: 'Send messages to AI models and receive streaming responses',
    badge: 'Core',
  },
  {
    method: 'GET',
    path: '/api/chat',
    description: 'Health check and list available models',
    badge: 'Utility',
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
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
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
              Integrate BrainStack Studio's multi-AI capabilities into your own applications.
            </p>
          </motion.div>

          {/* Quick Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-3 gap-4 mb-12"
          >
            <Card>
              <CardContent className="pt-6 text-center">
                <Zap className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Real-time Streaming</h3>
                <p className="text-sm text-slate-400">Server-sent events for live responses</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Globe className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Edge Deployed</h3>
                <p className="text-sm text-slate-400">Low latency worldwide</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Lock className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Secure</h3>
                <p className="text-sm text-slate-400">API key authentication</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Base URL */}
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
                  <code className="text-cyan-400">https://your-domain.vercel.app</code>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy('https://your-domain.vercel.app', 'base')}
                >
                  {copiedEndpoint === 'base' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Endpoints List */}
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

          {/* POST /api/chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6 mb-12"
          >
            <div className="flex items-center gap-3">
              <Badge variant="success" className="text-sm">POST</Badge>
              <h2 className="text-2xl font-bold">/api/chat</h2>
            </div>

            <p className="text-slate-400">
              Send a conversation to an AI model and receive a streaming response.
            </p>

            {/* Request Body */}
            <Card>
              <CardHeader>
                <CardTitle>Request Body</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  language="typescript"
                  code={`{
  // Required: Array of messages in the conversation
  "messages": [
    {
      "role": "user" | "assistant" | "system",
      "content": "string"
    }
  ],

  // Optional: AI model to use (default: "claude")
  "model": "claude" | "gpt" | "gemini" | "perplexity",

  // Optional: Custom system prompt
  "systemPrompt": "You are a helpful assistant...",

  // Optional: Temperature (0-2, default: 0.7)
  "temperature": 0.7,

  // Optional: Max tokens (default: 4096)
  "maxTokens": 4096
}`}
                />
              </CardContent>
            </Card>

            {/* Parameters Table */}
            <Card>
              <CardHeader>
                <CardTitle>Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 font-medium text-slate-400">Parameter</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-400">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-400">Required</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-400">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4"><code className="text-cyan-400">messages</code></td>
                        <td className="py-3 px-4 text-slate-400">Message[]</td>
                        <td className="py-3 px-4"><Badge variant="danger">Required</Badge></td>
                        <td className="py-3 px-4 text-slate-400">Conversation history</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4"><code className="text-cyan-400">model</code></td>
                        <td className="py-3 px-4 text-slate-400">string</td>
                        <td className="py-3 px-4"><Badge variant="default">Optional</Badge></td>
                        <td className="py-3 px-4 text-slate-400">AI model ID</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4"><code className="text-cyan-400">systemPrompt</code></td>
                        <td className="py-3 px-4 text-slate-400">string</td>
                        <td className="py-3 px-4"><Badge variant="default">Optional</Badge></td>
                        <td className="py-3 px-4 text-slate-400">Custom system instruction</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4"><code className="text-cyan-400">temperature</code></td>
                        <td className="py-3 px-4 text-slate-400">number</td>
                        <td className="py-3 px-4"><Badge variant="default">Optional</Badge></td>
                        <td className="py-3 px-4 text-slate-400">Creativity level (0-2)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4"><code className="text-cyan-400">maxTokens</code></td>
                        <td className="py-3 px-4 text-slate-400">number</td>
                        <td className="py-3 px-4"><Badge variant="default">Optional</Badge></td>
                        <td className="py-3 px-4 text-slate-400">Response length limit</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Response */}
            <Card>
              <CardHeader>
                <CardTitle>Response</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  The response is a text stream. Each chunk contains a portion of the AI's response.
                </p>
                <CodeBlock
                  language="text"
                  code={`Content-Type: text/plain; charset=utf-8
Transfer-Encoding: chunked

Hello! I'd be happy to help you with...`}
                />
              </CardContent>
            </Card>

            {/* Example */}
            <Card>
              <CardHeader>
                <CardTitle>Example: JavaScript/TypeScript</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  language="typescript"
                  code={`async function chat(userMessage: string) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        { role: 'user', content: userMessage }
      ],
      model: 'claude',
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  // Handle streaming response
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let result = '';

  while (reader) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    result += chunk;
    console.log(chunk); // Print as it streams
  }

  return result;
}

// Usage
const response = await chat('Explain quantum computing');
console.log('Full response:', response);`}
                />
              </CardContent>
            </Card>

            {/* cURL Example */}
            <Card>
              <CardHeader>
                <CardTitle>Example: cURL</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  language="bash"
                  code={`curl -X POST https://your-domain.vercel.app/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}],
    "model": "claude"
  }'`}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* GET /api/chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6 mb-12"
          >
            <div className="flex items-center gap-3">
              <Badge variant="primary" className="text-sm">GET</Badge>
              <h2 className="text-2xl font-bold">/api/chat</h2>
            </div>

            <p className="text-slate-400">
              Health check endpoint to verify API status and list available models.
            </p>

            <Card>
              <CardHeader>
                <CardTitle>Response</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  language="json"
                  code={`{
  "status": "ok",
  "models": ["claude", "gpt", "gemini", "perplexity"],
  "timestamp": "2026-01-19T12:00:00.000Z"
}`}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Error Handling */}
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
  "error": "Error message description",
  "details": "Additional details (development only)"
}`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>HTTP Status Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                    <Badge variant="success">200</Badge>
                    <span className="text-slate-300">Success</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                    <Badge variant="warning">400</Badge>
                    <span className="text-slate-300">Bad Request - Invalid parameters</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                    <Badge variant="danger">401</Badge>
                    <span className="text-slate-300">Unauthorized - Invalid or missing API key</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                    <Badge variant="danger">500</Badge>
                    <span className="text-slate-300">Server Error - Something went wrong</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
