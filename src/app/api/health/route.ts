import { NextResponse } from "next/server";

const HEALTH_VERSION = "2025-11-16-profit-engine-stub";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "kb-cloud",
    env: process.env.VERCEL ? "vercel" : "local",
    time: new Date().toISOString(),
    version: HEALTH_VERSION,
  });
}
