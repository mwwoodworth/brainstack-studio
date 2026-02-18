import { GET as capabilityGet, POST as capabilityPost } from '../route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return capabilityGet();
}

export async function POST(request: Request) {
  return capabilityPost(request);
}
