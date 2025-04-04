import { NextResponse } from "next/server";

// This is important for dynamic API routes
export const dynamic = "force-dynamic";

// Cache map to store previously generated URLs
const urlCache = new Map<string, string>();

// Generate a placeholder NFT image with a specific ID
export function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const id = searchParams.get("id") || "1";
    const size = searchParams.get("size") || "400";

    // Use a deterministic color based on ID instead of random
    const bgColor = searchParams.get("bg") || generateConsistentColor(id);

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
  } catch (error) {
    console.error("Error in placeholders API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Generate a consistent color based on the ID (deterministic)
function generateConsistentColor(id: string): string {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Make sure it's positive and within the color range
  hash = Math.abs(hash) % 16777215;
  return hash.toString(16).padStart(6, "0");
}
