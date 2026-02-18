// API: Get tool definition by ID
import { NextResponse } from 'next/server';
import { getToolById } from '@/lib/tools/registry';
import { checkRateLimit, getClientIP, rateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit';
import { recordUsageEvent } from '@/lib/usageEvents';

// Validate tool ID format (alphanumeric, hyphens, underscores, max 50 chars)
function isValidToolId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{1,50}$/.test(id);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimitResult = checkRateLimit(`toolDetail:${clientIP}`, RATE_LIMITS.standard);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      { status: 429, headers: rateLimitHeaders(rateLimitResult) }
    );
  }

  const { id } = await params;

  // Validate ID format
  if (!id || !isValidToolId(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid tool ID format' },
      { status: 400 }
    );
  }

  try {
    const tool = getToolById(id);

    if (!tool) {
      return NextResponse.json(
        { success: false, error: 'Tool not found' },
        { status: 404 }
      );
    }

    await recordUsageEvent({
      eventName: 'tool_detail',
      category: 'tools',
      path: `/api/tools/${id}`,
      toolId: id,
    });

    return NextResponse.json({
      success: true,
      tool,
    });
  } catch (error) {
    console.error(`Error fetching tool [${id}]:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tool' },
      { status: 500 }
    );
  }
}
