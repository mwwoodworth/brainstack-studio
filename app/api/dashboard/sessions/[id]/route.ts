import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function normalizeSessionId(value: string) {
  const id = value.trim().slice(0, 120);
  return id.length > 0 ? id : null;
}

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
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const sessionId = normalizeSessionId(id);
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Invalid session id" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("bss_explorer_sessions")
      .delete()
      .eq("user_id", user.id)
      .eq("id", sessionId);

    if (error) throw error;

    return NextResponse.json({ success: true, id: sessionId });
  } catch (error) {
    console.error("[dashboard/sessions/:id] DELETE failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete explorer session" },
      { status: 500 }
    );
  }
}
