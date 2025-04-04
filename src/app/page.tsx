"use client";

import React, { useEffect, useState } from "react";
import Banner from "@/components/Banner";
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

// Filter options
const tierOptions = ["All Tiers", "Premium", "Deluxe", "Basic"];
const themeOptions = ["All Themes", "Halloween", "Colorful", "Light", "Dark"];
const timeOptions = [
  "All Time",
  "Last 24h",
  "Last 7 days",
  "Last 30 days",
  "Last Year",
];
const sortOptions = [
  "Default",
  "Price: High to Low",
  "Price: Low to High",
  "Newest First",
  "Oldest First",
];

export default function Home() {
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
    selectedTier,
    setSelectedTier,
    selectedTheme,
    setSelectedTheme,
    priceRange,
    setPriceRange,
    minMaxPrice,
  } = useProducts(12);

  // Additional filter states
  const [selectedTime, setSelectedTime] = useState("All Time");
  const [selectedSort, setSelectedSort] = useState("Default");

  // Ensure a category is selected on mount
  useEffect(() => {
    if (!selectedCategory) {
      setSelectedCategory("all");
    }
  }, [selectedCategory, setSelectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Banner at the top */}
      <Banner characterImageUrl="/images/nft-character.svg" />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold dark:text-white">
            NFT Marketplace
          </h1>
          <div className="w-full md:w-80"></div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="w-full md:w-80">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search NFTs..."
            />
          </div>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar filters */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-4 space-y-6">
              {/* Price Range Filter */}
              <PriceRangeFilter
                minPrice={minMaxPrice[0]}
                maxPrice={minMaxPrice[1]}
                currentMin={priceRange[0]}
                currentMax={priceRange[1]}
                onPriceChange={(min, max) => setPriceRange([min, max])}
              />

              {/* Tier Filter Dropdown */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Tier</h3>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {tierOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme Filter Dropdown */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Theme</h3>
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {themeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Filter Dropdown */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Time</h3>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {timeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Sort By
                </h3>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {!loading && !error && products.length > 0 && (
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-700">
                  <p className="text-lg text-gray-300">
                    Showing{" "}
                    <span className="font-bold text-white">
                      {products.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-white">{totalCount}</span>{" "}
                    results
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3 order-1 lg:order-2">
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
                          ? "bg-purple-400 cursor-not-allowed"
                          : "bg-purple-600 hover:bg-purple-700"
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

      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-8 text-center text-gray-500 dark:text-gray-400">
        <p>© 2023 NFT Marketplace. All rights reserved.</p>
      </footer>
    </div>
  );
}
