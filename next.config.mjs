/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["robohash.org", "via.placeholder.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "robohash.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
