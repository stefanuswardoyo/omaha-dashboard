/** @type {import('next').NextConfig} */

const nextConfig = {
    env: {
        SERVER_URL: process.env.SERVER_URL,
    },
    async redirects() {
        return [
          {
            source: '/',
            destination: '/login',
            permanent: true,
          },
        ]
      },
};

module.exports = nextConfig;

