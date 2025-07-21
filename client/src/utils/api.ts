import { Post, PostMeta } from "../types/Post";

const API_BASE = "/api";

// 포스트 목록 조회 함수
export const fetchPosts = async (): Promise<PostMeta[]> => {
  const response = await fetch(`${API_BASE}/posts`);
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
};

export const api = {
  // 포스트 목록 조회
  async getPosts(): Promise<PostMeta[]> {
    const response = await fetch(`${API_BASE}/posts`);
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    return response.json();
  },

  // 특정 포스트 조회
  async getPost(slug: string): Promise<Post> {
    const response = await fetch(`${API_BASE}/posts/${slug}`);
    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }
    return response.json();
  },

  // 포스트 HTML 조회
  async getPostHtml(
    slug: string,
    options?: {
      components?: string[];
      styles?: boolean;
      metadata?: boolean;
      theme?: string;
    }
  ): Promise<string> {
    const params = new URLSearchParams();
    if (options?.components) {
      params.append("components", options.components.join(","));
    }
    if (options?.styles !== undefined) {
      params.append("styles", options.styles.toString());
    }
    if (options?.metadata !== undefined) {
      params.append("metadata", options.metadata.toString());
    }
    if (options?.theme) {
      params.append("theme", options.theme);
    }

    const response = await fetch(`${API_BASE}/posts/${slug}/html?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch post HTML");
    }
    return response.text();
  },

  // 포스트 원본 조회
  async getPostRaw(slug: string): Promise<string> {
    const response = await fetch(`${API_BASE}/posts/${slug}/raw`);
    if (!response.ok) {
      throw new Error("Failed to fetch post raw content");
    }
    return response.text();
  },
};
