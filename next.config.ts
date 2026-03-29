import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: isDev, // 👈 CLAVE
});

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: true,
};

export default isDev ? nextConfig : withPWA(nextConfig);
