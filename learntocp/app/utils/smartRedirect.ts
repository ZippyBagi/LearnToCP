'use server'

import path from 'path'
import fs from 'fs'
import { getLessonsRoot } from './getLessonRoot'
import { stripOrderPrefix } from '@/app/utils/generateSidebarContainers'

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function getPrefix(name: string): number | null {
  const match = name.match(/^([0-9]+)/)
  return match ? parseInt(match[1], 10) : null
}

function readDirs(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
}

function readMdFiles(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter(f => f.isFile() && f.name.endsWith('.md'))
    .map(f => f.name)
}

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
    const groupSlug = safeDecode(segments.at(-2) || "")
    const pageSlug  = safeDecode(segments.at(-1) || "")

    if (!groupSlug || !pageSlug) return fallback

    const sourceRoot = getLessonsRoot(currentLocale)
    const sourceGroupDir = readDirs(sourceRoot).find(
      dir => stripOrderPrefix(dir) === groupSlug
    )
    if (!sourceGroupDir) return fallback

    const groupPrefix = getPrefix(sourceGroupDir)
    if (groupPrefix === null) return fallback

    const sourceGroupPath = path.join(sourceRoot, sourceGroupDir)
    const sourcePageFile = readMdFiles(sourceGroupPath).find(
      file => stripOrderPrefix(path.basename(file, '.md')) === pageSlug
    )
    if (!sourcePageFile) return fallback

    const pagePrefix = getPrefix(sourcePageFile)
    if (pagePrefix === null) return fallback

    // Match the same numeric prefix in the target locale to find the equivalent content
    const targetRoot = getLessonsRoot(newLocale)
    const targetGroupDir = readDirs(targetRoot).find(
      dir => getPrefix(dir) === groupPrefix
    )
    if (!targetGroupDir) return fallback

    const targetGroupPath = path.join(targetRoot, targetGroupDir)
    const targetPageFile = readMdFiles(targetGroupPath).find(
      file => getPrefix(file) === pagePrefix
    )
    if (!targetPageFile) return fallback

    const targetGroupSlug = stripOrderPrefix(targetGroupDir)
    const targetPageSlug  = stripOrderPrefix(path.basename(targetPageFile, '.md'))

    return `/${newLocale}/Theory/${encodeURIComponent(targetGroupSlug)}/${encodeURIComponent(targetPageSlug)}`

  } catch (error) {
    console.error("Redirect error:", error)
    return fallback
  }
}
