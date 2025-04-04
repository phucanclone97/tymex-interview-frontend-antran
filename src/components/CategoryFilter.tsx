import React from "react";
import { Category } from "@/types/nft";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="relative w-full overflow-x-auto pb-1 -mx-2 px-2">
      <div className="flex space-x-1 sm:space-x-2 pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Gradient fade on right side */}
      <div className="absolute right-0 top-0 h-full flex items-center pointer-events-none">
        <div className="w-12 h-full bg-gradient-to-l from-gray-900 to-transparent"></div>
      </div>

      {/* Left side gradient for visual effect */}
      <div className="absolute left-0 top-0 h-full flex items-center pointer-events-none">
        <div className="w-2 h-full bg-gradient-to-r from-gray-900 to-transparent"></div>
      </div>
    </div>
  );
};

export default CategoryFilter;
