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
        folder: encodeURIComponent(folder),
        lesson: encodeURIComponent(path.basename(file, '.md')),
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

  const filePath = path.join(
    process.cwd(),
    'content',
    'LessonsMD',
    decodeURIComponent(folder),
    `${decodeURIComponent(lesson)}.md`
  )

  if (!fs.existsSync(filePath)) {
    notFound()
  }

  const markdown = fs.readFileSync(filePath, 'utf8')
  const htmlContent = await markdownToHtml(markdown, `${decodeURIComponent(lesson)}.md`)

  return (
    <div
      className="prose prose-slate dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}