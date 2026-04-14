import fs from 'fs'
import path from 'path'
 
export interface SidebarContainer {
  name: string
  hrefs: string[]
  names: string[]
}

export function generateSidebarContainers(): SidebarContainer[] {
  const lessonsRoot = path.join(process.cwd(), 'content', 'LessonsMD')
 
  if (!fs.existsSync(lessonsRoot)) {
    console.warn(`[generateSidebarContainers] Directory not found: ${lessonsRoot}`)
    return []
  }
 
  const folders = fs
    .readdirSync(lessonsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort()
 
  return folders.map((folderName): SidebarContainer => {
    const folderPath = path.join(lessonsRoot, folderName)
 
    const mdFiles = fs
      .readdirSync(folderPath, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => entry.name)
      .sort()
 
    const names = mdFiles.map((file) => path.basename(file, '.md'))
    const hrefs = names.map(
      (name) => `/Theory/${encodeURIComponent(folderName)}/${encodeURIComponent(name)}`
    )
 
    return { name: folderName, hrefs, names }
  })
}