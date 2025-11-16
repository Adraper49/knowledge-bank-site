import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

const ENGINE_SLUG = "profit-engine";

type ProfitEngineJobPayload = {
  type: "simulation" | "ticket" | string;
  preset?: string | null;
  ticket?: unknown;
  inputs?: Record<string, unknown> | null;
  priority?: "low" | "normal" | "high";
  tags?: string[];
};

export async function GET() {
  // Simple meta endpoint so we can sanity-check from PowerShell / external tools
  return NextResponse.json(
    {
      ok: true,
      engine: ENGINE_SLUG,
      message:
        "Profit Engine API stub is live. POST { engine: 'profit-engine', job: { ... } } to queue simulations or tickets.",
      examples: {
        simulate: {
          engine: "profit-engine",
          job: {
            type: "simulation",
            preset: "nfl-default",
            inputs: {
              league: "NFL",
              season: 2025,
              week: 1,
            },
            priority: "normal",
            tags: ["parlay-pilot", "sim"],
          },
        },
        ticket: {
          engine: "profit-engine",
          job: {
            type: "ticket",
            preset: "nfl-default",
            ticket: {
              legs: 3,
              stake: 10,
              currency: "USD",
            },
            priority: "high",
            tags: ["parlay-pilot", "ticket"],
          },
        },
      },
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const engine = body.engine ?? ENGINE_SLUG;
    const job = body.job as ProfitEngineJobPayload | undefined;

    if (engine !== ENGINE_SLUG) {
      return NextResponse.json(
        {
          ok: false,
          error: `Invalid engine. Expected "${ENGINE_SLUG}".`,
        },
        { status: 400 }
      );
    }

    if (!job || typeof job !== "object") {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing or invalid 'job' object in request body.",
        },
        { status: 400 }
      );
    }

    const payload: ProfitEngineJobPayload = {
      type: job.type ?? "simulation",
      preset: job.preset ?? null,
      ticket: job.ticket ?? null,
      inputs: job.inputs ?? null,
      priority: job.priority ?? "normal",
      tags: job.tags ?? [],
    };

    const { data, error } = await supabase
      .from("jobs")
      .insert({
        engine_slug: ENGINE_SLUG,
        payload,
        status: "queued",
      })
      .select("id, status, created_at")
      .single();

    if (error) {
      console.error("Supabase insert error (profit-engine jobs):", error);
      return NextResponse.json(
        {
          ok: false,
          engine: ENGINE_SLUG,
          error: "Failed to queue job in Profit Engine.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        engine: ENGINE_SLUG,
        job_id: data.id,
        status: data.status ?? "queued",
        job: {
          type: payload.type,
          preset: payload.preset,
          priority: payload.priority ?? "normal",
          tags: payload.tags ?? [],
        },
        note:
          "Profit Engine API stub: job accepted. Wiring to real simulations + Parlay Pilot will build on this.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Unexpected error in Profit Engine API:", err);
    return NextResponse.json(
      {
        ok: false,
        engine: ENGINE_SLUG,
        error: "Unexpected server error in Profit Engine stub.",
      },
      { status: 500 }
    );
  }
}
