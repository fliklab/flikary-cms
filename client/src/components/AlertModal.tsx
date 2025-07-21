import { AlertCircle, X } from "lucide-react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "info" | "warning" | "error";
  confirmText?: string;
  onConfirm?: () => void;
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "확인",
  onConfirm,
}: AlertModalProps) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "warning":
        return {
          iconColor: "#f59e0b",
          bgColor: "#fef3c7",
          borderColor: "#f59e0b",
        };
      case "error":
        return {
          iconColor: "#ef4444",
          bgColor: "#fef2f2",
          borderColor: "#ef4444",
        };
      default:
        return {
          iconColor: "#3b82f6",
          bgColor: "#eff6ff",
          borderColor: "#3b82f6",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="alert-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: styles.bgColor,
          borderColor: styles.borderColor,
        }}
      >
        <div className="modal-header">
          <div className="modal-title">
            <AlertCircle size={20} style={{ color: styles.iconColor }} />
            <h3>{title}</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-content">
          <p>{message}</p>
        </div>

        <div className="modal-footer">
          <button className="confirm-btn" onClick={onConfirm || onClose}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
