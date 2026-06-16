import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import katex from "katex";

function renderMath(expr, displayMode){
  try { return katex.renderToString(expr,{displayMode,throwOnError:false,output:"html"}); }
  catch { return expr; }
}
function restoreMath(h, store){
  h = h.replace(/<p>\s*(KATEXTOKEN\d+ENDKATEX)\s*<\/p>/g,"$1");
  return h.replace(/KATEXTOKEN(\d+)ENDKATEX/g,(_,i)=>store[Number(i)]??"");
}

const store=[];
let md = `Inline math $a_i < b^2$ here, and emphasis-bait $x*y*z$.

$$\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$$

Done.`;

// block then inline (mirrors converter order)
md = md.replace(/\$\$([\s\S]+?)\$\$/g,(_,e)=>{const t=`KATEXTOKEN${store.length}ENDKATEX`;store.push(`<div class="math math-block">${renderMath(e.trim(),true)}</div>`);return `\n\n${t}\n\n`;});
md = md.replace(/\$([^\n$]+?)\$/g,(_,e)=>{const t=`KATEXTOKEN${store.length}ENDKATEX`;store.push(`<span class="math math-inline">${renderMath(e.trim(),false)}</span>`);return t;});

const r = await remark().use(remarkGfm).use(remarkBreaks).use(html,{sanitize:false}).process(md);
let out = restoreMath(r.toString(), store);

console.log("=== tokens survived remark? ===", /KATEXTOKEN/.test(r.toString()));
console.log("=== inline rendered? ===", out.includes('class="math math-inline"') && out.includes('katex'));
console.log("=== block rendered & not in <p>? ===", out.includes('class="math math-block"') && !/<p>\s*<div class="math math-block"/.test(out));
console.log("=== a_i not turned to emphasis? ===", !out.includes('<em>') );
console.log("--- snippet ---");
console.log(out.replace(/<span class="katex">[\s\S]*?<\/span><\/span>/g,'[KATEX]').slice(0,600));
