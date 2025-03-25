/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Consider using optimized images for better performance
  },
  reactStrictMode: true, // Enable React's Strict Mode
  swcMinify: true, // Use SWC for minification
  experimental: {
    optimizeCss: true, // Optimize CSS
    scrollRestoration: true, // Enable scroll restoration
    concurrentFeatures: true, // Enable concurrent features for better performance
  },
  async redirects() {
    return [
      {
        source: "/old-path",
        destination: "/new-path",
        permanent: true,
      },
    ];
  },
  // Add custom headers for caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // Cache for 1 year
          },
        ],
      },
    ];
  },
  // Enable React's automatic static optimization
  experimental: {
    optimizeImages: true, // Optimize images for faster loading
  },
};

module.exports = nextConfig;
