import { isFeatureEnabled } from '@/lib/featureFlags';
import { isTelemetryEnabled } from '@/lib/explorerPreferences';

export type TelemetryEvent = {
  name: string;
  payload?: Record<string, unknown>;
};

export async function trackEvent(event: TelemetryEvent) {
  if (!isFeatureEnabled('telemetry')) return;
  if (typeof window === 'undefined') return;
  if (!isTelemetryEnabled()) return;

  const body = JSON.stringify({
    ...event,
    ts: new Date().toISOString(),
    path: window.location.pathname,
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon('/api/telemetry', blob);
      return;
    }

    await fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
  } catch {
    // Telemetry must never block UX.
  }
}
