import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { visit } from "unist-util-visit";
import { createHighlighter } from "shiki";

const codeHighliteTheme = "dracula";

export default async function markdownToHtml(markdown: string, fileName : string) {
  const highlighter = await highlighterPromise;
  let content = preprocessObsidian(markdown);

  const result = await remark()
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkBreaksProtectCode) 
    .use(html, { sanitize: false })
    .process(content);

  content = result.toString();
  content = stripBreaksInCodeBlocks(content);
  content = await highlightCodeBlocks(content, highlighter);
  content = postprocessHtml(content);

  const title = fileName.replace(/\.md$/i, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  content = `<h2 class="title">${title}</h2>\n` + content;
  
  return content;
}

const highlighterPromise = createHighlighter({
  themes: [codeHighliteTheme],
  langs: ["cpp", "c", "javascript", "typescript", "python", "bash", "json", "css", "html", "sql"],
});

function remarkBreaksProtectCode() {
  return (tree: any) => {
    visit(tree, "code", (node) => {
      node.value = node.value;
    });
  };
}

function stripBreaksInCodeBlocks(html: string): string {
  return html.replace(
    /(<pre[^>]*>[\s\S]*?<\/pre>)/g,
    (block) => block.replace(/<br\s*\/?>/gi, "\n")
  );
}

async function highlightCodeBlocks(
  html: string,
  highlighter: Awaited<ReturnType<typeof createHighlighter>>
) {

  const regex = /<pre><code class="language-([\w+#-]+)([^"]*)">([\s\S]*?)<\/code><\/pre>/g;
  const matches = [...html.matchAll(regex)];

  for (const match of matches) {
    const [fullMatch, lang, titleRaw, code] = match;
    const title = titleRaw.trim();

    const decoded = code
      .replace(/&amp;/g, "&")
      .replace(/&#x26;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#x3C;/g, "<")
      .replace(/&#x3E;/g, ">");

    const langMap: Record<string, string> = {
      "c++": "cpp",
      "c#": "csharp",
      "js": "javascript",
      "ts": "typescript",
    };
    const trimmed = decoded.replace(/\n$/, "");
    const normalizedLang = langMap[lang.toLowerCase()] ?? lang.toLowerCase();

    try {
      const highlighted = highlighter.codeToHtml(trimmed, {
        lang: normalizedLang,
        theme: codeHighliteTheme,
        transformers: [
          {
            pre(node) {
              const existing = (node.properties.class ?? "") as string;
              node.properties.class = existing + " shiki-block";
              node.properties["data-shiki"] = "true";
            },
          },
        ],
      });

      const wrapped = `<div class="code-block-wrapper not-prose">${highlighted}</div>`;
      html = html.replace(fullMatch, wrapped);
    } catch {
      // Unknown language — leave as-is
    }
  }

  return html;
}

function preprocessObsidian(markdown: string): string {
  // Protect code blocks and inline code from all regex replacements below
  const placeholders: string[] = [];
  const protect = (match: string) => {
    const token = `\u0000CODE_PLACEHOLDER_${placeholders.length}\u0000`;
    placeholders.push(match);
    return token;
  };

  // Fenced code blocks (``` or ~~~), then inline `code`
  markdown = markdown.replace(/```[\s\S]*?```/g, protect);
  markdown = markdown.replace(/~~~[\s\S]*?~~~/g, protect);
  markdown = markdown.replace(/`[^`\n]+`/g, protect);

  // 1. Callouts
  markdown = markdown.replace(
    /^> \[!(\w+)\][+-]?\s*(.*?)\n((?:>.*\n?)*)/gm,
    (_, type, title, body) => {
      const calloutType = type.toLowerCase();
      const calloutTitle = title || capitalize(calloutType);
      const bodyContent = body.replace(/^> ?/gm, "").trim();
      return `<div class="callout callout-${calloutType}" data-callout="${calloutType}">
              <div class="callout-title">${calloutTitle}</div>
              <div class="callout-content">\n\n${bodyContent}\n\n</div></div>\n\n`;
    }
  );

  // 2. Wikilinks with alias  [[Page|Alias]]
  markdown = markdown.replace(
    /\[\[([^\]|]+)\|([^\]]+)\]\]/g,
    '<a class="wikilink">$2</a>'
  );

  // 3. Wikilinks without alias  [[Page]]
  markdown = markdown.replace(
    /\[\[([^\]]+)\]\]/g,
    '<a class="wikilink">$1</a>'
  );

  // 4. Image embeds with optional size
  markdown = markdown.replace(
    /!\[\[([^\]]+?\.(png|jpg|jpeg|gif|svg|webp))(?:\|(\d+)(?:x(\d+))?)?\]\]/gi,
    (_, src, _ext, width, height) => {
      const w = width ? ` width="${width}"` : "";
      const h = height ? ` height="${height}"` : "";
      return `<img src="${src}" alt="${src}"${w}${h} class="obsidian-embed">`;
    }
  );

  // 5. Note embeds  ![[Note Name]]
  markdown = markdown.replace(
    /!\[\[([^\]]+)\]\]/g,
    `<div class="note-embed" data-note="$1">
  <span class="note-embed-title">$1</span>
</div>`
  );

  // 6. Highlights  ==text==
  markdown = markdown.replace(/==([^=]+)==/g, "<mark>$1</mark>");

  // 7. Comments  %%...%%
  markdown = markdown.replace(/%%[\s\S]*?%%/g, "");

  // 8. Tags  #tag
  markdown = markdown.replace(
    /(^|\s)#([a-zA-Z][a-zA-Z0-9/_-]*)(?=\s|$)/gm,
    '$1<a class="tag">#$2</a>'
  );

  // 9. Block references
  markdown = markdown.replace(
    / \^([a-zA-Z0-9-]+)$/gm,
    ' <span class="block-ref" id="^$1"></span>'
  );

  // 10. Block reference links
  markdown = markdown.replace(
    /\[\[([^\]]+)#\^([a-zA-Z0-9-]+)\]\]/g,
    '<a class="wikilink block-link">$1 ^$2</a>'
  );

  // 11. Heading anchors
  markdown = markdown.replace(
    /\[\[#([^\]]+)\]\]/g,
    '<a class="wikilink heading-link">$1</a>'
  );

  // in <p>, avoiding invalid <p><div>...</div></p> nesting.
  markdown = markdown.replace(
    /\$\$([\s\S]+?)\$\$/g,
    '\n\n<div class="math math-block">$$$1$$</div>\n\n'
  );

  // 13. Inline math
  markdown = markdown.replace(
    /\$([^\n$]+?)\$/g,
    '<span class="math math-inline">$$$1$$</span>'
  );

  markdown = markdown.replace(
    /\u0000CODE_PLACEHOLDER_(\d+)\u0000/g,
    (_, i) => placeholders[Number(i)]
  );

  return markdown;
}

function postprocessHtml(html: string): string {

  // Promote the <p> immediately before a code-block-wrapper into a header tab.
  html = html.replace(
  /<p>([^<]+)<\/p>\n(<div class="code-block-wrapper[^"]*">)/g,
  (_, title, wrapperOpen) => {
    const header = `<div class="code-block-header">`
      + `<span class="code-block-title">${title.trim()}</span>`
      + `<button class="code-copy-btn" onclick="
          navigator.clipboard.writeText(this.closest('.code-block-wrapper').querySelector('pre code').textContent);
          this.textContent = 'Copied!';
          this.classList.add('copied');
          setTimeout(() => { this.textContent = 'Copy'; this.classList.remove('copied'); }, 1800);
          ">Copy</button>`
      + `</div>`;
    return `${wrapperOpen}${header}`;
  }
);


  // Wrap bare <table> for responsive scrolling
  html = html.replace(/<table>/g, '<div class="table-wrapper"><table>');
  html = html.replace(/<\/table>/g, "</table></div>");

  // Add target="_blank" to external links only
  html = html.replace(
    /<a href="(https?:\/\/[^"]+)"/g,
    '<a href="$1" class="external-link" target="_blank" rel="noopener noreferrer"'
  );

  return html;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}