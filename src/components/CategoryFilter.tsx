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
    <div className="relative w-full overflow-x-auto">
      <div className="flex space-x-2 pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="absolute right-0 top-0 h-full flex items-center">
        <div className="w-12 h-full bg-gradient-to-l from-gray-900 to-transparent"></div>
      </div>
    </div>
  );
};

export default CategoryFilter;
