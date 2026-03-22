import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

export default async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(markdown);
  
  let content = result.toString();
  
  content = content.replace(
    /<pre><code class=\"language-(\w+)\">/g,
    '<pre class="language-$1"><code class="language-$1">'
  );
  
  return content;
}