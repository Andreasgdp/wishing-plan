import { withContentlayer } from "next-contentlayer";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));


/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["uploadthing.com"],
  },
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: !!process.env.CI,
  },
}
export default withContentlayer(nextConfig)
// export default nextConfig
