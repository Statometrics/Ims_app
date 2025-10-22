import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/process-round?game_id=...&week_start=YYYY-MM-DD
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const game_id = searchParams.get("game_id");
    const week_start = searchParams.get("week_start");

    if (!game_id || !week_start) {
      return NextResponse.json({ ok: false, error: "Missing game_id or week_start" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.rpc("process_lms_round", {
      p_game_id: game_id,
      p_week_start: week_start
    });
    if (error) throw error;

    return NextResponse.json({ ok: true, message: `Processed round ${week_start} for game ${game_id}` });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? "unknown error" }, { status: 500 });
  }
}

