import path from 'path'
import fs from 'fs'
import { cookies } from 'next/headers'
import { locales } from '@/translations'

export const DEFAULT_LOCALE = locales[0]

// Sync — for build-time use in generateStaticParams
export function getLessonsRoot(locale: string): string {
  const localePath = path.join(process.cwd(), 'content', locale, 'LessonsMD')
  if (!fs.existsSync(localePath)) {
    return path.join(process.cwd(), 'content', DEFAULT_LOCALE, 'LessonsMD')
  }
  return localePath
}

// Async — for runtime use when locale comes from cookie
export async function getLessonsRootFromCookie(): Promise<string> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('NEXT_LOCALE')?.value
  const locale = locales.includes(cookie as typeof locales[number])
    ? (cookie as string)
    : DEFAULT_LOCALE
  return getLessonsRoot(locale)
}