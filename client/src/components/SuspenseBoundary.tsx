import { Suspense, ReactNode } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface SuspenseBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function SuspenseBoundary({
  children,
  fallback = <LoadingSpinner size={24} />,
}: SuspenseBoundaryProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
