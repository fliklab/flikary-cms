import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({
  size = 20,
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div className={`loading-spinner ${className}`}>
      <Loader2 size={size} className="animate-spin" />
    </div>
  );
}
