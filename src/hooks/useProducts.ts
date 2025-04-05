import { useState, useEffect, useCallback, useRef } from "react";
import { IProduct } from "@/types/nft";
import {
  fetchProducts,
  SearchParams,
  AUTO_REFRESH_INTERVAL,
  PaginationData,
} from "@/utils/api";
import { useDebounce } from "./useDebounce";

// Define a filter state interface to consolidate all filters
interface FilterState {
  searchQuery: string;
  category: string;
  tier: string;
  theme: string;
  priceRange: [number, number];
}

interface UseProductsResult {
  products: IProduct[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  hasMore: boolean;
  loadMore: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTier: string;
  setSelectedTier: (tier: string) => void;
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minMaxPrice: [number, number];
  pagination: PaginationData;
}

export function useProducts(initialLimit = 6): UseProductsResult {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: initialLimit,
    pages: 1,
    hasMore: false,
  });

  // Single filter state for all filter values
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    category: "",
    tier: "All Tiers",
    theme: "All Themes",
    priceRange: [0, 1000],
  });

  const [limit] = useState(initialLimit);
  const [minMaxPrice, setMinMaxPrice] = useState<[number, number]>([0, 1000]);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Use refs to manage state without triggering re-renders
  const currentPageRef = useRef(1);
  const isLoadingRef = useRef(false);
  const filtersChangedRef = useRef(false);

  // Debounce only the values that need debouncing
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 500);
  const debouncedPriceRange = useDebounce(filters.priceRange, 500);

  // Filter updater functions
  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setSelectedCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setSelectedTier = useCallback((tier: string) => {
    setFilters((prev) => ({ ...prev, tier }));
  }, []);

  const setSelectedTheme = useCallback((theme: string) => {
    setFilters((prev) => ({ ...prev, theme }));
  }, []);

  const setPriceRange = useCallback((priceRange: [number, number]) => {
    setFilters((prev) => ({ ...prev, priceRange }));
  }, []);

  // Track when filters change - but only after initial load
  useEffect(() => {
    if (initialLoadComplete && !isInitializing) {
      filtersChangedRef.current = true;
      currentPageRef.current = 1;
    }
  }, [
    debouncedSearchQuery,
    filters.category,
    filters.tier,
    filters.theme,
    debouncedPriceRange,
    initialLoadComplete,
    isInitializing,
  ]);

  // Main data fetching function
  const fetchDataImpl = useCallback(
    async (isLoadMore = false) => {
      // Prevent concurrent fetches
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        // If loading more, use the current page + 1, otherwise start from page 1
        const pageToFetch = isLoadMore ? currentPageRef.current + 1 : 1;

        const params: SearchParams = {
          _page: pageToFetch,
          _limit: limit,
          _sort: "createdAt",
          _order: "desc",
          minPrice: debouncedPriceRange[0],
          maxPrice: debouncedPriceRange[1],
        };

        if (debouncedSearchQuery) {
          params.q = debouncedSearchQuery;
        }

        if (filters.category && filters.category !== "all") {
          params.category = filters.category;
        }

        if (filters.tier && filters.tier !== "All Tiers") {
          params.tier = filters.tier;
        }

        if (filters.theme && filters.theme !== "All Themes") {
          params.theme = filters.theme;
        }

        console.log(`Fetching page ${pageToFetch}, isLoadMore: ${isLoadMore}`);
        const {
          data,
          total,
          pagination: paginationData,
        } = await fetchProducts(params);
        console.log(`Received ${data.length} items, total: ${total}`);

        setTotalCount(total);
        setPagination(paginationData);

        if (isLoadMore) {
          // Append new data to existing data
          setProducts((prev) => {
            // Create a Set of existing product IDs to avoid duplicates
            const existingIds = new Set(prev.map((product) => product.id));

            // Filter out any products that already exist in the current list
            const uniqueNewProducts = data.filter(
              (product) => !existingIds.has(product.id)
            );

            // Return combined array of existing and new unique products
            return [...prev, ...uniqueNewProducts];
          });

          // Update page after successful fetch
          currentPageRef.current = pageToFetch;
        } else {
          // Replace data when not loading more
          setProducts(data);
          currentPageRef.current = 1;
        }

        // Reset the filter changed flag after successful fetch
        if (!isLoadMore) {
          filtersChangedRef.current = false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    },
    [
      debouncedSearchQuery,
      debouncedPriceRange,
      limit,
      filters.category,
      filters.tier,
      filters.theme,
    ]
  );

  // Load more function - only triggers if not loading and there's more data
  const loadMore = useCallback(() => {
    if (!isLoadingRef.current && pagination.hasMore) {
      fetchDataImpl(true);
    }
  }, [fetchDataImpl, pagination.hasMore]);

  // Fetch initial data and handle filter changes
  useEffect(() => {
    // Only fetch when filters have changed and after initial load
    if (filtersChangedRef.current && initialLoadComplete && !isInitializing) {
      fetchDataImpl(false);
    }
  }, [
    debouncedSearchQuery,
    filters.category,
    filters.tier,
    filters.theme,
    debouncedPriceRange,
    fetchDataImpl,
    initialLoadComplete,
    isInitializing,
  ]);

  // Initialize price range and do initial data load together
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        setIsInitializing(true);

        // First, get the min price
        const { data: minData } = await fetchProducts({
          _limit: 1,
          _sort: "price",
          _order: "asc",
        });

        const minPrice = minData.length > 0 ? minData[0].price : 0;

        // Then get the max price
        const { data: maxData } = await fetchProducts({
          _limit: 1,
          _sort: "price",
          _order: "desc",
        });

        const maxPrice = maxData.length > 0 ? maxData[0].price : 1000;

        // Add a bit of padding to max price
        const paddedMaxPrice = Math.ceil(maxPrice * 1.1);

        // Update state with price range values
        setMinMaxPrice([minPrice, paddedMaxPrice]);

        // Important: Update filters directly without triggering separate filter changes
        setFilters((prev) => ({
          ...prev,
          priceRange: [minPrice, paddedMaxPrice],
        }));

        // Fetch initial products with correct price range - we'll do this manually
        // instead of relying on the hook to prevent duplicate fetches
        const params: SearchParams = {
          _page: 1,
          _limit: limit,
          _sort: "createdAt",
          _order: "desc",
          minPrice: minPrice,
          maxPrice: paddedMaxPrice,
        };

        if (filters.category && filters.category !== "all") {
          params.category = filters.category;
        }

        console.log("Fetching initial data with price range");
        const {
          data,
          total,
          pagination: paginationData,
        } = await fetchProducts(params);
        console.log(`Initial fetch: ${data.length} items, total: ${total}`);

        // Update all the relevant states
        setTotalCount(total);
        setPagination(paginationData);
        setProducts(data);

        // Mark initial load as complete to enable filter change detection
        setInitialLoadComplete(true);
      } catch (err) {
        console.error("Error during initialization:", err);
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setLoading(false);
        setIsInitializing(false);
      }
    };

    // Run initialization once
    initialize();

    // This effect should only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto refresh every 60 seconds - only when the component is mounted and not during development
  useEffect(() => {
    // Don't auto-refresh during development mode
    if (process.env.NODE_ENV === "development") {
      return;
    }

    const intervalId = setInterval(() => {
      // Only refresh if not currently loading data
      if (!isLoadingRef.current) {
        fetchDataImpl(false);
      }
    }, AUTO_REFRESH_INTERVAL);

    // Clean up interval on component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchDataImpl]);

  return {
    products,
    loading,
    error,
    totalCount,
    hasMore: pagination.hasMore,
    loadMore,
    searchQuery: filters.searchQuery,
    setSearchQuery,
    selectedCategory: filters.category,
    setSelectedCategory,
    selectedTier: filters.tier,
    setSelectedTier,
    selectedTheme: filters.theme,
    setSelectedTheme,
    priceRange: filters.priceRange,
    setPriceRange,
    minMaxPrice,
    pagination,
  };
}
