import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const ENGINE_ID = "profit-engine";

type ProfitJobPayload = {
  type: string;
  preset?: string;
  inputs?: Record<string, unknown>;
  priority?: "low" | "normal" | "high";
  tags?: string[];
};

type ProfitEnginePostBody = {
  engine: string;
  job: ProfitJobPayload;
};

export async function GET() {
  return NextResponse.json({
    ok: true,
    engine: ENGINE_ID,
    message:
      "Profit Engine API stub is live. POST { engine: 'profit-engine', job: {...} } to queue a test job.",
  });
}

export async function POST(req: NextRequest) {
  let body: ProfitEnginePostBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid JSON body.",
      },
      { status: 400 }
    );
  }

  if (!body.engine || body.engine !== ENGINE_ID) {
    return NextResponse.json(
      {
        ok: false,
        error: `Invalid engine. Expected "${ENGINE_ID}".`,
      },
      { status: 400 }
    );
  }

  if (!body.job || typeof body.job !== "object") {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing job object.",
      },
      { status: 400 }
    );
  }

  const jobId = randomUUID();

  // NOTE:
  // In the real version, we will insert this into Supabase and kick off
  // real simulations + Parlay Pilot logic. For now, this stays in-memory
  // so it works in any environment (including Vercel) with no env vars.

  return NextResponse.json({
    ok: true,
    engine: ENGINE_ID,
    job_id: jobId,
    status: "queued",
    job: {
      type: body.job.type ?? "simulation",
      preset: body.job.preset ?? null,
      priority: body.job.priority ?? "normal",
      tags: body.job.tags ?? [],
    },
    note:
      "Profit Engine API stub: job accepted. Wiring to real simulations + Parlay Pilot will build on this.",
  });
}
