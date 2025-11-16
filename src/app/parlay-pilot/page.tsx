"use client";

import React, { useState } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Ticket,
  TrendingUp,
} from "lucide-react";

type RiskPreset = "safe" | "standard" | "aggro";

interface ProfitEngineResultSummary {
  league: string;
  season: number;
  week: number;
  num_games: number;
  num_sims: number;
  hit_rate_pct: number;
  avg_edge_pct: number;
  max_edge_pct: number;
  num_tickets: number;
  risk_preset: RiskPreset;
}

interface ProfitEngineTicketLeg {
  game_id: string;
  game_label: string;
  market: string;
  selection: string;
  price: string;
  implied_prob_pct: number;
  model_prob_pct: number;
  edge_pct: number;
}

interface ProfitEngineTicket {
  ticket_id: string;
  label: string;
  risk_tier: RiskPreset | "standard";
  kelly_fraction: number;
  stake_suggestion_units: number;
  payout_odds: string;
  model_win_prob_pct: number;
  implied_win_prob_pct: number;
  edge_pct: number;
  confidence_label: string;
  legs: ProfitEngineTicketLeg[];
}

interface ProfitEngineResultEnvelope {
  version: string;
  engine: string;
  job_id: string;
  source: string;
  created_at: string;
  completed_at: string;
  status: "queued" | "running" | "done" | "error" | "cancelled";
  summary: ProfitEngineResultSummary;
  tickets: ProfitEngineTicket[];
  meta?: {
    notes?: string;
    engine_version?: string;
  };
}

// 🔌 Sample result envelope – mirrors docs/profit-engine-result-envelope-v1.json
const sampleResult: ProfitEngineResultEnvelope = {
  version: "profit-engine-result-v1",
  engine: "profit-engine",
  job_id: "SAMPLE-JOB-ID-REPLACE-ME",
  source: "profit-engine/worker",
  created_at: "2025-11-16T02:30:00Z",
  completed_at: "2025-11-16T02:31:45Z",
  status: "done",
  summary: {
    league: "NFL",
    season: 2025,
    week: 1,
    num_games: 16,
    num_sims: 50000,
    hit_rate_pct: 61.3,
    avg_edge_pct: 3.2,
    max_edge_pct: 8.7,
    num_tickets: 5,
    risk_preset: "standard",
  },
  tickets: [
    {
      ticket_id: "TCK-0001",
      label: "Safe 3-leg",
      risk_tier: "safe",
      kelly_fraction: 0.02,
      stake_suggestion_units: 1.0,
      payout_odds: "+275",
      model_win_prob_pct: 56.4,
      implied_win_prob_pct: 26.7,
      edge_pct: 29.7,
      confidence_label: "A-Play",
      legs: [
        {
          game_id: "2025-01-12-PHI-DAL",
          game_label: "PHI @ DAL",
          market: "spread",
          selection: "PHI -3.5",
          price: "-110",
          implied_prob_pct: 52.4,
          model_prob_pct: 58.0,
          edge_pct: 5.6,
        },
        {
          game_id: "2025-01-12-KC-LV",
          game_label: "KC @ LV",
          market: "total",
          selection: "Over 47.5",
          price: "-105",
          implied_prob_pct: 51.2,
          model_prob_pct: 55.5,
          edge_pct: 4.3,
        },
        {
          game_id: "2025-01-12-GB-CHI",
          game_label: "GB @ CHI",
          market: "moneyline",
          selection: "GB ML",
          price: "+120",
          implied_prob_pct: 45.5,
          model_prob_pct: 51.0,
          edge_pct: 5.5,
        },
      ],
    },
    {
      ticket_id: "TCK-0002",
      label: "Standard 4-leg",
      risk_tier: "standard",
      kelly_fraction: 0.03,
      stake_suggestion_units: 0.75,
      payout_odds: "+750",
      model_win_prob_pct: 24.1,
      implied_win_prob_pct: 11.8,
      edge_pct: 12.3,
      confidence_label: "B-Play",
      legs: [],
    },
  ],
  meta: {
    notes: "Sample result envelope for Parlay Pilot UI wiring.",
    engine_version: "stub-2025-11-16",
  },
};

const riskPresetLabels: Record<RiskPreset, string> = {
  safe: "Safe",
  standard: "Standard",
  aggro: "Aggro",
};

const riskPresetDescriptions: Record<RiskPreset, string> = {
  safe: "Lower variance, higher win-rate focus.",
  standard: "Balanced risk vs reward.",
  aggro: "High upside, accepts more volatility.",
};

export default function ParlayPilotPage() {
  const [riskPreset, setRiskPreset] = useState<RiskPreset>(
    sampleResult.summary.risk_preset,
  );

  const result = sampleResult;
  const summary = result.summary;
  const tickets = result.tickets;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
              <ShieldCheck className="h-3 w-3" />
              <span>Profit Engine · Stub</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Parlay Pilot
              </h1>
              <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs text-slate-300">
                {summary.league} · {summary.season} · Week {summary.week}
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Preview how Profit Engine sends back sim results and curated
              parlay tickets. Live engine wiring comes next.
            </p>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-300">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <span>
                Hit rate{" "}
                <span className="font-semibold text-slate-100">
                  {summary.hit_rate_pct.toFixed(1)}%
                </span>
              </span>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400">
              Run new sim
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </header>
      </div>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row">
        {/* LEFT: Controls & risk presets */}
        <section className="w-full space-y-4 md:w-80">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">
                  Risk presets
                </h2>
                <p className="text-xs text-slate-400">
                  Tell the pilot how aggressive to fly this slate.
                </p>
              </div>
              <BarChart3 className="h-4 w-4 text-slate-400" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(["safe", "standard", "aggro"] as RiskPreset[]).map((preset) => {
                const active = riskPreset === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRiskPreset(preset)}
                    className={[
                      "flex h-16 flex-col items-start justify-center rounded-xl border px-2.5 py-1.5 text-left text-xs transition",
                      active
                        ? "border-emerald-400/80 bg-emerald-500/20 text-emerald-50 shadow shadow-emerald-500/30"
                        : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900",
                    ].join(" ")}
                  >
                    <span className="font-semibold">
                      {riskPresetLabels[preset]}
                    </span>
                    <span className="mt-0.5 line-clamp-2 text-[0.65rem] text-slate-400">
                      {riskPresetDescriptions[preset]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-400 shadow-lg shadow-slate-950/40">
            <div className="mb-2 flex items-center gap-2 text-slate-200">
              <Ticket className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-semibold">Coach lane (coming)</h2>
            </div>
            <p className="mb-2">
              This is where the coach bot will sit: explaining why each ticket
              was chosen, showing alternatives, and warning you about bankroll
              risk before you press send.
            </p>
            <p className="text-[0.7rem] text-slate-500">
              For now, we&apos;re just rendering sample data from the
              Profit&nbsp;Engine result envelope.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-[0.7rem] text-slate-500">
            <p>
              Parlay Pilot is a{" "}
              <span className="font-semibold text-slate-300">
                research &amp; simulation tool
              </span>
              . It is not financial advice and does not place bets.
            </p>
          </div>
        </section>

        {/* RIGHT: Sim summary + recommended tickets */}
        <section className="flex-1 space-y-4">
          {/* Sim summary card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5 shadow-lg shadow-slate-950/40">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-2.5 py-1 text-[0.65rem] text-slate-300">
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                  <span>Sim summary</span>
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  <span>
                    {summary.num_sims.toLocaleString()} simulations ·{" "}
                    {summary.num_games} games
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  This is the kind of payload Profit Engine returns after it
                  crunches a slate.
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 text-right text-xs">
                <span className="text-slate-400">
                  Job status:{" "}
                  <span className="font-semibold text-emerald-400">
                    {result.status}
                  </span>
                </span>
                <span className="text-[0.65rem] text-slate-500">
                  Engine version: {result.meta?.engine_version ?? "unknown"}
                </span>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <SummaryStat
                label="Hit rate (backtest)"
                value={`${summary.hit_rate_pct.toFixed(1)}%`}
                hint="Historical hit rate for this slate & preset."
              />
              <SummaryStat
                label="Average edge"
                value={`${summary.avg_edge_pct.toFixed(1)}%`}
                hint="Average model edge across recommended tickets."
              />
              <SummaryStat
                label="Max edge ticket"
                value={`${summary.max_edge_pct.toFixed(1)}%`}
                hint="Strongest edge found in this batch."
              />
              <SummaryStat
                label="Tickets generated"
                value={summary.num_tickets.toString()}
                hint="How many tickets the engine surfaced."
              />
            </div>
          </div>

          {/* Recommended tickets */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5 shadow-lg shadow-slate-950/40">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">
                  Recommended tickets
                </h2>
                <p className="text-xs text-slate-400">
                  These are the tickets the engine thinks are most interesting
                  for this slate and risk preset.
                </p>
              </div>
            </div>

            {tickets.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/60 p-4 text-center text-sm text-slate-400">
                No tickets returned in this sample payload.
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <TicketCard
                    key={ticket.ticket_id}
                    ticket={ticket}
                    riskPreset={riskPreset}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function SummaryStat(props: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5">
      <span className="text-[0.7rem] text-slate-400">{props.label}</span>
      <span className="mt-1 text-base font-semibold text-slate-50">
        {props.value}
      </span>
      {props.hint && (
        <span className="mt-0.5 text-[0.65rem] text-slate-500">
          {props.hint}
        </span>
      )}
    </div>
  );
}

function TicketCard(props: {
  ticket: ProfitEngineTicket;
  riskPreset: RiskPreset;
}) {
  const { ticket, riskPreset } = props;

  const riskColor =
    ticket.risk_tier === "safe"
      ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/40"
      : ticket.risk_tier === "aggro"
        ? "bg-rose-500/15 text-rose-200 border-rose-500/40"
        : "bg-amber-500/15 text-amber-200 border-amber-500/40";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-200 transition hover:border-slate-700 hover:bg-slate-950">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-50">
              {ticket.label}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.65rem] ${riskColor}`}
            >
              <ShieldCheck className="h-3 w-3" />
              <span>{ticket.risk_tier.toUpperCase()}</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[0.7rem] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Ticket className="h-3 w-3 text-slate-500" />
              Odds{" "}
              <span className="font-semibold text-slate-100">
                {ticket.payout_odds}
              </span>
            </span>
            <span>
              Engine label:{" "}
              <span className="font-semibold text-slate-200">
                {ticket.confidence_label}
              </span>
            </span>
            <span>
              Kelly:{" "}
              <span className="font-semibold text-sky-200">
                {(ticket.kelly_fraction * 100).toFixed(1)}%
              </span>{" "}
              · stake:{" "}
              <span className="font-semibold text-sky-200">
                {ticket.stake_suggestion_units.toFixed(2)}u
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-right text-[0.7rem]">
          <span className="text-slate-400">
            Edge:{" "}
            <span className="font-semibold text-emerald-300">
              {ticket.edge_pct.toFixed(1)}%
            </span>
          </span>
          <span className="text-slate-500">
            Model win:{" "}
            <span className="font-semibold text-slate-200">
              {ticket.model_win_prob_pct.toFixed(1)}%
            </span>{" "}
            vs implied{" "}
            <span className="font-semibold text-slate-200">
              {ticket.implied_win_prob_pct.toFixed(1)}%
            </span>
          </span>
          <span className="text-[0.6rem] text-slate-500">
            Tuned for preset:{" "}
            <span className="uppercase text-slate-300">{riskPreset}</span>
          </span>
        </div>
      </div>

      {ticket.legs.length > 0 && (
        <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950/70 p-2">
          <div className="mb-1 flex items-center justify-between gap-2 text-[0.7rem]">
            <span className="font-semibold text-slate-200">
              Legs ({ticket.legs.length})
            </span>
          </div>
          <div className="space-y-1.5">
            {ticket.legs.map((leg) => (
              <div
                key={leg.game_id + leg.selection}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-900/80 px-2 py-1"
              >
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[0.7rem] font-medium text-slate-100">
                      {leg.game_label}
                    </span>
                    <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wide text-slate-300">
                      {leg.market}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[0.7rem] text-slate-300">
                    <span className="font-semibold">{leg.selection}</span>
                    <span className="text-slate-400">{leg.price}</span>
                  </div>
                </div>
                <div className="text-right text-[0.65rem] text-slate-400">
                  <div>
                    Model:{" "}
                    <span className="font-semibold text-slate-100">
                      {leg.model_prob_pct.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    Implied:{" "}
                    <span className="font-semibold text-slate-100">
                      {leg.implied_prob_pct.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    Edge:{" "}
                    <span className="font-semibold text-emerald-300">
                      {leg.edge_pct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
