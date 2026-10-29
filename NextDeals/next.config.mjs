/** @type {import('next').NextConfig} */
import path from 'path';

const stripTrailingSlash = (url) => (url || '').trim().replace(/\/+$/, '');

// Set on the Cloudflare storefront: the CMS server (admin, API, database).
const CMS_URL = stripTrailingSlash(process.env.CMS_URL);
// Set on the CMS server: the public storefront that visitors should use instead.
const STOREFRONT_URL = stripTrailingSlash(process.env.STOREFRONT_URL);

// Storefront pages, i.e. everything except the CMS, APIs, tracker, media and static files.
const STOREFRONT_PATH = '/:path((?!api|admin|_next|media|out|.*\\..*).*)';

const nextConfig = {
  async redirects() {
    if (CMS_URL) {
      return [
        { source: '/admin', destination: `${CMS_URL}/admin`, permanent: false },
        { source: '/admin/:path*', destination: `${CMS_URL}/admin/:path*`, permanent: false },
      ];
    }
    if (STOREFRONT_URL) {
      return [
        { source: '/', destination: STOREFRONT_URL, permanent: false },
        { source: STOREFRONT_PATH, destination: `${STOREFRONT_URL}/:path`, permanent: false },
      ];
    }
    return [];
  },
  async rewrites() {
    if (!CMS_URL) return [];
    // Proxied before the storefront's own routes: logins, forms and media need
    // the database, which only the CMS server has. /out stays here because a
    // proxy would follow its redirect instead of sending the visitor on.
    return {
      beforeFiles: [
        { source: '/api/:path*', destination: `${CMS_URL}/api/:path*` },
        { source: '/media/:path*', destination: `${CMS_URL}/media/:path*` },
      ],
    };
  },
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
    'esbuild',
    'jose'
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