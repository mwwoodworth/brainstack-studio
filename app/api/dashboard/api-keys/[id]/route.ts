import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id || id.length > 100) {
      return NextResponse.json({ success: false, error: 'Invalid key id' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('bss_api_keys')
      .update({ revoked_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .is('revoked_at', null)
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: 'API key not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('[dashboard/api-keys/:id] DELETE failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to revoke API key' },
      { status: 500 }
    );
  }
}
