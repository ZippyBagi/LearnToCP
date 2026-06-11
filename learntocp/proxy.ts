import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/app/supabase/proxy'

const locales = ['en', 'sr']
const defaultLocale = 'en'

const protectedSegments = ['roadmap', 'problems']

function getLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  return defaultLocale
}

function isProtectedPath(pathnameWithoutLocale: string) {
  const firstSegment = pathnameWithoutLocale
    .split('/')
    .filter(Boolean)[0]
    ?.toLowerCase()
  return firstSegment ? protectedSegments.includes(firstSegment) : false
}

function redirectWithAuthCookies(url: URL, supabaseResponse: NextResponse) {
  const redirectResponse = NextResponse.redirect(url)
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie)
  })
  for (const header of ['Cache-Control', 'Expires', 'Pragma'] as const) {
    const value = supabaseResponse.headers.get(header)
    if (value) redirectResponse.headers.set(header, value)
  }
  return redirectResponse
}

export async function proxy(request: NextRequest) {
  const { supabaseResponse, claims } = await updateSession(request)

  const { pathname, search } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    const locale = pathname.split('/')[1]
    const pathnameWithoutLocale = pathname.slice(locale.length + 1)

    if (!claims && isProtectedPath(pathnameWithoutLocale)) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = `/${locale}/login`
      loginUrl.search = ''
      loginUrl.searchParams.set('next', `${pathname}${search}`)
      return redirectWithAuthCookies(loginUrl, supabaseResponse)
    }

    return supabaseResponse
  }

  // No locale in the URL: redirect to the localized URL. The auth guard runs
  // when that redirected request passes through the proxy again.
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`

  return redirectWithAuthCookies(request.nextUrl, supabaseResponse)
}

export const config = {
  matcher: [
    // `auth` is excluded so OAuth callbacks (/auth/*) are never locale-redirected.
    '/((?!_next|api|auth|favicon.ico|.*\\..*).*)',
  ],
}
