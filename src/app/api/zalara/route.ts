import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type ZalaraJob = {
  template?: string;
  inputs?: Record<string, unknown>;
  priority?: string;
  callback_url?: string;
  tags?: string[];
};

type ZalaraJobRequest = {
  engine?: string;
  job?: ZalaraJob;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ZalaraJobRequest;

    // Basic validation
    if (!body.engine) {
      return NextResponse.json(
        { ok: false, error: 'Missing "engine" field' },
        { status: 400 }
      );
    }

    if (!body.job?.template) {
      return NextResponse.json(
        { ok: false, error: 'Missing "job.template" field' },
        { status: 400 }
      );
    }

    // Generate a fake job id for now (no DB yet)
    const jobId = crypto.randomUUID();

    // In the future, this is where we will:
    // - Insert into Supabase "jobs" table
    // - Emit logs into "job_logs"
    // - Let Snoop / Zalara worker pick it up and render

    return NextResponse.json(
      {
        ok: true,
        engine: body.engine,
        job_id: jobId,
        status: 'queued',
        job: body.job,
        note:
          'Zalara API stub: job accepted. Wiring to Supabase + renderer comes next.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Zalara POST error', error);
    return NextResponse.json(
      {
        ok: false,
        error: error?.message ?? 'Unknown Zalara error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      engine: 'zalara',
      message:
        'Zalara API stub is live. POST { "engine": "zalara", "job": { "template": "...", "inputs": { ... } } } to queue a job.',
    },
    { status: 200 }
  );
}
