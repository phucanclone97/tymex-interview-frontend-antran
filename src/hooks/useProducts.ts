import { useState, useEffect, useCallback } from "react";
import { IProduct } from "@/types/nft";
import {
  fetchProducts,
  SearchParams,
  AUTO_REFRESH_INTERVAL,
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
}

export function useProducts(initialLimit = 6): UseProductsResult {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [limit] = useState(initialLimit);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchData = useCallback(
    async (isLoadMore = false) => {
      setLoading(true);
      setError(null);

      try {
        const params: SearchParams = {
          _page: isLoadMore ? page + 1 : 1,
          _limit: limit,
          _sort: "createdAt",
          _order: "desc",
        };

        if (debouncedSearchQuery) {
          params.q = debouncedSearchQuery;
        }

        if (selectedCategory && selectedCategory !== "all") {
          params.category = selectedCategory;
        }

        const { data, total } = await fetchProducts(params);

        setTotalCount(total);

        if (isLoadMore) {
          setProducts((prev) => [...prev, ...data]);
          setPage(page + 1);
        } else {
          setProducts(data);
          setPage(1);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearchQuery, limit, page, selectedCategory]
  );

  const loadMore = useCallback(() => {
    if (!loading && products.length < totalCount) {
      fetchData(true);
    }
  }, [fetchData, loading, products.length, totalCount]);

  // Initial fetch and when search or category changes
  useEffect(() => {
    fetchData();
  }, [debouncedSearchQuery, selectedCategory, fetchData]);

  // Auto refresh every 60 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  return {
    products,
    loading,
    error,
    totalCount,
    hasMore: products.length < totalCount,
    loadMore,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  };
}
