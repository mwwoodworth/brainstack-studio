// API: Get tool definition by ID
import { NextResponse } from 'next/server';
import { getToolById } from '@/lib/tools/registry';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const tool = getToolById(id);

  if (!tool) {
    return NextResponse.json(
      { success: false, error: 'Tool not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    tool,
  });
}
