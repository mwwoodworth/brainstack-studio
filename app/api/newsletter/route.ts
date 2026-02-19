import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIP, rateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit';

const isValidEmail = (value: string): boolean => {
  if (!value || value.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
};

export async function POST(request: Request) {
  try {
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(`newsletter:${clientIP}`, RATE_LIMITS.form);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: rateLimitHeaders(rateLimitResult) }
      );
    }

    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim().slice(0, 254) : '';

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Valid email address required.' }, { status: 400 });
    }

    // Forward to BrainOps lead capture as newsletter subscriber
    const webhookUrl = process.env.BSS_LEAD_WEBHOOK_URL;
    const webhookApiKey = process.env.BSS_LEAD_API_KEY;

    if (webhookUrl) {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (webhookApiKey) headers['X-API-Key'] = webhookApiKey;

      await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email,
          name: '',
          industry: 'Unknown',
          source: 'bss-newsletter',
          custom_fields: { subscribedAt: new Date().toISOString() },
        }),
      }).catch((err) => console.error('[BSS Newsletter] Webhook failed:', err));
    }

    // Email notification
    const resendKey = process.env.RESEND_API_KEY;
    const alertEmail = process.env.ALERT_EMAIL || 'matthew@brainstackstudio.com';
    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'BrainOps AI <ops@myroofgenius.com>',
          to: [alertEmail],
          subject: `[BSS Newsletter] New subscriber: ${email}`,
          html: `<h2>New Newsletter Subscriber</h2><p><strong>Email:</strong> ${email}</p><p><em>Subscribed: ${new Date().toISOString()}</em></p>`,
        }),
      }).catch((err) => console.error('[BSS Newsletter] Email notification failed:', err));
    } else {
      console.warn('[BSS Newsletter] NO RESEND_API_KEY — subscriber:', email);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[BSS Newsletter] Error:', error);
    return NextResponse.json({ error: 'Subscription failed.' }, { status: 500 });
  }
}
