import { NextResponse } from "next/server";
import type { ExplorerInput, ExplorerResult } from "@/lib/explorer";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SessionPayload = {
  id: string;
  createdAt: string;
  input: ExplorerInput;
  result: ExplorerResult;
};

function normalizeSessionId(value: unknown) {
  if (typeof value !== "string") return null;
  const id = value.trim().slice(0, 120);
  return id.length > 0 ? id : null;
}

function normalizeCreatedAt(value: unknown) {
  if (typeof value !== "string") return new Date().toISOString();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

function normalizeSessionBody(value: unknown): SessionPayload | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const id = normalizeSessionId(raw.id);
  if (!id) return null;

  return {
    id,
    createdAt: normalizeCreatedAt(raw.createdAt),
    input: (raw.input ?? {}) as ExplorerInput,
    result: (raw.result ?? {}) as ExplorerResult,
  };
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("bss_explorer_sessions")
      .select("id,input,result,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      sessions: (data ?? []).map((row) => ({
        id: row.id as string,
        createdAt: row.created_at as string,
        input: row.input as ExplorerInput,
        result: row.result as ExplorerResult,
      })),
    });
  } catch (error) {
    console.error("[dashboard/sessions] GET failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load explorer sessions" },
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
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const session = normalizeSessionBody((body as { session?: unknown }).session);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Invalid session payload" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("bss_explorer_sessions")
      .upsert(
        {
          user_id: user.id,
          id: session.id,
          input: session.input,
          result: session.result,
          created_at: session.createdAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,id" }
      )
      .select("id,input,result,created_at")
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      session: {
        id: data.id as string,
        createdAt: data.created_at as string,
        input: data.input as ExplorerInput,
        result: data.result as ExplorerResult,
      },
    });
  } catch (error) {
    console.error("[dashboard/sessions] POST failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save explorer session" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("bss_explorer_sessions")
      .delete()
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[dashboard/sessions] DELETE failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear explorer sessions" },
      { status: 500 }
    );
  }
}
