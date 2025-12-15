/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
     images: {
    domains: ["exam.elevateegy.com"],
  },
};

export default nextConfig;
