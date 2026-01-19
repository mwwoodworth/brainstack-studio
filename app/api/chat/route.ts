import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';

export const runtime = 'edge';

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
    const selectedModel = MODELS[modelKey]();

    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required and must not be empty' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = streamText({
      model: selectedModel,
      messages,
      system: systemPrompt || DEFAULT_SYSTEM_PROMPT,
      temperature,
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
