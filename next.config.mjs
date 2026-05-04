/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "exam-app.elevate-bootcamp.cloud",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
