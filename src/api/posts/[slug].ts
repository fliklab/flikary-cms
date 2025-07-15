import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import { parseMdxFile } from "@/utils/mdxParser";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  if (typeof slug !== "string") {
    return res.status(400).json({ error: "Invalid slug" });
  }
  const filePath = path.join(process.cwd(), "content/posts", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Post not found" });
  }
  try {
    const post = parseMdxFile(filePath);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to load post" });
  }
}
