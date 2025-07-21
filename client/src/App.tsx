import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { PostViewer } from "./components/PostViewer";
import { PostEditor } from "./components/PostEditor";
import { HelpPage } from "./components/HelpPage";
import { AlertModal } from "./components/AlertModal";
import { usePosts, usePost } from "./hooks/usePosts";
import "./App.css";

function App() {
  const { posts, loading: postsLoading, error: postsError } = usePosts();
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "info" | "warning" | "error";
    confirmText?: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const {
    post,
    loading: postLoading,
    error: postError,
  } = usePost(selectedPost || "");

  const handleSelectPost = (slug: string) => {
    setSelectedPost(slug);
    setIsEditing(false);
  };

  const handleCreatePost = () => {
    setAlertModal({
      isOpen: true,
      title: "새 글 생성",
      message:
        "새 글 생성 기능은 현재 개발 중입니다. GitHub API를 통한 커밋 기능이 추가될 예정입니다.",
      type: "info",
    });
  };

  const handleDeletePost = () => {
    setAlertModal({
      isOpen: true,
      title: "포스트 삭제",
      message:
        "정말로 이 포스트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      type: "warning",
      confirmText: "삭제",
      onConfirm: () => {
        // TODO: 실제 삭제 로직
        console.log("포스트 삭제");
        handleCloseAlertModal();
      },
    });
  };

  const handleEditPost = () => {
    setIsEditing(true);
  };

  const handleSavePost = (content: string) => {
    setAlertModal({
      isOpen: true,
      title: "포스트 저장",
      message:
        "포스트 저장 기능은 현재 개발 중입니다. GitHub API를 통한 커밋 기능이 추가될 예정입니다.",
      type: "info",
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleShowHelp = () => {
    setShowHelp(true);
  };

  const handleCloseAlertModal = () => {
    setAlertModal((prev) => ({ ...prev, isOpen: false }));
  };

  if (postsLoading) {
    return (
      <div className="app">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="app">
        <div className="error">에러: {postsError}</div>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar
        posts={posts}
        selectedPost={selectedPost || undefined}
        onSelectPost={handleSelectPost}
        onCreatePost={handleCreatePost}
        onShowHelp={handleShowHelp}
      />

      <div className="main-content">
        {showHelp ? (
          <HelpPage onBack={() => setShowHelp(false)} />
        ) : selectedPost ? (
          postLoading ? (
            <div className="loading">포스트 로딩 중...</div>
          ) : postError ? (
            <div className="error">포스트 에러: {postError}</div>
          ) : post ? (
            isEditing ? (
              <PostEditor
                initialContent={post.content}
                onSave={handleSavePost}
                onCancel={handleCancelEdit}
              />
            ) : (
              <PostViewer
                post={post}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            )
          ) : (
            <div className="no-post">포스트를 선택해주세요.</div>
          )
        ) : (
          <div className="welcome">
            <h1>Flikary CMS에 오신 것을 환영합니다</h1>
            <p>왼쪽에서 포스트를 선택하거나 새 포스트를 작성하세요.</p>
            <button
              className="help-link"
              onClick={handleShowHelp}
              style={{
                marginTop: "20px",
                padding: "8px 16px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              도움말 보기
            </button>
          </div>
        )}
      </div>

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={handleCloseAlertModal}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        confirmText={alertModal.confirmText}
        onConfirm={alertModal.onConfirm}
      />
    </div>
  );
}

export default App;
