/** @type {import('next').NextConfig} */
import path from 'path';
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['placeholder.svg','localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  serverExternalPackages: [
    'express',
    '@swc/core',
    'esbuild'
  ],
  outputFileTracingRoot: path.resolve(process.cwd()),
  experimental: {
    staleTimes: {
      dynamic: 30, // 30 seconds
      static: 180, // 3 minutes
    },
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  transpilePackages: [
    '@aws-sdk/client-sts'
  ],
  // swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateBuildId: async () => {
    return process.env.GIT_HASH || `build-${Date.now()}`
  },
  webpack: (config, { isServer, dev }) => {
    // Disable cache in development if issues persist
    if (dev) {
      config.cache = false;
    }
    // Add this fallback configuration
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@aws-sdk/nested-clients/sts': path.resolve(process.cwd(), 'node_modules/@aws-sdk/client-sts')
    };
    // Ignore .d.ts files
    config.module.rules.push({
      test: /\.d\.ts$/,
      loader: 'ignore-loader'
    })

    // Externalize payload for server bundle
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        {
          payload: 'payload',
          express: 'express',
        }
      ]
    }

    return config
  },
}

export default nextConfig