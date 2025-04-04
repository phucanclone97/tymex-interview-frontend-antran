import { fetchProducts, fetchProductById, SearchParams } from "./api";

// Mock global fetch
global.fetch = jest.fn();

describe("API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchProducts", () => {
    it("should fetch products with default parameters", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
        headers: {
          get: jest.fn((key: string) => {
            const headers: Record<string, string> = {
              "X-Total-Count": "2",
              "X-Pagination-Page": "1",
              "X-Pagination-Limit": "12",
              "X-Pagination-Pages": "1",
              "X-Pagination-Has-More": "false",
            };
            return headers[key] || null;
          }),
        },
      };

      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchProducts();

      expect(fetch).toHaveBeenCalledWith("/api/products", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store",
          Pragma: "no-cache",
        },
        next: { revalidate: 0 },
      });

      expect(result).toEqual({
        data: [{ id: 1 }, { id: 2 }],
        total: 2,
        pagination: {
          total: 2,
          page: 1,
          limit: 12,
          pages: 1,
          hasMore: false,
        },
      });
    });

    it("should fetch products with search parameters", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue([{ id: 1 }]),
        headers: {
          get: jest.fn((key: string) => {
            const headers: Record<string, string> = {
              "X-Total-Count": "1",
              "X-Pagination-Page": "2",
              "X-Pagination-Limit": "10",
              "X-Pagination-Pages": "1",
              "X-Pagination-Has-More": "false",
            };
            return headers[key] || null;
          }),
        },
      };

      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const params: SearchParams = {
        q: "test",
        category: "Epic",
        _page: 2,
        _limit: 10,
        _sort: "price",
        _order: "asc",
      };

      const result = await fetchProducts(params);

      expect(fetch).toHaveBeenCalledWith(
        "/api/products?q=test&category=Epic&_page=2&_limit=10&_sort=price&_order=asc",
        {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache, no-store",
            Pragma: "no-cache",
          },
          next: { revalidate: 0 },
        }
      );

      expect(result).toEqual({
        data: [{ id: 1 }],
        total: 1,
        pagination: {
          total: 1,
          page: 2,
          limit: 10,
          pages: 1,
          hasMore: false,
        },
      });
    });

    it("should handle API errors", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
      };

      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(fetchProducts()).rejects.toThrow("API error: 500");
    });

    it("should handle network errors", async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error("Network failure"));

      await expect(fetchProducts()).rejects.toThrow("Network failure");
    });
  });

  describe("fetchProductById", () => {
    it("should fetch a specific product by ID", async () => {
      const mockProduct = { id: 1, title: "Test Product" };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockProduct),
      };

      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchProductById(1);

      expect(fetch).toHaveBeenCalledWith("/api/products/1");
      expect(result).toEqual(mockProduct);
    });

    it("should handle API errors", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
      };

      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(fetchProductById(999)).rejects.toThrow("API error: 404");
    });
  });
});
