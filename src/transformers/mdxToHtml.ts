import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import remarkParse from "remark-parse";

export interface HtmlTransformOptions {
  includeStyles?: boolean;
  includeMetadata?: boolean;
  highlightTheme?: string;
  isMdx?: boolean; // MDX 파일인지 MD 파일인지 구분
  clientComponents?: string[]; // 클라이언트에서 처리할 컴포넌트 목록
}

export async function mdxToHtml(
  content: string,
  options: HtmlTransformOptions = {}
): Promise<string> {
  const {
    includeStyles = true,
    includeMetadata = false,
    highlightTheme = "github",
    isMdx = true, // 기본값은 MDX로 설정
    clientComponents = [],
  } = options;

  try {
    let html: string;

    if (isMdx) {
      // MDX 파일인 경우: MDX 컴파일러 사용
      html = await processMdxContent(content, clientComponents);
    } else {
      // MD 파일인 경우: 일반 Markdown 처리
      html = await processMarkdownContent(content);
    }

    // 스타일 포함 옵션
    if (includeStyles) {
      html = addStyles(html, highlightTheme);
    }

    // 메타데이터 포함 옵션
    if (includeMetadata) {
      html = addMetadata(html);
    }

    return html;
  } catch (error) {
    console.error("Content to HTML conversion failed:", error);
    // 에러 발생 시 fallback으로 간단한 변환 사용
    return fallbackConversion(
      content,
      includeStyles,
      includeMetadata,
      highlightTheme
    );
  }
}

async function processMdxContent(
  mdxContent: string,
  clientComponents: string[] = []
): Promise<string> {
  try {
    // 클라이언트 컴포넌트를 위한 커스텀 처리
    let processedContent = mdxContent;

    // 클라이언트 컴포넌트를 주석으로 변환 (클라이언트에서 처리하도록)
    clientComponents.forEach((componentName) => {
      const regex = new RegExp(
        `<${componentName}[^>]*>([\\s\\S]*?)</${componentName}>`,
        "g"
      );
      processedContent = processedContent.replace(regex, (match, content) => {
        return `<!-- CLIENT_COMPONENT:${componentName} -->\n${content}\n<!-- /CLIENT_COMPONENT:${componentName} -->`;
      });
    });

    // MDX를 HTML로 컴파일 (개발 모드로 설정)
    const compiledMdx = await compile(processedContent, {
      development: false, // 프로덕션 모드로 설정
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [rehypeHighlight, rehypeKatex, rehypeStringify],
    });

    // 컴파일된 결과를 문자열로 변환
    const html = String(compiledMdx);
    return html;
  } catch (error) {
    console.error("MDX compilation failed:", error);
    throw error;
  }
}

async function processMarkdownContent(
  markdownContent: string
): Promise<string> {
  try {
    // 일반 Markdown을 HTML로 변환
    const result = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(rehypeHighlight)
      .use(rehypeKatex)
      .use(rehypeStringify)
      .process(markdownContent);

    return String(result);
  } catch (error) {
    console.error("Markdown processing failed:", error);
    throw error;
  }
}

function fallbackConversion(
  content: string,
  includeStyles: boolean,
  includeMetadata: boolean,
  highlightTheme: string
): string {
  console.warn("Using fallback conversion");

  // 간단한 Markdown → HTML 변환 (fallback)
  let html = content
    // 제목
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    // 굵은 글씨
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // 기울임 글씨
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // 코드 블록
    .replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      '<pre><code class="language-$1">$2</code></pre>'
    )
    // 인라인 코드
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // 링크
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // 줄바꿈
    .replace(/\n/g, "<br>\n");

  if (includeStyles) {
    html = addStyles(html, highlightTheme);
  }

  if (includeMetadata) {
    html = addMetadata(html);
  }

  return html;
}

function addStyles(html: string, theme: string): string {
  const styles = `
    <style>
      /* 기본 스타일 */
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      
      /* 제목 스타일 */
      h1, h2, h3, h4, h5, h6 {
        margin-top: 2em;
        margin-bottom: 1em;
        font-weight: 600;
      }
      
      h1 { font-size: 2em; }
      h2 { font-size: 1.5em; }
      h3 { font-size: 1.25em; }
      
      /* 코드 블록 스타일 */
      pre {
        background-color: #f6f8fa;
        border-radius: 6px;
        padding: 16px;
        overflow-x: auto;
        margin: 1em 0;
      }
      
      code {
        background-color: #f6f8fa;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      }
      
      pre code {
        background-color: transparent;
        padding: 0;
      }
      
      /* 링크 스타일 */
      a {
        color: #0366d6;
        text-decoration: none;
      }
      
      a:hover {
        text-decoration: underline;
      }
      
      /* 테이블 스타일 */
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
      }
      
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      
      th {
        background-color: #f6f8fa;
        font-weight: 600;
      }
      
      /* 인용구 스타일 */
      blockquote {
        border-left: 4px solid #ddd;
        margin: 1em 0;
        padding-left: 1em;
        color: #666;
      }
      
      /* 목록 스타일 */
      ul, ol {
        margin: 1em 0;
        padding-left: 2em;
      }
      
      li {
        margin: 0.5em 0;
      }
      
      /* 클라이언트 컴포넌트 스타일 */
      .client-component {
        border: 2px dashed #ccc;
        padding: 1rem;
        margin: 1rem 0;
        background: #f9f9f9;
      }
      
      .client-component::before {
        content: "🔧 클라이언트 컴포넌트";
        display: block;
        font-size: 0.8em;
        color: #666;
        margin-bottom: 0.5rem;
      }
    </style>
  `;

  return `<html><head>${styles}</head><body>${html}</body></html>`;
}

function addMetadata(html: string): string {
  const metadata = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="generator" content="Flikary CMS">
  `;

  return html.replace("<head>", `<head>${metadata}`);
}

export function createHtmlResponse(
  html: string,
  options: HtmlTransformOptions = {}
): string {
  const { includeStyles = true, includeMetadata = false } = options;

  if (includeStyles || includeMetadata) {
    return html;
  } else {
    // 스타일과 메타데이터를 제외하고 본문만 반환
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
    return bodyMatch ? bodyMatch[1] : html;
  }
}
