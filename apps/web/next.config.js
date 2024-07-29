const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin("./i18n.ts");
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@prisma/client']
};
 
module.exports = withNextIntl(nextConfig);