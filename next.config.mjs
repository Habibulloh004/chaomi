/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["joinposter.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "joinposter.com",
        pathname: "/upload/**",
      },
      {
        protocol: "https",
        hostname: "static-00.iconduck.com",
        pathname: "/assets.00/**",
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
