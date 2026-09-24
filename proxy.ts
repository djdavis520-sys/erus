import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Must stay in sync with lib/auth.ts -- both run in different runtimes
const COOKIE_NAME = 'eru_admin';

function expectedToken(password: string): string {
  return btoa(`eru:${password}`);
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/api/admin/login' || pathname === '/admin/login') {
    return NextResponse.next();
  }

  const isAdminUi = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');
  const isProductApi = pathname === '/api/products' || pathname.startsWith('/api/products/') || pathname === '/api/upload';

  if (!isAdminUi && !isAdminApi && !isProductApi) {
    return NextResponse.next();
  }

  // Public: storefront product reads
  if (req.method === 'GET' && (pathname === '/api/products' || pathname.startsWith('/api/products/'))) {
    return NextResponse.next();
  }

  const password = process.env.ADMIN_PASSWORD ?? 'changeme';
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const authenticated = token === expectedToken(password);

  if (!authenticated) {
    if (isAdminUi) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/products', '/api/products/:path*', '/api/upload'],
};
