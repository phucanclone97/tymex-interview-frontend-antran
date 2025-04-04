import fs from "fs";
import path from "path";
import { IProduct } from "@/types/nft";
import staticProducts from "../mockData/products.json";

// Cache for the products data
let productsCache: IProduct[] | null = null;

/**
 * Load products from the mock data file or fallback to static JSON
 */
export function getProducts(): IProduct[] {
  // If we already have the data cached, return it
  if (productsCache) {
    return productsCache;
  }

  try {
    // In Vercel's serverless environment or if we can't read from files,
    // use the static JSON import
    if (process.env.VERCEL) {
      console.log("Using static JSON import for Vercel environment");
      productsCache = staticProducts as IProduct[];
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
      productsCache = staticProducts as IProduct[];
      return productsCache;
    }

    productsCache = dbData.products as IProduct[];
    return productsCache;
  } catch (error) {
    console.error("Error loading mock data:", error);
    console.log("Using static JSON import as fallback");
    productsCache = staticProducts as IProduct[];
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
