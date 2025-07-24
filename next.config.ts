import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["google-auth-library", "google-spreadsheet"],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        dns: false,
        child_process: false,
        tls: false,
        http: false,
        https: false,
        events: false,
        util: false,
        stream: false,
        crypto: false,
        buffer: false,
        path: false,
        os: false,
        url: false,
        querystring: false,
      };
    }
    return config;
  },
};

export default nextConfig;
