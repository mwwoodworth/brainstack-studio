import { NextResponse } from 'next/server';

const BRAINOPS_API = 'https://brainops-ai-agents.onrender.com';
const MCP_BRIDGE_API = 'https://brainops-mcp-bridge.onrender.com';
const API_KEY = process.env.BRAINOPS_API_KEY || 'brainops_prod_key_2025';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Fetch all live data in parallel
    const [healthRes, agentsRes, mcpRes] = await Promise.all([
      fetch(`${BRAINOPS_API}/health`, {
        headers: { 'X-API-Key': API_KEY },
        cache: 'no-store',
      }),
      fetch(`${BRAINOPS_API}/agents`, {
        headers: { 'X-API-Key': API_KEY },
        cache: 'no-store',
      }),
      fetch(`${MCP_BRIDGE_API}/health`, {
        cache: 'no-store',
      }),
    ]);

    if (!healthRes.ok) {
      throw new Error(`Health API returned ${healthRes.status}`);
    }

    const health = await healthRes.json();
    const agents = agentsRes.ok ? await agentsRes.json() : [];
    const mcp = mcpRes.ok ? await mcpRes.json() : { mcp_servers: 0, total_tools: 0 };

    return NextResponse.json({
      health,
      agents,
      mcp,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('System status fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system status', details: String(error) },
      { status: 500 }
    );
  }
}
