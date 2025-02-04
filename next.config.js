/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.dicebear.com",
                port: "",
                pathname: "/**",
            },
        ],
        dangerouslyAllowSVG: true,
        formats: ["image/avif", "image/webp"],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default config;
