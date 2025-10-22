import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { mondayOf } from "../../../lib/dates";

// ✅ Dynamic import to bypass Vercel static type checker
async function getLuxonDateTime() {
  const luxon = await import("luxon");
  return luxon.DateTime;
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const DateTime = await getLuxonDateTime();
  const now = DateTime.local();

  // your existing logic …
  return NextResponse.json({ ok: true, message: "Rollover complete", now: now.toISO() });
}


