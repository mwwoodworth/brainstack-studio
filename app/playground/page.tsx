'use client';

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Brain,
  Send,
  Loader2,
  Sparkles,
  ArrowLeft,
  Bot,
  User,
  Plus,
  Trash2,
  Settings,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  MessageSquare,
  Copy,
  Check,
  RotateCcw,
  Pencil,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { MessageContent } from '@/components/MessageContent';
import { useConversations } from '@/hooks/useConversations';
import { usePreferences } from '@/hooks/usePreferences';
import { AI_MODELS } from '@/lib/constants';
import { cn, formatDate, generateId, copyToClipboard } from '@/lib/utils';
import { Message } from '@/types';

function PlaygroundContent() {
  const searchParams = useSearchParams();
  const conversationIdParam = searchParams.get('id');

  const {
    conversations,
    currentConversation,
    isLoaded: conversationsLoaded,
    createConversation,
    selectConversation,
    updateConversation,
    addMessage,
    updateMessage,
    deleteConversation,
    clearCurrentConversation,
  } = useConversations();

  const { preferences, isLoaded: preferencesLoaded } = usePreferences();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoaded = conversationsLoaded && preferencesLoaded;

  // Initialize from URL param or preferences
  useEffect(() => {
    if (!isLoaded) return;

    if (conversationIdParam) {
      selectConversation(conversationIdParam);
    }

    setSelectedModel(preferences.defaultModel);
    setSystemPrompt(preferences.systemPrompt);
  }, [isLoaded, conversationIdParam, preferences, selectConversation]);

  // Update model when conversation changes
  useEffect(() => {
    if (currentConversation) {
      setSelectedModel(currentConversation.model);
      if (currentConversation.systemPrompt) {
        setSystemPrompt(currentConversation.systemPrompt);
      }
    }
  }, [currentConversation]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleNewConversation = () => {
    const newConv = createConversation(selectedModel);
    updateConversation(newConv.id, { systemPrompt });
    window.history.pushState({}, '', `/playground?id=${newConv.id}`);
  };

  const handleSelectConversation = (id: string) => {
    selectConversation(id);
    window.history.pushState({}, '', `/playground?id=${id}`);
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
    if (currentConversation?.id === id) {
      window.history.pushState({}, '', '/playground');
    }
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    if (currentConversation) {
      updateConversation(currentConversation.id, { model: modelId });
    }
  };

  const handleCopyMessage = async (content: string, messageId: string) => {
    await copyToClipboard(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleTitleEdit = () => {
    if (currentConversation) {
      setTitleInput(currentConversation.title);
      setEditingTitle(true);
    }
  };

  const handleTitleSave = () => {
    if (currentConversation && titleInput.trim()) {
      updateConversation(currentConversation.id, { title: titleInput.trim() });
    }
    setEditingTitle(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Create conversation if none exists
    let convId = currentConversation?.id;
    if (!convId) {
      const newConv = createConversation(selectedModel);
      updateConversation(newConv.id, { systemPrompt });
      convId = newConv.id;
      window.history.pushState({}, '', `/playground?id=${convId}`);
    }

    const userMessage = addMessage(convId, {
      role: 'user',
      content: input.trim(),
      model: selectedModel,
    });

    setInput('');
    setIsLoading(true);

    try {
      // Get current messages for context
      const conv = conversations.find((c) => c.id === convId) || currentConversation;
      const messages = [...(conv?.messages || []), userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          model: selectedModel,
          systemPrompt,
          temperature: preferences.temperature,
          maxTokens: preferences.maxTokens,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      // Add initial assistant message
      const assistantMsg = addMessage(convId, {
        role: 'assistant',
        content: '',
        model: selectedModel,
      });

      if (reader) {
        let fullContent = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          fullContent += chunk;

          // Update message with accumulated content
          updateMessage(convId, assistantMsg.id, fullContent);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

      addMessage(convId, {
        role: 'assistant',
        content: `Sorry, there was an error: ${errorMessage}. Please try again.`,
        model: selectedModel,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const currentModel = AI_MODELS.find((m) => m.id === selectedModel);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-screen bg-black/50 border-r border-white/10 flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/10">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Brain className="w-7 h-7 text-cyan-400" />
                <span className="font-bold">BrainStack Studio</span>
              </Link>
              <Button onClick={handleNewConversation} className="w-full" size="sm">
                <Plus className="w-4 h-4" />
                New Chat
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {conversations.length === 0 ? (
                <div className="text-center text-slate-500 text-sm py-8">
                  No conversations yet
                </div>
              ) : (
                <div className="space-y-1">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={cn(
                        'w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all',
                        currentConversation?.id === conv.id
                          ? 'bg-cyan-500/10 text-cyan-400'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      <span className="flex-1 truncate text-sm">{conv.title}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conv.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 space-y-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-black/50 backdrop-blur-xl border-b border-white/10 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {currentConversation && (
                <div className="flex items-center gap-2">
                  {editingTitle ? (
                    <input
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      onBlur={handleTitleSave}
                      onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                      className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:border-cyan-500"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={handleTitleEdit}
                      className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                    >
                      <span className="font-medium truncate max-w-[200px]">
                        {currentConversation.title}
                      </span>
                      <Pencil className="w-3.5 h-3.5 opacity-50" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Model Selector */}
            <div className="flex items-center gap-2">
              {AI_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelChange(model.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all hidden sm:block',
                    selectedModel === model.id
                      ? `${model.color} text-white`
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  )}
                >
                  {model.name.split(' ')[0]}
                </button>
              ))}
              <select
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                className="sm:hidden bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm"
              >
                {AI_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>{model.name.split(' ')[0]}</option>
                ))}
              </select>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  showSettings ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/10 text-slate-400'
                )}
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-white/10 mt-3">
                  <label className="block text-sm font-medium mb-2">System Prompt</label>
                  <Textarea
                    value={systemPrompt}
                    onChange={(e) => {
                      setSystemPrompt(e.target.value);
                      if (currentConversation) {
                        updateConversation(currentConversation.id, { systemPrompt: e.target.value });
                      }
                    }}
                    rows={3}
                    placeholder="Customize AI behavior..."
                    className="text-sm"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {!currentConversation || currentConversation.messages.length === 0 ? (
              <div className="text-center py-20">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${currentModel?.gradientColor || 'from-cyan-500 to-blue-500'} flex items-center justify-center`}>
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to AI Playground</h2>
                <p className="text-slate-400 mb-6">
                  Start a conversation with {currentModel?.name || 'AI'}
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                  {[
                    'Explain quantum computing',
                    'Write a Python function',
                    'Help me brainstorm ideas',
                    'Debug my code',
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setInput(prompt)}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {currentConversation.messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn('flex gap-4', message.role === 'user' && 'justify-end')}
                  >
                    {message.role === 'assistant' && (
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentModel?.gradientColor || 'from-cyan-500 to-blue-500'} flex items-center justify-center shrink-0`}>
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}

                    <div
                      className={cn(
                        'group relative max-w-[85%] rounded-2xl',
                        message.role === 'user'
                          ? 'bg-cyan-500 text-white px-4 py-3'
                          : 'bg-white/5 border border-white/10 px-4 py-3'
                      )}
                    >
                      {message.role === 'assistant' ? (
                        <MessageContent
                          content={message.content}
                          isStreaming={isLoading && index === currentConversation.messages.length - 1}
                        />
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}

                      {/* Message Actions */}
                      <div className={cn(
                        'absolute -bottom-8 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
                        message.role === 'user' ? 'right-0' : 'left-0'
                      )}>
                        <button
                          onClick={() => handleCopyMessage(message.content, message.id)}
                          className="p-1.5 text-slate-500 hover:text-white rounded transition-colors"
                        >
                          {copiedMessageId === message.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {isLoading && currentConversation.messages[currentConversation.messages.length - 1]?.role === 'user' && (
                  <div className="flex gap-4">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentModel?.gradientColor || 'from-cyan-500 to-blue-500'} flex items-center justify-center`}>
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-slate-400">Thinking...</p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 bg-black/50 backdrop-blur-xl px-4 py-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message BrainStack AI..."
                className="w-full px-4 py-3 pr-14 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-cyan-500 transition-colors resize-none min-h-[52px] max-h-[200px]"
                disabled={isLoading}
                rows={1}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 bottom-2 p-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span>Model: {currentModel?.name}</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Playground() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading...
        </div>
      </div>
    }>
      <PlaygroundContent />
    </Suspense>
  );
}
