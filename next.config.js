/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'es', 'pt'],
    defaultLocale: 'es',
  },
  images: {
    domains: ['via.placeholder.com', 'localhost'],
  },
};

module.exports = nextConfig;
