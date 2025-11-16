// BEGIN FILE: C:\KB\Web\knowledge-bank-site\src\app\api\health\route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'kb-cloud',
    env: process.env.VERCEL ? 'vercel' : 'local',
    time: new Date().toISOString(),
  });
}
// END FILE
