import { NextResponse } from "next/server";
import { getProductById } from "@/utils/mockData";

// This is important for dynamic API routes
export const dynamic = "force-dynamic";

// For Next.js 15 App Router - use a simplified handler signature
export function GET(
  _request: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: any
) {
  try {
    const id = parseInt(params.id);
    const product = getProductById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
