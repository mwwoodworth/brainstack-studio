'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center font-black text-lg glow-subtle">
            B
          </div>
          <span className="text-xl font-bold tracking-tight">BrainOps</span>
          <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-1 rounded-full font-medium">
            AI OS
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#capabilities" className="text-gray-400 hover:text-white transition text-sm">
            Capabilities
          </a>
          <a href="#ai-playground" className="text-gray-400 hover:text-white transition text-sm">
            AI Playground
          </a>
          <a href="#architecture" className="text-gray-400 hover:text-white transition text-sm">
            Architecture
          </a>
          <a href="#pricing" className="text-gray-400 hover:text-white transition text-sm">
            Pricing
          </a>
          <a href="#dashboard" className="text-gray-400 hover:text-white transition text-sm">
            Live Dashboard
          </a>
          <a
            href="#contact"
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-5 py-2.5 rounded-lg font-semibold text-sm transition glow-subtle"
          >
            Request Access
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/5">
          <div className="flex flex-col px-6 py-4 gap-4">
            <a href="#capabilities" className="text-gray-400 hover:text-white transition py-2">
              Capabilities
            </a>
            <a href="#ai-playground" className="text-gray-400 hover:text-white transition py-2">
              AI Playground
            </a>
            <a href="#architecture" className="text-gray-400 hover:text-white transition py-2">
              Architecture
            </a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition py-2">
              Pricing
            </a>
            <a href="#dashboard" className="text-gray-400 hover:text-white transition py-2">
              Live Dashboard
            </a>
            <a
              href="#contact"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 rounded-lg font-semibold text-center"
            >
              Request Access
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
