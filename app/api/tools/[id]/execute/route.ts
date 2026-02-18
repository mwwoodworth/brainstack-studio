// API: Execute a tool with provided inputs
import { NextResponse } from 'next/server';
import { getToolById, executeTool } from '@/lib/tools/registry';
import { checkRateLimit, getClientIP, rateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit';
import { recordUsageEvent } from '@/lib/usageEvents';

// Validate tool ID format (alphanumeric, hyphens, underscores, max 50 chars)
function isValidToolId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{1,50}$/.test(id);
}

// Validate input value type
function isValidInputType(value: unknown): value is string | number {
  return typeof value === 'string' || typeof value === 'number';
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimitResult = checkRateLimit(`toolExec:${clientIP}`, RATE_LIMITS.toolExecution);

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

  // Verify tool exists
  const tool = getToolById(id);
  if (!tool) {
    return NextResponse.json(
      { success: false, error: 'Tool not found' },
      { status: 404 }
    );
  }

  // Check if tool is coming soon
  if (tool.comingSoon) {
    return NextResponse.json(
      { success: false, error: 'This tool is coming soon and not yet available' },
      { status: 400 }
    );
  }

  // Check content length to prevent DoS
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > 100000) {
    return NextResponse.json(
      { success: false, error: 'Request too large' },
      { status: 413 }
    );
  }

  // Parse request body
  let inputs: Record<string, string | number>;
  try {
    const body = await request.json();
    const rawInputs = body.inputs || {};

    // Validate and sanitize input types
    inputs = {};
    for (const [key, value] of Object.entries(rawInputs)) {
      if (value === null || value === undefined) continue;
      if (!isValidInputType(value)) {
        return NextResponse.json(
          { success: false, error: `Invalid type for input "${key}". Expected string or number.` },
          { status: 400 }
        );
      }
      inputs[key] = value;
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  // Validate required inputs
  const missingRequired = tool.inputs
    .filter(input => input.required)
    .filter(input => !inputs[input.id] && inputs[input.id] !== 0)
    .map(input => input.id);

  if (missingRequired.length > 0) {
    return NextResponse.json(
      {
        success: false,
        error: 'Missing required inputs',
        missingFields: missingRequired,
      },
      { status: 400 }
    );
  }

  // Execute the tool
  try {
    const result = executeTool(id, inputs);

    await recordUsageEvent({
      eventName: 'tool_execute',
      category: 'tools',
      path: `/api/tools/${id}/execute`,
      toolId: id,
      metadata: {
        inputCount: Object.keys(inputs).length,
        confidence: result.confidence,
      },
    });

    return NextResponse.json({
      success: true,
      toolId: id,
      toolName: tool.name,
      result,
    });
  } catch (error) {
    console.error(`Tool execution error [${id}]:`, error);
    // Don't expose internal error details in production
    return NextResponse.json(
      {
        success: false,
        error: 'Tool execution failed',
        message: 'An error occurred while processing your request. Please check your inputs and try again.',
      },
      { status: 500 }
    );
  }
}
