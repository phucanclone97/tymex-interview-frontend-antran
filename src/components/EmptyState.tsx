import React from "react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No results found",
  message = "We couldn't find any NFTs matching your search criteria. Try adjusting your filters or search term.",
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon || (
        <svg
          className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
      <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mb-6 text-gray-500 dark:text-gray-400 max-w-md">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
