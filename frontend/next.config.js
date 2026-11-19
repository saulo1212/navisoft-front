const staticExport = process.env.NEXT_STATIC_EXPORT === '1';
const basePath = staticExport ? (process.env.PAGES_BASE_PATH ?? '/navisoft-front') : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_STATIC_EXPORT: staticExport ? '1' : '0',
    NEXT_PUBLIC_BASE_PATH: basePath,
    ...(staticExport ? { NEXT_PUBLIC_BASE_URL: basePath } : {}),
  },
  ...(staticExport ? {
    output: 'export',
    basePath,
    trailingSlash: true,
    images: { unoptimized: true },
  } : {
    output: process.env.NEXT_STANDALONE === '1' ? 'standalone' : undefined,
    pageExtensions: ['server.js', 'tsx', 'ts', 'jsx', 'js'],
    async redirects() {
      return [{
        source: '/',
        destination: '/dashboards/control-center',
        permanent: false,
      }];
    },
  }),
};
export default nextConfig;
