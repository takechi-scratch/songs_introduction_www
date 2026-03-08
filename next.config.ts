import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            new URL("https://**.googleusercontent.com/**"),
            new URL("https://**.twimg.com/**"),
        ],
    },
};

export default nextConfig;
