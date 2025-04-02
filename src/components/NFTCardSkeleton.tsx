import React from "react";

const NFTCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 w-full bg-gray-300 dark:bg-gray-700"></div>

      <div className="p-4">
        {/* Title placeholder */}
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>

        {/* Author row placeholder */}
        <div className="flex items-center mb-4">
          <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 mr-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
        </div>

        {/* Price and Date placeholder */}
        <div className="flex justify-between mb-4">
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>

        {/* Tags placeholder */}
        <div className="flex justify-between mb-4">
          <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
        </div>

        {/* Button placeholder */}
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
      </div>
    </div>
  );
};

export default NFTCardSkeleton;
