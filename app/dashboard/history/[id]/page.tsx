'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ToolResultDisplay } from '@/components/tools/ToolResultDisplay';
import { getToolById, Tool, ToolResult } from '@/lib/tools';
import { ArrowLeft, Calendar, FileText, Loader2, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type Session = {
  id: string;
  tool_id: string;
  inputs: Record<string, string | number>;
  result: ToolResult;
  created_at: string;
};

export default function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [tool, setTool] = useState<Tool | undefined>(undefined);

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch(`/api/dashboard/tool-sessions/${id}`);
        const data = await res.json();
        if (data.session) {
          setSession(data.session);
          setTool(getToolById(data.session.tool_id));
        }
      } catch (error) {
        console.error('Failed to load session', error);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-32 pb-20 px-6 flex items-center justify-center">
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading result...
          </div>
        </div>
      </main>
    );
  }

  if (!session || !tool) {
    return notFound();
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="w-4 h-4" />
              {formatDate(Date.parse(session.created_at))}
            </div>
          </div>

          <div className="flex items-start gap-4 pb-6 border-b border-white/10">
            <div className={`p-3 rounded-xl bg-${tool.color}-500/10 text-${tool.color}-400`}>
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{tool.name} Result</h1>
              <div className="flex items-center gap-3">
                <Badge variant="default">Saved Session</Badge>
                <span className="text-slate-400 text-sm">ID: {session.id}</span>
              </div>
            </div>
          </div>

          {/* Result Display */}
          <div className="bg-slate-900/30 rounded-xl border border-white/10 p-6 md:p-8">
            <ToolResultDisplay
              tool={tool}
              result={session.result}
              inputs={session.inputs}
              // Read-only mode: no enhancement callback
            />
          </div>

          {/* Inputs Summary */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Input Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(session.inputs).map(([key, value]) => {
                const inputDef = tool.inputs.find(i => i.id === key);
                if (!inputDef) return null;
                return (
                  <div key={key} className="p-3 rounded bg-black/20 border border-white/5">
                    <div className="text-xs text-slate-500 mb-1">{inputDef.label}</div>
                    <div className="text-sm text-slate-200 font-medium truncate" title={String(value)}>
                      {String(value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <Link href={`/tools/${tool.slug}`}>
              <Button>
                Run Again
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
