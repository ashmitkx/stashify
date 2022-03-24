/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['picsum.photos', 'i.scdn.co', 'mosaic.scdn.co']
    }
};

module.exports = nextConfig;
