import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { name, ts, path } = payload || {};

    if (!name) {
      return NextResponse.json({ error: 'Missing event name.' }, { status: 400 });
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
