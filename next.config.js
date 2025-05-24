/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // i18n config is now deprecated in app router, use middleware instead
  
  // Performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  
  // Enable only safe optimizations
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = nextConfig; 