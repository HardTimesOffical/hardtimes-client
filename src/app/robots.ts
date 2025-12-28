import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/login/', '/register/'], // Не индексируем личные кабинеты
    },
    sitemap: 'https://serverswamp.ru/sitemap.xml',
  }
}