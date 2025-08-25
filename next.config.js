/** @type {import('next').NextConfig} */
const nextConfig = {
  // Development optimizations
  swcMinify: true,
  experimental: {
    // Faster builds
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Reduce bundle analysis overhead
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Faster source maps in development
      config.devtool = 'eval-cheap-module-source-map'
    }
    return config
  },
  // Faster TypeScript compilation
  typescript: {
    ignoreBuildErrors: false,
  },
  // Reduce image optimization overhead
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
