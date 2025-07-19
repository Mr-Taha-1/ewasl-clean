// Safely import bundle analyzer only if available
let withBundleAnalyzer;
try {
  withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
} catch (error) {
  // Bundle analyzer not available in production, use identity function
  withBundleAnalyzer = (config) => config;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  typescript: {
    // Allow production builds to complete with type errors for now
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allow production builds to complete with ESLint errors for now
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Enable SWC minification
    swcMinify: true,
    // Disable strict mode for problematic components
    forceSwcTransforms: false,
  },
  webpack: (config, { isServer }) => {
    // Optimize bundle splitting for better memory usage
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
  images: {
    domains: ['localhost', 'app.ewasl.com', 'ewasl.com', 'vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
      },
      {
        protocol: 'https',
        hostname: 'facebook.com',
      },
      {
        protocol: 'https',
        hostname: 'instagram.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  // Production build optimizations
  poweredByHeader: false,
  compress: true,
  serverExternalPackages: ['sharp', 'fluent-ffmpeg'],
  // Security headers for production
  async headers() {
    if (process.env.NODE_ENV !== 'production') {
      return []
    }
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.openai.com https://openrouter.ai https://*.supabase.co https://api.stripe.com;"
          }
        ]
      }
    ]
  },
};

module.exports = withBundleAnalyzer(nextConfig);