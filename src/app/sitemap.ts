import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://serverswamp.ru'

  // 1. Базовые статические страницы
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/servers/java`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/servers/bedrock`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
  ]

  // 2. Динамические страницы серверов
  let serverPages: MetadataRoute.Sitemap = []
  
  try {
    // Запрашиваем список всех серверов для индексации
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/servers`, {
      next: { revalidate: 3600 } // Кэшируем список на час
    })
    
    if (res.ok) {
      const servers = await res.json()
      
      serverPages = servers.map((server: any) => ({
        url: `${baseUrl}/${server.slug}`,
        lastModified: server.updatedAt || new Date(),
        changeFrequency: 'daily',
        priority: 0.7, // Чуть ниже категорий, но выше прочих страниц
      }))
    }
  } catch (error) {
    console.error('Sitemap fetch error:', error)
  }

  return [...staticPages, ...serverPages]
}