import nextra from "nextra"

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
        pathname: '/avatar*',
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
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '/*',
      },
    ],
    domains: ['images.clerk.dev', "img.clerk.com", 'pbs.twimg.com', 'www.gravatar.com', "ucarecdn.com", "utfs.io"],

  },
  // reactStrictMode: true,
  // transpilePackages: ['@kouahai/frame'],
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
};

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  defaultShowCopyCode: true
})
export default withNextra(nextConfig);
