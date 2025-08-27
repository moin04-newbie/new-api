/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use a custom build directory to avoid OneDrive lock issues on .next
  distDir: 'build',
  // Development optimizations
  experimental: {
    // Faster builds
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
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
