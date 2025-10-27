/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      // Add hosts as needed
    ],
  },
  // Exclude scripts directory from Next.js build
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
  // Exclude scripts from TypeScript compilation
  typescript: {
    ignoreBuildErrors: false,
  },
  // Exclude scripts from ESLint
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['src', 'app'], // Only lint src and app directories
  },
};

export default nextConfig;


