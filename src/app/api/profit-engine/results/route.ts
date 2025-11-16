import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_RESULTS_DIR =
  process.env.PROFIT_ENGINE_RESULTS_DIR ||
  "C:\\KB\\Engines\\ProfitEngine\\Results";

type ProfitEngineResultEnvelope = {
  version: string;
  engine: string;
  status: string;
  job_id: string;
  summary?: {
    league: string;
    season: number;
    week: number;
    num_games?: number;
    num_sims?: number;
    hit_rate_pct?: number;
    avg_edge_pct?: number;
    max_edge_pct?: number;
    num_tickets?: number;
    risk_preset?: string;
  };
  tickets?: any[];
  [key: string]: any;
};

function stripBom(str: string): string {
  if (str.charCodeAt(0) === 0xfeff) {
    return str.slice(1);
  }
  return str;
}

export async function GET() {
  try {
    const RESULTS_DIR = DEFAULT_RESULTS_DIR;

    const entries = await fs.readdir(RESULTS_DIR);
    const files = entries.filter(
      (f) =>
        f.startsWith("profit-engine_result_") && f.endsWith(".json"),
    );

    if (files.length === 0) {
      return NextResponse.json(
        {
          ok: true,
          status: "empty",
          message: "No Profit Engine result envelopes found.",
          debug: { RESULTS_DIR },
        },
        { status: 200 },
      );
    }

    let latestFile = files[0];
    let latestMtime = 0;

    for (const file of files) {
      const stat = await fs.stat(path.join(RESULTS_DIR, file));
      if (stat.mtimeMs > latestMtime) {
        latestMtime = stat.mtimeMs;
        latestFile = file;
      }
    }

    const fullPath = path.join(RESULTS_DIR, latestFile);
    const raw = await fs.readFile(fullPath, "utf8");
    const stripped = stripBom(raw);

    const envelope = JSON.parse(stripped) as ProfitEngineResultEnvelope;

    return NextResponse.json({
      ok: true,
      status: "ok",
      file: latestFile,
      envelope,
      debug: {
        RESULTS_DIR,
        files,
        latest: latestFile,
        fullPath,
        rawLength: raw.length,
        strippedBom: raw.length !== stripped.length,
      },
    });
  } catch (err: any) {
    console.error("Error in /api/profit-engine/results:", err);
    return NextResponse.json(
      {
        ok: false,
        status: "error",
        message: "Exception in results route.",
        debug: {
          error: String(err?.message ?? err),
          stack: err?.stack,
        },
      },
      { status: 500 },
    );
  }
}
