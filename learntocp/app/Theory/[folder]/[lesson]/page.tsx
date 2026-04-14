import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import markdownToHtml from '@/app/utils/mdToHTML'

interface PageProps {
  params: Promise<{
    folder: string
    lesson: string
  }>
}

export async function generateStaticParams(): Promise<
  Array<{ folder: string; lesson: string }>
> {
  const lessonsRoot = path.join(process.cwd(), 'content', 'LessonsMD')

  if (!fs.existsSync(lessonsRoot)) return []

  const folders = fs
    .readdirSync(lessonsRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)

  const params: Array<{ folder: string; lesson: string }> = []

  for (const folder of folders) {
    const folderPath = path.join(lessonsRoot, folder)
    const files = fs
      .readdirSync(folderPath, { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.endsWith('.md'))
      .map((e) => e.name)

    for (const file of files) {
      params.push({
        folder,
        lesson: path.basename(file, '.md'), 
      })
    }
  }

  return params
}

export const dynamicParams = false

export async function generateMetadata({ params }: PageProps) {
  const { folder, lesson } = await params
  return {
    title: `${decodeURIComponent(lesson)} — ${decodeURIComponent(folder)}`,
  }
}

export default async function LessonPage({ params }: PageProps) {
  const { folder, lesson } = await params
  console.log('[LessonPage] raw params:', { folder, lesson })

  // Decode defensively — safe whether Next.js gives us encoded or decoded strings
  const folderDecoded = safeDecode(folder)
  const lessonDecoded = safeDecode(lesson)
  console.log('[LessonPage] decoded:', { folderDecoded, lessonDecoded })

  const filePath = path.join(
    process.cwd(),
    'content',
    'LessonsMD',
    folderDecoded,
    `${lessonDecoded}.md`
  )
  console.log('[LessonPage] filePath:', filePath, 'exists:', fs.existsSync(filePath))

  if (!fs.existsSync(filePath)) {
    notFound()
  }

  const markdown = fs.readFileSync(filePath, 'utf8')
  const htmlContent = await markdownToHtml(markdown, `${lessonDecoded}.md`)

  return (
    <div
      className="prose prose-slate dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}