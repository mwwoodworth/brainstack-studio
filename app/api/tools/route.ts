// API: List all tools
import { NextResponse } from 'next/server';
import { getAllTools, getFeaturedTools, getToolsByCategory } from '@/lib/tools/registry';
import { ToolCategory } from '@/lib/tools/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as ToolCategory | null;
  const featured = searchParams.get('featured');

  let tools;

  if (featured === 'true') {
    tools = getFeaturedTools();
  } else if (category) {
    tools = getToolsByCategory(category);
  } else {
    tools = getAllTools();
  }

  // Return lightweight tool listing (without full input definitions)
  const toolList = tools.map(tool => ({
    id: tool.id,
    slug: tool.slug,
    name: tool.name,
    shortDescription: tool.shortDescription,
    category: tool.category,
    industries: tool.industries,
    painPoints: tool.painPoints,
    icon: tool.icon,
    color: tool.color,
    featured: tool.featured ?? false,
    comingSoon: tool.comingSoon ?? false,
  }));

  return NextResponse.json({
    success: true,
    count: toolList.length,
    tools: toolList,
  });
}
