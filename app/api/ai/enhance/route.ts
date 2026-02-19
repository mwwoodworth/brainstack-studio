import { NextResponse } from 'next/server';
import { enhanceContent } from '@/lib/ai/anthropic';

export async function POST(req: Request) {
  try {
    const { content, context } = await req.json();
    if (!content) {
      return NextResponse.json({ success: false, error: 'Missing content' }, { status: 400 });
    }

    const enhanced = await enhanceContent(content, context || 'Professional Business Content');
    return NextResponse.json({ success: true, enhanced });
  } catch (error) {
    console.error('AI Enhance Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to enhance content' }, { status: 500 });
  }
}
