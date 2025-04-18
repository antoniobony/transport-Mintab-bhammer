import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/romodif',
        permanent: true,
      },
      // Wildcard path matching
      
    ]
  },
  devIndicators: false
};

export default nextConfig;
