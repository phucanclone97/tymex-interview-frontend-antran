import React from "react";

const NFTCardSkeleton: React.FC = () => {
  // Generate a random background color for the skeleton
  const randomColor = getRandomColor();

  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg animate-pulse">
      {/* Category badge placeholder */}
      <div className="absolute top-2 left-2 z-20 px-3 py-1 rounded-md bg-gray-700/50 w-20 h-6"></div>

      {/* Favorite button placeholder */}
      <div className="absolute top-2 right-2 z-20 p-1 rounded-full bg-gray-700/50 w-7 h-7"></div>

      {/* Image placeholder with colorful background */}
      <div
        className="relative h-60 w-full"
        style={{ backgroundColor: randomColor }}
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

// Helper function to get a random color for the skeleton
function getRandomColor(): string {
  const colors = [
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

  return colors[Math.floor(Math.random() * colors.length)];
}

export default NFTCardSkeleton;
