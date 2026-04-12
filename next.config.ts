import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  // Route used to tunnel Sentry events (avoids ad-blockers)
  tunnelRoute: '/monitoring',
  // Suppress Sentry CLI telemetry
  telemetry: false,
  // Silent during build — log only on errors
  silent: true,
  // Source maps: delete .map files from server bundle after upload (not served to browser)
  sourcemaps: {
    filesToDeleteAfterUpload: ['.next/static/**/*.map'],
    // If no auth token is set, disable upload to avoid build errors in local/CI without token
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
});
