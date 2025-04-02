import React from "react";
import { Category } from "@/types/nft";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium mb-4 dark:text-white">Categories</h3>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <button
              onClick={() => onCategoryChange(category.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-medium"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {category.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;
