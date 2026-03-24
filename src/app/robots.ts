import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/login',
          '/register',
          '/api/',
          '/_next/',
        ],
      },
    ],
    sitemap: 'https://minecraftmonitoring-mc.ru//sitemap.xml',
  }
}