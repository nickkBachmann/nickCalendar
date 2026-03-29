import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: isDev,
});

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  turbopack: {}, // 👈 🔥 ESTO ARREGLA TODO
};

export default isDev ? nextConfig : withPWA(nextConfig);
