import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://serverswamp.ru'

  // 1. Статические страницы
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/servers`, {
      // Кэшируем на стороне сервера, чтобы не дергать API при каждом запросе бота
      next: { revalidate: 3600 } 
    })

    if (res.ok) {
      const servers = await res.json()
      
      serverPages = servers.map((server: any) => ({
        url: `${baseUrl}/${server.slug}`,
        // Используем дату обновления из БД или текущую, если её нет
        lastModified: server.updatedAt ? new Date(server.updatedAt) : new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Sitemap generation error:', error)
  }

  return [...staticPages, ...serverPages]
}