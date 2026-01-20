import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';

export const runtime = 'edge';

// Backend proxy URL for when local API keys are not configured
const BACKEND_PROXY_URL = process.env.BACKEND_PROXY_URL || 'https://brainops-ai-agents.onrender.com';
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || 'brainops_prod_key_2025';

// Check if we have API keys configured locally
const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
const hasGoogleKey = !!process.env.GOOGLE_API_KEY || !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const hasPerplexityKey = !!process.env.PERPLEXITY_API_KEY;

// Create Perplexity provider using OpenAI-compatible API
const perplexity = createOpenAI({
  name: 'perplexity',
  apiKey: process.env.PERPLEXITY_API_KEY ?? '',
  baseURL: 'https://api.perplexity.ai',
});

// Model configurations with proper typing
const MODELS = {
  claude: () => anthropic('claude-opus-4-5-20251101'),
  gpt: () => openai('gpt-5.2'),
  gemini: () => google('gemini-3.0-pro'),
  perplexity: () => perplexity('sonar-pro'),
} as const;

type ModelKey = keyof typeof MODELS;

// Check if a specific model has its API key configured
function hasApiKeyForModel(model: ModelKey): boolean {
  switch (model) {
    case 'claude': return hasAnthropicKey;
    case 'gpt': return hasOpenAIKey;
    case 'gemini': return hasGoogleKey;
    case 'perplexity': return hasPerplexityKey;
    default: return false;
  }
}

const DEFAULT_SYSTEM_PROMPT = `You are BrainStack AI, a powerful assistant running on the BrainStack Studio platform.
You have access to multiple AI models and can help with coding, analysis, creative tasks, and more.
Be helpful, concise, and professional. You're part of the BrainOps AI Operating System ecosystem.

When writing code:
- Use markdown code blocks with language specifiers
- Provide clear explanations
- Follow best practices for the language

When analyzing or discussing topics:
- Be thorough but concise
- Use formatting (headers, lists, bold) for clarity
- Cite sources when relevant`;

// Proxy chat request through BrainOps AI Agents backend (AUREA Chat endpoint)
async function proxyToBackend(
  messages: Array<{ role: string; content: string }>,
  model: string,
  systemPrompt: string,
  temperature: number,
  maxTokens: number
): Promise<Response> {
  // Combine all user messages into the last message for AUREA
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';

  // Build context from conversation history
  const contextMessages = messages.slice(0, -1).map(m => `${m.role}: ${m.content}`).join('\n');
  const fullMessage = contextMessages
    ? `Context from conversation:\n${contextMessages}\n\nCurrent message: ${lastUserMessage}`
    : lastUserMessage;

  try {
    // Use non-streaming mode for edge runtime compatibility
    const response = await fetch(`${BACKEND_PROXY_URL}/aurea/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': BACKEND_API_KEY,
      },
      body: JSON.stringify({
        message: fullMessage,
        stream: false,  // Non-streaming for edge compatibility
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Backend proxy error: ${error}`);
      throw new Error(`Backend proxy error: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.response || 'No response from AI';

    // Return as streaming-compatible format for useChat hook
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(responseText));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Proxy to backend failed:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      messages,
      model = 'claude',
      systemPrompt,
      temperature = 0.7,
      maxTokens = 4096
    } = body;

    // Validate model
    const modelKey = (model in MODELS ? model : 'claude') as ModelKey;

    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required and must not be empty' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const sanitizedMessages = messages
      .filter((message) => message && typeof message.content === 'string' && typeof message.role === 'string')
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    if (sanitizedMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages must include role and content' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const normalizedTemperature = Number.isFinite(temperature)
      ? Math.min(Math.max(Number(temperature), 0), 2)
      : 0.7;
    const normalizedMaxTokens = Number.isFinite(maxTokens)
      ? Math.min(Math.max(Number(maxTokens), 256), 32000)
      : 4096;

    const finalSystemPrompt = systemPrompt || DEFAULT_SYSTEM_PROMPT;

    // Check if we have the API key for this model
    if (!hasApiKeyForModel(modelKey)) {
      console.log(`No API key for model ${modelKey}, proxying through backend`);
      return proxyToBackend(
        sanitizedMessages,
        modelKey,
        finalSystemPrompt,
        normalizedTemperature,
        normalizedMaxTokens
      );
    }

    // Use direct AI SDK if we have the API key
    const selectedModel = MODELS[modelKey]();
    const result = streamText({
      model: selectedModel,
      messages: sanitizedMessages,
      system: finalSystemPrompt,
      temperature: normalizedTemperature,
      // Note: maxTokens is controlled by the model provider's defaults
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const isApiKeyError = errorMessage.toLowerCase().includes('api key') ||
                          errorMessage.toLowerCase().includes('unauthorized');

    return new Response(
      JSON.stringify({
        error: isApiKeyError
          ? 'API configuration error. Please check your API keys.'
          : 'Failed to process request. Please try again.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      }),
      { status: isApiKeyError ? 401 : 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Health check endpoint
export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      models: Object.keys(MODELS),
      timestamp: new Date().toISOString()
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
