import React, { useState, useMemo } from "react";
import Image from "next/image";
import { IProduct } from "@/types/nft";

interface NFTCardProps {
  product: IProduct;
}

const NFTCard: React.FC<NFTCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(product.isFavorite);
  // Use a consistent date format for initial server rendering
  // const [formattedDate, setFormattedDate] = useState(
  //   formatDate(product.createdAt)
  // );

  // Format price to 2 decimal places
  const formattedPrice = product.price.toFixed(2);

  // Get author full name
  const authorName = `${product.author.firstName} ${product.author.lastName}`;

  // Use client-side only date formatting after hydration
  // useEffect(() => {
  //   // Only in the browser, update the date with locale-specific formatting
  //   setFormattedDate(new Date(product.createdAt).toLocaleDateString());
  // }, [product.createdAt]);

  // Generate a consistent image URL based on product ID
  const getImageSrc = useMemo(() => {
    // Use different placeholder services based on the product category
    const services = [
      `https://picsum.photos/seed/${product.id}/400/400`, // Lorem Picsum
      `https://source.unsplash.com/random/400x400?nft,digital,art&sig=${product.id}`, // Unsplash
    ];

    // Use category to determine which service to use (ensuring consistent selection)
    const serviceIndex = getCategoryIndex(product.category) % services.length;
    return services[serviceIndex];
  }, [product.id, product.category]);

  // Get background color based on category
  const bgColor = useMemo(() => {
    return getCategoryColor(product.category);
  }, [product.category]);

  // Fallback image in case of errors
  const fallbackImage = "https://placehold.co/400x400/252525/FFFFFF?text=NFT";

  // Toggle favorite
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl dark:shadow-gray-900/30 h-full flex flex-col">
      {/* Category badge */}
      <div
        className="absolute top-2 left-2 z-20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium text-white"
        style={{
          backgroundColor: getCategoryBadgeColor(product.category),
        }}
      >
        {product.category}
      </div>

      {/* Favorite button */}
      <button
        onClick={toggleFavorite}
        className="absolute top-2 right-2 z-20 p-0.5 sm:p-1 rounded-full bg-white/30 backdrop-blur-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isFavorite ? "white" : "none"}
          stroke={isFavorite ? "none" : "white"}
          strokeWidth={2}
          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
        >
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      </button>

      {/* Image container with colorful background */}
      <div
        className="relative h-44 sm:h-48 md:h-52 lg:h-56 w-full overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        <Image
          src={imageError ? fallbackImage : getImageSrc}
          alt={product.title}
          fill
          placeholder="blur"
          blurDataURL={getImageSrc}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover hover:scale-110 transition-transform duration-300"
          onError={() => setImageError(true)}
          loading="lazy"
          unoptimized={true}
        />
      </div>

      {/* Content */}
      <div className="bg-gradient-to-br from-gray-900/90 to-black p-2 sm:p-3 text-white flex-grow">
        <div className="flex justify-between items-start">
          {/* Title with tooltip */}
          <div className="max-w-[65%] group relative">
            <h3 className="font-bold text-xs sm:text-sm md:text-base truncate">
              {product.title}
            </h3>
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50">
              <div className="bg-gray-900/95 text-white text-xs rounded py-1 px-2 shadow-lg whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis border border-gray-700">
                {product.title}
              </div>
              <div className="w-2 h-2 bg-gray-900/95 transform rotate-45 absolute -bottom-1 left-3 border-b border-r border-gray-700"></div>
            </div>
          </div>

          {/* Price with tooltip */}
          <div className="flex items-center text-xs sm:text-sm md:text-base font-bold max-w-[30%] group relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="flex-shrink-0 w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 text-purple-400"
            >
              <path d="M12 .75a8.75 8.75 0 00-8.75 8.75c0 7.16 8.01 11.84 8.38 12.07l.37.23.37-.23c.37-.23 8.38-4.91 8.38-12.07A8.75 8.75 0 0012 .75z" />
            </svg>
            <span className="truncate">{formattedPrice} ETH</span>
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-50">
              <div className="bg-gray-900/95 text-white text-xs rounded py-1 px-2 shadow-lg whitespace-nowrap border border-gray-700">
                {formattedPrice} ETH
              </div>
              <div className="w-2 h-2 bg-gray-900/95 transform rotate-45 absolute -bottom-1 right-3 border-b border-r border-gray-700"></div>
            </div>
          </div>
        </div>

        <div className="flex items-center mt-1 sm:mt-2">
          <div className="relative w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full overflow-hidden mr-1.5 sm:mr-2 border border-purple-500 flex-shrink-0">
            <Image
              src={
                product.author.avatar ||
                "https://placehold.co/100x100/252525/FFFFFF?text=User"
              }
              alt={authorName}
              fill
              sizes="24px"
              className="object-cover"
              unoptimized={true}
              loading="lazy"
              onError={(e) => {
                // Fallback for avatar images
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://placehold.co/100x100/252525/FFFFFF?text=User";
              }}
            />
          </div>
          <div className="group relative flex-grow">
            <span className="text-xs text-gray-300 truncate block">
              {authorName}
            </span>
            <div className="absolute top-full left-0 mt-1 hidden group-hover:block z-50">
              <div className="bg-gray-900/95 text-white text-xs rounded py-1 px-2 shadow-lg whitespace-nowrap border border-gray-700">
                {authorName}
              </div>
              <div className="w-2 h-2 bg-gray-900/95 transform rotate-45 absolute -top-1 left-3 border-t border-l border-gray-700"></div>
            </div>
          </div>
        </div>
        {/* Test UI for Theme and Created Date */}
        {/* <div className="flex justify-between items-center mt-3">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Created
            </div>
            <div className="text-sm dark:text-gray-300">{formattedDate}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Theme
            </div>
            <span className="text-sm dark:text-gray-300">{product.theme}</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

// Format date in a consistent way for server-side rendering
// function formatDate(timestamp: number): string {
//   const date = new Date(timestamp);
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
//     2,
//     "0"
//   )}-${String(date.getDate()).padStart(2, "0")}`;
// }

// Helper function to get a consistent index for a category
function getCategoryIndex(category: string): number {
  const categories = [
    "Upper Body",
    "Lower Body",
    "Hat",
    "Shoes",
    "Accessory",
    "Legendary",
    "Mythic",
    "Epic",
    "Rare",
  ];

  return categories.indexOf(category) !== -1 ? categories.indexOf(category) : 0;
}

// Helper function to get background color based on category
function getCategoryColor(category: string): string {
  const categoryColors: Record<string, string> = {
    "Upper Body": "#6B46C1", // purple
    "Lower Body": "#3182CE", // blue
    Hat: "#DD6B20", // orange
    Shoes: "#E53E3E", // red
    Accessory: "#38A169", // green
    Legendary: "#F6AD55", // light orange
    Mythic: "#F687B3", // pink
    Epic: "#9F7AEA", // lavender
    Rare: "#4299E1", // light blue
  };

  return categoryColors[category] || "#2D3748"; // default dark gray
}

// Helper function to get badge color based on category
function getCategoryBadgeColor(category: string): string {
  const badgeColors: Record<string, string> = {
    "Upper Body": "#805AD5", // darker purple
    "Lower Body": "#2B6CB0", // darker blue
    Hat: "#C05621", // darker orange
    Shoes: "#C53030", // darker red
    Accessory: "#2F855A", // darker green
    Legendary: "#DD6B20", // darker orange
    Mythic: "#D53F8C", // darker pink
    Epic: "#805AD5", // darker lavender
    Rare: "#3182CE", // darker light blue
  };

  return badgeColors[category] || "#1A202C"; // default darker gray
}

export default NFTCard;
