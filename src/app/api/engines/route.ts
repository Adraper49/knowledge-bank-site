// BEGIN FILE: C:\KB\Web\knowledge-bank-site\src\app\api\engines\route.ts

import { NextResponse } from "next/server";

// Static list of KB engines for now.
// Later we can move this into Supabase (kb_engines table).
const ENGINES = [
  {
    id: "profit-engine",
    name: "Profit Engine & Hobby Lines",
    slug: "profit-engine",
    role: "SPORTS · MARKETS · RISK",
    description:
      "Backtests angles, tracks bankroll, enforces rules, and runs experiments for sports and trading.",
    kind: "engine",
  },
  {
    id: "zalara",
    name: "Zalara",
    slug: "zalara",
    role: "CREATIVE ENGINE",
    description:
      "Turns structured jobs into promos, thumbnails, and visuals for books, apps, and campaigns.",
    kind: "engine",
  },
  {
    id: "signal-forge",
    name: "Signal Forge & Opportunity Engine",
    slug: "signal-forge",
    role: "SIGNALS & IDEAS",
    description:
      "Scans sports, products, and markets for patterns, then routes promising ideas to the right engine.",
    kind: "engine",
  },
  {
    id: "universes-books",
    name: "Universes & books",
    slug: "universes-books",
    role: "STORY WORLDS",
    description:
      "KB powers book series and story worlds built on real data, simulations, and what-if logic.",
    kind: "universe",
  },
] as const;

export async function GET() {
  return NextResponse.json({
    ok: true,
    count: ENGINES.length,
    engines: ENGINES,
  });
}

// Optional: be explicit that POST etc. aren't allowed yet.
export async function POST() {
  return NextResponse.json(
    { ok: false, error: "Read-only endpoint. Use GET /api/engines." },
    { status: 405 },
  );
}

// END FILE
