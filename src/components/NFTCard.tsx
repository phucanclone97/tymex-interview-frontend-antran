import React, { useState, useMemo } from "react";
import Image from "next/image";
import { IProduct } from "@/types/nft";

interface NFTCardProps {
  product: IProduct;
}

const NFTCard: React.FC<NFTCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);

  // Format price to 2 decimal places
  const formattedPrice = product.price.toFixed(2);

  // Get author full name
  const authorName = `${product.author.firstName} ${product.author.lastName}`;

  // Format date
  const createdDate = new Date(product.createdAt).toLocaleDateString();

  // Generate a consistent image URL based on product ID
  const getImageSrc = useMemo(() => {
    // Use different placeholder services based on the product category
    const services = [
      `https://picsum.photos/seed/${product.id}/400/400`, // Lorem Picsum
      `https://source.unsplash.com/random/400x400?nft,digital,art&sig=${product.id}`, // Unsplash
      `https://placeimg.com/400/400/tech?${product.id}`, // PlaceIMG
    ];

    // Use category to determine which service to use (ensuring consistent selection)
    const serviceIndex = getCategoryIndex(product.category) % services.length;
    return services[serviceIndex];
  }, [product.id, product.category]);

  // Fallback image in case of errors
  const fallbackImage = "https://placehold.co/400x400/252525/FFFFFF?text=NFT";

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
            src={imageError ? fallbackImage : getImageSrc}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
            unoptimized={true} // Use this to prevent Next.js from optimizing external images
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

export default NFTCard;
