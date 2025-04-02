import { IProduct } from "@/types/nft";

// Get API URL from environment variables with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

// Get auto refresh interval from environment variables with fallback
export const AUTO_REFRESH_INTERVAL = parseInt(
  process.env.NEXT_PUBLIC_AUTO_REFRESH_INTERVAL || "60000",
  10
);

export interface SearchParams {
  q?: string;
  category?: string;
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

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

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
