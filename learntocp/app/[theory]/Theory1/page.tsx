import markdownToHtml from '@/app/utils/mdToHTML'
import fs from 'fs'
import path from 'path'

export default async function App(){

    const filePath = path.join(process.cwd(), 'content', 'LessonsMD', 'DataStructures', 'SparseTable.md')
    const markdown = fs.readFileSync(filePath, 'utf8')
    const htmlContent = await markdownToHtml(markdown)

    return (
        <article
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    )
}
