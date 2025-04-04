# Vercel Deployment Guide

## Overview

This project includes a mock server implementation that has been integrated into the Next.js API routes for seamless deployment on Vercel.

## How It Works

1. In development, there are two options:

   - Use the local JSON server at `http://localhost:5005` (requires running the mock server)
   - Use the built-in Next.js API routes at `/api` (recommended)

2. For Vercel deployment:

   - The static product data is bundled with the application
   - API routes are deployed as serverless functions
   - No external services or databases are required

3. The API endpoints are:
   - `/api/products` - List, filter, sort, and paginate products
   - `/api/products/[id]` - Get a single product by ID

## API Features Implemented

All the features from the original JSON Server are available through the Next.js API routes:

- **Search** by title with `?q=keyword`
- **Filter** by:
  - Category: `?category=Epic`
  - Tier: `?tier=Premium`
  - Theme: `?theme=Dark`
- **Price Range** filtering:
  - Min price: `?price_gte=50`
  - Max price: `?price_lte=200`
- **Pagination**:
  - Page: `?_page=1`
  - Limit: `?_limit=12`
- **Sorting**:
  - Sort by field: `?_sort=price`
  - Order: `?_order=asc` or `?_order=desc`

## Deployment Process

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Deploy without any additional configuration

Vercel will automatically:

- Build your Next.js application
- Deploy the API routes as serverless functions
- Make the static assets available

## Data Strategy

For Vercel deployment, the application uses:

1. A static JSON file (`src/mockData/products.json`) included in the build
2. API routes that serve and filter this data
3. A fallback mechanism that works in both development and production

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Override the API URL (defaults to `/api` if not set)
- `NEXT_PUBLIC_AUTO_REFRESH_INTERVAL`: Set the auto-refresh interval in milliseconds (defaults to 60000)
