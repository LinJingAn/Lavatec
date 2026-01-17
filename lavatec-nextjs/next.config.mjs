/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This project mounts the existing React Router SPA inside Next.js.
  // All routes are handled client-side by react-router.
  output: 'standalone',
  // Disable static optimization for pages that use React Router
  // Pages should export `export const dynamic = 'force-dynamic'` if they use client-side hooks
};

export default nextConfig;
