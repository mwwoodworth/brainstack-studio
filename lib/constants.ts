import { AIModel, UserPreferences } from '@/types';

export const AI_MODELS: AIModel[] = [
  {
    id: 'claude',
    name: 'Claude Opus 4.5',
    provider: 'Anthropic',
    color: 'bg-orange-500',
    gradientColor: 'from-orange-500 to-amber-500',
    description: 'Most capable model for complex reasoning, analysis, and creative tasks',
    capabilities: ['Advanced Reasoning', 'Code Generation', 'Analysis', 'Creative Writing', 'Vision'],
    contextWindow: '200K tokens',
    pricing: '$15/1M input, $75/1M output',
  },
  {
    id: 'gpt',
    name: 'GPT-5.2',
    provider: 'OpenAI',
    color: 'bg-emerald-500',
    gradientColor: 'from-emerald-500 to-teal-500',
    description: 'Versatile model with strong general-purpose capabilities',
    capabilities: ['Multi-modal', 'Function Calling', 'Code Interpreter', 'DALL-E Integration'],
    contextWindow: '128K tokens',
    pricing: '$10/1M input, $30/1M output',
  },
  {
    id: 'gemini',
    name: 'Gemini 3 Pro',
    provider: 'Google',
    color: 'bg-blue-500',
    gradientColor: 'from-blue-500 to-indigo-500',
    description: 'Multimodal AI with native Google ecosystem integration',
    capabilities: ['Multimodal', 'Long Context', 'Google Search', 'Code Execution'],
    contextWindow: '1M tokens',
    pricing: '$7/1M input, $21/1M output',
  },
  {
    id: 'perplexity',
    name: 'Sonar Pro',
    provider: 'Perplexity',
    color: 'bg-purple-500',
    gradientColor: 'from-purple-500 to-pink-500',
    description: 'Real-time web search with AI-powered synthesis',
    capabilities: ['Real-time Search', 'Citations', 'Web Browsing', 'Fact Checking'],
    contextWindow: '128K tokens',
    pricing: '$5/1M input, $15/1M output',
  },
];

export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultModel: 'claude',
  theme: 'dark',
  streamingEnabled: true,
  systemPrompt: `You are BrainStack AI, a powerful assistant running on the BrainStack Studio platform.
You have access to multiple AI models and can help with coding, analysis, creative tasks, and more.
Be helpful, concise, and professional. You're part of the BrainOps AI Operating System ecosystem.`,
  temperature: 0.7,
  maxTokens: 4096,
};

export const PLATFORM_FEATURES = [
  {
    title: 'Multi-AI Orchestration',
    description: 'Seamlessly switch between Claude, GPT, Gemini, and Perplexity in one unified interface',
    icon: 'Brain',
  },
  {
    title: 'Real-time Streaming',
    description: 'Watch AI responses stream in real-time with low latency edge deployment',
    icon: 'Zap',
  },
  {
    title: 'Conversation Memory',
    description: 'Your conversations are automatically saved and synced across sessions',
    icon: 'Database',
  },
  {
    title: 'Code Intelligence',
    description: 'Syntax highlighting, code execution, and intelligent code assistance',
    icon: 'Code',
  },
  {
    title: 'Global Infrastructure',
    description: 'Enterprise-grade infrastructure with 99.9% uptime SLA',
    icon: 'Globe',
  },
  {
    title: 'API Access',
    description: 'Full API access to integrate BrainStack into your own applications',
    icon: 'Terminal',
  },
];

export const STORAGE_KEYS = {
  CONVERSATIONS: 'brainstack_conversations',
  PREFERENCES: 'brainstack_preferences',
  CURRENT_CONVERSATION: 'brainstack_current_conversation',
};
