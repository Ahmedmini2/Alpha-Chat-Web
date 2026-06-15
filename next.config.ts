import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Project cover images, developer logos, brochure thumbnails and HeyGen video
  // posters come from many CDNs/S3 buckets we don't control. We render them
  // unoptimized (no Next image loader), which sidesteps host allow-listing.
  images: {
    unoptimized: true,
  },
  // Type errors still fail the build (tsc). ESLint is run separately via `npm run lint`
  // so a stray unused import doesn't block a production build.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
