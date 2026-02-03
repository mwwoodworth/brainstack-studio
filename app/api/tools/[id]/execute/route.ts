// API: Execute a tool with provided inputs
import { NextResponse } from 'next/server';
import { getToolById, executeTool } from '@/lib/tools/registry';
import { trackEvent } from '@/lib/telemetry';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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

  // Parse request body
  let inputs: Record<string, string | number>;
  try {
    const body = await request.json();
    inputs = body.inputs || {};
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

    // Track usage (non-blocking)
    trackEvent({
      name: 'api_tool_execute',
      payload: {
        toolId: id,
        inputCount: Object.keys(inputs).length,
        confidence: result.confidence,
      },
    }).catch(() => {}); // Ignore telemetry errors

    return NextResponse.json({
      success: true,
      toolId: id,
      toolName: tool.name,
      result,
    });
  } catch (error) {
    console.error(`Tool execution error [${id}]:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Tool execution failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
