import fs from "fs";
import path from "path";
import { IProduct } from "@/types/nft";
import staticProducts from "../mockData/products.json";

// Cache for the products data
let productsCache: IProduct[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 10 * 1000; // 10 seconds cache TTL for testing

/**
 * Load products from the mock data file or fallback to static JSON
 */
export function getProducts(): IProduct[] {
  const now = Date.now();

  // If we have cached data and it's still fresh, use it
  if (productsCache && now - lastCacheTime < CACHE_TTL) {
    return productsCache;
  }

  try {
    // In Vercel's serverless environment, always use the static JSON import
    // Reset the cache for each request to ensure fresh data
    if (process.env.VERCEL) {
      console.log("Using static JSON import for Vercel environment");
      // Important: Create a deep copy to avoid reference issues
      productsCache = JSON.parse(JSON.stringify(staticProducts)) as IProduct[];
      lastCacheTime = now;
      return productsCache;
    }

    // Try multiple potential paths for the db.json file
    const potentialPaths = [
      path.join(process.cwd(), "mockServer", "db.json"),
      path.join(process.cwd(), "..", "tymex-mock-server-nodejs-1_0", "db.json"),
      path.join(process.cwd(), "tymex-mock-server-nodejs-1_0", "db.json"),
    ];

    let dbData = null;

    for (const dbPath of potentialPaths) {
      try {
        if (fs.existsSync(dbPath)) {
          dbData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
          console.log(`Found mock data at: ${dbPath}`);
          break;
        }
      } catch {
        // Continue to the next path
      }
    }

    if (!dbData) {
      console.log("Could not find db.json, using static JSON import");
      productsCache = JSON.parse(JSON.stringify(staticProducts)) as IProduct[];
      lastCacheTime = now;
      return productsCache;
    }

    productsCache = dbData.products as IProduct[];
    lastCacheTime = now;
    return productsCache;
  } catch (error) {
    console.error("Error loading mock data:", error);
    console.log("Using static JSON import as fallback");
    productsCache = JSON.parse(JSON.stringify(staticProducts)) as IProduct[];
    lastCacheTime = now;
    return productsCache;
  }
}

/**
 * Get a product by ID
 */
export function getProductById(id: number): IProduct | undefined {
  const products = getProducts();
  return products.find((p) => p.id === id);
}
