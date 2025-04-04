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

export async function fetchProducts(params: SearchParams = {}): Promise<{
  data: IProduct[];
  total: number;
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
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const total = Number(response.headers.get("X-Total-Count") || "0");
    const data = await response.json();

    return { data, total };
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
