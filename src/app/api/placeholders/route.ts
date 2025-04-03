import { NextRequest, NextResponse } from "next/server";

// Cache map to store previously generated URLs
const urlCache = new Map<string, string>();

// Generate a placeholder NFT image with a specific ID
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id") || "1";
  const size = searchParams.get("size") || "400";
  const bgColor =
    searchParams.get("bg") || Math.floor(Math.random() * 16777215).toString(16);

  // Create a cache key based on the parameters
  const cacheKey = `${id}-${size}-${bgColor}`;

  // Check if we have this URL cached
  if (urlCache.has(cacheKey)) {
    const cachedUrl = urlCache.get(cacheKey)!;

    // Return cached URL with cache headers
    return new NextResponse(null, {
      status: 307, // Temporary redirect
      headers: {
        Location: cachedUrl,
        "Cache-Control": "public, max-age=86400", // Cache for 1 day
        "CDN-Cache-Control": "public, max-age=86400",
      },
    });
  }

  const imageUrl = `https://via.placeholder.com/${size}x${size}/${bgColor}/FFFFFF?text=NFT+${id}`;

  // Store in cache
  urlCache.set(cacheKey, imageUrl);

  // Return with cache headers
  return new NextResponse(null, {
    status: 307, // Temporary redirect
    headers: {
      Location: imageUrl,
      "Cache-Control": "public, max-age=86400", // Cache for 1 day
      "CDN-Cache-Control": "public, max-age=86400",
    },
  });
}
