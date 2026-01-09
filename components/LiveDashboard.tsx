'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Brain,
  Cpu,
  Database,
  Gauge,
  RefreshCw,
  Server,
  Zap,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface SystemData {
  health: {
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
  };
  mcp: {
    mcp_servers: number;
    total_tools: number;
  };
  agents: Array<{
    id: string;
    name: string;
    status: string;
  }>;
  timestamp: string;
}

export default function LiveDashboard() {
  const [data, setData] = useState<SystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/system-status');
      if (!res.ok) throw new Error('Failed to fetch system status');
      const result = await res.json();
      setData(result);
      setLastUpdate(new Date());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-8 h-8 animate-spin text-violet-500" />
        <span className="ml-3 text-gray-400">Connecting to BrainOps...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-violet-600 rounded-lg hover:bg-violet-500 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const capabilities = data.health.capabilities || {};
  const activeCapabilities = Object.values(capabilities).filter(Boolean).length;

  return (
    <section id="dashboard" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            LIVE SYSTEM DASHBOARD
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Real-Time Intelligence</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Live metrics from the BrainOps AI Operating System. Updated every 10 seconds.
          </p>
          {lastUpdate && (
            <p className="text-xs text-gray-500 mt-2">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Brain className="w-6 h-6" />}
            label="AI Agents"
            value={data.health.agent_count}
            color="violet"
          />
          <StatCard
            icon={<Zap className="w-6 h-6" />}
            label="MCP Tools"
            value={data.mcp.total_tools}
            color="cyan"
          />
          <StatCard
            icon={<Database className="w-6 h-6" />}
            label="Memories"
            value={data.health.memory_count.toLocaleString()}
            color="emerald"
          />
          <StatCard
            icon={<Gauge className="w-6 h-6" />}
            label="AUREA Success"
            value={`${data.health.aurea_success_rate}%`}
            color="amber"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Server className="w-5 h-5 text-violet-400" />
              <h3 className="font-bold">Active Systems</h3>
            </div>
            <div className="text-4xl font-black text-gradient">
              {data.health.active_systems}
            </div>
            <p className="text-sm text-gray-500 mt-1">Core systems running</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold">MCP Servers</h3>
            </div>
            <div className="text-4xl font-black text-gradient">{data.mcp.mcp_servers}</div>
            <p className="text-sm text-gray-500 mt-1">Connected bridges</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold">Capabilities</h3>
            </div>
            <div className="text-4xl font-black text-gradient">{activeCapabilities}</div>
            <p className="text-sm text-gray-500 mt-1">Active features</p>
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-violet-400" />
            Bleeding Edge AI Capabilities
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(capabilities).map(([key, active]) => (
              <div
                key={key}
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}
              >
                {active ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span className="text-sm font-medium capitalize">
                  {key.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Embedded Memory Stats */}
        {data.health.embedded_memory_stats && (
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-violet-400" />
              Embedded Memory System
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <MemoryStat
                label="Episodic Memory"
                value={data.health.embedded_memory_stats.episodic}
                description="Event-based memories"
              />
              <MemoryStat
                label="Procedural Memory"
                value={data.health.embedded_memory_stats.procedural}
                description="How-to knowledge"
              />
              <MemoryStat
                label="Meta Memory"
                value={data.health.embedded_memory_stats.meta}
                description="Self-awareness data"
              />
            </div>
          </div>
        )}

        {/* Version Info */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          BrainOps AI OS {data.health.version} | Timestamp: {data.timestamp}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    violet: 'from-violet-600 to-purple-600',
    cyan: 'from-cyan-600 to-blue-600',
    emerald: 'from-emerald-600 to-green-600',
    amber: 'from-amber-600 to-orange-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 relative overflow-hidden"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-5`}
      />
      <div className="relative">
        <div className={`text-${color}-400 mb-3`}>{icon}</div>
        <div className="text-3xl font-black">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
    </motion.div>
  );
}

function MemoryStat({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-4">
      <div className="text-2xl font-bold text-violet-400">{value}</div>
      <div className="font-medium">{label}</div>
      <div className="text-xs text-gray-500">{description}</div>
    </div>
  );
}
