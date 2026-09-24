import { cookies } from 'next/headers';

export const COOKIE_NAME = 'eru_admin';
export const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

export function getAdminToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? 'changeme';
  return Buffer.from(`eru:${password}`).toString('base64');
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token === getAdminToken();
}
