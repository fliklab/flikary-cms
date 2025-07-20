import { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import { getAllPosts } from "../../src/utils/mdxParser.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const postsDir = path.join(process.cwd(), "content/posts");
    const posts = getAllPosts(postsDir).map(({ content, ...meta }) => meta);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to load posts" });
  }
}
