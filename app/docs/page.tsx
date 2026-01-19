'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { CodeBlock } from '@/components/CodeBlock';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Book,
  Zap,
  Code,
  Terminal,
  MessageSquare,
  Settings,
  Database,
  Shield,
  ChevronRight,
  Search,
} from 'lucide-react';

const SECTIONS = [
  { id: 'getting-started', label: 'Getting Started', icon: Zap },
  { id: 'playground', label: 'AI Playground', icon: MessageSquare },
  { id: 'models', label: 'AI Models', icon: Code },
  { id: 'api', label: 'API Reference', icon: Terminal },
  { id: 'configuration', label: 'Configuration', icon: Settings },
  { id: 'storage', label: 'Data & Storage', icon: Database },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started');

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
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
              Everything you need to know about BrainStack Studio, from getting started to advanced API usage.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <div className="sticky top-24 space-y-2">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
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

            {/* Content */}
            <div className="flex-1 min-w-0">
              {activeSection === 'getting-started' && <GettingStartedSection />}
              {activeSection === 'playground' && <PlaygroundSection />}
              {activeSection === 'models' && <ModelsSection />}
              {activeSection === 'api' && <APISection />}
              {activeSection === 'configuration' && <ConfigurationSection />}
              {activeSection === 'storage' && <StorageSection />}
              {activeSection === 'security' && <SecuritySection />}
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-3xl font-bold mb-4">Getting Started</h2>
        <p className="text-slate-400 mb-6">
          BrainStack Studio is a multi-AI platform that lets you access Claude, GPT, Gemini, and Perplexity
          through a unified interface. Get started in minutes.
        </p>
      </div>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Quick Start</h3>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500 text-white font-bold shrink-0">1</span>
              <div>
                <p className="font-medium">Launch the Playground</p>
                <p className="text-slate-400 text-sm">Navigate to the AI Playground to start chatting with AI models.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500 text-white font-bold shrink-0">2</span>
              <div>
                <p className="font-medium">Select Your Model</p>
                <p className="text-slate-400 text-sm">Choose from Claude Opus 4.5, GPT-5.2, Gemini 3 Pro, or Sonar Pro.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500 text-white font-bold shrink-0">3</span>
              <div>
                <p className="font-medium">Start Chatting</p>
                <p className="text-slate-400 text-sm">Type your message and get streaming AI responses in real-time.</p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Environment Setup</h3>
          <p className="text-slate-400 mb-4">
            To run BrainStack Studio locally, you'll need to configure your API keys:
          </p>
          <CodeBlock
            language="bash"
            code={`# Create a .env.local file with your API keys
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key
PERPLEXITY_API_KEY=your_perplexity_key`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Installation</h3>
          <CodeBlock
            language="bash"
            code={`# Clone the repository
git clone https://github.com/your-org/brainstack-studio.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build`}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PlaygroundSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-3xl font-bold mb-4">AI Playground</h2>
        <p className="text-slate-400 mb-6">
          The AI Playground is your interactive workspace for conversing with multiple AI models.
        </p>
      </div>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Features</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <ChevronRight className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <p className="font-medium">Real-time Streaming</p>
                <p className="text-slate-400 text-sm">Watch AI responses stream in character by character.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ChevronRight className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <p className="font-medium">Model Switching</p>
                <p className="text-slate-400 text-sm">Switch between AI models mid-conversation without losing context.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ChevronRight className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <p className="font-medium">Code Highlighting</p>
                <p className="text-slate-400 text-sm">Syntax highlighting for code blocks with one-click copy.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ChevronRight className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <p className="font-medium">Conversation History</p>
                <p className="text-slate-400 text-sm">Your conversations are automatically saved locally.</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-slate-400">Send message</span>
              <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono">Enter</kbd>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-slate-400">New line</span>
              <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono">Shift+Enter</kbd>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-slate-400">New conversation</span>
              <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono">Ctrl+N</kbd>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-slate-400">Toggle sidebar</span>
              <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono">Ctrl+B</kbd>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ModelsSection() {
  const models = [
    {
      name: 'Claude Opus 4.5',
      provider: 'Anthropic',
      badge: 'primary',
      description: 'Most capable model for complex reasoning, analysis, and creative tasks.',
      strengths: ['Advanced reasoning', 'Long context (200K)', 'Code generation', 'Analysis'],
    },
    {
      name: 'GPT-5.2',
      provider: 'OpenAI',
      badge: 'success',
      description: 'Versatile model with strong general-purpose capabilities.',
      strengths: ['Multi-modal', 'Function calling', 'Code interpreter', 'Plugins'],
    },
    {
      name: 'Gemini 3 Pro',
      provider: 'Google',
      badge: 'primary',
      description: 'Multimodal AI with native Google ecosystem integration.',
      strengths: ['1M context window', 'Multimodal', 'Google Search', 'Code execution'],
    },
    {
      name: 'Sonar Pro',
      provider: 'Perplexity',
      badge: 'purple',
      description: 'Real-time web search with AI-powered synthesis.',
      strengths: ['Real-time search', 'Citations', 'Web browsing', 'Fact checking'],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-3xl font-bold mb-4">AI Models</h2>
        <p className="text-slate-400 mb-6">
          BrainStack Studio provides access to four leading AI models, each with unique strengths.
        </p>
      </div>

      <div className="grid gap-6">
        {models.map((model) => (
          <Card key={model.name}>
            <CardContent>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{model.name}</h3>
                  <p className="text-slate-400 text-sm">{model.provider}</p>
                </div>
                <Badge variant={model.badge as any}>{model.provider}</Badge>
              </div>
              <p className="text-slate-300 mb-4">{model.description}</p>
              <div className="flex flex-wrap gap-2">
                {model.strengths.map((strength) => (
                  <span key={strength} className="px-3 py-1 bg-white/5 rounded-full text-sm text-slate-400">
                    {strength}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

function APISection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-3xl font-bold mb-4">API Reference</h2>
        <p className="text-slate-400 mb-6">
          Use the BrainStack API to integrate AI capabilities into your own applications.
        </p>
      </div>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Chat Endpoint</h3>
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="success">POST</Badge>
            <code className="text-cyan-400">/api/chat</code>
          </div>
          <p className="text-slate-400 mb-4">Send messages to AI models and receive streaming responses.</p>
          <CodeBlock
            language="typescript"
            code={`// Request body
{
  "messages": [
    { "role": "user", "content": "Hello, how are you?" }
  ],
  "model": "claude", // claude | gpt | gemini | perplexity
  "systemPrompt": "You are a helpful assistant",
  "temperature": 0.7,
  "maxTokens": 4096
}`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Example: Fetch API</h3>
          <CodeBlock
            language="javascript"
            code={`const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Explain quantum computing' }],
    model: 'claude'
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log(decoder.decode(value));
}`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Health Check</h3>
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="primary">GET</Badge>
            <code className="text-cyan-400">/api/chat</code>
          </div>
          <p className="text-slate-400 mb-4">Check API status and available models.</p>
          <CodeBlock
            language="json"
            code={`// Response
{
  "status": "ok",
  "models": ["claude", "gpt", "gemini", "perplexity"],
  "timestamp": "2026-01-19T12:00:00.000Z"
}`}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ConfigurationSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-3xl font-bold mb-4">Configuration</h2>
        <p className="text-slate-400 mb-6">
          Customize BrainStack Studio to fit your needs.
        </p>
      </div>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Environment Variables</h3>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <code className="text-cyan-400">ANTHROPIC_API_KEY</code>
              <p className="text-slate-400 text-sm mt-1">Your Anthropic API key for Claude models</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <code className="text-cyan-400">OPENAI_API_KEY</code>
              <p className="text-slate-400 text-sm mt-1">Your OpenAI API key for GPT models</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <code className="text-cyan-400">GOOGLE_GENERATIVE_AI_API_KEY</code>
              <p className="text-slate-400 text-sm mt-1">Your Google API key for Gemini models</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <code className="text-cyan-400">PERPLEXITY_API_KEY</code>
              <p className="text-slate-400 text-sm mt-1">Your Perplexity API key for Sonar models</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">User Preferences</h3>
          <p className="text-slate-400 mb-4">Configure default settings in the Settings page:</p>
          <ul className="space-y-2 text-slate-300">
            <li>• Default AI model</li>
            <li>• System prompt customization</li>
            <li>• Temperature (creativity level)</li>
            <li>• Max tokens per response</li>
            <li>• Streaming enabled/disabled</li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StorageSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-3xl font-bold mb-4">Data & Storage</h2>
        <p className="text-slate-400 mb-6">
          Understanding how BrainStack Studio handles your data.
        </p>
      </div>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Local Storage</h3>
          <p className="text-slate-400 mb-4">
            All conversation data is stored locally in your browser using localStorage:
          </p>
          <ul className="space-y-2 text-slate-300">
            <li>• <code className="text-cyan-400">brainstack_conversations</code> - Your chat history</li>
            <li>• <code className="text-cyan-400">brainstack_preferences</code> - Your settings</li>
            <li>• <code className="text-cyan-400">brainstack_current_conversation</code> - Active session</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Data Export</h3>
          <p className="text-slate-400 mb-4">
            You can export all your data from the Dashboard:
          </p>
          <CodeBlock
            language="json"
            code={`{
  "conversations": [...],
  "preferences": {...},
  "exportedAt": "2026-01-19T12:00:00.000Z"
}`}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SecuritySection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-3xl font-bold mb-4">Security</h2>
        <p className="text-slate-400 mb-6">
          Security best practices for using BrainStack Studio.
        </p>
      </div>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">API Key Security</h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-cyan-400 mt-0.5" />
              <span>Never expose API keys in client-side code</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-cyan-400 mt-0.5" />
              <span>Use environment variables for all secrets</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-cyan-400 mt-0.5" />
              <span>Rotate API keys regularly</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-cyan-400 mt-0.5" />
              <span>Set up usage limits with your AI providers</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Security Headers</h3>
          <p className="text-slate-400 mb-4">
            BrainStack Studio includes security headers by default:
          </p>
          <CodeBlock
            language="json"
            code={`{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block"
}`}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
