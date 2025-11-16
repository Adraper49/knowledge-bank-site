// BEGIN PASTE INTO NOTEPAD (src/app/parlay-pilot/page.tsx)
"use client";

import { useState } from "react";

type ApiResponse = {
  ok: boolean;
  engine?: string;
  job_id?: string;
  status?: string;
  note?: string;
  error?: string;
};

export default function ParlayPilotPage() {
  const [season, setSeason] = useState<number>(2025);
  const [week, setWeek] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const body = {
        engine: "profit-engine",
        job: {
          type: "simulation",
          preset: "nfl-default",
          inputs: {
            league: "NFL",
            season: Number(season),
            week: Number(week),
          },
          priority: "normal",
          tags: ["parlay-pilot", "sim", "ui"],
        },
      };

      const res = await fetch("/api/profit-engine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(
          (data && data.error) ||
            `Request failed with status ${res.status}`
        );
      }

      setResult(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-xl space-y-6">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Profit Engine · Parlay Pilot
          </p>
          <h1 className="text-2xl font-semibold">
            Run an NFL simulation
          </h1>
          <p className="text-sm text-slate-400">
            This calls <code>/api/profit-engine</code> and queues a
            simulation job in the cloud. We&apos;ll wire it to real sims
            next.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                League
              </label>
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                disabled
              >
                <option>NFL (more coming later)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Season
              </label>
              <input
                type="number"
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={season}
                onChange={(e) => setSeason(Number(e.target.value))}
                min={2000}
                max={2100}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Week
              </label>
              <input
                type="number"
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={week}
                onChange={(e) => setWeek(Number(e.target.value))}
                min={1}
                max={22}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? "Queuing simulation…" : "Run simulation"}
          </button>

          <p className="text-[11px] text-slate-500">
            When you click run, Parlay Pilot calls the cloud stub. A real
            worker will read these jobs and run full simulations later.
          </p>
        </form>

        {error && (
          <div className="rounded-xl border border-red-500/60 bg-red-950/70 px-3 py-2 text-xs text-red-100">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <section className="rounded-2xl border border-emerald-600/60 bg-emerald-950/60 p-4 text-xs space-y-1">
            <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-300">
              Job queued
            </p>
            <p>
              <span className="font-semibold">Engine:</span>{" "}
              {result.engine}
            </p>
            {result.job_id && (
              <p>
                <span className="font-semibold">Job ID:</span>{" "}
                <span className="font-mono break-all">
                  {result.job_id}
                </span>
              </p>
            )}
            {result.status && (
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {result.status}
              </p>
            )}
            {result.note && (
              <p className="text-slate-100 mt-1">{result.note}</p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
// END PASTE INTO NOTEPAD
