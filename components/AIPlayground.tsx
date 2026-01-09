'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Brain,
  Zap,
  Search,
  Cpu,
} from 'lucide-react';

type Provider = 'claude' | 'gemini' | 'gpt' | 'perplexity';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ProviderConfig {
  id: Provider;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const PROVIDERS: ProviderConfig[] = [
  {
    id: 'claude',
    name: 'Claude Opus 4.5',
    icon: <Brain className="w-5 h-5" />,
    color: 'from-amber-500 to-orange-600',
    description: 'Deep reasoning & analysis',
  },
  {
    id: 'gemini',
    name: 'Gemini 3 Flash',
    icon: <Zap className="w-5 h-5" />,
    color: 'from-blue-500 to-cyan-600',
    description: '1M token context window',
  },
  {
    id: 'gpt',
    name: 'GPT-5.2',
    icon: <Cpu className="w-5 h-5" />,
    color: 'from-emerald-500 to-green-600',
    description: 'Agentic multi-step tasks',
  },
  {
    id: 'perplexity',
    name: 'Perplexity Sonar',
    icon: <Search className="w-5 h-5" />,
    color: 'from-violet-500 to-purple-600',
    description: 'Real-time web knowledge',
  },
];

export default function AIPlayground() {
  const [selectedProvider, setSelectedProvider] = useState<Provider>('claude');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleProviderChange = (provider: Provider) => {
    setSelectedProvider(provider);
    setMessages([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          provider: selectedProvider,
        }),
      });

      if (!res.ok) throw new Error('Chat request failed');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
      };
      setMessages((prev) => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id ? { ...m, content: m.content + chunk } : m
            )
          );
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, an error occurred. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentProvider = PROVIDERS.find((p) => p.id === selectedProvider);

  return (
    <section id="ai-playground" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-900/10 via-transparent to-transparent" />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            MULTI-AI PLAYGROUND
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Experience <span className="text-gradient">Incredible Intelligence</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Chat with BrainOps using your choice of AI provider. Switch between the world's
            most advanced language models in real-time.
          </p>
        </div>

        {/* Provider Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleProviderChange(provider.id)}
              className={`relative p-4 rounded-xl transition-all ${
                selectedProvider === provider.id
                  ? 'glass border-violet-500/50 glow-subtle'
                  : 'glass hover:bg-white/10'
              }`}
            >
              {selectedProvider === provider.id && (
                <motion.div
                  layoutId="provider-indicator"
                  className={`absolute inset-0 bg-gradient-to-br ${provider.color} opacity-10 rounded-xl`}
                />
              )}
              <div className="relative flex flex-col items-center gap-2">
                <div className={selectedProvider === provider.id ? 'text-white' : 'text-gray-400'}>
                  {provider.icon}
                </div>
                <div className="font-semibold text-sm">{provider.name}</div>
                <div className="text-xs text-gray-500">{provider.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Chat Interface */}
        <div className="glass rounded-2xl overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentProvider?.color} flex items-center justify-center`}
              >
                {currentProvider?.icon}
              </div>
              <div>
                <div className="font-semibold">BrainOps AI</div>
                <div className="text-xs text-gray-400">Powered by {currentProvider?.name}</div>
              </div>
            </div>
            <button
              onClick={() => setMessages([])}
              className="text-gray-400 hover:text-white transition p-2"
              title="Clear chat"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Bot className="w-16 h-16 text-violet-500/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                  Ask about BrainOps capabilities, the AUREA orchestrator, our AI agents, or
                  how the system can transform your business.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {[
                    'What is BrainOps?',
                    'How does AUREA work?',
                    'Tell me about your agents',
                    'Show me live metrics',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="text-xs px-3 py-1.5 bg-violet-500/20 text-violet-300 rounded-full hover:bg-violet-500/30 transition"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                >
                  {message.role === 'assistant' && (
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentProvider?.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-violet-600 text-white'
                        : 'bg-white/10 text-gray-100'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentProvider?.color} flex items-center justify-center`}
                >
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white/10 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <span
                      className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask BrainOps anything..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
