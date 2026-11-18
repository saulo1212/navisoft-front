import { basePath } from "./src/helpers/index.js";

const nextConfig = {
  /* config options here */
  basePath: basePath,
  async redirects() {
    return [{
      source: '/',
      destination: "/dashboards/control-center",
      permanent: false
    }];
  }
};
export default nextConfig;