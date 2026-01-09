'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Database,
  Shield,
  Plug,
  Users,
  Calendar,
  Zap,
  Activity,
  RefreshCw,
} from 'lucide-react';

interface CapabilityData {
  executions?: number;
  memories?: number;
  systems?: number;
  tools?: number;
  agents?: number;
  active?: number;
}

export default function Capabilities() {
  const [data, setData] = useState<CapabilityData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/system-status');
        if (res.ok) {
          const result = await res.json();
          setData({
            agents: result.health.agent_count,
            memories: result.health.memory_count,
            systems: result.health.active_systems,
            tools: result.mcp.total_tools,
            active: result.agents?.filter((a: any) => a.status === 'active').length || 0,
          });
        }
      } catch (e) {
        console.error('Failed to fetch capabilities data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const capabilities = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'AUREA Orchestrator',
      description: 'Autonomous decision-making engine with OODA loop implementation',
      stat: loading ? '...' : `${data.active || 0}+ active`,
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Unified Brain',
      description: 'Persistent memory system that never forgets context',
      stat: loading ? '...' : `${(data.memories || 0).toLocaleString()} memories`,
      color: 'from-violet-500 to-purple-600',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Self-Healing',
      description: 'Automatic error detection, diagnosis, and recovery',
      stat: loading ? '...' : `${data.systems || 0} systems monitored`,
      color: 'from-emerald-500 to-green-600',
    },
    {
      icon: <Plug className="w-8 h-8" />,
      title: 'Universal Bridge',
      description: 'MCP integration connecting to your entire tech stack',
      stat: loading ? '...' : `${data.tools || 0}+ tools`,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Digital Twins',
      description: 'Real-time replicas of your systems for simulation',
      stat: 'Live replicas',
      color: 'from-pink-500 to-rose-600',
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Agent Scheduler',
      description: 'Intelligent task scheduling across all agents',
      stat: loading ? '...' : `${data.agents || 0} agents`,
      color: 'from-indigo-500 to-blue-600',
    },
  ];

  return (
    <section id="capabilities" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm font-medium mb-6"
          >
            <Activity className="w-4 h-4" />
            CORE CAPABILITIES
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            Built for <span className="text-gradient">Autonomous Operations</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Six core systems working together to run your business 24/7. All metrics are live.
          </motion.p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, index) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 group hover:glow-subtle transition-all duration-300"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cap.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                {cap.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{cap.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{cap.description}</p>
              <div className="flex items-center gap-2 text-sm">
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-violet-400" />
                ) : (
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                )}
                <span className="text-violet-300 font-medium">{cap.stat}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
