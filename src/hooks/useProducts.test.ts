import { renderHook, act, waitFor } from "@testing-library/react";
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
    jest.useFakeTimers();

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

  it("should initialize with default values", async () => {
    // Mock initial fetch response
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

    // Second page data for "load more"
    (fetchProducts as jest.Mock).mockResolvedValueOnce({
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

    const { result } = renderHook(() => useProducts(2)); // Limit of 2 per page

    // Wait for the initial fetch to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Check initial state after first load
    expect(result.current.products).toHaveLength(2);
    expect(result.current.products[0].id).toBe(1);
    expect(result.current.products[1].id).toBe(2);
    expect(result.current.hasMore).toBe(true);

    // Load more products
    act(() => {
      result.current.loadMore();
    });

    // Wait for the second fetch to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Check state after loading more
    expect(result.current.products).toHaveLength(4);
    expect(result.current.products[2].id).toBe(3);
    expect(result.current.products[3].id).toBe(4);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.totalCount).toBe(4);
  });

  it("should filter out duplicate products when loading more", async () => {
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

    // Second page data with one duplicate
    (fetchProducts as jest.Mock).mockResolvedValueOnce({
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

    const { result } = renderHook(() => useProducts(2));

    // Wait for the loading state to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check initial state after first load
    expect(result.current.products).toHaveLength(2);
    expect(result.current.products[0].id).toBe(1);
    expect(result.current.products[1].id).toBe(2);
    expect(result.current.hasMore).toBe(true);

    // Load more products
    act(() => {
      result.current.loadMore();
    });

    // Wait for the loading state to complete again
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
    // Mock initial fetch
    (fetchProducts as jest.Mock).mockResolvedValue({
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

    const { result } = renderHook(() => useProducts());

    // Wait for the initial fetch to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Update search query
    act(() => {
      result.current.setSearchQuery("test");
    });

    // Wait for debounce
    jest.advanceTimersByTime(500);
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Update category
    act(() => {
      result.current.setSelectedCategory("Epic");
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify that filterChangedRef triggered a new fetch
    expect(fetchProducts).toHaveBeenCalledTimes(3);

    // Verify the search parameters in the last call
    expect((fetchProducts as jest.Mock).mock.calls[2][0]).toMatchObject({
      q: "test",
      category: "Epic",
    });
  });

  it("should handle API errors", async () => {
    // Mock an API error
    (fetchProducts as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    const { result } = renderHook(() => useProducts());

    // Wait for the loading state to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check error state
    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe("API Error");
  });
});
