// Core types for BrainStack Studio

export type AIModel = {
  id: string;
  name: string;
  provider: string;
  color: string;
  gradientColor: string;
  description: string;
  capabilities: string[];
  contextWindow: string;
  pricing: string;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  timestamp: number;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: number;
  updatedAt: number;
  systemPrompt?: string;
};

export type UserPreferences = {
  defaultModel: string;
  theme: 'dark' | 'light' | 'system';
  streamingEnabled: boolean;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
};

export type APIError = {
  code: string;
  message: string;
  details?: string;
};

export type ChatRequest = {
  messages: { role: string; content: string }[];
  model: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
};

export type ChatResponse = {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
};
