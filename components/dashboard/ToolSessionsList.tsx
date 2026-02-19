'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, History, Loader2, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { getToolById } from '@/lib/tools';

type ToolSession = {
  id: string;
  tool_id: string;
  created_at: string;
  result: {
    summary: string;
    confidence: number;
  };
};

export function ToolSessionsList() {
  const [sessions, setSessions] = useState<ToolSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      try {
        const res = await fetch('/api/dashboard/tool-sessions');
        const data = await res.json();
        if (data.sessions) {
          setSessions(data.sessions);
        }
      } catch (error) {
        console.error('Failed to load tool sessions', error);
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-violet-400" />
            Recent Runs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading history...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5 text-violet-400" />
          Recent Tool Runs
        </CardTitle>
        <CardDescription>History of your calculator and generator outputs</CardDescription>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>No tool runs saved yet.</p>
            <Button asChild variant="ghost" className="mt-2 text-cyan-400 hover:text-cyan-300">
              <Link href="/tools">Browse Tools</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => {
              const tool = getToolById(session.tool_id);
              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-violet-500/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 rounded bg-violet-500/10 text-violet-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-slate-200 truncate">
                        {tool?.name || session.tool_id}
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatDate(Date.parse(session.created_at))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant="default" className="hidden sm:inline-flex">
                      {Math.round(session.result.confidence * 100)}% Conf.
                    </Badge>
                    <Link href={`/dashboard/history/${session.id}`}>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        View
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
