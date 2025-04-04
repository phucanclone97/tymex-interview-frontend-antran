import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/utils/mockData";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const id = parseInt(params.id);

  // Find the product with the matching ID
  const product = getProductById(id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
