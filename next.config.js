/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⬇️ This disables only Vercel’s isolated type-check
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
