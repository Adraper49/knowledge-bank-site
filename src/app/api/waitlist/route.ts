// BEGIN FILE: C:\KB\Web\knowledge-bank-site\src\app\api\waitlist\route.ts
import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { email, note } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing email" },
        { status: 400 }
      );
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist_subscribers`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ email, note }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Supabase error", res.status, text);
      return NextResponse.json(
        { ok: false, error: "Failed to save in Supabase" },
        { status: 500 }
      );
    }

    const [row] = await res.json();
    return NextResponse.json({ ok: true, subscriber: row ?? null });
  } catch (err) {
    console.error("Waitlist API error", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
// END FILE
