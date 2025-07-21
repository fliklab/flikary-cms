import { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import fs from "fs";
import { parseMdxFile } from "../../src/utils/mdxParser.js";
import {
  mdxToHtml,
  createHtmlResponse,
} from "../../src/transformers/mdxToHtml.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // URL에서 slug를 직접 파싱 (쿼리 파라미터 제외)
  const urlParts = req.url?.split("/");
  let slug = urlParts?.[urlParts.length - 1];

  // 쿼리 파라미터가 있으면 제거
  if (slug && slug.includes("?")) {
    slug = slug.split("?")[0];
  }

  console.log("Request query:", req.query);
  console.log("Request url:", req.url);
  console.log("Slug from URL:", slug);

  if (!slug || typeof slug !== "string") {
    console.log("Invalid slug:", slug);
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

  console.log("File path:", filePath);
  console.log("File exists:", fs.existsSync(filePath));

  try {
    const format = (req.query.format as string) || "json";
    console.log("Requested format:", format);

    switch (format) {
      case "html":
        // HTML 형식으로 응답
        console.log("Serving HTML content");
        const post = parseMdxFile(filePath);
        const includeStyles = req.query.styles !== "false";
        const includeMetadata = req.query.metadata === "true";
        const highlightTheme = (req.query.theme as string) || "github";
        const isMdx = filePath.endsWith(".mdx");

        // 클라이언트 컴포넌트 목록 (쿼리 파라미터에서 받을 수 있음)
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

        const finalHtml = createHtmlResponse(html, {
          includeStyles,
          includeMetadata,
        });

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=3600");
        res.status(200).send(finalHtml);
        break;

      case "raw":
        // 원본 MDX 형식으로 응답
        console.log("Serving raw MDX content");
        const rawContent = fs.readFileSync(filePath, "utf-8");
        res.setHeader("Content-Type", "text/markdown; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=3600");
        res.status(200).send(rawContent);
        break;

      case "json":
      default:
        // JSON 형식으로 응답 (기본)
        console.log("Serving JSON content");
        const jsonPost = parseMdxFile(filePath);
        res.status(200).json(jsonPost);
        break;
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Failed to load post" });
  }
}
