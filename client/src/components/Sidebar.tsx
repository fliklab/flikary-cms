import { PostMeta } from "../types/Post";
import { FileText, Plus, Settings, HelpCircle, Search } from "lucide-react";

interface SidebarProps {
  posts: PostMeta[];
  selectedPost?: string;
  onSelectPost: (slug: string) => void;
  onCreatePost: () => void;
  onShowHelp: () => void;
  onShowSearch: () => void;
}

export function Sidebar({
  posts,
  selectedPost,
  onSelectPost,
  onCreatePost,
  onShowHelp,
  onShowSearch,
}: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Flikary CMS</h1>
        <button
          className="create-btn"
          onClick={onCreatePost}
          title="새 포스트 작성"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="sidebar-content">
        <div className="section">
          <h3>포스트 목록</h3>
          <div className="post-list">
            {posts.map((post) => (
              <div
                key={post.slug}
                className={`post-item ${
                  selectedPost === post.slug ? "selected" : ""
                }`}
                onClick={() => onSelectPost(post.slug)}
              >
                <FileText size={14} />
                <div className="post-info">
                  <div className="post-title">{post.title}</div>
                  <div className="post-date">
                    {new Date(post.date).toLocaleDateString("ko-KR")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="search-btn" onClick={onShowSearch} title="검색">
          <Search size={16} />
        </button>
        <button className="help-btn" onClick={onShowHelp} title="도움말">
          <HelpCircle size={16} />
        </button>
        <button className="settings-btn" title="설정">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}
