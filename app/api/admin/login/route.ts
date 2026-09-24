import { NextResponse } from 'next/server';
import { getAdminToken, COOKIE_NAME, SESSION_DURATION } from '@/lib/auth';

export async function POST(req: Request) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'changeme';

  if (password !== adminPassword) {
    // Constant-time compare isn't critical here since no payments are involved,
    // but add a small delay to blunt brute-force
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, getAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
