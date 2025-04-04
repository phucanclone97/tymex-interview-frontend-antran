import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NFT Marketplace",
  description: "Explore and collect unique digital NFTs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 md:py-4 flex flex-wrap justify-between items-center">
              <Link
                href="/"
                className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 md:w-6 md:h-6"
                >
                  <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                  <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                  <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
                </svg>
                <span className="whitespace-nowrap">NFT Marketplace</span>
              </Link>

              <nav className="flex items-center">
                <ul className="flex flex-wrap gap-2 md:gap-6 items-center">
                  <li className="hidden sm:block">
                    <Link
                      href="/marketplace"
                      className="text-sm md:text-base text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors font-medium"
                    >
                      Marketplace
                    </Link>
                  </li>
                  <li className="hidden sm:block">
                    <a
                      href="#"
                      className="text-sm md:text-base text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors font-medium"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors whitespace-nowrap">
                      Connect Wallet
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          {children}
          <SpeedInsights />
        </div>
      </body>
    </html>
  );
}
