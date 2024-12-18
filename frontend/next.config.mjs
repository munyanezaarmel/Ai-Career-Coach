/** @type {import('next').NextConfig} */
import { i18n } from "./next-i18.config.mjs";
const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
