import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post } from "@/types/Post";

export function parseMdxFile(filePath: string): Post {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug: path.basename(filePath, ".mdx"),
    title: data.title || "",
    date: data.date || "",
    tags: data.tags || [],
    content,
  };
}

export function getAllPosts(dir: string): Post[] {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  return files.map((f) => parseMdxFile(path.join(dir, f)));
}
