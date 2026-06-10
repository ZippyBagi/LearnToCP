import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/app/supabase/proxy'

const locales = ['en', 'sr']
const defaultLocale = 'en'

function getLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  return defaultLocale
}

export async function proxy(request: NextRequest) {
  const { supabaseResponse } = await updateSession(request)

  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return supabaseResponse

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`

  // Carry refreshed auth cookies (and their cache-prevention headers) over to the redirect response.
  const redirectResponse = NextResponse.redirect(request.nextUrl)
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie)
  })
  for (const header of ['Cache-Control', 'Expires', 'Pragma'] as const) {
    const value = supabaseResponse.headers.get(header)
    if (value) redirectResponse.headers.set(header, value)
  }

  return redirectResponse
}

export const config = {
  matcher: [
    // `auth` is excluded so OAuth callbacks (/auth/*) are never locale-redirected.
    '/((?!_next|api|auth|favicon.ico|.*\\..*).*)',
  ],
}
