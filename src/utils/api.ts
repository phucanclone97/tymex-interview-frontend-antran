import { IProduct } from "@/types/nft";

// Get API URL from environment variables with fallback to relative path for Vercel
const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Get auto refresh interval from environment variables with fallback
export const AUTO_REFRESH_INTERVAL = parseInt(
  process.env.NEXT_PUBLIC_AUTO_REFRESH_INTERVAL || "60000",
  10
);

export interface SearchParams {
  q?: string;
  category?: string;
  tier?: string;
  theme?: string;
  minPrice?: number;
  maxPrice?: number;
  _page?: number;
  _limit?: number;
  _sort?: string;
  _order?: "asc" | "desc";
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasMore: boolean;
}

export async function fetchProducts(params: SearchParams = {}): Promise<{
  data: IProduct[];
  total: number;
  pagination: PaginationData;
}> {
  const searchParams = new URLSearchParams();

  // Handle regular params
  const { minPrice, maxPrice, ...restParams } = params;

  Object.entries(restParams).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

  // Handle price range params
  if (minPrice !== undefined) {
    searchParams.append("price_gte", minPrice.toString());
  }

  if (maxPrice !== undefined) {
    searchParams.append("price_lte", maxPrice.toString());
  }

  const queryString = searchParams.toString();
  const url = `${API_URL}/products${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache, no-store",
        Pragma: "no-cache",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Parse header values, supporting both uppercase and lowercase header formats
    const getHeaderValue = (name: string): string | null => {
      return (
        response.headers.get(name) ||
        response.headers.get(name.toLowerCase()) ||
        response.headers.get(name.toUpperCase()) ||
        null
      );
    };

    const total = Number(getHeaderValue("x-total-count") || "0");
    const page = Number(
      getHeaderValue("x-pagination-current") ||
        getHeaderValue("x-pagination-page") ||
        "1"
    );
    const limit = Number(
      getHeaderValue("x-pagination-limit") || params._limit?.toString() || "12"
    );
    const pages = Number(getHeaderValue("x-pagination-pages") || "1");

    // Calculate has more based on current page and total pages
    const hasMore = page < pages;

    const data = await response.json();

    return {
      data,
      total,
      pagination: {
        total,
        page,
        limit,
        pages,
        hasMore,
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function fetchProductById(id: number): Promise<IProduct> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
}
