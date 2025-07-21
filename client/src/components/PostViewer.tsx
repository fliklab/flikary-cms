import { Post } from "../types/Post";
import { Eye, Edit, Download, Trash2 } from "lucide-react";

interface PostViewerProps {
  post: Post;
  onEdit: () => void;
  onDelete: () => void;
}

export function PostViewer({ post, onEdit, onDelete }: PostViewerProps) {
  return (
    <div className="post-viewer">
      <div className="post-header">
        <div className="post-meta">
          <h1>{post.title}</h1>
          <div className="post-info">
            <span className="date">
              {new Date(post.date).toLocaleDateString("ko-KR")}
            </span>
            {post.tags.length > 0 && (
              <div className="tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="post-actions">
          <button className="action-btn" onClick={onEdit} title="편집">
            <Edit size={16} />
          </button>
          <button className="action-btn" title="미리보기">
            <Eye size={16} />
          </button>
          <button className="action-btn" title="다운로드">
            <Download size={16} />
          </button>
          <button
            className="action-btn delete-btn"
            onClick={onDelete}
            title="삭제"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="post-content">
        {post.content ? (
          <div className="content-preview">
            <pre>{post.content}</pre>
          </div>
        ) : (
          <div className="no-content">
            <p>콘텐츠가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
