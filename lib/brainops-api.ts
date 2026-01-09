const BRAINOPS_API = 'https://brainops-ai-agents.onrender.com';
const MCP_BRIDGE_API = 'https://brainops-mcp-bridge.onrender.com';
const BACKEND_API = 'https://brainops-backend-prod.onrender.com';
const API_KEY = process.env.BRAINOPS_API_KEY || 'brainops_prod_key_2025';

export interface SystemHealth {
  status: string;
  version: string;
  active_systems: number;
  agent_count: number;
  memory_count: number;
  aurea_success_rate: number;
  capabilities: Record<string, boolean>;
  embedded_memory_stats?: {
    episodic: number;
    procedural: number;
    meta: number;
  };
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  description?: string;
  last_execution?: string;
  executions_today?: number;
}

export interface MCPHealth {
  status: string;
  mcp_servers: number;
  total_tools: number;
  config_path: string;
}

export interface BrainMemory {
  key: string;
  category: string;
  value: unknown;
  created_at: string;
}

// Always fetch live data - no fallbacks
export async function getSystemHealth(): Promise<SystemHealth> {
  const res = await fetch(`${BRAINOPS_API}/health`, {
    headers: { 'X-API-Key': API_KEY },
    cache: 'no-store', // Always fresh
  });

  if (!res.ok) {
    throw new Error(`System health fetch failed: ${res.status}`);
  }

  return await res.json();
}

export async function getAgents(): Promise<Agent[]> {
  const res = await fetch(`${BRAINOPS_API}/agents`, {
    headers: { 'X-API-Key': API_KEY },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Agents fetch failed: ${res.status}`);
  }

  return await res.json();
}

export async function getMCPHealth(): Promise<MCPHealth> {
  const res = await fetch(`${MCP_BRIDGE_API}/health`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`MCP health fetch failed: ${res.status}`);
  }

  return await res.json();
}

export async function getBackendHealth(): Promise<{ status: string; version: string }> {
  const res = await fetch(`${BACKEND_API}/health`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Backend health fetch failed: ${res.status}`);
  }

  return await res.json();
}

export async function getBrainCritical(): Promise<BrainMemory[]> {
  const res = await fetch(`${BRAINOPS_API}/brain/critical`, {
    headers: { 'X-API-Key': API_KEY },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Brain critical fetch failed: ${res.status}`);
  }

  return await res.json();
}

export async function queryBrain(query: string): Promise<unknown> {
  const res = await fetch(`${BRAINOPS_API}/brain/query`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Brain query failed: ${res.status}`);
  }

  return await res.json();
}

// Aggregate all system status for the dashboard
export async function getFullSystemStatus() {
  const [health, agents, mcp, backend] = await Promise.all([
    getSystemHealth(),
    getAgents(),
    getMCPHealth(),
    getBackendHealth(),
  ]);

  return {
    health,
    agents,
    mcp,
    backend,
    timestamp: new Date().toISOString(),
  };
}
