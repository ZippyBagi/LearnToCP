import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "sr"];
const defaultLocale = "en";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname === `/${locale}` ||
      pathname.startsWith(`/${locale}/`)
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*).*)",
  ],
};