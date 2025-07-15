import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { getAllPosts } from "@/utils/mdxParser";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const postsDir = path.join(process.cwd(), "content/posts");
    const posts = getAllPosts(postsDir).map(({ content, ...meta }) => meta);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to load posts" });
  }
}
