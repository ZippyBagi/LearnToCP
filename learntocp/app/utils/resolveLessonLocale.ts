import 'server-only'

import path from 'path'
import fs from 'fs'
import { getLessonsRoot } from './getLessonRoot'
import { stripOrderPrefix } from '@/app/utils/generateSidebarContainers'

export interface ResolvedLesson {
  /** Display slug (order prefix stripped) of the matched folder in the target locale. */
  groupSlug: string
  /** Display slug (order prefix stripped) of the matched lesson in the target locale. */
  pageSlug: string
}

export function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

function getPrefix(name: string): number | null {
  const match = name.match(/^([0-9]+)/)
  return match ? parseInt(match[1], 10) : null
}

function readDirs(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return []
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
}

function readMdFiles(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return []
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((f) => f.isFile() && f.name.endsWith('.md'))
    .map((f) => f.name)
}

/**
 * Translate a Theory lesson reference from one locale to another.
 *
 * Lessons are kept in numeric-prefixed folders/files (e.g. "02 Sorting"). The
 * same lesson shares a prefix across locales, so we locate the source lesson by
 * its display name, read its folder + file prefixes, then find the entries with
 * the matching prefixes in the target locale.
 *
 * `groupSlug` / `pageSlug` are display slugs (order prefix already stripped).
 * Returns `null` when no equivalent lesson exists in the target locale.
 */
export function resolveLessonLocale(
  sourceLocale: string,
  groupSlug: string,
  pageSlug: string,
  targetLocale: string,
): ResolvedLesson | null {
  if (!groupSlug || !pageSlug) return null

  const sourceRoot = getLessonsRoot(sourceLocale)
  const sourceGroupDir = readDirs(sourceRoot).find(
    (dir) => stripOrderPrefix(dir) === groupSlug,
  )
  if (!sourceGroupDir) return null

  const groupPrefix = getPrefix(sourceGroupDir)
  if (groupPrefix === null) return null

  const sourceGroupPath = path.join(sourceRoot, sourceGroupDir)
  const sourcePageFile = readMdFiles(sourceGroupPath).find(
    (file) => stripOrderPrefix(path.basename(file, '.md')) === pageSlug,
  )
  if (!sourcePageFile) return null

  const pagePrefix = getPrefix(sourcePageFile)
  if (pagePrefix === null) return null

  // Match the same numeric prefixes in the target locale to find equivalent content
  const targetRoot = getLessonsRoot(targetLocale)
  const targetGroupDir = readDirs(targetRoot).find(
    (dir) => getPrefix(dir) === groupPrefix,
  )
  if (!targetGroupDir) return null

  const targetGroupPath = path.join(targetRoot, targetGroupDir)
  const targetPageFile = readMdFiles(targetGroupPath).find(
    (file) => getPrefix(file) === pagePrefix,
  )
  if (!targetPageFile) return null

  return {
    groupSlug: stripOrderPrefix(targetGroupDir),
    pageSlug: stripOrderPrefix(path.basename(targetPageFile, '.md')),
  }
}
