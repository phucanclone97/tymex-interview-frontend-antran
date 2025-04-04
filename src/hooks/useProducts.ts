import { useState, useEffect, useCallback, useRef } from "react";
import { IProduct } from "@/types/nft";
import {
  fetchProducts,
  SearchParams,
  AUTO_REFRESH_INTERVAL,
  PaginationData,
} from "@/utils/api";
import { useDebounce } from "./useDebounce";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTier, setSelectedTier] = useState("All Tiers");
  const [selectedTheme, setSelectedTheme] = useState("All Themes");
  const [limit] = useState(initialLimit);
  const [minMaxPrice, setMinMaxPrice] = useState<[number, number]>([0, 1000]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Use refs to manage state without triggering re-renders
  const currentPageRef = useRef(1);
  const isLoadingRef = useRef(false);
  const filtersChangedRef = useRef(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedPriceRange = useDebounce(priceRange, 500);

  // Track when filters change
  useEffect(() => {
    filtersChangedRef.current = true;
    currentPageRef.current = 1;
  }, [
    debouncedSearchQuery,
    selectedCategory,
    selectedTier,
    selectedTheme,
    debouncedPriceRange,
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

        console.log(isLoadMore, params);
        if (debouncedSearchQuery) {
          params.q = debouncedSearchQuery;
        }

        if (selectedCategory && selectedCategory !== "all") {
          params.category = selectedCategory;
        }

        if (selectedTier && selectedTier !== "All Tiers") {
          params.tier = selectedTier;
        }

        if (selectedTheme && selectedTheme !== "All Themes") {
          params.theme = selectedTheme;
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
          setProducts((prev) => [...prev, ...data]);
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
      selectedCategory,
      selectedTier,
      selectedTheme,
    ]
  );

  // Load more function - only triggers if not loading and there's more data
  const loadMore = useCallback(() => {
    if (!isLoadingRef.current && pagination.hasMore) {
      fetchDataImpl(true);
    }
  }, [pagination.hasMore]);

  // Fetch initial data and handle filter changes
  useEffect(() => {
    // Only fetch when filters have changed
    if (filtersChangedRef.current) {
      fetchDataImpl(false);
    }
  }, [
    debouncedSearchQuery,
    selectedCategory,
    selectedTier,
    selectedTheme,
    debouncedPriceRange,
  ]);

  // Initial data load
  useEffect(() => {
    fetchDataImpl(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch the min and max prices if not set yet
  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        const { data } = await fetchProducts({
          _limit: 1,
          _sort: "price",
          _order: "asc",
        });

        const minPrice = data.length > 0 ? data[0].price : 0;

        const { data: maxData } = await fetchProducts({
          _limit: 1,
          _sort: "price",
          _order: "desc",
        });

        const maxPrice = maxData.length > 0 ? maxData[0].price : 1000;

        // Add a bit of padding to max price
        const paddedMaxPrice = Math.ceil(maxPrice * 1.1);

        setMinMaxPrice([minPrice, paddedMaxPrice]);
        setPriceRange([minPrice, paddedMaxPrice]);
      } catch (err) {
        console.error("Error fetching price range:", err);
      }
    };

    fetchPriceRange();
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
  }, []);

  return {
    products,
    loading,
    error,
    totalCount,
    hasMore: pagination.hasMore,
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
    pagination,
  };
}
