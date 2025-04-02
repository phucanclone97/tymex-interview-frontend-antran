import React from "react";
import Image from "next/image";
import { IProduct } from "@/types/nft";

interface NFTCardProps {
  product: IProduct;
}

const NFTCard: React.FC<NFTCardProps> = ({ product }) => {
  // Format price to 2 decimal places
  const formattedPrice = product.price.toFixed(2);

  // Get author full name
  const authorName = `${product.author.firstName} ${product.author.lastName}`;

  // Format date
  const createdDate = new Date(product.createdAt).toLocaleDateString();

  // Get the right image path
  const imageSrc = `/api/placeholders?id=${
    product.imageId
  }&bg=${getColorForCategory(product.category)}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
      <div className="relative h-48 w-full">
        <div className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 px-2 py-1 rounded-full">
          <span className="text-white text-xs font-medium">
            {product.category}
          </span>
        </div>
        <div className="absolute top-2 left-2 z-10">
          {product.isFavorite && (
            <div className="bg-red-500 p-1 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-4 h-4"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </div>
          )}
        </div>
        <div className="h-full w-full bg-gray-200 dark:bg-gray-700">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-lg mb-1 truncate dark:text-white">
          {product.title}
        </h3>

        <div className="flex items-center mb-3">
          <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2">
            <Image
              src={product.author.avatar}
              alt={authorName}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {authorName}
          </span>
        </div>

        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Price
            </div>
            <div className="font-bold text-lg dark:text-white">
              {formattedPrice} ETH
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Created
            </div>
            <div className="text-sm dark:text-gray-300">{createdDate}</div>
          </div>
        </div>

        <div className="flex justify-between text-xs mb-3">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
            {product.theme}
          </span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
            {product.tier}
          </span>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

// Helper function to get a color based on category
function getColorForCategory(category: string): string {
  const categoryColors: Record<string, string> = {
    "Upper Body": "4285F4", // blue
    "Lower Body": "34A853", // green
    Hat: "FBBC05", // yellow
    Shoes: "EA4335", // red
    Accessory: "8F44AD", // purple
    Legendary: "D4AF37", // gold
    Mythic: "C0C0C0", // silver
    Epic: "FF5733", // orange
    Rare: "3498DB", // light blue
  };

  return categoryColors[category] || "404040"; // default dark gray
}

export default NFTCard;
