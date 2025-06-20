const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: 'standalone',
    productionBrowserSourceMaps: false,
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    webpack(config, { isServer }) {
        config.optimization.minimize = true;
        config.cache = false;

        if (!isServer) {
            config.optimization.splitChunks = {
                chunks: 'all',
                maxInitialRequests: 20,
                maxAsyncRequests: 20,
                maxSize: 20480, // 20KB
                minSize: 10240, // 10KB
                minChunks: 1,
                minRemainingSize: 0,
                cacheGroups: {
                    antd: {
                        test: /[\\/]node_modules[\\/](@ant-design|antd)[\\/]/,
                        name: (module, chunks, cacheGroupKey) => {
                            const context = module.context || '';
                            const matchResult = context.match(/node_modules\/(.*)/);
                            if (matchResult) {
                                return `ant-${cacheGroupKey}`;
                            }
                            return `an-default-${cacheGroupKey}`;
                        },
                        chunks: 'all',
                        priority: 20,
                        enforce: true,
                        reuseExistingChunk: false,
                    },
                    recharts: {
                        test: /[\\/]node_modules[\\/](recharts)[\\/]/,
                        name: (module, chunks, cacheGroupKey) => {
                            const context = module.context || '';
                            const matchResult = context.match(/node_modules\/(.*)/);
                            if (matchResult) {
                                return `rec-${cacheGroupKey}`;
                            }
                            return `rec-default-${cacheGroupKey}`;
                        },
                        chunks: 'all',
                        priority: 20,
                        enforce: true,
                        reuseExistingChunk: false,
                    },
                },
            };
        }
        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'letsmetrix.com',
                port: '',
                pathname: '/admin-blog/wp-content/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.shopify.com',
                port: '',
                pathname: '/app-store/listing_images/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.letsmetrix.com',
                port: '',
                pathname: '/app-store/listing_images/**',
            },
            {
                protocol: 'https',
                hostname: 'api-wix.letsmetrix.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'storeleads.app',
                port: '',
                pathname: '/img/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.shopify.com',
                port: '',
                pathname: '/app-store/**',
            },
            {
                protocol: 'https',
                hostname: 'apps.shopifycdn.com',
                port: '',
                pathname: '/listing_images/**',
            },
            {
                protocol: 'https',
                hostname: 'storeleads.app',
                port: '',
                pathname: '/technologies/**',
            },
        ],
        formats: ['image/webp'],
        minimumCacheTTL: 31536000,
    },
};

module.exports = withBundleAnalyzer(nextConfig);
