import { NextRequest, NextResponse } from "next/server";

// Generate a placeholder NFT image with a specific ID
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id") || "1";
  const size = searchParams.get("size") || "400";
  const bgColor =
    searchParams.get("bg") || Math.floor(Math.random() * 16777215).toString(16);

  const imageUrl = `https://via.placeholder.com/${size}x${size}/${bgColor}/FFFFFF?text=NFT+${id}`;

  return NextResponse.redirect(imageUrl);
}
