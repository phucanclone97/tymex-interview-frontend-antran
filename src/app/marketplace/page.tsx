"use client";

import React, { useEffect } from "react";
import NFTCard from "@/components/NFTCard";
import NFTCardSkeleton from "@/components/NFTCardSkeleton";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/EmptyState";
import ErrorDisplay from "@/components/ErrorDisplay";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import { Category } from "@/types/nft";
import { useProducts } from "@/hooks/useProducts";

// Define categories based on the mock server data
const categories: Category[] = [
  { id: "all", label: "All" },
  { id: "Upper Body", label: "Upper Body" },
  { id: "Lower Body", label: "Lower Body" },
  { id: "Hat", label: "Hat" },
  { id: "Shoes", label: "Shoes" },
  { id: "Accessory", label: "Accessory" },
  { id: "Legendary", label: "Legendary" },
  { id: "Mythic", label: "Mythic" },
  { id: "Epic", label: "Epic" },
  { id: "Rare", label: "Rare" },
];

const MarketplacePage = () => {
  const {
    products,
    loading,
    error,
    totalCount,
    hasMore,
    loadMore,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    minMaxPrice,
  } = useProducts(12);

  // Ensure a category is selected on mount
  useEffect(() => {
    if (!selectedCategory) {
      setSelectedCategory("all");
    }
  }, [selectedCategory, setSelectedCategory]);

  const handleResetFilter = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setPriceRange(minMaxPrice);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold dark:text-white">NFT Marketplace</h1>
        <div className="w-full md:w-auto">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search NFTs by name, category..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <PriceRangeFilter
              minPrice={minMaxPrice[0]}
              maxPrice={minMaxPrice[1]}
              currentMin={priceRange[0]}
              currentMax={priceRange[1]}
              onPriceChange={(min, max) => setPriceRange([min, max])}
            />

            <div className="mt-4">
              <button
                onClick={handleResetFilter}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>

            {!loading && !error && products.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700 mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {products.length} of {totalCount} results
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3">
          {error && (
            <ErrorDisplay
              onRetry={() => {
                setSelectedCategory(selectedCategory);
              }}
            />
          )}

          {!error && loading && products.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <NFTCardSkeleton key={index} />
              ))}
            </div>
          )}

          {!error && !loading && products.length === 0 && <EmptyState />}

          {!error && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <NFTCard key={product.id} product={product} />
                ))}
              </div>

              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {[...Array(3)].map((_, index) => (
                    <NFTCardSkeleton key={`loading-${index}`} />
                  ))}
                </div>
              )}

              {hasMore && (
                <div className="mt-8 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className={`px-6 py-3 text-white font-medium rounded-lg transition-colors ${
                      loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default MarketplacePage;
