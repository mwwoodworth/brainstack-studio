import { anthropic } from '@ai-sdk/anthropic';
import { createOpenAI, openai } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export type AIProvider = 'claude' | 'gemini' | 'gpt' | 'perplexity';

export interface AIModelConfig {
  provider: AIProvider;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export const AI_MODELS: AIModelConfig[] = [
  {
    provider: 'claude',
    name: 'Claude Opus 4.5',
    description: 'Most intelligent - Deep reasoning & analysis',
    color: '#D97706',
    icon: '🧠',
  },
  {
    provider: 'gemini',
    name: 'Gemini 3 Flash',
    description: 'Ultra-fast - 1M token context window',
    color: '#4285F4',
    icon: '⚡',
  },
  {
    provider: 'gpt',
    name: 'GPT-5.2',
    description: 'Agentic - Complex multi-step tasks',
    color: '#10A37F',
    icon: '🤖',
  },
  {
    provider: 'perplexity',
    name: 'Perplexity Sonar',
    description: 'Search-augmented - Real-time knowledge',
    color: '#7C3AED',
    icon: '🔍',
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAIModel(provider: AIProvider): { model: any; name: string } | null {
  switch (provider) {
    case 'claude': {
      const key = process.env.ANTHROPIC_API_KEY;
      if (key && key.trim().length > 10) {
        return { model: anthropic('claude-opus-4-5-20251101'), name: 'Claude Opus 4.5' };
      }
      break;
    }
    case 'gemini': {
      const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
      if (key && key.trim().length > 10) {
        const google = createGoogleGenerativeAI({ apiKey: key.trim() });
        return { model: google('gemini-3-flash-preview'), name: 'Gemini 3 Flash' };
      }
      break;
    }
    case 'gpt': {
      const key = process.env.OPENAI_API_KEY;
      if (key && key.trim().length > 10) {
        return { model: openai('gpt-5.2'), name: 'GPT-5.2' };
      }
      break;
    }
    case 'perplexity': {
      const key = process.env.PERPLEXITY_API_KEY;
      if (key && key.trim().length > 10) {
        const perplexity = createOpenAI({
          apiKey: key.trim(),
          baseURL: 'https://api.perplexity.ai',
        });
        return { model: perplexity('sonar-pro'), name: 'Perplexity Sonar' };
      }
      break;
    }
  }
  return null;
}

export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = [];

  if (process.env.ANTHROPIC_API_KEY) providers.push('claude');
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY) providers.push('gemini');
  if (process.env.OPENAI_API_KEY) providers.push('gpt');
  if (process.env.PERPLEXITY_API_KEY) providers.push('perplexity');

  return providers;
}

export function getBestAvailableModel(): { model: any; name: string; provider: AIProvider } | null {
  const priority: AIProvider[] = ['claude', 'gemini', 'gpt', 'perplexity'];

  for (const provider of priority) {
    const result = getAIModel(provider);
    if (result) {
      return { ...result, provider };
    }
  }

  return null;
}
