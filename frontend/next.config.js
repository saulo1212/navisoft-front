
const nextConfig = {
  output: process.env.NEXT_STANDALONE === '1' ? 'standalone' : undefined,
  async redirects() {
    return [{
      source: '/',
      destination: "/dashboards/control-center",
      permanent: false
    }];
  }
};
export default nextConfig;
