import { NextResponse } from "next/server";
import { getProducts } from "@/utils/mockData";
import { IProduct } from "@/types/nft";

// This is important for dynamic API routes
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const products = getProducts();

    let filteredProducts = [...products];

    // Text search
    const q = searchParams.get("q");
    if (q && q.trim() !== "") {
      const searchTerm = q.toLowerCase().trim();
      filteredProducts = filteredProducts.filter((product: IProduct) =>
        product.title.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    const category = searchParams.get("category");
    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter(
        (product: IProduct) => product.category === category
      );
    }

    // Tier filter
    const tier = searchParams.get("tier");
    if (tier && tier !== "all") {
      filteredProducts = filteredProducts.filter(
        (product: IProduct) => product.tier === tier
      );
    }

    // Theme filter
    const theme = searchParams.get("theme");
    if (theme && theme !== "all") {
      filteredProducts = filteredProducts.filter(
        (product: IProduct) => product.theme === theme
      );
    }

    // Price range filters
    const minPrice = searchParams.get("price_gte");
    if (minPrice) {
      filteredProducts = filteredProducts.filter(
        (product: IProduct) => product.price >= parseFloat(minPrice)
      );
    }

    const maxPrice = searchParams.get("price_lte");
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(
        (product: IProduct) => product.price <= parseFloat(maxPrice)
      );
    }

    // Sorting
    const sort = searchParams.get("_sort");
    const order = searchParams.get("_order") as "asc" | "desc";

    if (sort) {
      filteredProducts.sort((a: IProduct, b: IProduct) => {
        const fieldA = a[sort as keyof IProduct];
        const fieldB = b[sort as keyof IProduct];

        // Use a consistent sorting approach for both server and client
        if (typeof fieldA === "string" && typeof fieldB === "string") {
          // Use simple string comparison instead of locale-specific
          return order === "desc"
            ? fieldB > fieldA
              ? 1
              : -1
            : fieldA > fieldB
            ? 1
            : -1;
        } else {
          return order === "desc"
            ? Number(fieldB) - Number(fieldA)
            : Number(fieldA) - Number(fieldB);
        }
      });
    }

    // Pagination
    const page = parseInt(searchParams.get("_page") || "1");
    // Support larger limit for View More functionality
    const limit = parseInt(searchParams.get("_limit") || "12");
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = filteredProducts.slice(startIndex, endIndex);

    // Create response with pagination headers
    const response = NextResponse.json(paginatedResults);
    response.headers.set("X-Total-Count", filteredProducts.length.toString());

    // Add additional pagination data
    response.headers.set("X-Pagination-Page", page.toString());
    response.headers.set("X-Pagination-Limit", limit.toString());
    response.headers.set(
      "X-Pagination-Pages",
      Math.ceil(filteredProducts.length / limit).toString()
    );
    response.headers.set(
      "X-Pagination-Has-More",
      (endIndex < filteredProducts.length).toString()
    );

    // Add CORS headers to ensure the frontend can access these custom headers
    response.headers.set(
      "Access-Control-Expose-Headers",
      "X-Total-Count, X-Pagination-Page, X-Pagination-Limit, X-Pagination-Pages, X-Pagination-Has-More"
    );

    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
