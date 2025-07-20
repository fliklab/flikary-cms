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

  const filePath = path.join(process.cwd(), "content/posts", `${slug}.mdx`);
  console.log("HTML File path:", filePath);
  console.log("HTML File exists:", fs.existsSync(filePath));

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Post not found" });
  }

  try {
    const post = parseMdxFile(filePath);

    // 쿼리 파라미터로 옵션 처리
    const includeStyles = req.query.styles !== "false";
    const includeMetadata = req.query.metadata === "true";
    const highlightTheme = (req.query.theme as string) || "github";

    // MDX를 HTML로 변환
    const html = await mdxToHtml(post.content, {
      includeStyles,
      includeMetadata,
      highlightTheme,
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
