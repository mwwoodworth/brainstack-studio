import { NextResponse } from 'next/server';
import { enhanceContent } from '@/lib/ai/anthropic';
import { checkRateLimit, getClientIP, rateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const MAX_CONTENT_LENGTH = 10000;

export async function POST(req: Request) {
  try {
    // Auth required: this endpoint calls paid Anthropic API
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required.' },
        { status: 401 }
      );
    }

    // Rate limit: calls paid Anthropic API
    const clientIP = getClientIP(req);
    const rateLimitResult = checkRateLimit(`ai-enhance:${clientIP}`, RATE_LIMITS.form);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429, headers: rateLimitHeaders(rateLimitResult) }
      );
    }

    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 50000) {
      return NextResponse.json({ success: false, error: 'Request too large.' }, { status: 413 });
    }

    const body = await req.json();
    const content = typeof body?.content === 'string' ? body.content.slice(0, MAX_CONTENT_LENGTH) : '';
    const context = typeof body?.context === 'string' ? body.context.slice(0, 500) : 'Professional Business Content';

    if (!content) {
      return NextResponse.json({ success: false, error: 'Missing content' }, { status: 400 });
    }

    const enhanced = await enhanceContent(content, context);
    return NextResponse.json({ success: true, enhanced });
  } catch (error) {
    console.error('AI Enhance Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to enhance content' }, { status: 500 });
  }
}
