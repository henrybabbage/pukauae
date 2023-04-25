/** @type {import('next').NextConfig} */
const { withPlaiceholder } = require('@plaiceholder/next')

const nextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.geojson$/,
            use: ['json-loader']
        })
        return config
    },
    i18n: {
        locales: ['en'],
        defaultLocale: 'en'
    },
    reactStrictMode: true,
    compiler: {
        styledComponents: true
    },
    env: {
        NEXT_PUBLIC_VISUALCROSSING_API_KEY:
            process.env.NEXT_PUBLIC_VISUALCROSSING_API_KEY,
        NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL,
        NEXT_PUBLIC_IMAGES_DOMAIN: process.env.NEXT_PUBLIC_IMAGES_DOMAIN,
        NEXT_PUBLIC_YOUTUBE_ASSET_DOMAIN:
            process.env.NEXT_PUBLIC_YOUTUBE_ASSET_DOMAIN
    },
    images: {
        domains: ['localhost', 'pukauae.s3.ap-southeast-2.amazonaws.com'],
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.amazonaws.com'
            },
            {
                protocol: 'https',
                hostname: '**.cloudfront.net'
            },
            {
                protocol: 'https',
                hostname: '**.strapi.io'
            }
        ]
    }
}

module.exports = withPlaiceholder({ ...nextConfig })
