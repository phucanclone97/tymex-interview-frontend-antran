import React from "react";
import Spinner from "./Spinner";

interface LoadingOverlayProps {
  isLoading: boolean;
  children?: React.ReactNode;
  transparent?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  transparent = false,
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div
        className={`absolute inset-0 flex items-center justify-center z-50 ${
          transparent ? "bg-gray-900/40" : "bg-gray-900/80"
        }`}
      >
        <div className="text-center">
          <Spinner size="lg" color="white" />
          <p className="mt-2 text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
