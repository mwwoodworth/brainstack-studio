import {
  buildExplorerResult,
  CONFIDENCE_THRESHOLD,
  INDUSTRIES,
  PAIN_POINTS,
  ROLES,
  type ExplorerIndustry,
  type ExplorerPainPoint,
  type ExplorerRole,
} from '@/lib/explorer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const validIndustries = new Set(INDUSTRIES.map((industry) => industry.id));
const validRoles = new Set(ROLES.map((role) => role.id));
const validPainPoints = new Set(PAIN_POINTS.map((pain) => pain.id));

export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      deterministic: true,
      confidenceThreshold: CONFIDENCE_THRESHOLD,
      industries: Array.from(validIndustries),
      roles: Array.from(validRoles),
      painPoints: Array.from(validPainPoints),
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { industry, role, painPoint } = body || {};

    if (!industry || !role || !painPoint) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!validIndustries.has(industry) || !validRoles.has(role) || !validPainPoints.has(painPoint)) {
      return new Response(
        JSON.stringify({ error: 'Invalid input values.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = buildExplorerResult({
      industry: industry as ExplorerIndustry,
      role: role as ExplorerRole,
      painPoint: painPoint as ExplorerPainPoint,
    });

    if (!result) {
      return new Response(
        JSON.stringify({ error: 'Unable to generate deterministic output.' }),
        { status: 422, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        status: 'ok',
        confidenceThreshold: CONFIDENCE_THRESHOLD,
        input: { industry, role, painPoint },
        result,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid request payload.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
