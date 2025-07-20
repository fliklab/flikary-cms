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
}

export async function mdxToHtml(
  mdxContent: string,
  options: HtmlTransformOptions = {}
): Promise<string> {
  const {
    includeStyles = true,
    includeMetadata = false,
    highlightTheme = "github",
  } = options;

  try {
    // 간단한 Markdown → HTML 변환
    let html = simpleMarkdownToHtml(mdxContent);

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
    console.error("MDX to HTML conversion failed:", error);
    throw new Error("Failed to convert MDX to HTML");
  }
}

function simpleMarkdownToHtml(markdown: string): string {
  // 간단한 Markdown → HTML 변환
  let html = markdown
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
