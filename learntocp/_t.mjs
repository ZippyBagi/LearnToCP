import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

const md = `## Example

\`\`\`Input
2 3
\`\`\`

\`\`\`Output
5
\`\`\`

## Code

\`\`\`c++
int x = a < b;
\`\`\`
`;

const out = (await remark().use(remarkGfm).use(remarkBreaks).use(html,{sanitize:false}).process(md)).toString();
console.log("=== remark HTML ===");
console.log(out);

// replicate transformExampleFences
const EXAMPLE_FENCE_KIND={input:"input",output:"output",ulaz:"input",izlaz:"output"};
const regex=/<pre><code class="language-([\w+#-]+)[^"]*">([\s\S]*?)<\/code><\/pre>/g;
const res=out.replace(regex,(full,lang,code)=>{
  const kind=EXAMPLE_FENCE_KIND[lang.toLowerCase()];
  if(!kind) return full;
  const body=code.replace(/\n$/,"");
  const label=lang.charAt(0).toUpperCase()+lang.slice(1).toLowerCase();
  let boxClass=`example-box example-${kind}`;
  return `<div class="example-io"><span class="example-label">${label}</span><pre class="${boxClass}">${body}</pre></div>`;
});
console.log("=== after transform ===");
console.log(res);
