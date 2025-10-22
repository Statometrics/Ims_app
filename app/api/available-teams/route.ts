import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/available-teams?game_id=...&user_id=...&week_start=YYYY-MM-DD
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const game_id = searchParams.get("game_id");
    const user_id = searchParams.get("user_id");
    const week_start = searchParams.get("week_start");

    if (!game_id || !user_id || !week_start) {
      return NextResponse.json(
        { ok: false, error: "Missing parameters" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.rpc("available_teams_for_user", {
      p_game_id: game_id,
      p_user_id: user_id,
      p_week_start: week_start,
    });

    if (error) throw error;

    return NextResponse.json({ ok: true, teams: data });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message ?? "unknown error" },
      { status: 500 }
    );
  }
}
