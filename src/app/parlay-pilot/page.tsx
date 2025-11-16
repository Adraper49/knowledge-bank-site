// BEGIN FILE: C:\KB\Web\knowledge-bank-site\src\app\parlay-pilot\page.tsx
"use client";

import React, { useEffect, useState } from "react";

type ProfitEngineTicketLeg = {
  game_id: string;
  game_label: string;
  market: string;
  selection: string;
  price: string;
  implied_prob_pct: number;
  model_prob_pct: number;
  edge_pct: number;
};

type ProfitEngineTicket = {
  ticket_id: string;
  label: string;
  risk_tier: string;
  kelly_fraction: number;
  stake_suggestion_units: number;
  payout_odds: string;
  model_win_prob_pct: number;
  implied_win_prob_pct: number;
  edge_pct: number;
  confidence_label: string;
  legs: ProfitEngineTicketLeg[];
};

type ProfitEngineSummary = {
  league: string;
  season: number;
  week: number;
  num_games: number;
  num_sims: number;
  hit_rate_pct: number;
  avg_edge_pct: number;
  max_edge_pct: number;
  num_tickets: number;
  risk_preset: string;
};

type ProfitEngineEnvelope = {
  job_id: string;
  status: string;
  created_at: string;
  completed_at: string;
  summary: ProfitEngineSummary;
  tickets: ProfitEngineTicket[];
};

export default function ParlayPilotPage() {
  // Form state
  const [league, setLeague] = useState("NFL");
  const [season, setSeason] = useState("2025");
  const [week, setWeek] = useState("1");
  const [riskPreset, setRiskPreset] = useState("standard");
  const [numSims, setNumSims] = useState("50000");

  // App state
  const [envelope, setEnvelope] = useState<ProfitEngineEnvelope | null>(null);
  const [lastJobId, setLastJobId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tickets = envelope?.tickets ?? [];
  const summary = envelope?.summary;

  async function fetchLatestResults() {
    setIsLoadingResults(true);
    setError(null);

    try {
      const resp = await fetch("/api/profit-engine/results", {
        method: "GET",
        cache: "no-store",
      });

      const data = await resp.json();

      if (!resp.ok || !data?.ok) {
        throw new Error(data?.message || "Failed to load results");
      }

      setEnvelope(data.envelope as ProfitEngineEnvelope);
    } catch (err: any) {
      console.error("Error loading results:", err);
      setError(err?.message || "Error loading results");
    } finally {
      setIsLoadingResults(false);
    }
  }

  useEffect(() => {
    // On first load, try to pull the most recent stubbed result
    fetchLatestResults().catch(() => {});
  }, []);

  async function handleRunSimulation(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        engine: "profit-engine",
        job: {
          type: "sim_week",
          league,
          season: Number(season) || 2025,
          week: Number(week) || 1,
          risk_preset: riskPreset,
          preset: "nfl-default",
          settings: {
            num_simulations: Number(numSims) || 50000,
            max_legs: 4,
            min_edge_pct: 1.5,
            max_tickets: 20,
          },
          tags: ["parlay-pilot", "sim", "kb-ui"],
        },
      };

      const resp = await fetch("/api/profit-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok || !data?.ok) {
        throw new Error(data?.message || "Failed to submit job");
      }

      setLastJobId(data.job_id ?? null);

      // Immediately pull the latest result the worker wrote
      await fetchLatestResults();
    } catch (err: any) {
      console.error("Error submitting job:", err);
      setError(err?.message || "Something went wrong submitting the job");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            KB · Hobby Lines
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Parlay Pilot <span className="text-sky-400">/ Profit Engine</span>
          </h1>
          <p className="max-w-2xl text-sm text-slate-400">
            Queue a simulation week into Profit Engine and pull back pre-built
            tickets for your NFL card. This view is wired to the local KB queue
            and worker stub.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Control panel */}
          <form
            onSubmit={handleRunSimulation}
            className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-medium text-slate-100">
                Simulation controls
              </h2>
              {lastJobId && (
                <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-300">
                  Last job: {lastJobId.slice(0, 8)}…
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {/* League */}
              <label className="space-y-1">
                <span className="text-xs text-slate-400">League</span>
                <select
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-2 py-1.5 text-sm outline-none focus:border-sky-500"
                  value={league}
                  onChange={(e) => setLeague(e.target.value)}
                >
                  <option value="NFL">NFL</option>
                </select>
              </label>

              {/* Season */}
              <label className="space-y-1">
                <span className="text-xs text-slate-400">Season</span>
                <input
                  type="number"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-2 py-1.5 text-sm outline-none focus:border-sky-500"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                />
              </label>

              {/* Week */}
              <label className="space-y-1">
                <span className="text-xs text-slate-400">Week</span>
                <input
                  type="number"
                  min={1}
                  max={22}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-2 py-1.5 text-sm outline-none focus:border-sky-500"
                  value={week}
                  onChange={(e) => setWeek(e.target.value)}
                />
              </label>

              {/* Risk preset */}
              <label className="space-y-1">
                <span className="text-xs text-slate-400">Risk preset</span>
                <select
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-2 py-1.5 text-sm outline-none focus:border-sky-500"
                  value={riskPreset}
                  onChange={(e) => setRiskPreset(e.target.value)}
                >
                  <option value="safe">Safe</option>
                  <option value="standard">Standard</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </label>

              {/* Num sims */}
              <label className="space-y-1 col-span-2">
                <span className="text-xs text-slate-400">
                  Number of simulations
                </span>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-2 py-1.5 text-sm outline-none focus:border-sky-500"
                  value={numSims}
                  onChange={(e) => setNumSims(e.target.value)}
                />
              </label>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400 disabled:opacity-60"
              >
                {isSubmitting ? "Queuing…" : "Run simulation"}
              </button>

              <button
                type="button"
                onClick={() => fetchLatestResults()}
                disabled={isLoadingResults}
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-60"
              >
                {isLoadingResults ? "Refreshing…" : "Refresh latest result"}
              </button>

              {error && (
                <p className="text-xs text-rose-400">
                  {error}
                </p>
              )}
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              Under the hood: POST → <code>/api/profit-engine</code> queues a{" "}
              <code>sim_week</code> job into <code>C:\KB\Queue\High</code>. The
              worker writes a result envelope into{" "}
              <code>C:\KB\Engines\ProfitEngine\Results</code>, and{" "}
              <code>/api/profit-engine/results</code> pulls the latest file.
            </p>
          </form>

          {/* Results panel */}
          <div className="space-y-4">
            {/* Summary card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-medium text-slate-100">
                  Latest Profit Engine result
                </h2>
                {envelope && (
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-300">
                    {envelope.status === "done"
                      ? "Status: done"
                      : `Status: ${envelope.status}`}
                  </span>
                )}
              </div>

              {summary ? (
                <>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {summary.league} {summary.season} · Week {summary.week}
                      </p>
                      <p className="text-slate-400">
                        {summary.num_games} games ·{" "}
                        {summary.num_sims.toLocaleString()} sims
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-slate-400">
                        Hit rate:{" "}
                        <span className="text-slate-50">
                          {summary.hit_rate_pct.toFixed(1)}%
                        </span>
                      </p>
                      <p className="text-slate-400">
                        Avg edge:{" "}
                        <span className="text-slate-50">
                          {summary.avg_edge_pct.toFixed(1)}%
                        </span>{" "}
                        · Max edge:{" "}
                        <span className="text-slate-50">
                          {summary.max_edge_pct.toFixed(1)}%
                        </span>
                      </p>
                      <p className="text-slate-400">
                        Tickets:{" "}
                        <span className="text-slate-50">
                          {summary.num_tickets}
                        </span>{" "}
                        · Preset:{" "}
                        <span className="text-slate-50">
                          {summary.risk_preset}
                        </span>
                      </p>
                    </div>
                  </div>

                  {envelope && (
                    <p className="text-[11px] text-slate-500">
                      Job ID: <code>{envelope.job_id}</code>
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-400">
                  No Profit Engine results yet. Run a simulation on the left to
                  generate a fresh envelope.
                </p>
              )}
            </div>

            {/* Ticket list */}
            <div className="space-y-3">
              {tickets.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400">
                  No tickets in the latest envelope yet. Once the worker starts
                  returning real simulations, they will show up here.
                </div>
              )}

              {tickets.map((ticket) => (
                <div
                  key={ticket.ticket_id}
                  className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-50">
                        {ticket.label}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Risk tier:{" "}
                        <span className="text-slate-50">
                          {ticket.risk_tier}
                        </span>{" "}
                        · Kelly:{" "}
                        <span className="text-slate-50">
                          {(ticket.kelly_fraction * 100).toFixed(1)}%
                        </span>{" "}
                        · Stake:{" "}
                        <span className="text-slate-50">
                          {ticket.stake_suggestion_units}u
                        </span>
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-300">
                      <p>
                        Odds:{" "}
                        <span className="text-sky-300">
                          {ticket.payout_odds}
                        </span>
                      </p>
                      <p>
                        Model win:{" "}
                        <span className="text-slate-50">
                          {ticket.model_win_prob_pct.toFixed(1)}%
                        </span>
                      </p>
                      <p>
                        Edge:{" "}
                        <span className="text-emerald-300">
                          {ticket.edge_pct.toFixed(1)}%
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Confidence: {ticket.confidence_label}
                      </p>
                    </div>
                  </div>

                  {ticket.legs && ticket.legs.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-slate-200">
                      {ticket.legs.map((leg) => (
                        <li
                          key={`${leg.game_id}-${leg.market}-${leg.selection}`}
                          className="flex items-start justify-between gap-3 rounded-xl bg-slate-950/60 px-3 py-2"
                        >
                          <div>
                            <p className="font-medium">{leg.game_label}</p>
                            <p className="text-[11px] text-slate-400">
                              {leg.market.toUpperCase()} · {leg.selection} ·{" "}
                              {leg.price}
                            </p>
                          </div>
                          <div className="text-right text-[11px] text-slate-400">
                            <p>
                              Model:{" "}
                              <span className="text-slate-50">
                                {leg.model_prob_pct.toFixed(1)}%
                              </span>
                            </p>
                            <p>
                              Edge:{" "}
                              <span className="text-emerald-300">
                                {leg.edge_pct.toFixed(1)}%
                              </span>
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-slate-500">
                      No legs attached yet in this stub. The real engine will
                      populate legs for multi-leg tickets.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
// END FILE: C:\KB\Web\knowledge-bank-site\src\app\parlay-pilot\page.tsx
