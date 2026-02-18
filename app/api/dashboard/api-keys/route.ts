import { NextResponse } from 'next/server';
import { buildKeyPrefix, generateApiKey, hashApiKey, normalizeApiKeyName } from '@/lib/apiKeys';
import { getUserTier } from '@/lib/subscription';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

function proRequiredResponse() {
  return NextResponse.json(
    {
      success: false,
      error: 'Pro subscription required for API key management',
      code: 'PRO_REQUIRED',
    },
    { status: 403 }
  );
}

function handleApiKeyError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  if (message.toLowerCase().includes('relation')) {
    return NextResponse.json(
      {
        success: false,
        error: 'API key storage is not configured',
        detail: 'Expected table "bss_api_keys" was not found.',
      },
      { status: 501 }
    );
  }
  return NextResponse.json({ success: false, error: 'API key request failed' }, { status: 500 });
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { tier } = await getUserTier();
    if (tier !== 'pro') {
      return proRequiredResponse();
    }

    const { data, error } = await supabase
      .from('bss_api_keys')
      .select('id,name,key_prefix,last_used_at,created_at,revoked_at')
      .eq('user_id', user.id)
      .is('revoked_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      keys: data ?? [],
    });
  } catch (error) {
    console.error('[dashboard/api-keys] GET failed:', error);
    return handleApiKeyError(error);
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { tier } = await getUserTier();
    if (tier !== 'pro') {
      return proRequiredResponse();
    }

    const body = await request.json().catch(() => ({}));
    const name = normalizeApiKeyName(body?.name);
    const rawKey = generateApiKey();
    const keyHash = hashApiKey(rawKey);
    const keyPrefix = buildKeyPrefix(rawKey);

    const { data, error } = await supabase
      .from('bss_api_keys')
      .insert({
        user_id: user.id,
        name,
        key_hash: keyHash,
        key_prefix: keyPrefix,
      })
      .select('id,name,key_prefix,last_used_at,created_at,revoked_at')
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      key: data,
      rawKey,
    });
  } catch (error) {
    console.error('[dashboard/api-keys] POST failed:', error);
    return handleApiKeyError(error);
  }
}
