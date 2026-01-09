import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createOpenAI, openai } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const BRAINOPS_API = 'https://brainops-ai-agents.onrender.com';
const API_KEY = process.env.BRAINOPS_API_KEY || 'brainops_prod_key_2025';

type Provider = 'claude' | 'gemini' | 'gpt' | 'perplexity';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getModel(provider: Provider): { model: any; name: string } | null {
  switch (provider) {
    case 'claude': {
      const key = process.env.ANTHROPIC_API_KEY;
      if (key?.trim()) {
        return { model: anthropic('claude-opus-4-5-20251101'), name: 'Claude Opus 4.5' };
      }
      break;
    }
    case 'gemini': {
      const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
      if (key?.trim()) {
        const google = createGoogleGenerativeAI({ apiKey: key.trim() });
        return { model: google('gemini-3-flash-preview'), name: 'Gemini 3 Flash' };
      }
      break;
    }
    case 'gpt': {
      const key = process.env.OPENAI_API_KEY;
      if (key?.trim()) {
        return { model: openai('gpt-5.2'), name: 'GPT-5.2' };
      }
      break;
    }
    case 'perplexity': {
      const key = process.env.PERPLEXITY_API_KEY;
      if (key?.trim()) {
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

function getBestModel(): { model: any; name: string; provider: Provider } | null {
  const priority: Provider[] = ['claude', 'gemini', 'gpt', 'perplexity'];
  for (const p of priority) {
    const result = getModel(p);
    if (result) return { ...result, provider: p };
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, provider: requestedProvider } = await req.json();

    // Get the appropriate model
    let modelConfig;
    if (requestedProvider) {
      modelConfig = getModel(requestedProvider);
      if (!modelConfig) {
        // Fall back to best available
        modelConfig = getBestModel();
      }
    } else {
      modelConfig = getBestModel();
    }

    if (!modelConfig) {
      return new Response(JSON.stringify({ error: 'No AI provider configured' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch live system context
    let systemContext = '';
    try {
      const healthRes = await fetch(`${BRAINOPS_API}/health`, {
        headers: { 'X-API-Key': API_KEY },
      });
      if (healthRes.ok) {
        const health = await healthRes.json();
        systemContext = `
LIVE BRAINOPS SYSTEM STATUS:
- Version: ${health.version}
- Active Systems: ${health.active_systems}
- AI Agents: ${health.agent_count}
- Memory Entries: ${health.memory_count?.toLocaleString()}
- AUREA Success Rate: ${health.aurea_success_rate}%
- Capabilities: ${Object.entries(health.capabilities || {}).filter(([,v]) => v).map(([k]) => k.replace(/_/g, ' ')).join(', ')}
`;
      }
    } catch (e) {
      console.error('Failed to fetch system context:', e);
    }

    const systemPrompt = `You are the BrainOps AI Assistant - the interface to the world's first Business AI Operating System.

You are powered by ${modelConfig.name}.

${systemContext}

PERSONALITY:
- You are knowledgeable, professional, and helpful
- You represent cutting-edge AI technology
- You can explain BrainOps capabilities, architecture, and use cases
- You are honest about what BrainOps can and cannot do
- You encourage users to explore the live dashboard and request access

KEY FEATURES TO DISCUSS:
1. AUREA Orchestrator - The autonomous decision-making engine
2. Unified Brain - Persistent memory system (${systemContext.includes('Memory Entries') ? 'active' : 'configuring'})
3. Self-Healing Systems - Automatic error detection and recovery
4. MCP Bridge - Integration with 245+ tools
5. Digital Twins - Real-time system replicas
6. Multi-Agent Architecture - 59+ specialized AI agents

Be concise, informative, and engaging. Help users understand why BrainOps is different from traditional AI assistants.`;

    const result = streamText({
      model: modelConfig.model,
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Chat failed', details: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
