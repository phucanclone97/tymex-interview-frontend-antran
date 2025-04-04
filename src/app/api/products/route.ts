import { type NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/utils/mockData";
import { IProduct } from "@/types/nft";

// This ensures the API route is not cached and is always evaluated
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("_page") || "1", 10);
    const limit = parseInt(searchParams.get("_limit") || "10", 10);
    const sort = searchParams.get("_sort") || "createdAt";
    const order = searchParams.get("_order") || "desc";
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const tier = searchParams.get("tier") || "";
    const theme = searchParams.get("theme") || "";
    const minPrice = parseFloat(searchParams.get("price_gte") || "0");
    const maxPrice = parseFloat(searchParams.get("price_lte") || "1000");

    // Get all products
    const allProducts = getProducts();

    // Filter products based on search query and other filters
    const filteredProducts = allProducts.filter((product: IProduct) => {
      // Search by title if query exists
      const matchesQuery = query
        ? product.title.toLowerCase().includes(query.toLowerCase())
        : true;

      // Filter by category if specified
      const matchesCategory =
        category && category !== "all"
          ? product.category.toLowerCase() === category.toLowerCase()
          : true;

      // Filter by tier if specified
      const matchesTier = tier
        ? product.tier.toLowerCase() === tier.toLowerCase()
        : true;

      // Filter by theme if specified
      const matchesTheme = theme
        ? product.theme.toLowerCase() === theme.toLowerCase()
        : true;

      // Filter by price range
      const matchesPrice =
        product.price >= minPrice &&
        (isNaN(maxPrice) || product.price <= maxPrice);

      return (
        matchesQuery &&
        matchesCategory &&
        matchesTier &&
        matchesTheme &&
        matchesPrice
      );
    });

    // Sort products
    filteredProducts.sort((a: IProduct, b: IProduct) => {
      const aValue = a[sort as keyof IProduct];
      const bValue = b[sort as keyof IProduct];

      if (order === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    const totalCount = filteredProducts.length;

    // Create response with proper headers for pagination
    const response = NextResponse.json(paginatedProducts);

    // Set headers for pagination info and CORS
    response.headers.set("x-total-count", totalCount.toString());
    response.headers.set(
      "access-control-expose-headers",
      "x-total-count, x-pagination-pages"
    );
    response.headers.set(
      "x-pagination-pages",
      Math.ceil(totalCount / limit).toString()
    );
    response.headers.set("x-pagination-current", page.toString());
    response.headers.set(
      "cache-control",
      "no-cache, no-store, must-revalidate"
    );
    response.headers.set("pragma", "no-cache");

    return response;
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
