import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIP, rateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(`telemetry:${clientIP}`, RATE_LIMITS.telemetry);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests.' },
        { status: 429, headers: rateLimitHeaders(rateLimitResult) }
      );
    }

    const payload = await request.json();
    const { name, ts, path } = payload || {};

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Missing or invalid event name.' }, { status: 400 });
    }

    console.log('[BSS Telemetry]', {
      name,
      ts,
      path,
      payload,
    });

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[BSS Telemetry] Error', error);
    return NextResponse.json({ error: 'Telemetry failed.' }, { status: 500 });
  }
}
