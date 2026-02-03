import { NextResponse } from 'next/server';

const WEBHOOK_URL = process.env.BSS_LEAD_WEBHOOK_URL;

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, industry, role, painPoint, budget, message } = body || {};

    if (!name || !email || !company || !industry || !role || !painPoint || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const payload = {
      name,
      email,
      company,
      industry,
      role,
      painPoint,
      budget,
      message,
      submittedAt: new Date().toISOString(),
      source: 'bss-enterprise-intake',
    };

    if (WEBHOOK_URL) {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return NextResponse.json({ error: 'Lead webhook failed.' }, { status: 502 });
      }
    } else {
      console.log('[BSS Lead]', payload);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[BSS Lead] Error', error);
    return NextResponse.json({ error: 'Failed to submit lead.' }, { status: 500 });
  }
}
