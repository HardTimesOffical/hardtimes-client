// middleware.ts (project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Add locales here as you create dictionary files ──────────────
export const locales = ['ru', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ru';

// ─── Helpers ──────────────────────────────────────────────────────
function getLocaleFromPath(pathname: string): Locale | null {
  const segment = pathname.split('/')[1];
  return locales.includes(segment as Locale) ? (segment as Locale) : null;
}

function detectLocale(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language') ?? '';
  const preferred = acceptLanguage.split(',')[0]?.split('-')[0];
  return locales.includes(preferred as Locale) ? (preferred as Locale) : defaultLocale;
}

// ─── Middleware ───────────────────────────────────────────────────
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Launcher i18n redirect ──────────────────────────────────────
  // /launcher → /ru/launcher (or user's preferred language)
  if (pathname.startsWith('/launcher')) {
    const detected = detectLocale(request);
    return NextResponse.redirect(
      new URL(`/${detected}${pathname}${request.nextUrl.search}`, request.url)
    );
  }

  // ── For /{locale}/launcher: make sure locale is valid ──────────
  // If someone hits /xx/launcher with an unsupported locale, redirect to default
  const localeFromPath = getLocaleFromPath(pathname);
  if (
    pathname.includes('/launcher') &&
    localeFromPath === null
  ) {
    // e.g. /de/launcher — 'de' not yet in locales, redirect to default
    const restOfPath = pathname.substring(pathname.indexOf('/launcher'));
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${restOfPath}${request.nextUrl.search}`, request.url)
    );
  }

  // ── Admin protection ────────────────────────────────────────────
  if (pathname.includes('/hard-stuff')) {
    const userRole = request.cookies.get('userRole')?.value;
    if (userRole !== 'admin') {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Bare /launcher without locale prefix
    '/launcher/:path*',
    // Localized launcher paths for all possible locales
    '/:lang/launcher/:path*',
    // Admin protection
    '/hard-stuff/:path*',
  ],
};
