import { NextResponse } from 'next/server';
import { createServiceRoleClient, createSupabaseServerClient } from '@/lib/supabase/server';
import { getOptionalEnv } from '@/lib/env';

type OnboardingPayload = {
  role: string;
  teamSize: string;
  primaryGoal: string;
  industry: string;
  integrationReadiness: string;
};

const MAX_FIELD_LENGTH = 120;

function sanitize(value: unknown) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_FIELD_LENGTH);
}

function isCompleted(userMetadata: Record<string, unknown> | undefined) {
  return Boolean(userMetadata?.bss_onboarding_completed);
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

    const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
    return NextResponse.json({
      success: true,
      completed: isCompleted(metadata),
      profile: (metadata.bss_onboarding as Record<string, unknown>) ?? null,
      completedAt: metadata.bss_onboarding_completed_at ?? null,
    });
  } catch (error) {
    console.error('[onboarding] GET failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load onboarding status' },
      { status: 500 }
    );
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

    const body = await request.json().catch(() => ({}));
    const payload: OnboardingPayload = {
      role: sanitize(body?.role),
      teamSize: sanitize(body?.teamSize),
      primaryGoal: sanitize(body?.primaryGoal),
      industry: sanitize(body?.industry),
      integrationReadiness: sanitize(body?.integrationReadiness),
    };

    if (!payload.role || !payload.primaryGoal) {
      return NextResponse.json(
        { success: false, error: 'Role and primary goal are required' },
        { status: 400 }
      );
    }

    const userMetadata = {
      ...(user.user_metadata ?? {}),
      bss_onboarding: payload,
      bss_onboarding_completed: true,
      bss_onboarding_completed_at: new Date().toISOString(),
    };

    const { error } = await supabase.auth.updateUser({
      data: userMetadata,
    });

    if (error) {
      const serviceKey = getOptionalEnv('SUPABASE_SERVICE_ROLE_KEY');
      if (!serviceKey) throw error;

      const admin = createServiceRoleClient();
      const { error: adminError } = await admin.auth.admin.updateUserById(user.id, {
        user_metadata: userMetadata,
      });
      if (adminError) throw adminError;
    }

    return NextResponse.json({
      success: true,
      completed: true,
      profile: payload,
    });
  } catch (error) {
    console.error('[onboarding] POST failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save onboarding details' },
      { status: 500 }
    );
  }
}
