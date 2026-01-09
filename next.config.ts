import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Enable server actions for AI streaming
  },
  images: {
    domains: ['brainops-ai-agents.onrender.com'],
  },
};

export default nextConfig;
