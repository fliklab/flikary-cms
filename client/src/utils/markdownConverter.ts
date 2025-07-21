// TipTap 에디터의 HTML을 마크다운으로 변환하는 유틸리티
export function htmlToMarkdown(html: string): string {
  // 간단한 HTML to Markdown 변환
  let markdown = html
    // 제목
    .replace(/<h1[^>]*>(.*?)<\/h1>/g, "# $1\n")
    .replace(/<h2[^>]*>(.*?)<\/h2>/g, "## $1\n")
    .replace(/<h3[^>]*>(.*?)<\/h3>/g, "### $1\n")
    .replace(/<h4[^>]*>(.*?)<\/h4>/g, "#### $1\n")
    .replace(/<h5[^>]*>(.*?)<\/h5>/g, "##### $1\n")
    .replace(/<h6[^>]*>(.*?)<\/h6>/g, "###### $1\n")

    // 굵게
    .replace(/<strong[^>]*>(.*?)<\/strong>/g, "**$1**")
    .replace(/<b[^>]*>(.*?)<\/b>/g, "**$1**")

    // 기울임
    .replace(/<em[^>]*>(.*?)<\/em>/g, "*$1*")
    .replace(/<i[^>]*>(.*?)<\/i>/g, "*$1*")

    // 코드
    .replace(/<code[^>]*>(.*?)<\/code>/g, "`$1`")

    // 코드 블록
    .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gs, "```\n$1\n```")

    // 링크
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g, "[$2]($1)")

    // 이미지
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/g, "![$2]($1)")
    .replace(/<img[^>]*src="([^"]*)"[^>]*>/g, "![]($1)")

    // 인용구
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gs, "> $1\n")

    // 목록
    .replace(/<ul[^>]*>(.*?)<\/ul>/gs, (match, content) => {
      return content.replace(/<li[^>]*>(.*?)<\/li>/g, "- $1");
    })
    .replace(/<ol[^>]*>(.*?)<\/ol>/gs, (match, content) => {
      let index = 1;
      return content.replace(/<li[^>]*>(.*?)<\/li>/g, () => `${index++}. $1`);
    })

    // 단락
    .replace(/<p[^>]*>(.*?)<\/p>/g, "$1\n\n")

    // 줄바꿈
    .replace(/<br[^>]*>/g, "\n")

    // HTML 태그 제거
    .replace(/<[^>]*>/g, "")

    // HTML 엔티티 디코딩
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")

    // 연속된 줄바꿈 정리
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\n{2,}$/g, "\n")
    .trim();

  return markdown;
}

export function markdownToHtml(markdown: string): string {
  // 간단한 Markdown to HTML 변환
  let html = markdown
    // 제목
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^#### (.*$)/gm, "<h4>$1</h4>")
    .replace(/^##### (.*$)/gm, "<h5>$1</h5>")
    .replace(/^###### (.*$)/gm, "<h6>$1</h6>")

    // 굵게
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // 기울임
    .replace(/\*(.*?)\*/g, "<em>$1</em>")

    // 인라인 코드
    .replace(/`(.*?)`/g, "<code>$1</code>")

    // 코드 블록
    .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")

    // 링크
    .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2">$1</a>')

    // 이미지
    .replace(/!\[([^\]]*)\]\(([^)]*)\)/g, '<img src="$2" alt="$1">')

    // 인용구
    .replace(/^> (.*$)/gm, "<blockquote>$1</blockquote>");

  // 목록 처리 개선
  const lines = html.split("\n");
  const processedLines = [];
  let inList = false;
  let listItems = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 불렛 포인트 시작
    if (line.match(/^- (.+)/)) {
      if (!inList) {
        inList = true;
        listItems = [];
      }
      listItems.push(`<li>${line.replace(/^- (.+)/, "$1")}</li>`);
    }
    // 번호 목록 시작
    else if (line.match(/^\d+\. (.+)/)) {
      if (!inList) {
        inList = true;
        listItems = [];
      }
      listItems.push(`<li>${line.replace(/^\d+\. (.+)/, "$1")}</li>`);
    }
    // 목록이 끝났을 때
    else if (inList && line.trim() === "") {
      if (listItems.length > 0) {
        processedLines.push(`<ul>${listItems.join("")}</ul>`);
        listItems = [];
        inList = false;
      }
    }
    // 일반 텍스트
    else {
      if (inList && listItems.length > 0) {
        processedLines.push(`<ul>${listItems.join("")}</ul>`);
        listItems = [];
        inList = false;
      }
      if (line.trim() !== "") {
        processedLines.push(`<p>${line}</p>`);
      }
    }
  }

  // 마지막 목록 처리
  if (inList && listItems.length > 0) {
    processedLines.push(`<ul>${listItems.join("")}</ul>`);
  }

  html = processedLines.join("\n");

  // HTML 태그 정리
  html = html
    .replace(/<p><\/p>/g, "")
    .replace(/<p>(<h[1-6]>.*?<\/h[1-6]>)<\/p>/g, "$1")
    .replace(/<p>(<blockquote>.*?<\/blockquote>)<\/p>/g, "$1")
    .replace(/<p>(<ul>.*?<\/ul>)<\/p>/g, "$1")
    .replace(/<p>(<pre>.*?<\/pre>)<\/p>/g, "$1");

  return html;
}
