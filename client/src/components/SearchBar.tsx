import { useState, useDeferredValue, useMemo } from "react";
import { Search, X } from "lucide-react";
import { PostMeta } from "../types/Post";

interface SearchBarProps {
  posts: PostMeta[];
  onSelectPost: (slug: string) => void;
  onClose: () => void;
}

export function SearchBar({ posts, onSelectPost, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredPosts = useMemo(() => {
    if (!deferredQuery.trim()) return [];

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(deferredQuery.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(deferredQuery.toLowerCase())
        )
    );
  }, [posts, deferredQuery]);

  const isStale = query !== deferredQuery;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-header">
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              placeholder="포스트 검색..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
              autoFocus
            />
            {query && (
              <button className="clear-btn" onClick={() => setQuery("")}>
                <X size={16} />
              </button>
            )}
          </div>
          <button className="close-search-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="search-results">
          {isStale && (
            <div className="search-loading">
              <div className="loading-spinner">
                <div className="animate-spin" />
              </div>
            </div>
          )}

          {filteredPosts.length > 0 ? (
            <div className="search-list">
              {filteredPosts.map((post) => (
                <div
                  key={post.slug}
                  className="search-item"
                  onClick={() => {
                    onSelectPost(post.slug);
                    onClose();
                  }}
                >
                  <div className="search-item-title">{post.title}</div>
                  <div className="search-item-date">
                    {new Date(post.date).toLocaleDateString("ko-KR")}
                  </div>
                  {post.tags.length > 0 && (
                    <div className="search-item-tags">
                      {post.tags.map((tag) => (
                        <span key={tag} className="search-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : query && !isStale ? (
            <div className="no-results">
              <p>검색 결과가 없습니다.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
