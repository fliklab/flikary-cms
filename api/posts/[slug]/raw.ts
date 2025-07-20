import { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import fs from "fs";

export default function handler(req: VercelRequest, res: VercelResponse) {
  // URL에서 slug를 직접 파싱
  const urlParts = req.url?.split("/");
  const slug = urlParts?.[urlParts.length - 2]; // /raw 앞의 부분이 slug

  console.log("Raw Request - Slug from URL:", slug);

  if (!slug || typeof slug !== "string") {
    console.log("Invalid slug for raw:", slug);
    return res.status(400).json({ error: "Invalid slug" });
  }

  const filePath = path.join(process.cwd(), "content/posts", `${slug}.mdx`);
  console.log("Raw File path:", filePath);
  console.log("Raw File exists:", fs.existsSync(filePath));

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Post not found" });
  }

  try {
    // 원본 MDX 파일 내용 읽기
    const rawContent = fs.readFileSync(filePath, "utf-8");

    // MDX 응답 헤더 설정
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600"); // 1시간 캐시

    res.status(200).send(rawContent);
  } catch (error) {
    console.error("Error reading raw MDX file:", error);
    res.status(500).json({ error: "Failed to read post content" });
  }
}
