// BEGIN FILE: C:\KB\Web\knowledge-bank-site\src\app\page.tsx
"use client";

import type { FormEvent } from "react";

export default function Home() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <main className="min-h-screen">
      {/* Top nav */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/40">
              KB
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight">
                Knowledge Bank
              </span>
              <span className="text-[11px] text-slate-400">
                AI operating system
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-xs font-medium text-slate-300 md:flex">
            <a href="#engines" className="hover:text-emerald-300">
              Engines
            </a>
            <a href="#universes" className="hover:text-emerald-300">
              Universes
            </a>
            <a href="#how-it-works" className="hover:text-emerald-300">
              How it works
            </a>
            <a
              href="#contact"
              className="rounded-full border border-emerald-500 px-3 py-1 text-[11px] text-emerald-300 hover:bg-emerald-500 hover:text-slate-950"
            >
              Join waitlist
            </a>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-6">
        {/* Hero */}
        <section>
          <p className="inline-flex rounded-full border border-emerald-500/80 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-emerald-300">
            In active build mode
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Your AI operating system for{" "}
            <span className="text-emerald-400">engines, apps,</span> and{" "}
            <span className="text-emerald-400">universes.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
            Knowledge Bank connects simulation engines, creative tools, and
            story worlds into one system. Simple at the surface, structured
            underneath.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400"
            >
              Join the waitlist
            </a>
            <a
              href="#engines"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-200 hover:border-emerald-400 hover:text-emerald-300"
            >
              Explore engines
            </a>
          </div>
        </section>

        {/* Engines & apps */}
        <section
          id="engines"
          className="mt-14 border-t border-slate-800 pt-8"
        >
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            Engines & apps
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Each engine has a focused job. Together they watch signals, run
            simulations, and ship outputs.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm shadow-sm shadow-slate-950/40">
              <h3 className="text-sm font-semibold text-slate-50">
                Profit Engine & Hobby Lines
              </h3>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-emerald-300">
                Sports · markets · risk
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Backtests angles, tracks bankroll, and enforces rules for sports
                and trading experiments.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm shadow-sm shadow-slate-950/40">
              <h3 className="text-sm font-semibold text-slate-50">Zalara</h3>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-emerald-300">
                Creative engine
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Turns structured jobs into promos, thumbnails, and visuals for
                books, apps, and campaigns.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm shadow-sm shadow-slate-950/40">
              <h3 className="text-sm font-semibold text-slate-50">
                Signal Forge & Opportunity Engine
              </h3>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-emerald-300">
                Signals & ideas
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Scans sports, products, and markets for patterns, then routes
                promising ideas to the right engine.
              </p>
            </div>
          </div>
        </section>

        {/* Universes & books */}
        <section
          id="universes"
          className="mt-14 border-t border-slate-800 pt-8"
        >
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            Universes & books
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Knowledge Bank also powers book series and story worlds built on
            real data and what-if logic.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm shadow-sm shadow-slate-950/40">
              <h3 className="text-sm font-semibold text-slate-50">
                Where Are Our Numbers
              </h3>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-emerald-300">
                Data-first series
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Tallies lost people, wealth, and potential across Africa, the
                U.S., Native nations, and more.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm shadow-sm shadow-slate-950/40">
              <h3 className="text-sm font-semibold text-slate-50">
                Courtroom & GOAT projects
              </h3>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-emerald-300">
                Debates on trial
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Treats sports and cultural debates like real cases, with
                evidence, timelines, and final verdicts.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm shadow-sm shadow-slate-950/40">
              <h3 className="text-sm font-semibold text-slate-50">
                Rebekah & city stories
              </h3>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-emerald-300">
                Fiction lanes
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Character-driven stories anchored in real cities, backed by KB
                timelines and what-if branches.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mt-14 border-t border-slate-800 pt-8"
        >
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            How it works
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Under the hood, Knowledge Bank is simple: jobs in, work done,
            results out — all through queues and workers.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                01 · Engines with clear jobs
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Each engine focuses on one role: signals, media, formulas,
                universes, or orchestration.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                02 · Queues & workers
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Jobs are JSON files dropped into High, Normal, or Low queues.
                Workers pick them up on laptop or cloud.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                03 · Logs & snapshots
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Every run leaves logs, metrics, and human snapshots so you can
                replay, audit, and improve.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="mt-14 border-t border-slate-800 pt-8"
        >
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            Stay in the loop
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-300">
            This contact block is UI-only for now. Later it can connect to
            email or Supabase for waitlists, collabs, or white-label engines.
          </p>

          <form className="mt-5 max-w-md space-y-3" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-slate-300"
              >
                Name
              </label>
              <input
                id="name"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="intent"
                className="block text-xs font-medium text-slate-300"
              >
                How do you want to use Knowledge Bank?
              </label>
              <textarea
                id="intent"
                rows={3}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 outline-none"
                placeholder="Example: sports engine, book support, content studio, personal automations..."
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400"
            >
              Submit (UI only)
            </button>
          </form>
        </section>

        {/* Footer */}
        <footer className="mt-14 border-t border-slate-900 pt-4 text-[11px] text-slate-500">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p>© 2025 Knowledge Bank. All rights reserved.</p>
            <p className="text-[11px] text-slate-500">
              Simple front door. Serious engines behind it.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
// END FILE
