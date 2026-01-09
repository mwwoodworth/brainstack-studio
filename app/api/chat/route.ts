import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

export const runtime = 'edge';

const MODELS: Record<string, any> = {
  claude: anthropic('claude-opus-4-5-20251101'),
  gpt: openai('gpt-5.2'),
  gemini: google('gemini-3.0-pro'),
};

export async function POST(req: Request) {
  const { messages, model = 'claude' } = await req.json();

  const selectedModel = MODELS[model] || MODELS.claude;

  const result = streamText({
    model: selectedModel,
    messages,
    system: `You are BrainStack AI, a powerful assistant running on the BrainStack Studio platform.
You have access to multiple AI models and can help with coding, analysis, creative tasks, and more.
Be helpful, concise, and professional. You're part of the BrainOps AI Operating System ecosystem.`,
  });

  return result.toTextStreamResponse();
}
