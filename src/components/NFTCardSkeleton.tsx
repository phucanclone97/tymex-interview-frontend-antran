import React, { useState, useEffect } from "react";

// Predefined colors that will be used for skeletons
const SKELETON_COLORS = [
  "#6B46C1", // purple
  "#3182CE", // blue
  "#DD6B20", // orange
  "#E53E3E", // red
  "#38A169", // green
  "#F6AD55", // light orange
  "#F687B3", // pink
  "#9F7AEA", // lavender
  "#4299E1", // light blue
];

const NFTCardSkeleton: React.FC<{ index?: number }> = ({ index = 0 }) => {
  // Use a deterministic color based on the index prop for server rendering
  const [bgColor, setBgColor] = useState(
    SKELETON_COLORS[index % SKELETON_COLORS.length]
  );

  // Move random color generation to client-side only if no index was provided
  useEffect(() => {
    if (index === 0) {
      // Generate random color only on the client after hydration
      const randomIndex = Math.floor(Math.random() * SKELETON_COLORS.length);
      setBgColor(SKELETON_COLORS[randomIndex]);
    }
  }, [index]);

  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg animate-pulse">
      {/* Category badge placeholder */}
      <div className="absolute top-2 left-2 z-20 px-3 py-1 rounded-md bg-gray-700/50 w-20 h-6"></div>

      {/* Favorite button placeholder */}
      <div className="absolute top-2 right-2 z-20 p-1 rounded-full bg-gray-700/50 w-7 h-7"></div>

      {/* Image placeholder with colorful background */}
      <div
        className="relative h-60 w-full"
        style={{ backgroundColor: bgColor }}
      >
        <div className="absolute inset-0 bg-gray-800/20"></div>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-br from-gray-900/90 to-black p-4">
        <div className="flex justify-between items-start">
          {/* Title placeholder */}
          <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-3"></div>

          {/* Price placeholder */}
          <div className="h-6 bg-gray-700/50 rounded w-16"></div>
        </div>

        {/* Author placeholder */}
        <div className="flex items-center mt-3">
          <div className="w-6 h-6 rounded-full bg-gray-700/50 mr-2"></div>
          <div className="h-4 bg-gray-700/50 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default NFTCardSkeleton;
