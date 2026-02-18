import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { fetchUsageEventsForUser } from '@/lib/usageEvents';

type UsageEvent = {
  event_name: string;
  category: string;
  path: string | null;
  tool_id: string | null;
  created_at: string;
};

const SERIES_DAYS = 14;

function buildDayKeys() {
  const days: string[] = [];
  const now = new Date();
  for (let i = SERIES_DAYS - 1; i >= 0; i -= 1) {
    const day = new Date(now);
    day.setDate(now.getDate() - i);
    days.push(day.toISOString().slice(0, 10));
  }
  return days;
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const since = new Date();
    since.setDate(since.getDate() - 30);

    let events: UsageEvent[] = [];
    try {
      events = (await fetchUsageEventsForUser(user.id, since.toISOString())) as UsageEvent[];
    } catch (error) {
      console.error('[dashboard/usage] Failed to fetch usage events:', error);
    }

    const dayKeys = buildDayKeys();
    const dailyIndex: Record<string, { total: number; explorer: number; tools: number; api: number }> = {};
    dayKeys.forEach((day) => {
      dailyIndex[day] = { total: 0, explorer: 0, tools: 0, api: 0 };
    });

    const toolCounts = new Map<string, number>();
    let explorerRuns = 0;
    let toolExecutions = 0;
    let apiCalls = 0;

    for (const event of events) {
      const day = event.created_at?.slice(0, 10);
      const bucket = day ? dailyIndex[day] : undefined;

      const isExplorer = event.category === 'explorer' || event.event_name.startsWith('explorer_');
      const isTool = event.category === 'tools' || event.event_name.startsWith('tool_');
      const isApi = event.category === 'api' || event.path?.startsWith('/api/');

      if (isExplorer) explorerRuns += 1;
      if (isTool) toolExecutions += 1;
      if (isApi) apiCalls += 1;

      if (bucket) {
        bucket.total += 1;
        if (isExplorer) bucket.explorer += 1;
        if (isTool) bucket.tools += 1;
        if (isApi) bucket.api += 1;
      }

      if (event.tool_id) {
        toolCounts.set(event.tool_id, (toolCounts.get(event.tool_id) ?? 0) + 1);
      }
    }

    const dailySeries = dayKeys.map((day) => ({
      day,
      ...dailyIndex[day],
    }));

    const topTools = Array.from(toolCounts.entries())
      .map(([toolId, count]) => ({ toolId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      totals: {
        events: events.length,
        explorerRuns,
        toolExecutions,
        apiCalls,
      },
      dailySeries,
      topTools,
      windowDays: SERIES_DAYS,
    });
  } catch (error) {
    console.error('[dashboard/usage] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load usage analytics' },
      { status: 500 }
    );
  }
}
