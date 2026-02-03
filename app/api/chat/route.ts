const DEPRECATED_RESPONSE = {
  error: 'Deprecated endpoint. Use /api/capability/explorer for deterministic previews.',
};

export async function GET() {
  return new Response(JSON.stringify(DEPRECATED_RESPONSE), {
    status: 410,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST() {
  return new Response(JSON.stringify(DEPRECATED_RESPONSE), {
    status: 410,
    headers: { 'Content-Type': 'application/json' },
  });
}
