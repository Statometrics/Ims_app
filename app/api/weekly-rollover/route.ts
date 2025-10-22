import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { DateTime } from "luxon";
import { mondayOf } from "../../../lib/dates";  // ✅ Fixed path (no alias)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const now = DateTime.now().setZone("Europe/London");
    const thisMonday = mondayOf(now.toJSDate());

    // Call the Supabase RPC function to ensure rounds exist for this Monday
    const { error } = await supabaseAdmin.rpc("ensure_rounds_for_monday_safe", {
      p_monday: thisMonday,
    });

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      message: `Rounds ensured for ${thisMonday}`,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message ?? "unknown error" },
      { status: 500 }
    );
  }
}
