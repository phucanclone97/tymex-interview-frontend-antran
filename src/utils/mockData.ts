import fs from "fs";
import path from "path";
import { IProduct } from "@/types/nft";

// Cache for the products data
let productsCache: IProduct[] | null = null;

/**
 * Load products from the mock data file
 */
export function getProducts(): IProduct[] {
  if (productsCache) {
    return productsCache;
  }

  try {
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
      console.error("Could not find db.json in any of the expected locations");
      return [];
    }

    productsCache = dbData.products as IProduct[];
    return productsCache;
  } catch (error) {
    console.error("Error loading mock data:", error);
    return [];
  }
}

/**
 * Get a product by ID
 */
export function getProductById(id: number): IProduct | undefined {
  const products = getProducts();
  return products.find((p) => p.id === id);
}
