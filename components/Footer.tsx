'use client';

import Link from 'next/link';
import { Brain, Github, Linkedin } from 'lucide-react';
import { NewsletterCTA } from '@/components/NewsletterCTA';

const FOOTER_LINKS = {
  Product: [
    { label: 'Guided Explorer', href: '/explorer' },
    { label: 'Tools', href: '/tools' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Pricing', href: '/pricing' },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'API Reference', href: '/api-docs' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Platform Trust', href: '/technology' },
    { label: 'Implementation Guide', href: '/docs#implementation' },
  ],
  Company: [
    { label: 'About', href: '/about' },
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
            <p className="text-slate-300 text-sm mb-4 max-w-xs">
              Operational AI that automates real workflows with governance, audit trails,
              and measurable outcomes. Built on a deterministic, audit-ready operational AI engine.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/mwwoodworth" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black rounded" aria-label="BrainStack Studio on GitHub">
                <Github className="w-5 h-5" aria-hidden="true" />
              </a>
              <a href="https://linkedin.com/in/mattwoodworth" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black rounded" aria-label="Matt Woodworth on LinkedIn">
                <Linkedin className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <NewsletterCTA variant="footer" className="col-span-2 md:col-span-6 md:max-w-sm" />

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 hover:text-white transition-colors"
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
          <p className="text-sm text-slate-300">
            &copy; {new Date().getFullYear()} BrainStack Studio. All rights reserved.
          </p>
          <p className="text-sm text-slate-400">
            Operational AI, built for trust.
          </p>
        </div>
      </div>
    </footer>
  );
}
