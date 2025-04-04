import React from "react";
import Image from "next/image";
import Link from "next/link";

interface BannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  characterImageUrl?: string;
}

const Banner: React.FC<BannerProps> = ({
  title = "Discover Rare Digital Art and Collect NFTs",
  subtitle = "The world's largest digital marketplace for crypto collectibles and non-fungible tokens",
  ctaText = "Start Exploring",
  ctaLink = "/marketplace",
  characterImageUrl,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-purple-900 rounded-2xl my-8 mx-4 md:mx-8">
      <div className="flex flex-col md:flex-row items-center px-6 py-12 md:py-16 md:px-10">
        {/* Text Content */}
        <div className="w-full md:w-3/5 z-10 pr-0 md:pr-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-purple-100 mb-8 max-w-2xl">
            {subtitle}
          </p>
          <Link
            href={ctaLink}
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors duration-200"
          >
            {ctaText}
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </Link>
        </div>

        {/* Character/Image Area */}
        <div className="w-full md:w-2/5 mt-8 md:mt-0 z-10 flex justify-center md:justify-end">
          {characterImageUrl ? (
            <div className="relative w-72 h-72 md:w-96 md:h-96 transform hover:scale-105 transition-transform duration-300">
              <Image
                src={characterImageUrl}
                alt="NFT Character"
                fill
                style={{ objectFit: "contain" }}
                priority
                className="drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              />
            </div>
          ) : (
            <div className="w-72 h-72 md:w-96 md:h-96 flex items-center justify-center bg-purple-800/30 rounded-full">
              <p className="text-white text-center">
                Character Image
                <br />
                Will Appear Here
              </p>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Statistics Bar */}
      <div className="w-full bg-slate-800/80 py-4 px-6 flex flex-wrap justify-around items-center">
        <div className="text-center px-4 py-2">
          <p className="text-3xl font-bold text-purple-400">10K+</p>
          <p className="text-sm text-gray-300">Artworks</p>
        </div>
        <div className="text-center px-4 py-2">
          <p className="text-3xl font-bold text-purple-400">3.2K+</p>
          <p className="text-sm text-gray-300">Artists</p>
        </div>
        <div className="text-center px-4 py-2">
          <p className="text-3xl font-bold text-purple-400">25K+</p>
          <p className="text-sm text-gray-300">Users</p>
        </div>
        <div className="text-center px-4 py-2">
          <p className="text-3xl font-bold text-purple-400">2.5 ETH</p>
          <p className="text-sm text-gray-300">Avg. Price</p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
