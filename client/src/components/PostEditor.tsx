import { useState } from "react";
import { Save, X } from "lucide-react";

interface PostEditorProps {
  initialContent?: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

export function PostEditor({
  initialContent = "",
  onSave,
  onCancel,
}: PostEditorProps) {
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    onSave(content);
  };

  return (
    <div className="post-editor">
      <div className="editor-header">
        <h2>포스트 편집</h2>
        <div className="editor-actions">
          <button className="save-btn" onClick={handleSave}>
            <Save size={16} />
            저장
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            <X size={16} />
            취소
          </button>
        </div>
      </div>

      <div className="editor-content">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="포스트 내용을 작성하세요..."
          className="content-textarea"
        />
      </div>
    </div>
  );
}
