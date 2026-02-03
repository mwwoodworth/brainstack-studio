'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useExplorerSessions } from '@/hooks/useExplorerSessions';
import { INDUSTRIES, PAIN_POINTS, ROLES } from '@/lib/explorer';
import { formatDate, truncateText } from '@/lib/utils';
import {
  LayoutDashboard,
  Search,
  Trash2,
  Clock,
  Target,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';

const getLabel = (list: Array<{ id: string; label: string }>, id?: string) =>
  list.find((item) => item.id === id)?.label ?? 'Unspecified';

export default function DashboardPage() {
  const { sessions, isLoaded, deleteSession, clearSessions } = useExplorerSessions();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = useMemo(() => {
    if (!searchQuery) return sessions;
    const query = searchQuery.toLowerCase();
    return sessions.filter((session) => {
      const industry = getLabel(INDUSTRIES, session.input.industry).toLowerCase();
      const role = getLabel(ROLES, session.input.role).toLowerCase();
      const pain = getLabel(PAIN_POINTS, session.input.painPoint).toLowerCase();
      const summary = session.result.identifiedPain.toLowerCase();
      return (
        industry.includes(query) ||
        role.includes(query) ||
        pain.includes(query) ||
        summary.includes(query)
      );
    });
  }, [sessions, searchQuery]);

  const totalSessions = sessions.length;
  const lastSession = sessions[0];
  const lastRun = lastSession ? formatDate(Date.parse(lastSession.createdAt)) : 'No runs yet';

  const topIndustry = useMemo(() => {
    const counts = sessions.reduce<Record<string, number>>((acc, session) => {
      const key = session.input.industry ?? 'unknown';
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? getLabel(INDUSTRIES, top[0]) : 'N/A';
  }, [sessions]);

  if (!isLoaded) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-32 pb-20 px-6 flex items-center justify-center">
          <div className="animate-pulse text-slate-400">Loading dashboard...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <LayoutDashboard className="w-10 h-10 text-cyan-400" />
                <h1 className="text-4xl font-bold">Explorer Dashboard</h1>
              </div>
              <p className="text-slate-400">
                Review saved Guided Explorer sessions and reuse them for implementation scope.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/explorer">
                <Button size="lg">
                  Run Explorer
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              {sessions.length > 0 && (
                <Button variant="secondary" size="lg" onClick={clearSessions}>
                  Clear All
                </Button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
          >
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <ClipboardList className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalSessions}</div>
                    <div className="text-xs text-slate-400">Saved Sessions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Target className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold truncate">{topIndustry}</div>
                    <div className="text-xs text-slate-400">Top Industry</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{lastRun}</div>
                    <div className="text-xs text-slate-400">Last Run</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by industry, role, pain point, or summary..."
                className="pl-12"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {filteredSessions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ClipboardList className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {sessions.length === 0 ? 'No sessions saved yet' : 'No matching sessions'}
                  </h3>
                  <p className="text-slate-400 mb-6">
                    {sessions.length === 0
                      ? 'Run the Guided Explorer and save a session to build a deployment plan.'
                      : 'Try a different search term.'}
                  </p>
                  {sessions.length === 0 && (
                    <Link href="/explorer">
                      <Button>
                        Run Explorer
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredSessions.map((session) => {
                    const industry = getLabel(INDUSTRIES, session.input.industry);
                    const role = getLabel(ROLES, session.input.role);
                    const pain = getLabel(PAIN_POINTS, session.input.painPoint);

                    return (
                      <motion.div
                        key={session.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Card variant="interactive">
                          <CardContent className="py-4 space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <div className="text-sm text-slate-400">{industry}</div>
                                <div className="text-lg font-semibold">{role} · {pain}</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant="default">
                                  Confidence {Math.round(session.result.confidence * 100)}%
                                </Badge>
                                <span className="text-xs text-slate-500">
                                  {formatDate(Date.parse(session.createdAt))}
                                </span>
                              </div>
                            </div>

                            <p className="text-sm text-slate-300">
                              {truncateText(session.result.identifiedPain, 140)}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {session.result.outputs.map((output) => (
                                <Badge key={output} variant="default" className="text-xs">
                                  {output}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between">
                              <Link href="/explorer">
                                <Button variant="secondary" size="sm">
                                  Open Explorer
                                  <ArrowRight className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(event) => {
                                  event.preventDefault();
                                  deleteSession(session.id);
                                }}
                                className="text-slate-400 hover:text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
