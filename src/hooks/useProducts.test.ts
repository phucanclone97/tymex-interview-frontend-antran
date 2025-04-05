import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { useProducts } from "./useProducts";
import { fetchProducts } from "../utils/api";
import { IProduct } from "../types/nft";

// Mock the api module
jest.mock("../utils/api", () => ({
  fetchProducts: jest.fn(),
  AUTO_REFRESH_INTERVAL: 60000,
}));

describe("useProducts hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({ legacyFakeTimers: true }); // Use legacy timers to avoid infinite loops

    // Setup default mock implementation
    (fetchProducts as jest.Mock).mockResolvedValue({
      data: [],
      total: 0,
      pagination: {
        total: 0,
        page: 1,
        limit: 12,
        pages: 0,
        hasMore: false,
      },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Increase timeout for tests
  jest.setTimeout(30000);

  it("should initialize with default values", async () => {
    // First mock for min price fetch
    (fetchProducts as jest.Mock).mockResolvedValueOnce({
      data: [{ id: 1, price: 10, title: "Product 1" }],
      total: 1,
      pagination: {
        total: 1,
        page: 1,
        limit: 1,
        pages: 1,
        hasMore: false,
      },
    });

    // Second mock for max price fetch
    (fetchProducts as jest.Mock).mockResolvedValueOnce({
      data: [{ id: 2, price: 100, title: "Product 2" }],
      total: 1,
      pagination: {
        total: 1,
        page: 1,
        limit: 1,
        pages: 1,
        hasMore: false,
      },
    });

    // Third mock for initial data fetch
    (fetchProducts as jest.Mock).mockResolvedValueOnce({
      data: [{ id: 1, title: "Product 1" }],
      total: 1,
      pagination: {
        total: 1,
        page: 1,
        limit: 12,
        pages: 1,
        hasMore: false,
      },
    });

    const { result } = renderHook(() => useProducts());

    // Initial render (need to wait for hook effects to complete)
    await act(async () => {
      jest.advanceTimersByTime(10);
    });

    // Wait for the loading state to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // After data is loaded
    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].id).toBe(1);
    expect(result.current.totalCount).toBe(1);
    expect(result.current.hasMore).toBe(false);
  });

  it("should handle loading more products", async () => {
    // Min price mock
    (fetchProducts as jest.Mock).mockResolvedValueOnce({
      data: [{ id: 1, price: 10, title: "Product 1" }],
      total: 1,
      pagination: { total: 1, page: 1, limit: 1, pages: 1, hasMore: false },
    });

    // Max price mock
    (fetchProducts as jest.Mock).mockResolvedValueOnce({
      data: [{ id: 4, price: 100, title: "Product 4" }],
      total: 1,
      pagination: { total: 1, page: 1, limit: 1, pages: 1, hasMore: false },
    });

    // Initial data load mock
    (fetchProducts as jest.Mock).mockResolvedValueOnce({
      data: [
        { id: 1, title: "Product 1" },
        { id: 2, title: "Product 2" },
      ],
      total: 4,
      pagination: {
        total: 4,
        page: 1,
        limit: 2,
        pages: 2,
        hasMore: true,
      },
    });

    // Mock for load more
    (fetchProducts as jest.Mock).mockImplementationOnce((params) => {
      if (params && params._page === 2) {
        return Promise.resolve({
          data: [
            { id: 3, title: "Product 3" },
            { id: 4, title: "Product 4" },
          ],
          total: 4,
          pagination: {
            total: 4,
            page: 2,
            limit: 2,
            pages: 2,
            hasMore: false,
          },
        });
      }
    });

    const { result } = renderHook(() => useProducts(2)); // Limit of 2 per page

    // Initial render and data load
    await act(async () => {
      jest.advanceTimersByTime(10);
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check initial state after first load
    expect(result.current.products).toHaveLength(2);
    expect(result.current.products[0].id).toBe(1);
    expect(result.current.products[1].id).toBe(2);
    expect(result.current.hasMore).toBe(true);

    // Load more products
    await act(async () => {
      result.current.loadMore();
      // Advance timers a little to trigger async operations
      jest.advanceTimersByTime(10);
    });

    // Wait for loading to complete after loadMore
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check state after loading more
    expect(result.current.products).toHaveLength(4);
    expect(result.current.products[2].id).toBe(3);
    expect(result.current.products[3].id).toBe(4);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.totalCount).toBe(4);
  });

  it("should filter out duplicate products when loading more", async () => {
    // Min price mock
    (fetchProducts as jest.Mock).mockResolvedValueOnce({
      data: [{ id: 1, price: 10, title: "Product 1" }],
      total: 1,
      pagination: { total: 1, page: 1, limit: 1, pages: 1, hasMore: false },
    });

    // Max price mock
    (fetchProducts as jest.Mock).mockResolvedValueOnce({
      data: [{ id: 4, price: 100, title: "Product 4" }],
      total: 1,
      pagination: { total: 1, page: 1, limit: 1, pages: 1, hasMore: false },
    });

    // Initial data load
    (fetchProducts as jest.Mock).mockResolvedValueOnce({
      data: [
        { id: 1, title: "Product 1" },
        { id: 2, title: "Product 2" },
      ],
      total: 4,
      pagination: {
        total: 4,
        page: 1,
        limit: 2,
        pages: 2,
        hasMore: true,
      },
    });

    // Load more mock
    (fetchProducts as jest.Mock).mockImplementationOnce((params) => {
      if (params && params._page === 2) {
        return Promise.resolve({
          data: [
            { id: 2, title: "Product 2" }, // Duplicate
            { id: 3, title: "Product 3" },
          ],
          total: 4,
          pagination: {
            total: 4,
            page: 2,
            limit: 2,
            pages: 2,
            hasMore: false,
          },
        });
      }
    });

    const { result } = renderHook(() => useProducts(2));

    // Initial render
    await act(async () => {
      jest.advanceTimersByTime(10);
    });

    // Wait for the initial data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.products).toHaveLength(2);
    });

    // Verify initial products
    expect(result.current.products[0].id).toBe(1);
    expect(result.current.products[1].id).toBe(2);
    expect(result.current.hasMore).toBe(true);

    // Load more
    await act(async () => {
      result.current.loadMore();
      jest.advanceTimersByTime(10);
    });

    // Wait for state updates to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify products array has the correct structure after filtering duplicates
    expect(result.current.products).toHaveLength(3);
    expect(result.current.products.map((p: IProduct) => p.id)).toEqual([
      1, 2, 3,
    ]);
    expect(result.current.hasMore).toBe(false);
  });

  it("should update search and filter criteria", async () => {
    let fetchCount = 0;

    // Min price mock
    (fetchProducts as jest.Mock).mockImplementationOnce(() => {
      fetchCount++;
      return Promise.resolve({
        data: [{ id: 1, price: 10, title: "Test Product" }],
        total: 1,
        pagination: { total: 1, page: 1, limit: 1, pages: 1, hasMore: false },
      });
    });

    // Max price mock
    (fetchProducts as jest.Mock).mockImplementationOnce(() => {
      fetchCount++;
      return Promise.resolve({
        data: [{ id: 2, price: 100, title: "Test Product" }],
        total: 1,
        pagination: { total: 1, page: 1, limit: 1, pages: 1, hasMore: false },
      });
    });

    // Initial data load and subsequent filter changes
    (fetchProducts as jest.Mock).mockImplementation(() => {
      fetchCount++;
      return Promise.resolve({
        data: [{ id: 1, title: "Test Product" }],
        total: 1,
        pagination: {
          total: 1,
          page: 1,
          limit: 12,
          pages: 1,
          hasMore: false,
        },
      });
    });

    const { result } = renderHook(() => useProducts());

    // Initial render
    await act(async () => {
      jest.advanceTimersByTime(10);
    });

    // Wait for the initial fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Change search query - this should mark filters as changed
    await act(async () => {
      result.current.setSearchQuery("test");
      // Wait for debounced query to trigger
      jest.advanceTimersByTime(600);
    });

    // Wait for search results to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Change category - this should mark filters as changed
    await act(async () => {
      result.current.setSelectedCategory("Epic");
      jest.advanceTimersByTime(10);
    });

    // Wait for filtered results to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Change price range - this should mark filters as changed
    await act(async () => {
      result.current.setPriceRange([20, 50]);
      // Wait for debounced price to trigger
      jest.advanceTimersByTime(600);
    });

    // Wait for price filtered results to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify that filterChangedRef triggered correct number of fetches
    // 3 initial fetches (min price, max price, initial data) + 3 filter changes = 6 total
    expect(fetchCount).toBe(6);
  });

  it("should handle API errors", async () => {
    // Min price mock
    (fetchProducts as jest.Mock).mockResolvedValueOnce({
      data: [{ id: 1, price: 10, title: "Product 1" }],
      total: 1,
      pagination: { total: 1, page: 1, limit: 1, pages: 1, hasMore: false },
    });

    // Max price mock
    (fetchProducts as jest.Mock).mockResolvedValueOnce({
      data: [{ id: 2, price: 100, title: "Product 2" }],
      total: 1,
      pagination: { total: 1, page: 1, limit: 1, pages: 1, hasMore: false },
    });

    // Throw error on data fetch
    (fetchProducts as jest.Mock).mockRejectedValueOnce(new Error("API error"));

    const { result } = renderHook(() => useProducts());

    // Initial render
    await act(async () => {
      jest.advanceTimersByTime(10);
    });

    // Wait for the error state to be set
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).not.toBeNull();
    });

    // Verify error state
    expect(result.current.error!.message).toBe("API error");
    expect(result.current.products).toHaveLength(0);
  });
});
