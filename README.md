# NFT Marketplace

A modern NFT marketplace built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Responsive design for desktop, tablet, and mobile devices
- Product listing with filtering and search functionality
- Load more pagination for efficient data loading
- Auto-refresh data every 60 seconds
- Proper loading, empty, and error states
- Dark mode support
- Unit tests with Jest and React Testing Library

## Technologies Used

- Next.js 15.2
- TypeScript
- Tailwind CSS for styling
- Jest and React Testing Library for testing

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd tymex-interview-frontend-antran
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the mock server

```bash
cd ../mockServer
npm install
npm run start
```

4. In a separate terminal, start the development server

```bash
cd ../tymex
npm run dev
# or

yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing

Run the tests:

```bash
npm test
# or
yarn test
```

Run tests with coverage:

```bash
npm run test:coverage
# or
yarn test:coverage
```

## Project Structure

- `/src/app`: Next.js app directory structure
- `/src/components`: Reusable UI components
- `/src/hooks`: Custom React hooks
- `/src/types`: TypeScript type definitions
- `/src/utils`: Utility functions, including API services

## API Integration

The application using NextJS API running on http://localhost:3000/api that provides data for NFT products.

## Features Implemented

### Must Have Features

- Modern UI matching the Figma design
- Responsive design for all device sizes
- Data fetching from API
- Search and filtering
- "Load more" functionality
- Loading states, empty states, and error handling
- Auto-refresh every 60 seconds
- TypeScript for type safety
- Well-organized code with separate components
- Unit test coverage > 40%

### Nice to Have Features

- Basic animations with page transitions and fade effects
- Multi-criteria search
- Auto-triggered search when criteria changes
- Custom hooks for data fetching and debounce
- Debounce pattern for search inputs

## License

This project is licensed under the MIT License.
