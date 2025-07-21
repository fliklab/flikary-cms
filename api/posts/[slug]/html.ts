import { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import fs from "fs";
import { parseMdxFile } from "../../../src/utils/mdxParser.js";
import {
  mdxToHtml,
  createHtmlResponse,
} from "../../../src/transformers/mdxToHtml.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // URL에서 slug를 직접 파싱
  const urlParts = req.url?.split("/");
  const slug = urlParts?.[urlParts.length - 2]; // /html 앞의 부분이 slug

  console.log("HTML Request - Slug from URL:", slug);

  if (!slug || typeof slug !== "string") {
    console.log("Invalid slug for HTML:", slug);
    return res.status(400).json({ error: "Invalid slug" });
  }

  // MDX와 MD 파일 모두 확인
  const mdxPath = path.join(process.cwd(), "content/posts", `${slug}.mdx`);
  const mdPath = path.join(process.cwd(), "content/posts", `${slug}.md`);

  let filePath: string;
  if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    filePath = mdPath;
  } else {
    return res.status(404).json({ error: "Post not found" });
  }

  console.log("HTML File path:", filePath);
  console.log("HTML File exists:", fs.existsSync(filePath));

  try {
    const post = parseMdxFile(filePath);

    // 쿼리 파라미터로 옵션 처리
    const includeStyles = req.query.styles !== "false";
    const includeMetadata = req.query.metadata === "true";
    const highlightTheme = (req.query.theme as string) || "github";

    // MDX/MD를 HTML로 변환
    const isMdx = filePath.endsWith(".mdx");
    // 클라이언트 컴포넌트 목록
    const clientComponents = req.query.components
      ? (req.query.components as string).split(",")
      : ["Alert", "CodeBlock", "Button", "Card"];

    const html = await mdxToHtml(post.content, {
      includeStyles,
      includeMetadata,
      highlightTheme,
      isMdx,
      clientComponents,
    });

    // 응답 형식 결정
    const finalHtml = createHtmlResponse(html, {
      includeStyles,
      includeMetadata,
    });

    // HTML 응답 헤더 설정
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600"); // 1시간 캐시

    res.status(200).send(finalHtml);
  } catch (error) {
    console.error("Error converting MDX to HTML:", error);
    res.status(500).json({ error: "Failed to convert post to HTML" });
  }
}
