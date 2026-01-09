'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LiveData {
  agent_count: number;
  memory_count: number;
  mcp_tools: number;
  aurea_success_rate: number;
}

export default function Hero() {
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/system-status');
        if (res.ok) {
          const data = await res.json();
          setLiveData({
            agent_count: data.health.agent_count,
            memory_count: data.health.memory_count,
            mcp_tools: data.mcp.total_tools,
            aurea_success_rate: data.health.aurea_success_rate,
          });
          setStatus('live');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pt-36 pb-24 px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto text-center relative">
        {/* Live Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm font-medium mb-8"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              status === 'live'
                ? 'bg-green-400 animate-pulse'
                : status === 'error'
                ? 'bg-red-400'
                : 'bg-yellow-400 animate-pulse'
            }`}
          />
          {status === 'live' && liveData && (
            <span>
              {liveData.agent_count} agents active | {liveData.mcp_tools} tools | {liveData.aurea_success_rate}% success
            </span>
          )}
          {status === 'loading' && <span>Connecting to BrainOps...</span>}
          {status === 'error' && <span>Reconnecting...</span>}
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tight"
        >
          The First
          <br />
          <span className="text-gradient">Business AI</span>
          <br />
          Operating System
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Not another chatbot. Not another copilot.
          <br />
          <span className="text-white font-semibold">An operating system that runs your company.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <a
            href="#ai-playground"
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-10 py-5 rounded-2xl font-bold text-lg transition glow"
          >
            Try AI Playground
          </a>
          <a
            href="#dashboard"
            className="bg-white/5 hover:bg-white/10 border border-white/10 px-10 py-5 rounded-2xl font-semibold text-lg transition"
          >
            View Live Dashboard
          </a>
        </motion.div>

        {/* Comparison Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6"
        >
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 text-left">
            <div className="text-red-400 font-bold mb-3 flex items-center gap-2">
              <span className="text-xl">&#10005;</span> Traditional AI (Copilots)
            </div>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Waits for your prompts</li>
              <li>Forgets everything between sessions</li>
              <li>Works in one app at a time</li>
              <li>Suggests actions for humans to take</li>
              <li>Breaks and waits for IT</li>
            </ul>
          </div>
          <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 text-left">
            <div className="text-green-400 font-bold mb-3 flex items-center gap-2">
              <span className="text-xl">&#10003;</span> BrainOps AI OS
            </div>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <span className="text-white">Monitors, decides, and acts 24/7</span>
              </li>
              <li>
                <span className="text-white">
                  {liveData ? `${liveData.memory_count.toLocaleString()} memories` : 'Persistent memory'}
                </span>
              </li>
              <li>
                <span className="text-white">
                  {liveData ? `${liveData.mcp_tools}+ integrated tools` : '245+ tools'}
                </span>
              </li>
              <li>
                <span className="text-white">
                  {liveData ? `${liveData.agent_count} agents execute autonomously` : 'Autonomous execution'}
                </span>
              </li>
              <li>
                <span className="text-white">Self-healing recovery system</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
