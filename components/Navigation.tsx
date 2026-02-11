'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const NAV_LINKS = [
  { href: '/explorer', label: 'Explorer' },
  { href: '/tools', label: 'Tools' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/technology', label: 'Platform' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black rounded-lg">
            <Brain className="w-8 h-8 text-cyan-400" />
            <span className="text-xl font-bold">BrainStack Studio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-cyan-400'
                    : 'text-slate-300 hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons — Auth-aware */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-8" />
            ) : user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/pricing">
                  <Button size="sm">Get Pro</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pt-4 pb-2 space-y-2"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'block px-4 py-2 rounded-lg transition-colors',
                  pathname === link.href
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10 flex gap-2">
              {user ? (
                <>
                  <Link href="/dashboard" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="secondary" className="w-full" size="sm">Dashboard</Button>
                  </Link>
                  <Button className="flex-1" size="sm" onClick={() => { signOut(); setIsMenuOpen(false); }}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="secondary" className="w-full" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/pricing" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full" size="sm">Get Pro</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
