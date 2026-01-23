/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This project mounts the existing React Router SPA inside Next.js.
  // All routes are handled client-side by react-router.
  output: 'standalone',
  // Skip static generation - all pages use React Router and should be dynamic
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

export default nextConfig;
