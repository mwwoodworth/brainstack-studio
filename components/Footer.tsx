'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const [version, setVersion] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const res = await fetch('/api/system-status');
        if (res.ok) {
          const data = await res.json();
          setVersion(data.health.version);
          setTimestamp(new Date(data.timestamp).toLocaleString());
        }
      } catch {
        setVersion('v3.x');
      }
    };
    fetchVersion();
  }, []);

  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center font-black text-lg">
                B
              </div>
              <span className="text-xl font-bold">BrainOps</span>
              <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-1 rounded-full">
                AI OS
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-md mb-4">
              The world's first autonomous AI Operating System for business. Running 24/7 with
              persistent memory and self-healing capabilities.
            </p>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/brainopsai"
                className="text-gray-400 hover:text-white transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/brainops"
                className="text-gray-400 hover:text-white transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/mwwoodworth"
                className="text-gray-400 hover:text-white transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#capabilities" className="hover:text-white transition">
                  Capabilities
                </a>
              </li>
              <li>
                <a href="#ai-playground" className="hover:text-white transition">
                  AI Playground
                </a>
              </li>
              <li>
                <a href="#dashboard" className="hover:text-white transition">
                  Live Dashboard
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="font-semibold mb-4">Ecosystem</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="https://myroofgenius.com"
                  className="hover:text-white transition flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MyRoofGenius <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://brainops-command-center.vercel.app"
                  className="hover:text-white transition flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Command Center <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://weathercraft-erp.vercel.app"
                  className="hover:text-white transition flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Weathercraft ERP <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} BrainOps. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            {version && (
              <span className="text-xs bg-white/5 px-2 py-1 rounded">
                BrainOps {version}
              </span>
            )}
            {timestamp && (
              <span className="text-xs">
                Last sync: {timestamp}
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
