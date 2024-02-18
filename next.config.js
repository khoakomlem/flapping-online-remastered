/* eslint-disable @typescript-eslint/naming-convention */
// import million from "million/compiler";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    minimumCacheTTL: 60,
    // Unoptimized: true,
  },
  webpack(config, { buildId, dev }) {
    config.resolve.symlinks = true
    // Config.infrastructureLogging = {
    // appendOnly: true,
    // level: 'verbose',
    // }
    // @ts-expect-error asdasdasdasdadas
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config
  },
}

export default nextConfig
