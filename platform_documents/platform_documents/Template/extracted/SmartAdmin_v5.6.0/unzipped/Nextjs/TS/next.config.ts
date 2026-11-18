import type {NextConfig} from "next";
import {basePath} from "@/helpers";

const nextConfig: NextConfig = {
    /* config options here */
    basePath: basePath,
    async redirects() {
        return [
            {
                source: '/',
                destination: "/dashboards/control-center",
                permanent: false,
            },
        ];
    },
};

export default nextConfig;
