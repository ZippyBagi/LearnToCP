'use server'

import { resolveLessonLocale, safeDecode } from './resolveLessonLocale'

export async function getSmartRedirect(
  pathname: string,
  newLocale: string
): Promise<string> {
  const fallback = `/${newLocale}`

  try {
    const segments = pathname.split('/').filter(Boolean)
    // Expects /[locale]/Theory/[folder]/[lesson]
    if (segments.length < 4) return fallback

    const currentLocale = segments[0]
    // Decode immediately so "Linear%20Algebra" becomes "Linear Algebra" before matching
    const groupSlug = safeDecode(segments.at(-2) || '')
    const pageSlug = safeDecode(segments.at(-1) || '')

    const resolved = resolveLessonLocale(currentLocale, groupSlug, pageSlug, newLocale)
    if (!resolved) return fallback

    return `/${newLocale}/Theory/${encodeURIComponent(resolved.groupSlug)}/${encodeURIComponent(resolved.pageSlug)}`
  } catch (error) {
    console.error('Redirect error:', error)
    return fallback
  }
}
