const isGithubPages = process.env.GITHUB_PAGES === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isGithubPages
    ? {
        output: 'export',
        basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
        images: {
          unoptimized: true,
        },
      }
    : {
        images: {
          remotePatterns: [
            {
              protocol: 'https',
              hostname: '**',
            },
          ],
        },
        experimental: {
          serverActions: {
            bodySizeLimit: '100mb',
          },
        },
      }),
};

export default nextConfig;
