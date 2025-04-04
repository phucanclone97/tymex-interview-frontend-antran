import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/utils/mockData";
import { IProduct } from "@/types/nft";

export async function GET(request: NextRequest) {
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

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return order === "desc"
          ? fieldB.localeCompare(fieldA)
          : fieldA.localeCompare(fieldB);
      } else {
        return order === "desc"
          ? Number(fieldB) - Number(fieldA)
          : Number(fieldA) - Number(fieldB);
      }
    });
  }

  // Pagination
  const page = parseInt(searchParams.get("_page") || "1");
  const limit = parseInt(searchParams.get("_limit") || "12");
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = filteredProducts.slice(startIndex, endIndex);

  // Create response with pagination headers
  const response = NextResponse.json(paginatedResults);
  response.headers.set("X-Total-Count", filteredProducts.length.toString());

  return response;
}
