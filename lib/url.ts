import type { NextRequest } from "next/server";

const FALLBACK_PRIMARY_ORIGIN = "https://brainstackstudio.com";
const FALLBACK_ALLOWED_ORIGINS = new Set<string>([
  FALLBACK_PRIMARY_ORIGIN,
  "https://brainstack-studio.vercel.app",
]);

function normalizeOrigin(value?: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }
    return `${url.protocol}//${url.host}`;
  } catch {
    return null;
  }
}

export function resolveTrustedAppOrigin(request?: NextRequest): string {
  const configuredAppOrigin = normalizeOrigin(
    process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL
  );

  const allowedOrigins = new Set(FALLBACK_ALLOWED_ORIGINS);
  if (configuredAppOrigin) {
    allowedOrigins.add(configuredAppOrigin);
  }

  const requestOrigin = normalizeOrigin(request?.headers.get("origin"));
  if (requestOrigin && allowedOrigins.has(requestOrigin)) {
    return requestOrigin;
  }

  return configuredAppOrigin || FALLBACK_PRIMARY_ORIGIN;
}
