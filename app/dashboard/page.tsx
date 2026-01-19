'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useConversations } from '@/hooks/useConversations';
import { AI_MODELS } from '@/lib/constants';
import { formatDate, truncateText } from '@/lib/utils';
import Link from 'next/link';
import {
  LayoutDashboard,
  MessageSquare,
  Search,
  Plus,
  Trash2,
  Clock,
  Brain,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Calendar,
} from 'lucide-react';

export default function DashboardPage() {
  const {
    conversations,
    isLoaded,
    createConversation,
    deleteConversation,
  } = useConversations();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = !searchQuery ||
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.messages.some((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesModel = !selectedModel || conv.model === selectedModel;
    return matchesSearch && matchesModel;
  });

  // Stats
  const totalConversations = conversations.length;
  const totalMessages = conversations.reduce((acc, c) => acc + c.messages.length, 0);
  const modelUsage = AI_MODELS.map((model) => ({
    ...model,
    count: conversations.filter((c) => c.model === model.id).length,
  }));
  const mostUsedModel = modelUsage.sort((a, b) => b.count - a.count)[0];

  const handleNewConversation = () => {
    const conv = createConversation();
    window.location.href = `/playground?id=${conv.id}`;
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-32 pb-20 px-6 flex items-center justify-center">
          <div className="animate-pulse text-slate-400">Loading dashboard...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <LayoutDashboard className="w-10 h-10 text-cyan-400" />
                <h1 className="text-4xl font-bold">Dashboard</h1>
              </div>
              <p className="text-slate-400">
                Manage your conversations and track your AI usage.
              </p>
            </div>
            <Button onClick={handleNewConversation} size="lg">
              <Plus className="w-5 h-5" />
              New Conversation
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalConversations}</div>
                    <div className="text-xs text-slate-400">Conversations</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalMessages}</div>
                    <div className="text-xs text-slate-400">Total Messages</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Brain className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{AI_MODELS.length}</div>
                    <div className="text-xs text-slate-400">AI Models</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold truncate">{mostUsedModel?.name.split(' ')[0] || 'N/A'}</div>
                    <div className="text-xs text-slate-400">Most Used</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="pl-12"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <Button
                variant={selectedModel === null ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedModel(null)}
              >
                All
              </Button>
              {AI_MODELS.map((model) => (
                <Button
                  key={model.id}
                  variant={selectedModel === model.id ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedModel(model.id)}
                >
                  {model.name.split(' ')[0]}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Conversations List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {filteredConversations.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {conversations.length === 0 ? 'No conversations yet' : 'No matching conversations'}
                  </h3>
                  <p className="text-slate-400 mb-6">
                    {conversations.length === 0
                      ? 'Start a new conversation to get started with BrainStack Studio.'
                      : 'Try adjusting your search or filters.'}
                  </p>
                  {conversations.length === 0 && (
                    <Button onClick={handleNewConversation}>
                      <Plus className="w-4 h-4" />
                      Start Your First Conversation
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredConversations.map((conversation) => {
                    const model = AI_MODELS.find((m) => m.id === conversation.model);
                    const lastMessage = conversation.messages[conversation.messages.length - 1];

                    return (
                      <motion.div
                        key={conversation.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Card variant="interactive" className="group">
                          <CardContent className="py-4">
                            <div className="flex items-start gap-4">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${model?.gradientColor || 'from-cyan-500 to-blue-500'} flex items-center justify-center shrink-0`}>
                                <Brain className="w-5 h-5 text-white" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold truncate">{conversation.title}</h3>
                                  <Badge variant="default" className="shrink-0">
                                    {model?.name.split(' ')[0] || conversation.model}
                                  </Badge>
                                </div>

                                {lastMessage && (
                                  <p className="text-sm text-slate-400 truncate">
                                    {truncateText(lastMessage.content, 100)}
                                  </p>
                                )}

                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    {conversation.messages.length} messages
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {formatDate(conversation.updatedAt)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/playground?id=${conversation.id}`}>
                                  <Button variant="secondary" size="sm">
                                    Open
                                    <ChevronRight className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    deleteConversation(conversation.id);
                                  }}
                                  className="text-slate-400 hover:text-red-400"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
