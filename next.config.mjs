/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
        pathname: '/*',

      },
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
        pathname: '/avatar*', // Allow any path that starts with /avatar
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 'ucarecdn.com',
        pathname: '/*',
      },
    ],
    domains: ['images.clerk.dev', "img.clerk.com", 'pbs.twimg.com', 'www.gravatar.com', "ucarecdn.com"],

  },
};

export default nextConfig;
