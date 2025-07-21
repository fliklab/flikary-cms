import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import CodeBlock from "@tiptap/extension-code-block";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
  FileText,
  Save,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { htmlToMarkdown, markdownToHtml } from "../utils/markdownConverter";

interface RichTextEditorProps {
  initialContent?: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

export function RichTextEditor({
  initialContent = "",
  onSave,
  onCancel,
}: RichTextEditorProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [originalMarkdown, setOriginalMarkdown] = useState(initialContent);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        link: false,
      }),
      Placeholder.configure({
        placeholder: "포스트 내용을 작성하세요...",
      }),
      Highlight,
      CodeBlock.configure({
        HTMLAttributes: {
          class: "code-block",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "link",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "image",
        },
      }),
    ],
    content: markdownToHtml(initialContent),
    onUpdate: ({ editor }) => {
      // HTML을 마크다운으로 변환하여 원본 저장
      const html = editor.getHTML();
      const markdown = htmlToMarkdown(html);
      setOriginalMarkdown(markdown);
    },
  });

  const handleSave = () => {
    if (editor) {
      const html = editor.getHTML();
      const markdown = htmlToMarkdown(html);
      onSave(markdown);
    }
  };

  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleBulletList = () =>
    editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () =>
    editor?.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () =>
    editor?.chain().focus().toggleBlockquote().run();
  const toggleCodeBlock = () => editor?.chain().focus().toggleCodeBlock().run();

  const addLink = () => {
    const url = window.prompt("URL을 입력하세요:");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("이미지 URL을 입력하세요:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  if (!editor) {
    return <div className="loading">에디터 로딩 중...</div>;
  }

  return (
    <div className="rich-text-editor">
      <div className="editor-header">
        <h2>포스트 편집</h2>
        <div className="editor-actions">
          <button
            className="view-btn"
            onClick={() => setShowOriginal(!showOriginal)}
            title={showOriginal ? "리치 에디터 보기" : "원본 마크다운 보기"}
          >
            {showOriginal ? <Eye size={16} /> : <FileText size={16} />}
            {showOriginal ? "에디터" : "원본"}
          </button>
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

      {!showOriginal && (
        <div className="toolbar">
          <button
            className={`toolbar-btn ${editor.isActive("bold") ? "active" : ""}`}
            onClick={toggleBold}
            title="굵게"
          >
            <Bold size={16} />
          </button>
          <button
            className={`toolbar-btn ${
              editor.isActive("italic") ? "active" : ""
            }`}
            onClick={toggleItalic}
            title="기울임"
          >
            <Italic size={16} />
          </button>
          <div className="toolbar-separator" />
          <button
            className={`toolbar-btn ${
              editor.isActive("bulletList") ? "active" : ""
            }`}
            onClick={toggleBulletList}
            title="글머리 기호 목록"
          >
            <List size={16} />
          </button>
          <button
            className={`toolbar-btn ${
              editor.isActive("orderedList") ? "active" : ""
            }`}
            onClick={toggleOrderedList}
            title="번호 매기기 목록"
          >
            <ListOrdered size={16} />
          </button>
          <div className="toolbar-separator" />
          <button
            className={`toolbar-btn ${
              editor.isActive("blockquote") ? "active" : ""
            }`}
            onClick={toggleBlockquote}
            title="인용구"
          >
            <Quote size={16} />
          </button>
          <button
            className={`toolbar-btn ${
              editor.isActive("codeBlock") ? "active" : ""
            }`}
            onClick={toggleCodeBlock}
            title="코드 블록"
          >
            <Code size={16} />
          </button>
          <div className="toolbar-separator" />
          <button className="toolbar-btn" onClick={addLink} title="링크 추가">
            <LinkIcon size={16} />
          </button>
          <button
            className="toolbar-btn"
            onClick={addImage}
            title="이미지 추가"
          >
            <ImageIcon size={16} />
          </button>
        </div>
      )}

      <div className="editor-content">
        {showOriginal ? (
          <div className="markdown-view">
            <div className="markdown-header">
              <h3>원본 마크다운</h3>
              <button
                className="sync-btn"
                onClick={() => {
                  if (editor) {
                    const html = markdownToHtml(originalMarkdown);
                    editor.commands.setContent(html);
                  }
                }}
                title="에디터에 반영"
              >
                동기화
              </button>
            </div>
            <textarea
              value={originalMarkdown}
              onChange={(e) => setOriginalMarkdown(e.target.value)}
              className="markdown-textarea"
              placeholder="마크다운을 직접 편집하세요..."
            />
          </div>
        ) : (
          <EditorContent editor={editor} className="editor-content-area" />
        )}
      </div>
    </div>
  );
}
