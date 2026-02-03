// API: List all tools
import { NextResponse } from 'next/server';
import { getAllTools, getFeaturedTools, getToolsByCategory } from '@/lib/tools/registry';
import { ToolCategory } from '@/lib/tools/types';
import { checkRateLimit, getClientIP, rateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit';

const VALID_CATEGORIES: ToolCategory[] = ['calculators', 'analyzers', 'generators', 'visualizers'];

export async function GET(request: Request) {
  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimitResult = checkRateLimit(`tools:${clientIP}`, RATE_LIMITS.standard);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      { status: 429, headers: rateLimitHeaders(rateLimitResult) }
    );
  }

  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get('category');
  const featured = searchParams.get('featured');

  // Validate category if provided
  const category = categoryParam && VALID_CATEGORIES.includes(categoryParam as ToolCategory)
    ? (categoryParam as ToolCategory)
    : null;

  let tools;

  try {
    if (featured === 'true') {
      tools = getFeaturedTools();
    } else if (category) {
      tools = getToolsByCategory(category);
    } else {
      tools = getAllTools();
    }
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tools' },
      { status: 500 }
    );
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
