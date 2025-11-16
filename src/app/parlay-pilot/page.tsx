"use client";

import * as React from "react";

type JobResponse = {
  ok: boolean;
  engine?: string;
  job_id?: string;
  status?: string;
  job?: any;
  note?: string;
  error?: string;
};

export default function ParlayPilotPage() {
  const [league] = React.useState("NFL");
  const [season, setSeason] = React.useState<string>("2025");
  const [week, setWeek] = React.useState<string>("1");
  const [riskPreset, setRiskPreset] = React.useState<"safe" | "standard" | "aggro">(
    "standard",
  );

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<JobResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    const presetCode =
      riskPreset === "safe"
        ? "nfl-safe"
        : riskPreset === "aggro"
        ? "nfl-aggro"
        : "nfl-default";

    try {
      const payload = {
        engine: "profit-engine",
        job: {
          type: "simulation",
          preset: presetCode,
          inputs: {
            league,
            season: Number(season),
            week: Number(week),
          },
          priority: "normal",
          tags: ["parlay-pilot", "sim", riskPreset],
        },
      };

      const res = await fetch("/api/profit-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as JobResponse;

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "API error");
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="space-y-2 border-b border-slate-800 pb-4">
          <p className="text-xs tracking-[0.2em] text-slate-400 uppercase">
            Profit Engine · Parlay Pilot
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Run an NFL simulation
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            This sends a job to the Profit Engine stub at{" "}
            <code className="px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs">
              /api/profit-engine
            </code>
            . A real worker will read these jobs and run full simulations later.
          </p>

          <div className="mt-3 inline-flex flex-wrap items-center gap-3 text-xs">
            <span className="px-2 py-1 rounded-full bg-amber-900/30 text-amber-300 border border-amber-500/40">
              Simulation only · No real-money wagering
            </span>
            <span className="px-2 py-1 rounded-full bg-emerald-900/30 text-emerald-300 border border-emerald-500/40">
              Connected to cloud stubs
            </span>
          </div>
        </header>

        {/* Layout: form + status + coach card */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left side — Simulation form */}
          <section className="md:col-span-2 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 shadow-md">
              <div className="border-b border-slate-800 px-4 py-3">
                <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-200">
                  Simulation setup
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Choose a week and risk preset. Parlay Pilot will queue a
                  single simulation job in the cloud.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
                {/* League */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">
                    League
                  </label>
                  <select
                    value={league}
                    disabled
                    className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 disabled:opacity-70"
                  >
                    <option>NFL (more coming later)</option>
                  </select>
                  <p className="text-[11px] text-slate-500">
                    NCAA, NBA, MLB and others will dock into Parlay Pilot later.
                  </p>
                </div>

                {/* Season / Week */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">
                      Season
                    </label>
                    <input
                      type="number"
                      value={season}
                      onChange={(e) => setSeason(e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                      min={1970}
                      max={2100}
                    />
                    <p className="text-[11px] text-slate-500">
                      Historical seasons are perfect for stress-testing presets.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">
                      Week
                    </label>
                    <input
                      type="number"
                      value={week}
                      onChange={(e) => setWeek(e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                      min={1}
                      max={22}
                    />
                    <p className="text-[11px] text-slate-500">
                      Regular season 1–18 · playoffs / preseason via presets
                      later.
                    </p>
                  </div>
                </div>

                {/* Risk preset */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">
                    Risk preset
                  </label>
                  <div className="grid gap-2 md:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => setRiskPreset("safe")}
                      className={
                        "rounded border px-3 py-2 text-left text-xs " +
                        (riskPreset === "safe"
                          ? "border-emerald-400 bg-emerald-900/40"
                          : "border-slate-700 bg-slate-900 hover:border-slate-500")
                      }
                    >
                      <div className="font-semibold">Safe</div>
                      <div className="text-[11px] text-slate-200">
                        Lower risk, smaller edges. Think conservative presets.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRiskPreset("standard")}
                      className={
                        "rounded border px-3 py-2 text-left text-xs " +
                        (riskPreset === "standard"
                          ? "border-sky-400 bg-sky-900/40"
                          : "border-slate-700 bg-slate-900 hover:border-slate-500")
                      }
                    >
                      <div className="font-semibold">Standard</div>
                      <div className="text-[11px] text-slate-200">
                        Balanced risk / reward. Default for most sims.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRiskPreset("aggro")}
                      className={
                        "rounded border px-3 py-2 text-left text-xs " +
                        (riskPreset === "aggro"
                          ? "border-rose-400 bg-rose-900/40"
                          : "border-slate-700 bg-slate-900 hover:border-slate-500")
                      }
                    >
                      <div className="font-semibold">Aggro</div>
                      <div className="text-[11px] text-slate-200">
                        Higher risk, big swings. Used for hunting outlier
                        edges.
                      </div>
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2 border-t border-slate-800 mt-4 flex items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Queueing..." : "Queue simulation"}
                  </button>
                  <p className="text-[11px] text-slate-500 text-right max-w-xs">
                    Parlay Pilot will read these jobs from the cloud queue and
                    run full state simulations in a later phase.
                  </p>
                </div>
              </form>
            </div>
          </section>

          {/* Right side — Job status + Coach card */}
          <section className="space-y-4">
            {/* Job status */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 shadow-md">
              <div className="border-b border-slate-800 px-4 py-3">
                <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-200">
                  Job status
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Run a simulation on the left to see the job payload and
                  response here.
                </p>
              </div>

              <div className="px-4 py-4 space-y-2 text-xs text-slate-200">
                {!result && !error && (
                  <p className="text-slate-400">
                    No jobs yet. Submit a simulation to see the latest job ID
                    and status from the Profit Engine stub.
                  </p>
                )}

                {error && (
                  <p className="text-rose-300">
                    Error: <span className="font-mono">{error}</span>
                  </p>
                )}

                {result && (
                  <div className="space-y-1">
                    <p>
                      <span className="font-semibold">Engine:</span>{" "}
                      {result.engine}
                    </p>
                    <p className="break-all">
                      <span className="font-semibold">Job ID:</span>{" "}
                      {result.job_id}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      {result.status}
                    </p>
                    {result.note && (
                      <p className="text-slate-300">{result.note}</p>
                    )}
                  </div>
                )}

                <p className="pt-3 text-[11px] text-slate-500 border-t border-slate-800 mt-3">
                  Parlay Pilot = Profit Engine dock. In future phases this panel
                  will show leg-by-leg tickets, edge visualizations, and
                  bankroll tracking.
                </p>
              </div>
            </div>

            {/* Ask Coach (coming soon) */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 shadow-md">
              <div className="border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-200">
                    Ask Coach · AI lane
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Guided ideas and explanations about risk, slates, and
                    presets.
                  </p>
                </div>
                <span className="text-[11px] px-2 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-600">
                  Coming soon
                </span>
              </div>

              <div className="px-4 py-4 space-y-2 text-xs text-slate-300">
                <p>
                  This lane will plug into an open-source model behind strict
                  safety rails:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                  <li>
                    No real-money advice · only simulation, education, and risk
                    framing.
                  </li>
                  <li>
                    KB-style guardrails: profanity filters, self-harm checks,
                    and rate limits.
                  </li>
                  <li>
                    Context-aware answers based on your current slate and risk
                    preset.
                  </li>
                </ul>
                <p className="text-[11px] text-slate-500 pt-2">
                  For now, use the simulation form to explore ideas. Coach lane
                  will be unlocked in a later build once safety gates are
                  wired.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer note */}
        <footer className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
          Parlay Pilot is a simulation and research tool only. It does not place
          real bets or connect to any sportsbook. Always wager responsibly and
          within your local laws.
        </footer>
      </div>
    </main>
  );
}
