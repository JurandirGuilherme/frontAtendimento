/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    eslint: {
        trailingSlash: true,
        ignoreDuringBuilds: true,
      },
      typescript: {
        ignoreBuildErrors: true,
      },
};

export default nextConfig;
