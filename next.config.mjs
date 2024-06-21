/** @type {import('next').NextConfig} */
const nextConfig = {
    ignoreBuildErrors: true,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'cloudflare-ipfs.com',
            port: '',
            pathname: '/ipfs/**',
          },
        ],
      },
};

export default nextConfig;
