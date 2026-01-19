'use client';

import Link from 'next/link';
import { Brain, Github, Twitter, Linkedin } from 'lucide-react';

const FOOTER_LINKS = {
  Product: [
    { label: 'Playground', href: '/playground' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'API', href: '/api-docs' },
    { label: 'Pricing', href: '/pricing' },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'API Reference', href: '/api-docs' },
    { label: 'Examples', href: '/docs#examples' },
    { label: 'Changelog', href: '/docs#changelog' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Security', href: '/security' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Brain className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold">BrainStack Studio</span>
            </Link>
            <p className="text-slate-400 text-sm mb-4 max-w-xs">
              The multi-AI platform for the future. Access Claude, GPT, Gemini, and Perplexity in one unified interface.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} BrainStack Studio. Part of the BrainOps AI Operating System.
          </p>
          <p className="text-sm text-slate-500">
            Built with Next.js, Vercel AI SDK, and love.
          </p>
        </div>
      </div>
    </footer>
  );
}
