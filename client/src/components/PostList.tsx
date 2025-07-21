import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPosts } from "../utils/api";

interface Post {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  [key: string]: any;
}

interface PostListProps {
  onPostSelect?: (post: Post) => void;
}

export default function PostList({ onPostSelect }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postData, setPostData] = useState<any>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postsData = await fetchPosts();
        setPosts(postsData);
      } catch (err) {
        setError("포스트 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handlePostClick = async (post: Post) => {
    setSelectedPost(post);
    onPostSelect?.(post);

    try {
      const response = await fetch(`/api/posts/${post.slug}`);
      const data = await response.json();
      setPostData(data);
    } catch (err) {
      setError("포스트 데이터를 불러오는데 실패했습니다.");
    }
  };

  const formatJSON = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">포스트 목록</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">포스트 목록</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">포스트 목록</h2>

      {/* 포스트 목록 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">포스트 목록 (JSON)</h3>
        <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap">
            {formatJSON(posts)}
          </pre>
        </div>
      </div>

      {/* 포스트 링크들 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">포스트 링크</h3>
        <div className="grid gap-2">
          {posts.map((post) => (
            <button
              key={post.slug}
              onClick={() => handlePostClick(post)}
              className="text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <div className="font-medium text-blue-900">{post.title}</div>
              <div className="text-sm text-blue-700">{post.slug}</div>
              {post.date && (
                <div className="text-xs text-blue-600">{post.date}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 선택된 포스트 데이터 */}
      {selectedPost && postData && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">
            선택된 포스트: {selectedPost.title}
          </h3>
          <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
              {formatJSON(postData)}
            </pre>
          </div>
        </div>
      )}

      {/* API 엔드포인트 정보 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-yellow-800">
          API 엔드포인트
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <strong>포스트 목록:</strong>{" "}
            <code className="bg-yellow-100 px-2 py-1 rounded">
              GET /api/posts
            </code>
          </div>
          <div>
            <strong>개별 포스트:</strong>{" "}
            <code className="bg-yellow-100 px-2 py-1 rounded">
              GET /api/posts/[slug]
            </code>
          </div>
          <div>
            <strong>HTML 형식:</strong>{" "}
            <code className="bg-yellow-100 px-2 py-1 rounded">
              GET /api/posts/[slug]?format=html
            </code>
          </div>
          <div>
            <strong>원본 형식:</strong>{" "}
            <code className="bg-yellow-100 px-2 py-1 rounded">
              GET /api/posts/[slug]?format=raw
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
