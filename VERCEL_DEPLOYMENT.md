# Vercel Deployment Guide

## Overview

This project includes a mock server implementation that has been integrated into the Next.js API routes for seamless deployment on Vercel.

## How It Works

1. The mock data from `mockServer/db.json` is loaded by the built-in API routes.
2. The API endpoints are:
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

When deploying to Vercel:

1. Make sure the `mockServer` directory is included in your Git repository
2. Vercel will automatically use the API routes defined in `src/app/api`
3. Your frontend code should use relative API URLs starting with `/api`

## Local Development

For local development, you can:

1. Continue using the original mock server with `node mockServer/server.js`
2. Set `NEXT_PUBLIC_API_URL=http://localhost:5005` in your `.env.local` file
3. Or use the built-in API routes by default with a relative `/api` URL

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Override the API URL (defaults to `/api` if not set)
- `NEXT_PUBLIC_AUTO_REFRESH_INTERVAL`: Set the auto-refresh interval in milliseconds (defaults to 60000)
