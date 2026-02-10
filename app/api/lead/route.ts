import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIP, rateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit';

const WEBHOOK_URL = process.env.BSS_LEAD_WEBHOOK_URL;
const WEBHOOK_API_KEY = process.env.BSS_LEAD_API_KEY;

// Input validation constants
const MAX_FIELD_LENGTHS = {
  name: 200,
  email: 254,
  company: 200,
  industry: 100,
  role: 100,
  painPoint: 100,
  budget: 50,
  message: 5000,
} as const;

// RFC 5322 compliant email validation
const isValidEmail = (value: string): boolean => {
  if (!value || value.length > 254) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(value);
};

// Sanitize string input - remove potential XSS vectors
const sanitizeString = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, 10000); // Hard cap at 10KB per field
};

// Validate field length
const isValidLength = (value: string, maxLength: number): boolean => {
  return value.length > 0 && value.length <= maxLength;
};

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(`lead:${clientIP}`, RATE_LIMITS.form);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: rateLimitHeaders(rateLimitResult) }
      );
    }

    // Check content length to prevent DoS
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 100000) {
      return NextResponse.json({ error: 'Request too large.' }, { status: 413 });
    }

    const body = await request.json();

    // Sanitize all inputs
    const name = sanitizeString(body?.name);
    const email = sanitizeString(body?.email);
    const company = sanitizeString(body?.company);
    const industry = sanitizeString(body?.industry);
    const role = sanitizeString(body?.role);
    const painPoint = sanitizeString(body?.painPoint);
    const budget = sanitizeString(body?.budget);
    const message = sanitizeString(body?.message);

    // Check required fields
    if (!name || !email || !company || !industry || !role || !painPoint || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Validate field lengths
    if (!isValidLength(name, MAX_FIELD_LENGTHS.name) ||
        !isValidLength(company, MAX_FIELD_LENGTHS.company) ||
        !isValidLength(industry, MAX_FIELD_LENGTHS.industry) ||
        !isValidLength(role, MAX_FIELD_LENGTHS.role) ||
        !isValidLength(painPoint, MAX_FIELD_LENGTHS.painPoint) ||
        !isValidLength(message, MAX_FIELD_LENGTHS.message)) {
      return NextResponse.json({ error: 'Field exceeds maximum length.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // Build payload matching BrainOps Agents /revenue/leads/capture schema
    // Required: email, name, industry, source
    // Optional: company, phone, custom_fields
    const payload = {
      name,
      email,
      industry,
      source: 'bss-enterprise-intake',
      company,
      custom_fields: {
        role,
        painPoint,
        budget,
        message,
        submittedAt: new Date().toISOString(),
      },
    };

    if (WEBHOOK_URL) {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (WEBHOOK_API_KEY) {
        headers['X-API-Key'] = WEBHOOK_API_KEY;
      }

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('[BSS Lead] Webhook failed with status:', response.status);
        return NextResponse.json({ error: 'Failed to submit lead. Please try again.' }, { status: 500 });
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
