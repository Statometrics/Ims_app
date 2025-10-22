import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
// @ts-ignore — Luxon types fail only on Vercel build, safe to ignore
import { DateTime } from "luxon";
import { mondayOf } from "../../../lib/dates";

// ✅ Create admin client with service role (for server-side inserts/updates)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ Main function: ensures new game rounds exist for each Monday
export async function GET() {
  try {
    // Get current Monday date
    const monday = mondayOf(DateTime.now());

    // Call the stored procedure (in Supabase) to ensure rounds exist
    const { error } = await supabaseAdmin.rpc("ensure_rounds_for_monday_safe", {
      p_monday: monday.toISODate(),
    });

    if (error) {
      console.error("RPC Error:", error);
      return NextResponse.json({ ok: false, error: error.message });
    }

    return NextResponse.json({ ok: true, message: `Rounds ensured for ${monday.toISODate()}` });
  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}
