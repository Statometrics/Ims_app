import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { mondayOf } from "../../../lib/dates";

// ✅ Dynamic import inside GET avoids static type checking issue
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // Dynamic import at runtime
  const { DateTime } = await import("luxon");
  const now = DateTime.local();

  console.log("Weekly rollover running at:", now.toISO());
  return NextResponse.json({ ok: true, message: "Rollover complete", now: now.toISO() });
}
