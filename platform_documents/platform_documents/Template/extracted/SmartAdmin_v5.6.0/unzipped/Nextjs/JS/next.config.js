
const nextConfig = {
  /* config options here */
  async redirects() {
    return [{
      source: '/',
      destination: "/dashboards/control-center",
      permanent: false
    }];
  }
};
export default nextConfig;